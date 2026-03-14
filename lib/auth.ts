import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

console.log("ENV AUTH_SECRET:", !!process.env.AUTH_SECRET);
console.log("ENV NEXTAUTH_SECRET:", !!process.env.NEXTAUTH_SECRET);
console.log("ENV EMAIL_SERVER:", process.env.EMAIL_SERVER);
console.log("ENV EMAIL_FROM:", process.env.EMAIL_FROM);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Nodemailer({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    }),
  ],
  events: {
    async createUser({ user }) {
      const account = await prisma.account.create({ data: { type: "CLIENT" } });
      await prisma.accountMembership.create({
        data: {
          accountId: account.id,
          userId: user.id!,
          role: "OWNER",
        },
      });
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) (session.user as any).id = user.id;

      const membership = await prisma.accountMembership.findFirst({
        where: { userId: user.id },
        select: { accountId: true, role: true, account: { select: { type: true } } },
      });

      (session as any).accountId = membership?.accountId ?? null;
      (session as any).role = membership?.role ?? null;
      (session as any).accountType = membership?.account.type ?? null;

      return session;
    },
  },
});