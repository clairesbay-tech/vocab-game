"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  type RootState,
  loadRootState,
  saveRootState,
  setActiveProfile,
  addProfile,
  renameProfile,
  deleteProfile,
  buildInitialProfileState,
  setActiveLearningLang,
} from "../../lib/profiles";

import type { LearningLang } from "../../lib/words";

const AVATARS = ["👧", "👦", "🧒", "👩", "👨", "👵", "👴", "🐼", "🐱", "🐶", "🦊", "🐯"];

const LEARNING_LANGS: { id: LearningLang; label: string }[] = [
  { id: "fa", label: "Persan" },
  { id: "en", label: "English" },
  { id: "fr", label: "Français" },
];

export default function SettingsClient() {
  const router = useRouter();

  const [root, setRoot] = useState<RootState>(() => ({
    activeProfileId: "",
    profiles: [],
  }));
  const [mounted, setMounted] = useState(false);

  // Load
  useEffect(() => {
    const loaded = loadRootState();
    setRoot(loaded);
    setMounted(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!mounted) return;
    saveRootState(root);
  }, [root, mounted]);

  const hasProfiles = root.profiles.length > 0;

  const activeProfileId = root.activeProfileId;
  const activeName = useMemo(() => {
    const p = root.profiles.find((x) => x.id === activeProfileId);
    return p?.name ?? "";
  }, [root.profiles, activeProfileId]);

  function goPlayForProfile(profileId: string, lang: LearningLang) {
    setRoot((r) => {
      let next = setActiveProfile(r, profileId);
      next = setActiveLearningLang(next, profileId, lang);
      saveRootState(next);
      return next;
    });
    window.location.href = "/";
  }

  function updateProfileMeta(profileId: string, patch: { avatar?: string; lang?: "fr" | "en" }) {
    setRoot((r) => {
      const rr: any = r;
      return {
        ...rr,
        profiles: rr.profiles.map((p: any) => (p.id === profileId ? { ...p, ...patch } : p)),
      };
    });
  }

  function resetProfile(profileId: string) {
    const ok = window.confirm("Reset de ce profil ? (progression + enregistrements)");
    if (!ok) return;

    setRoot((r) => {
      const rr: any = r;
      return {
        ...rr,
        profiles: rr.profiles.map((p: any) => {
          if (p.id !== profileId) return p;
          return {
            ...p,
            state: {
              ...buildInitialProfileState(),
              mode: p.state?.mode ?? 1,
            },
          };
        }),
      };
    });
  }

  function onAddProfile() {
    setRoot((r) => addProfile(r));
  }

  function onRename(profileId: string, currentName: string) {
    const name = window.prompt("Nouveau nom du profil :", currentName);
    if (!name) return;
    setRoot((r) => renameProfile(r, profileId, name));
  }

  function onDelete(profileId: string) {
    const ok = window.confirm("Supprimer ce profil ? (Ses résultats seront perdus)");
    if (!ok) return;
    setRoot((r) => deleteProfile(r, profileId));
  }

  function goBack() {
    router.push("/");
  }

  if (!mounted) return null;
return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topRow}>
          <button style={styles.backBtn} onClick={goBack}>
            ← Retour au jeu
          </button>

          <div style={styles.titleBlock}>
            <div style={styles.h1}>Paramètres</div>
            <div style={styles.sub}>Gérer les profils, avatars, langue, reset, suppression.</div>
          </div>

          <button style={styles.addBtn} onClick={onAddProfile}>
            ➕ Ajouter un profil
          </button>
        </div>

        {!hasProfiles ? (
          <div style={styles.empty}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Aucun profil</div>
            <button style={styles.addBtn} onClick={onAddProfile}>
              ➕ Créer le premier profil
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {root.profiles.map((p: any) => {
              const isActive = p.id === root.activeProfileId;
              const avatar = p.avatar ?? "👧";
              const lang: "fr" | "en" = (p.lang ?? "fr") as "fr" | "en";
              const activeLearning = ((p.state as any)?.activeLearningLang ?? "fa") as LearningLang;

              return (
                <div key={p.id} style={{ ...styles.profileCard, ...(isActive ? styles.activeCard : null) }}>
                  <div style={styles.profileHeader}>
                    <div style={styles.profileNameRow}>
                      <div style={styles.avatarBig}>{avatar}</div>
                      <div style={{ display: "grid", gap: 4 }}>
                        <div style={styles.profileName}>{p.name}</div>
                        <div style={styles.mini}>ID: {p.id.slice(0, 6)}…</div>
                      </div>
                    </div>
                  </div>

                  <div style={styles.section}>
                    <div style={styles.label}>Avatar</div>
                    <div style={styles.avatarChoices}>
                      {AVATARS.map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => updateProfileMeta(p.id, { avatar: a })}
                          style={{ ...styles.avatarChoice, ...(a === avatar ? styles.avatarChoiceOn : null) }}
                          aria-label={`Avatar ${a}`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={styles.section}>
                    <div style={styles.label}>Langue maternelle</div>
                    <div style={styles.row}>
                      <button
                        style={{ ...styles.langBtn, ...(lang === "fr" ? styles.langOn : styles.langOff) }}
                        onClick={() => updateProfileMeta(p.id, { lang: "fr" })}
                      >
                        🇫🇷 FR
                      </button>
                      <button
                        style={{ ...styles.langBtn, ...(lang === "en" ? styles.langOn : styles.langOff) }}
                        onClick={() => updateProfileMeta(p.id, { lang: "en" })}
                      >
                        🇬🇧 EN
                      </button>
                    </div>
                  </div>

                  <div style={styles.section}>
                    <div style={styles.label}>Langue à apprendre</div>
                    <div style={styles.rowWrap}>
                      {LEARNING_LANGS.map((lng) => {
                        const isActiveLng = activeLearning === lng.id;
                        return (
                          <button
                            key={lng.id}
                            type="button"
                            onClick={() => goPlayForProfile(p.id, lng.id)}
                            style={{ ...styles.langBtn, ...(isActiveLng ? styles.langOn : styles.langOff) }}
                          >
                            {lng.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={styles.section}>
                    <div style={styles.label}>Actions</div>
                    <div style={styles.rowWrap}>
                      <button style={styles.btn} onClick={() => onRename(p.id, p.name)}>
                        ✏️ Renommer
                      </button>
                      <button style={styles.btn} onClick={() => resetProfile(p.id)}>
                        🔄 Reset
                      </button>
                      <button style={styles.btnDanger} onClick={() => onDelete(p.id)}>
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hasProfiles && (
          <div style={styles.footerNote}>
            Profil actif : <strong>{activeName || "—"}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 18,
    display: "flex",
    justifyContent: "center",
    background: "linear-gradient(180deg, #f6f7fb, #ffffff)",
    color: "#111",
  },
  card: {
    width: "min(980px, 100%)",
    background: "#fff",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    padding: 16,
  },
  topRow: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  backBtn: {
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    padding: "10px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 800,
  },
  addBtn: {
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#111",
    color: "#fff",
    padding: "10px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 900,
  },
  titleBlock: { display: "grid", gap: 2 },
  h1: { fontSize: 18, fontWeight: 950 },
  sub: { fontSize: 13, opacity: 0.7 },
  empty: {
    borderRadius: 14,
    border: "1px dashed rgba(0,0,0,0.2)",
    padding: 18,
    display: "grid",
    justifyItems: "start",
    gap: 10,
    marginTop: 10,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 12,
  },
  profileCard: {
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.10)",
    padding: 12,
    background: "#fff",
    display: "grid",
    gap: 10,
  },
  activeCard: {
    border: "1px solid rgba(0,0,0,0.25)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  profileHeader: { display: "grid", gap: 10 },
  profileNameRow: { display: "flex", alignItems: "center", gap: 10 },
  avatarBig: {
    width: 44,
    height: 44,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    fontSize: 22,
  },
  profileName: { fontSize: 16, fontWeight: 950 },
  mini: { fontSize: 12, opacity: 0.65 },
  section: {
    borderTop: "1px solid rgba(0,0,0,0.06)",
    paddingTop: 10,
    display: "grid",
    gap: 8,
  },
  label: { fontSize: 12, fontWeight: 950, opacity: 0.7, textTransform: "uppercase", letterSpacing: 0.6 },
  avatarChoices: { display: "flex", flexWrap: "wrap", gap: 8 },
  avatarChoice: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    cursor: "pointer",
    fontSize: 18,
  },
  avatarChoiceOn: {
    border: "2px solid #111",
    boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
  },
  row: { display: "flex", gap: 10 },
  rowWrap: { display: "flex", flexWrap: "wrap", gap: 10 },
  langBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    cursor: "pointer",
    fontWeight: 900,
    background: "#fff",
  },
  langOn: { background: "#111", color: "#fff" },
  langOff: { background: "#fafafa", color: "#111" },
  btn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fafafa",
    cursor: "pointer",
    fontWeight: 900,
  },
  btnDanger: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff0f0",
    cursor: "pointer",
    fontWeight: 900,
    color: "#b71c1c",
  },
  footerNote: { marginTop: 12, fontSize: 13, opacity: 0.8 },
};