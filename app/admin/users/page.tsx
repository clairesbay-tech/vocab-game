export default function AdminUsersPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Admin users désactivé</h1>
    </main>
  );
}
/*


import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";

export default async function AdminUsersPage() {

  // const session = await auth();
  // if (!session) redirect("/login");

  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    include: {
      memberships: {
        include: {
          account: true,
        },
      },
    },
  });

  return (
    <main style={{ padding: 24 }}>
      <h1>Utilisateurs</h1>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Email</th>
            <th>User ID</th>
            <th>Account</th>
            <th>Account type</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) =>
            user.memberships.map((membership) => (
              <tr key={`${user.id}-${membership.accountId}`}>
                <td>{user.email}</td>
                <td>{user.id}</td>
                <td>{membership.accountId}</td>
                <td>{membership.account.type}</td>
                <td>{membership.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}*/