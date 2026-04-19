"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setMessage("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Compte créé. Vérifie ton email si une confirmation est demandée.");
      }

      return;
    }

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
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.h1}>
            {mode === "signin" ? "Se connecter" : "Créer un compte"}
          </h1>
          <p style={styles.sub}>
            {mode === "signin"
              ? "Accède à tes profils et reprends le jeu."
              : "Crée ton compte pour enregistrer tes profils et ta progression."}
          </p>
        </div>

        <div style={styles.toggleWrap}>
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setMessage("");
            }}
            style={{
              ...styles.toggleBtn,
              ...(mode === "signin" ? styles.toggleBtnActive : styles.toggleBtnInactive),
            }}
          >
            Se connecter
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setMessage("");
            }}
            style={{
              ...styles.toggleBtn,
              ...(mode === "signup" ? styles.toggleBtnActive : styles.toggleBtnInactive),
            }}
          >
            Créer un compte
          </button>
        </div>

        <div style={styles.formSection}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Mot de passe</label>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <button onClick={handleSubmit} style={styles.primaryBtn}>
          {mode === "signin" ? "Se connecter" : "Créer un compte"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(180deg, #f6f7fb, #ffffff)",
  },
  card: {
    width: "min(460px, 100%)",
    background: "#fff",
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    padding: 24,
    display: "grid",
    gap: 18,
  },
  header: {
    display: "grid",
    gap: 6,
  },
  h1: {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
  },
  sub: {
    margin: 0,
    fontSize: 14,
    opacity: 0.72,
  },
  toggleWrap: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    padding: 6,
    borderRadius: 14,
    background: "#f3f4f6",
  },
  toggleBtn: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 14,
  },
  toggleBtnActive: {
    background: "#111",
    color: "#fff",
    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
  },
  toggleBtnInactive: {
    background: "transparent",
    color: "#111",
  },
  formSection: {
    display: "grid",
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: 800,
    opacity: 0.8,
  },
  input: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #ccc",
    fontSize: 15,
  },
  primaryBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 15,
  },
  message: {
    margin: 0,
    fontSize: 14,
    padding: 12,
    borderRadius: 12,
    background: "#f3f4f6",
  },
};