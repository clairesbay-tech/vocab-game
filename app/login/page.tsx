export default function LoginPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Connexion désactivée</h1>
      <p>Version MVP sans authentification.</p>
    </main>
  );
}
/*
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h1>Connexion</h1>
      <p>Reçois un lien magique par email.</p>

      {sent ? (
        <p>✅ Lien envoyé ! Vérifie ta boîte mail.</p>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await signIn("email", { email, callbackUrl: "/settings" });
            setSent(true);
          }}
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemple.com"
            style={{ width: "100%", padding: 12, marginTop: 12 }}
          />
          <button style={{ marginTop: 12, padding: 12, width: "100%" }}>
            Envoyer le lien
          </button>
        </form>
      )}
    </div>
  );
}
  */