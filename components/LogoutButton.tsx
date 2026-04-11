"use client";

import { supabase } from "@/lib/supabase";

type LogoutButtonProps = {
  label?: string;
};

export default function LogoutButton({
  label = "Se déconnecter",
}: LogoutButtonProps) {
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("logout error", error);
      alert(`Erreur déconnexion : ${error.message}`);
      return;
    }

    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.12)",
        background: "#fff",
        cursor: "pointer",
        fontWeight: 800,
      }}
    >
      {label}
    </button>
  );
}