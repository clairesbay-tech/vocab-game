"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signUp() {
    setMessage("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Compte créé. Vérifie ton email si une confirmation est demandée.");
    }
  }

  async function signIn() {
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Connexion réussie.");
      window.location.href = "/";
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: "40px auto", display: "grid", gap: 12 }}>
      <h1>Connexion</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={signIn} style={{ padding: "10px 14px" }}>
          Se connecter
        </button>
        <button onClick={signUp} style={{ padding: "10px 14px" }}>
          Créer un compte
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}