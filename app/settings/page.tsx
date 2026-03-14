
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";
//import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  //const session = await auth();
  //if (!session) redirect("/login");
  return <SettingsClient />;
}