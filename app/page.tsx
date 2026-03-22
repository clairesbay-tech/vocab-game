"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { WORDS, type WordDef, type LearningLang } from "../lib/words";
import { FAMILIES, type FamilyDef, familyIcon } from "../lib/families";
import {
  type Level,
  type Mode,
  type RootState,
  getActiveProfile,
  updateActiveProfileState,
  setActiveProfile,
  addProfile,
  renameProfile,
  deleteProfile,
  buildInitialProfileState,
} from "@/lib/profiles";

import { tt, TKey } from "@/lib/i18n";
import type { ProfileLang } from "@/lib/profiles";
import { supabase } from "@/lib/supabase";

/* ---------------- Helpers ---------------- */

type Fly = {
  id: number;
  emoji?: string;
  imageUrl?: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const HI5_MS = 3000;
const FLY_MS = 3000;

function sleep(ms: number) {
  return new Promise<void>((res) => window.setTimeout(res, ms));
}

function intersects(a: string[], bSet: Set<string>) {
  for (const x of a) if (bSet.has(x)) return true;
  return false;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

//function playAudio(url: string) {
//  const audio = new Audio(url);
//  audio.play().catch((e) => console.error("Audio play failed:", e));
//}

function hasEmojiOrImage(w: WordDef) {
  return Boolean(w.imageUrl || w.imageEmoji);
}


function familyLabel(f: FamilyDef, lang: ProfileLang) {
  return lang === "en" ? f.eng : f.fr;
}

function dataUrlFromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}

function pickRandomId(ids: string[], avoid?: string | null): string | null {
  if (!ids.length) return null;
  if (ids.length === 1) return ids[0];
  const filtered = avoid ? ids.filter((x) => x !== avoid) : ids;
  const list = filtered.length ? filtered : ids;
  return list[Math.floor(Math.random() * list.length)];
}

/* ---------------- Page ---------------- */

export default function Page() {

  //Test 15 mars
  useEffect(() => {
    async function testSupabase() {
      const { data, error } = await supabase.from("profiles").select("*");
      console.log("SUPABASE TEST", data, error);
    }

    testSupabase();
  }, []);
  // Fin test

  // New 15 mars authentication
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // End new

  const [levelMenuOpen, setLevelMenuOpen] = useState(false);
  //Refonte niveau 3
  const [l3RecordingReviewOpen, setL3RecordingReviewOpen] = useState(false);
  const [l3DontKnowOpen, setL3DontKnowOpen] = useState(false);
  const [lastRecordedUrl, setLastRecordedUrl] = useState<string | null>(null);


  const [l2Result, setL2Result] = useState<null | {
    ok: boolean;
    word: WordDef;
  }>(null);

  const [root, setRoot] = useState<RootState>(() => ({
    activeProfileId: "",
    profiles: [],
  }));
  const [mounted, setMounted] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  // Pour le choix de la langue qu'on apprend
  const [learningMenuOpen, setLearningMenuOpen] = useState(false);
  // UI
  const [isRecording, setIsRecording] = useState(false);
  const [fly, setFly] = useState<Fly | null>(null);

  // celebration sequence
  const [celebrating, setCelebrating] = useState<null | { word: WordDef }>(null);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  // refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);

  //new for audio player
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  //15 mars
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("auth getUser error", error);
      }

      setCurrentUserEmail(user?.email ?? null);
      setCurrentUserId(user?.id ?? null);
      setAuthChecked(true);
    }

    loadUser();
  }, []);

//end

  function togglePlay(url: string) {
    // si c'est déjà en train de jouer => stop
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    // sinon on (re)crée et on joue
    const a = new Audio(url);
    audioRef.current = a;

    setIsPlaying(true);

    a.onended = () => setIsPlaying(false);
    a.onpause = () => setIsPlaying(false);

    a.play().catch((e) => {
      console.error("Audio play failed:", e);
      setIsPlaying(false);
    });
  }
  
  // refs for positioning
  const hi5Ref = useRef<HTMLDivElement | null>(null);
  const tabCountRef1 = useRef<HTMLSpanElement | null>(null);
  const tabCountRef2 = useRef<HTMLSpanElement | null>(null);
  const tabCountRef3 = useRef<HTMLSpanElement | null>(null);

  // anti-closures
  const rootRef = useRef(root);
  const currentWordIdRef = useRef<string | null>(null);

  useEffect(() => {
    rootRef.current = root;
  }, [root]);

  // Pour avoir un lien direct vers un profil

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const profileName = params.get("profile");

    if (!profileName) return;
    if (!mounted) return;
    if (!root.profiles.length) return;

    const found = root.profiles.find(
      (p) => p.name.toLowerCase() === profileName.toLowerCase()
    );

    if (!found) return;

    setRoot((r) => setActiveProfile(r, found.id));
  }, [mounted, root.profiles]);

  // Close menu when we click somewhere else
  useEffect(() => {
    function onDocClick() {
      setProfileMenuOpen(false);
      setLevelMenuOpen(false);
      setLearningMenuOpen(false);
      }
      if (profileMenuOpen || levelMenuOpen || learningMenuOpen) {
        document.addEventListener("click", onDocClick);
      }
      return () => document.removeEventListener("click", onDocClick);
            
    if (profileMenuOpen || levelMenuOpen || learningMenuOpen) document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [profileMenuOpen, levelMenuOpen, learningMenuOpen]);

  function toggleLevelMenu() {
  setLevelMenuOpen((v) => {
    const next = !v;
    if (next) {
      setProfileMenuOpen(false);
      setLearningMenuOpen(false);
    }
    return next;
  });
}

function toggleProfileMenu() {
  setProfileMenuOpen((v) => {
    const next = !v;
    if (next) {
      setLevelMenuOpen(false);
      setLearningMenuOpen(false);
    }
    return next;
  });
}

function toggleLearningMenu() {
  setLearningMenuOpen((v) => {
    const next = !v;
    if (next) {
      setLevelMenuOpen(false);
      setProfileMenuOpen(false);
    }
    return next;
  });
}

  // load once 21 mars
useEffect(() => {
  async function loadApp() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("auth getUser error", userError);
      setRoot({
        activeProfileId: "",
        profiles: [],
      });
      setMounted(true);
      return;
    }

    if (!user?.id) {
      setRoot({
        activeProfileId: "",
        profiles: [],
      });
      setMounted(true);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, avatar, ui_lang, root_state")
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (error) {
      console.error("load profiles error", error);
      setRoot({
        activeProfileId: "",
        profiles: [],
      });
      setMounted(true);
      return;
    }

    const profilesFromDb =
      data?.map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar ?? "👧",
        lang: (p.ui_lang ?? "fr") as ProfileLang,
        state: (p.root_state as any) ?? buildInitialProfileState(),
      })) ?? [];

    setRoot({
      activeProfileId: profilesFromDb[0]?.id ?? "",
      profiles: profilesFromDb,
    });

    setMounted(true);
  }

  loadApp();
}, []);

  // persist
  //21 mars
  useEffect(() => {
    async function saveActiveProfileState() {
      if (!mounted) return;
      if (!root.activeProfileId) return;

      const activeProfile = root.profiles.find(
        (p) => p.id === root.activeProfileId
      );
      if (!activeProfile) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          root_state: activeProfile.state,
        })
        .eq("id", activeProfile.id);

      if (error) {
        console.error("save active profile state error", error);
      }
    }

    saveActiveProfileState();
  }, [root, mounted]);


  const hasProfiles = root.profiles.length > 0;
  const activeProfile = useMemo(() => (hasProfiles ? getActiveProfile(root) : null), [root, hasProfiles]);

  const state = activeProfile?.state ?? buildInitialProfileState();


  
  // ✅ Langue UI dépend du profil
    const uiLang: ProfileLang = activeProfile?.lang ?? "fr";

    const t = useMemo(() => {
      return (key: TKey, params?: Record<string, string | number>) =>
        tt(uiLang, key, params);
    }, [uiLang]);
    const modeName = t(`mode.${state.mode}`);
    const levelTitle = t("mode.levelLabel", { level: state.mode, label: modeName });

  // ✅ Langue d'apprentissage (jeu) dépend de l'état (pas du profil)
  const learningLang: LearningLang = (state as any)?.activeLearningLang ?? "fa";

  // ✅ Accesseurs par langue (fallbacks pour éviter de casser si data incomplète)
  const wordsForLang = (state as any)?.wordsByLang?.[learningLang] ?? {};
  const selectedForLang = (state as any)?.selectedByLang?.[learningLang] ?? {};
  const recordingsForLang = (state as any)?.recordingsByLang?.[learningLang] ?? {};

  const selectedFamiliesSet = useMemo<Set<string>>(
    () => new Set(((state as any).selectedFamilyIds ?? []) as string[]),
    [(state as any).selectedFamilyIds]
  );

  const activeWords = useMemo(() => {
    if (!selectedFamiliesSet.size) return [];
    return WORDS.filter((w) => intersects(w.families ?? [], selectedFamiliesSet));
  }, [selectedFamiliesSet]);


  function countWordsInLevel(level: Level): number {
    return activeWords.reduce((acc, w) => {
      const lvl = (wordsForLang[w.id]?.level ?? 1) as Level;
      return acc + (lvl === level ? 1 : 0);
    }, 0);
  }

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }

  

  function playControlledAudio(url: string) {
  stopAudio();

  const a = new Audio(url);
  audioRef.current = a;
  setIsPlaying(true);

  a.onended = () => setIsPlaying(false);
  a.onpause = () => setIsPlaying(false);

  a.play().catch((e) => {
    console.error("Audio play failed:", e);
    setIsPlaying(false);
  });
}
  function confirmL2Result() {
    if (!l2Result || !currentWordId) return;

    if (l2Result.ok) {
      promoteWordNow(currentWordId, 3);
    } else {
      demoteToLevel1(currentWordId);
    }

    setL2Result(null);
    refreshCurrentWord();
  }

  function getWordIdsInLevel(level: Level): string[] {
    return activeWords
      .map((w) => w.id)
      .filter((id) => ((wordsForLang[id]?.level ?? 1) as Level) === level);
  }

  function familyStats(familyId: string) {
    const familyWords = WORDS.filter((w) => (w.families ?? []).includes(familyId));
    const total = familyWords.length;

    const validated = familyWords.filter((w) => ((wordsForLang[w.id]?.level ?? 1) as number) >= 2).length;
    const pct = total ? Math.round((validated / total) * 100) : 0;
    return { total, validated, pct };
  }

  // Counts
  const counts = useMemo(
    () => ({
      l1: countWordsInLevel(1),
      l2: countWordsInLevel(2),
      l3: countWordsInLevel(3),
      l4: countWordsInLevel(4),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeWords, learningLang, (state as any).wordsByLang, uiLang]
  );

  // unlocking rules
  const canAccessL2 = counts.l1 + counts.l2 >= 4;
  const canAccessL3 = counts.l3 > 0;

  // Tabs disabled logic
  const disabledTab = {
    l1: counts.l1 === 0,
    l2: !canAccessL2,
    l3: !canAccessL3,
  };

  function updateState(updater: (prev: typeof state) => typeof state) {
    if (!hasProfiles) return;
    setRoot((r) => updateActiveProfileState(r, updater(getActiveProfile(r).state)));
  }

  // ✅ Assure une sélection valide par mode, POUR LA LANGUE COURANTE
  useEffect(() => {
    if (!hasProfiles || !activeProfile) return;

    updateState((s) => {
      const lng: LearningLang = (s as any).activeLearningLang ?? "fa";
      const wb = (s as any).wordsByLang ?? {};
      const words = wb[lng] ?? {};
      const sb = (s as any).selectedByLang ?? {};
      const selForLng = { ...(sb[lng] ?? {}) } as Partial<Record<Mode, string>>;

      let changed = false;

      for (const mode of [1, 2, 3] as Mode[]) {
        const ids = activeWords
          .map((w) => w.id)
          .filter((id) => ((words[id]?.level ?? 1) as Level) === (mode as Level));

        const sel = selForLng[mode];

        if (!ids.length) {
          if (sel) {
            delete selForLng[mode];
            changed = true;
          }
          continue;
        }

        if (!sel || !ids.includes(sel)) {
          selForLng[mode] = pickRandomId(ids, null) ?? ids[0];
          changed = true;
        }
      }

      if (!changed) return s;

      return {
        ...(s as any),
        selectedByLang: {
          ...(sb as any),
          [lng]: selForLng,
        },
      };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counts.l1, counts.l2, counts.l3, activeProfile?.id, hasProfiles, learningLang]);

  function setMode(mode: Mode) {
    stopAudio();
    if (!hasProfiles) return;
    if (mode === 2 && disabledTab.l2) return;
    if (mode === 3 && disabledTab.l3) return;

    setIsRecording(false);
    updateState((s) => ({ ...(s as any), mode }));
  }

  function setLearningLang(lng: LearningLang) {
  if (!hasProfiles) return;
  setIsRecording(false);
  updateState((s) => ({ ...(s as any), activeLearningLang: lng }));
  }

  function getTabCountRef(mode: Mode) {
    if (mode === 1) return tabCountRef1.current;
    if (mode === 2) return tabCountRef2.current;
    return tabCountRef3.current;
  }

  function startFlyFromTo(sourceEl: HTMLElement, targetEl: HTMLElement, word: WordDef) {
    const s = sourceEl.getBoundingClientRect();
    const t = targetEl.getBoundingClientRect();

    const x1 = s.left + s.width / 2;
    const y1 = s.top + s.height / 2;
    const x2 = t.left + t.width / 2;
    const y2 = t.top + t.height / 2;

    const id = Date.now();
    setFly({
      id,
      emoji: word.imageEmoji,
      imageUrl: word.imageUrl,
      x1,
      y1,
      x2,
      y2,
    });

    window.setTimeout(() => {
      setFly((f) => (f?.id === id ? null : f));
    }, FLY_MS + 100);
  }

  function promoteWordNow(wordId: string, toLevel: Level) {
    updateState((s) => {
      const lng: LearningLang = (s as any).activeLearningLang ?? "fa";
      const wb = (s as any).wordsByLang ?? {};
      const perLng = wb[lng] ?? {};
      const prev = perLng[wordId] ?? { level: 1, l1ListenCount: 0 };

      return {
        ...(s as any),
        wordsByLang: {
          ...(wb as any),
          [lng]: {
            ...(perLng as any),
            [wordId]: { ...prev, level: toLevel },
          },
        },
      };
    });
  }

  function demoteToLevel1(wordId: string) {
    updateState((s) => {
      const lng: LearningLang = (s as any).activeLearningLang ?? "fa";
      const wb = (s as any).wordsByLang ?? {};
      const perLng = wb[lng] ?? {};

      return {
        ...(s as any),
        wordsByLang: {
          ...(wb as any),
          [lng]: {
            ...(perLng as any),
            [wordId]: { level: 1, l1ListenCount: 0 },
          },
        },
      };
    });
  }

  function refreshCurrentWord() {
    stopAudio();
    updateState((s) => {
      const mode: Mode = (s as any).mode ?? 1;
      const lng: LearningLang = (s as any).activeLearningLang ?? "fa";

      const wb = (s as any).wordsByLang ?? {};
      const words = wb[lng] ?? {};

      const sb = (s as any).selectedByLang ?? {};
      const selForLng = { ...(sb[lng] ?? {}) } as Partial<Record<Mode, string>>;

      const level = mode as Level;
      const current = selForLng[mode] ?? null;

      const ids = activeWords
        .map((w) => w.id)
        .filter((id) => ((words[id]?.level ?? 1) as Level) === level);

      const nextId = pickRandomId(ids, current);
      if (!nextId) return s;

      selForLng[mode] = nextId;

      return {
        ...(s as any),
        selectedByLang: {
          ...(sb as any),
          [lng]: selForLng,
        },
      };
    });
  }

  const currentWordId: string | null = (selectedForLang as any)?.[(state as any).mode] ?? null;

    useEffect(() => {
  // stop audio on word change
  if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, [currentWordId]);
  
  const currentWord = useMemo(() => {
    return activeWords.find((w) => w.id === currentWordId) || null;
  }, [activeWords, currentWordId]);

  const currentWordState = useMemo(() => {
    if (!currentWordId) return null;
    return wordsForLang[currentWordId] ?? { level: 1, l1ListenCount: 0 };
  }, [currentWordId, wordsForLang]);

  useEffect(() => {
    currentWordIdRef.current = currentWordId;
  }, [currentWordId]);

  // Level 1 actions
  function handleListenL1() {
    if (!currentWordId || !currentWordState || !currentWord) return;

    updateState((s) => {
      const lng: LearningLang = (s as any).activeLearningLang ?? "fa";
      const wb = (s as any).wordsByLang ?? {};
      const perLng = wb[lng] ?? {};
      const ws = perLng[currentWordId];

      if (!ws || (ws.level ?? 1) !== 1) return s;

      const nextCount = Math.min(3, (ws.l1ListenCount ?? 0) + 1);

      return {
        ...(s as any),
        wordsByLang: {
          ...(wb as any),
          [lng]: {
            ...(perLng as any),
            [currentWordId]: { ...ws, l1ListenCount: nextCount },
          },
        },
      };
    });
  }

  async function startRecording() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert(t("dialogs.browserNoMic"));
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        try {
          const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
          const dataUrl = await dataUrlFromBlob(blob);

          const latestRoot = rootRef.current;
          if (!latestRoot.profiles.length) return;

          const active = getActiveProfile(latestRoot);
          const wid = currentWordIdRef.current;
          if (!wid) return;

          const w = WORDS.find((x) => x.id === wid);
          if (!w) return;

          // save last recording per word (for current learningLang)
          setRoot((r) => {
            const prof = getActiveProfile(r);
            const s = prof.state as any;
            const lng: LearningLang = s.activeLearningLang ?? "fa";

            const rb = s.recordingsByLang ?? {};
            const perLng = rb[lng] ?? {};

            return updateActiveProfileState(r, {
              ...s,
              recordingsByLang: {
                ...rb,
                [lng]: {
                  ...perLng,
                  [wid]: dataUrl,
                },
              },
            });
          });

          const modeNow: Mode = (active.state as any).mode;

              if (modeNow === 1) {
              setCelebrating({ word: w });

              setPhase(1);
              await sleep(HI5_MS);

              setPhase(2);
              promoteWordNow(wid, 2);

              await sleep(50);

              const sourceEl = hi5Ref.current;
              const targetEl = getTabCountRef(2);
              if (sourceEl && targetEl) startFlyFromTo(sourceEl, targetEl, w);

              await sleep(FLY_MS);

              setPhase(0);
              setCelebrating(null);

              setRoot((r) => {
                const prof = getActiveProfile(r);
                const s = prof.state as any;
                const lng: LearningLang = s.activeLearningLang ?? "fa";

                const wb = s.wordsByLang ?? {};
                const words = wb[lng] ?? {};

                const sb = s.selectedByLang ?? {};
                const selForLng = { ...(sb[lng] ?? {}) } as Partial<Record<Mode, string>>;

                const ids = activeWords
                  .map((x) => x.id)
                  .filter((id) => ((words[id]?.level ?? 1) as Level) === 1);

                const current = selForLng[1] ?? null;
                const nextId = pickRandomId(ids, current);
                if (nextId) selForLng[1] = nextId;

                return updateActiveProfileState(r, {
                  ...s,
                  selectedByLang: { ...sb, [lng]: selForLng },
                });
              });
            }

            if (modeNow === 3) {
              setLastRecordedUrl(dataUrl);
              stopAudio();

              const a = new Audio(dataUrl);
              audioRef.current = a;
              setIsPlaying(true);

              a.onended = () => {
                setIsPlaying(false);
                setL3RecordingReviewOpen(true);
              };

              a.onpause = () => {
                setIsPlaying(false);
              };

              a.play().catch((e) => {
                console.error("Audio play failed:", e);
                setIsPlaying(false);
                setL3RecordingReviewOpen(true);
              });
            }
        } catch (e) {
          console.error(e);
        } finally {
          stream.getTracks().forEach((tr) => tr.stop());
        }
      };

      mediaRecorderRef.current = mr;
      mr.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert(t("dialogs.micAccessDenied"));
    }
  }

  function stopRecording() {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    if (mr.state !== "inactive") mr.stop();
    setIsRecording(false);
  }

  // Sélectionner les familles de mots
  function toggleFamily(familyId: string) {
    updateState((s) => {
      const current = new Set(((s as any).selectedFamilyIds ?? []) as string[]);

      if (current.has(familyId)) {
        if (current.size <= 1) return s;
        current.delete(familyId);
        return { ...(s as any), selectedFamilyIds: Array.from(current) };
      }

      current.add(familyId);
      return { ...(s as any), selectedFamilyIds: Array.from(current) };
    });
  }

  // Level 2 choices
  const l2Choices = useMemo(() => {
    if (!currentWordId) return [];

    const pool = activeWords.filter((w) => hasEmojiOrImage(w));
    const correct = activeWords.find((w) => w.id === currentWordId);
    if (!correct || pool.length === 0) return [];

    const others = pool.filter((w) => w.id !== currentWordId);
    const distractors = shuffle(others).slice(0, 3);

    const combined = [correct, ...distractors].filter(Boolean) as WordDef[];
    return shuffle(combined).slice(0, 4);
  }, [currentWordId, activeWords]);

  const l4Words = useMemo(() => {
    return activeWords.filter(
      (w) => ((wordsForLang[w.id]?.level ?? 1) as Level) === 4
    );
  }, [activeWords, wordsForLang]);

  function listenL2() {
  if (!currentWord) return;
  const url = currentWord.learning[learningLang]?.audioUrl;
  if (!url) return;
  playControlledAudio(url);
}

  function pickL2(choiceId: string) {
    stopAudio();
    if (!currentWordId) return;

    const chosenWord = activeWords.find((w) => w.id === choiceId);
    if (!chosenWord) return;

    // stop tout audio en cours
    stopAudio();

    // joue l'audio du mot cliqué
    const chosenAudio = chosenWord.learning[learningLang]?.audioUrl;
    if (chosenAudio) {
      playControlledAudio(chosenAudio);
    }

    const isCorrect = choiceId === currentWordId;

    // on n'avance PAS tout de suite
    setL2Result({
      ok: isCorrect,
      word: chosenWord,
    });
  }

        //NEW Mode 3 functions
        const [l3HintOpen, setL3HintOpen] = useState(false);
        const [lastHintAudioUrl, setLastHintAudioUrl] = useState<string | null>(null);

        function playHintL3() {
          if (!currentWord) return;

          const hintUrl =
            (currentWord.learning[learningLang] as any)?.hintAudioUrl;

          if (!hintUrl) return;

          stopAudio();
          setLastHintAudioUrl(hintUrl);

          const a = new Audio(hintUrl);
          audioRef.current = a;
          setIsPlaying(true);

          a.onended = () => {
            setIsPlaying(false);
            setL3HintOpen(true);
          };

          a.onpause = () => {
            setIsPlaying(false);
          };

          a.play().catch((e) => {
            console.error("Audio play failed:", e);
            setIsPlaying(false);
            setL3HintOpen(true);
          });
        }

        function revealL3() {
          if (!currentWord || !currentWordId) return;

          const url = currentWord.learning[learningLang]?.audioUrl;
          if (!url) return;

          stopAudio();

          const a = new Audio(url);
          audioRef.current = a;
          setIsPlaying(true);

          a.onended = () => {
            setIsPlaying(false);
            setL3DontKnowOpen(true);
          };

          a.onpause = () => {
            setIsPlaying(false);
          };

          a.play().catch((e) => {
            console.error("Audio play failed:", e);
            setIsPlaying(false);
            setL3DontKnowOpen(true);
          });
        }

        function confirmL3RecordingOk() {
          stopAudio();
          setL3RecordingReviewOpen(false);
          refreshCurrentWord();
        }

        function confirmL3HintAndNext() {
          stopAudio();
          setL3HintOpen(false);
          refreshCurrentWord();
        }
        function confirmL3RecordingRetry() {
          stopAudio();
          setL3RecordingReviewOpen(false);
        }

        function confirmL3DontKnow() {
          if (!currentWordId) return;
          stopAudio();
          promoteWordNow(currentWordId, 2);
          setL3DontKnowOpen(false);
          refreshCurrentWord();
        }

        function teacherValidateL3Ok() {
          if (!currentWordId) return;
          stopAudio();
          validateL3Ok();
          refreshCurrentWord();
        }

        function teacherSendBackToL2() {
          if (!currentWordId) return;
          stopAudio();
          promoteWordNow(currentWordId, 2);
          refreshCurrentWord();
        }
  

  // Level 3
  function validateL3Ok() {
    if (!currentWordId) return;
    promoteWordNow(currentWordId, 4);
  }

  function validateL3Fail() {
    if (!currentWordId) return;
    promoteWordNow(currentWordId, 2);
    refreshCurrentWord();
  }

  // Profile actions 15 mars
  async function onAddProfile() {
    if (!currentUserId) {
      alert("Utilisateur non connecté");
      return;
    }
    console.log("ADD PROFILE CLICKED", currentUserId);
    const name = window.prompt("Nom du profil ?");
    if (!name?.trim()) return;

    const profileId = crypto.randomUUID();
    const avatar = "👧";
    const lang: ProfileLang = "fr";

    console.log("ABOUT TO INSERT", {
      id: profileId,
      user_id: currentUserId,
      name: name.trim(),
      avatar,
      ui_lang: lang,
    });
    const { error } = await supabase.from("profiles").insert([
      {
        id: profileId,
        user_id: currentUserId,
        name: name.trim(),
        avatar,
        ui_lang: lang,
      },
    ]);
    console.log("INSERT RESULT", { error, profileId, currentUserId, name: name.trim() });

    if (error) {
      console.error("create profile error", error);
      alert(`Erreur création profil : ${error.message}`);
      return;
    }

    setRoot((r) => ({
      ...r,
      activeProfileId: r.activeProfileId || profileId,
      profiles: [
        ...r.profiles,
        {
          id: profileId,
          name: name.trim(),
          avatar,
          lang,
          state: buildInitialProfileState(),
        } as any,
      ],
    }));
  }

  function onRenameActive() {
    if (!activeProfile) return;
    const name = window.prompt(t("dialogs.renamePrompt"), activeProfile.name);
    if (!name) return;
    setRoot((r) => renameProfile(r, activeProfile.id, name));
  }

  function onDeleteActive() {
    if (!activeProfile) return;
    const ok = window.confirm(t("dialogs.deleteConfirm"));
    if (!ok) return;
    setRoot((r) => deleteProfile(r, activeProfile.id));
  }

  function resetActiveProfile() {
    if (!activeProfile) return;
    const ok = window.confirm(t("dialogs.resetConfirm"));
    if (!ok) return;
    setRoot((r) =>
      updateActiveProfileState(r, {
        ...buildInitialProfileState(),
        mode: (getActiveProfile(r).state as any).mode,
      } as any)
    );
  }

  function markAcquiredL1() {
    stopAudio();
    if (!currentWordId) return;

    promoteWordNow(currentWordId, 2);

    updateState((s) => {
      const mode: Mode = 1;
      const lng: LearningLang = (s as any).activeLearningLang ?? "fa";

      const wb = (s as any).wordsByLang ?? {};
      const words = wb[lng] ?? {};

      const sb = (s as any).selectedByLang ?? {};
      const selForLng = { ...(sb[lng] ?? {}) } as Partial<Record<Mode, string>>;

      const ids = activeWords
        .map((w) => w.id)
        .filter((id) => ((words[id]?.level ?? 1) as Level) === 1);

      const nextId = pickRandomId(ids, currentWordId);
      if (nextId) selForLng[mode] = nextId;

      return {
        ...(s as any),
        selectedByLang: { ...(sb as any), [lng]: selForLng },
        mode: 1,
      };
    });
  }

  const displayedRecording = currentWordId ? recordingsForLang[currentWordId] : null;

  // c'est ici dans le composant juste avant le return
  const hasHint =
  !!(currentWord &&
     (currentWord.learning[learningLang] as any)?.hintAudioUrl);


  if (!mounted) return null;

  return (
  <div style={styles.page}>
    <div style={{ marginBottom: 12, fontSize: 14 }}>
      {!authChecked
        ? "Vérification session..."
        : currentUserEmail
        ? `Connecté : ${currentUserEmail}`
        : "Non connecté"}
    </div>
      
      {/* Fly animation 
      {fly && (
        <div
          key={fly.id}
          style={{
            ...styles.fly,
            left: fly.x1,
            top: fly.y1,
            ["--dx" as any]: `${fly.x2 - fly.x1}px`,
            ["--dy" as any]: `${fly.y2 - fly.y1}px`,
            animationDuration: `${FLY_MS}ms`,
          }}
        >
          {fly.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fly.imageUrl} alt="" style={styles.flyImg} />
          ) : (
            <span style={styles.flyEmoji}>{fly.emoji ?? "✨"}</span>
          )}
        </div>
      )}*/}

      {/* Celebration overlay */}
      {celebrating && (
        <div style={styles.overlay}>
          <div ref={hi5Ref} style={styles.hi5Card}>
            {phase === 1 && (
              <>
                <div style={{ fontSize: 64, lineHeight: 1 }}>🖐️</div>
                <div style={{ marginTop: 10, fontSize: 16, opacity: 0.9 }}>
                  {t("celebration.highFive")}
                </div>
              </>
            )}

            {phase === 2 && (
              <>
                <div style={{ fontSize: 14, opacity: 0.85 }}>{t("celebration.validated")}</div>
                <div style={{ marginTop: 10 }}>
                  {celebrating.word.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={celebrating.word.imageUrl}
                      alt=""
                      style={{ width: 72, height: 72, objectFit: "contain" }}
                    />
                  ) : (
                    <div style={{ fontSize: 72, lineHeight: 1 }}>{celebrating.word.imageEmoji ?? "✨"}</div>
                  )}
                </div>
                <div style={{ marginTop: 8, fontSize: 14, opacity: 0.85 }}>
                  {t("celebration.toRecognize")}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {l2Result && (
        <div style={styles.overlay}>
          <div style={styles.hi5Card}>
            <div style={{ fontSize: 64, lineHeight: 1 }}>
              {l2Result.ok ? "🙌🏻" : "😓"}
            </div>

            <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700 }}>
              {l2Result.ok ? "Bravo !" : "Oups !"}
            </div>

            <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
              {l2Result.ok ? "Bonne réponse." : "Ce n’était pas la bonne image."}
            </div>

            <button
              style={{ ...styles.primaryBtn, marginTop: 16 }}
              onClick={confirmL2Result}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {l3RecordingReviewOpen && (
        <div style={styles.overlay}>
          <div style={styles.hi5Card}>
            <div style={{ fontSize: 56, lineHeight: 1 }}>🎙️</div>

            <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700 }}>
              Est-ce que c’est ok ?
            </div>

            <div style={{ marginTop: 10 }}>
              {lastRecordedUrl && (
                <audio controls autoPlay src={lastRecordedUrl} style={{ width: "100%" }} />
              )}
            </div>

            <div style={{ ...styles.actions, justifyContent: "center", marginTop: 16 }}>
              <button style={styles.primaryBtn} onClick={confirmL3RecordingOk}>
                OK
              </button>

              <button style={styles.secondaryBtn} onClick={confirmL3RecordingRetry}>
                Recommencer
              </button>
            </div>
          </div>
        </div>
      )}

      {l3DontKnowOpen && (
        <div style={styles.overlay}>
          <div style={styles.hi5Card}>
            <div style={{ fontSize: 56, lineHeight: 1 }}>🤷‍♀️</div>

            <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700 }}>
              Ce mot va redescendre au niveau 2
            </div>

            <button
              style={{ ...styles.primaryBtn, marginTop: 16 }}
              onClick={confirmL3DontKnow}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {l3HintOpen && (
        <div style={styles.overlay}>
          <div style={styles.hi5Card}>
            <div style={{ fontSize: 56, lineHeight: 1 }}>💡</div>

            <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700 }}>
              Indice écouté
            </div>

            <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
              Ce mot reste au niveau 3. On passe à un autre mot.
            </div>

            {lastHintAudioUrl && (
              <div style={{ marginTop: 12 }}>
                <audio controls src={lastHintAudioUrl} style={{ width: "100%" }} />
              </div>
            )}

            <button
              style={{ ...styles.primaryBtn, marginTop: 16 }}
              onClick={confirmL3HintAndNext}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div style={styles.card}>
        {/* Mode bar */}
        <header style={styles.modeBar} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modeLeft}>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                style={styles.levelBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLevelMenu();
                }}
                disabled={!hasProfiles}
                aria-label="Choose level"
                title="Choose level"
              >
                <span style={styles.levelBtnText}>
                  {t("mode.levelLabel", {
                  level: (state as any).mode,
                  label: t(`mode.${(state as any).mode}` as any),
                })}
                </span>
                <span style={styles.levelBtnCaret} aria-hidden="true">
                  ▾
                </span>
              </button>

              {levelMenuOpen && hasProfiles && (
                <div style={styles.levelPopover} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.profilePopoverTitle}>{t("menu.levelsTitle")}</div>

                  <div style={styles.levelList}>
                    {([1, 2, 3, 4] as Mode[]).map((mode) => {
                      const disabled =
                        mode === 2 ? disabledTab.l2 : mode === 3 ? disabledTab.l3 : false;

                      const isActive = (state as any).mode === mode;

                      return (
                        <button
                          key={mode}
                          type="button"
                          disabled={disabled}
                          style={{
                            ...styles.levelListItem,
                            ...(isActive ? styles.levelListItemActive : null),
                            ...(disabled ? styles.levelListItemDisabled : null),
                          }}
                          onClick={() => {
                            setMode(mode);
                            setLevelMenuOpen(false);
                          }}
                        >
                          <span style={styles.levelItemName}>
                            {t("mode.levelLabel", { level: mode, label: t(`mode.${mode}` as any) })}
                          </span>
                          {isActive && <span style={styles.profileItemCheck}>✓</span>}
                          {disabled && <span style={styles.levelLock}>🔒</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {}


          </div>
          <button
                  type="button"
                  style={styles.profileSettingsBtn}
                  onClick={() => {
                    setProfileMenuOpen(false);
                    window.location.href = "/settings";
                  }}
                >
                  EXIT
                </button>
          {}
        </header>

        {!hasProfiles ? (
          <div style={styles.section}>
            <div style={{ fontSize: 16, marginBottom: 10 }}>{t("empty.noProfilesTitle")}</div>
            <button style={styles.primaryBtn} onClick={onAddProfile}>
              {t("empty.addProfileBtn")}
            </button>
          </div>
        ) : (
          <main style={{ display: "grid", gap: 16 }}>
            {/* Si on est en mode 1 et qu'il n'y a plus de mot, on garde quand même les familles */}
            {(state as any).mode === 1 && (!currentWord || !currentWordId || !currentWordState) && (
              <section style={styles.section}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  Il n’y a plus de mots dans cette sélection.
                </div>
                <div style={styles.hint}>Choisis d’autres familles pour continuer.</div>
              </section>
            )}

            {/* Si on est en mode 2 ou 3 et qu'il n'y a pas de mot, on affiche juste l'état vide */}
            {((state as any).mode === 2 || (state as any).mode === 3) &&
              (!currentWord || !currentWordId || !currentWordState) && (
                <section style={styles.section}>
                  <div style={{ fontSize: 16 }}>{t("empty.noWordTitle")}</div>
                  <div style={styles.hint}>{t("empty.noWordHint")}</div>
                </section>
            )}
            {/* Contenu normal seulement s'il y a un mot */}
            {currentWord && currentWordId && currentWordState && (
              <>


                {/* Mode 1 */}
                {(state as any).mode === 1 && (
                  <section style={styles.wordCard}>
                    <div style={styles.imageWrapper}>
                      <div style={styles.imageBox}>
                        {currentWord.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={currentWord.imageUrl}
                            alt=""
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                          />
                        ) : (
                          
                          <div style={{ textAlign: "center", fontSize: 40 }}>
                          {currentWord.imageEmoji && (
                            <div style={{ fontSize: 56 }}>{currentWord.imageEmoji}</div>
                          )}

                          <div style={styles.wordLatin}>
                            {currentWord.learning[uiLang]?.text ?? ""}
                          </div>
                        </div>
                        )}
                      </div>
                    </div>

                    <div style={styles.wordBlock}>

                      <div style={{ ...styles.wordFa, direction: learningLang === "fa" ? "rtl" : "ltr" }}>
                        {currentWord.learning[learningLang]?.text ?? ""}
                      </div>

                      {currentWord.learning[learningLang]?.trans && (
                        <div style={styles.wordTrans}>{currentWord.learning[learningLang]?.trans}</div>
                      )}
                    </div>

                    <div style={styles.actionsRow}>
                      <button style={styles.iconBtnGhost} onClick={refreshCurrentWord}>
                        🔀
                      </button>

                      <button
                        type="button"
                        style={{
                          ...styles.playerBtn,
                          ...(isPlaying ? styles.playerBtnPlaying : {}),
                        }}
                        onClick={() => {
                          const url = currentWord.learning[learningLang]?.audioUrl;
                          if (!url) return;
                          togglePlay(url);
                          handleListenL1();
                        }}
                        aria-label={t("l1.listenRepeat")}
                      >
                        <span style={styles.playerIcon}>{isPlaying ? "⏸" : "▶︎"}</span>
                      </button>

                      <button
                        style={styles.iconBtnPrimary}
                        onClick={() => {
                          stopAudio();
                          markAcquiredL1();
                        }}
                        disabled={!currentWordId}
                      >
                        🙌🏻
                      </button>
                    </div>
                  </section>
                )}

                {/* Mode 2 */}
                {(state as any).mode === 2 && (
                  <section style={styles.section}>
                    {!canAccessL2 && <div style={styles.hint}>{t("l2.unlockHint")}</div>}

                    <div style={styles.hint}>{t("l2.hint")}</div>

                    <div style={styles.actionsRow}>
                      <button
                        type="button"
                        style={{
                          ...styles.playerBtn,
                          ...(isPlaying ? styles.playerBtnPlaying : {}),
                        }}
                        onClick={listenL2}
                      >
                        <span style={styles.playerIcon}>{isPlaying ? "⏸" : "▶︎"}</span>
                      </button>
                    </div>

                    <div style={styles.grid4}>
                      {l2Choices.map((w, idx) => (
                        <button
                          key={`${w.id}__${idx}`}
                          style={styles.optionBtn}
                          onClick={() => pickL2(w.id)}
                        >
                          {w.imageUrl ? (
                            <img src={w.imageUrl} alt="" style={styles.choiceImg} />
                          ) : (
                            <span style={{ fontSize: 90 }}>{w.imageEmoji ?? "✨"}</span>
                          )}

                          <div style={styles.choiceText}>
                            {w.learning[uiLang]?.text}
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

      {/* Mode 3 NEW 2 */}

                      {/* Visual (only in mode 3 in your design) */}
                {(state as any).mode === 3 && (
                  <section style={styles.wordCard}>
                    <div style={styles.imageWrapper}>
                  <div style={styles.imageBox}>
                    {currentWord.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentWord.imageUrl}
                        alt=""
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      <div style={{ textAlign: "center", fontSize: 40 }}>
                        {currentWord.imageEmoji && (
                          <div style={{ fontSize: 56 }}>{currentWord.imageEmoji}</div>
                        )}

                        <div style={{ fontSize: 22 }}>
                          {currentWord.learning[uiLang]?.text ?? ""}
                        </div>
                      </div>
                    )}
                  </div>
                  </div>
                  <div style={styles.hint}>{t("l3.hint")}</div>
                            <div style={styles.actionsRow}>
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                style={styles.recordBtn}
                aria-label="Enregistrer"
                title="Enregistrer"
              >
                ⏺
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                style={styles.recordBtnActive}
                aria-label="Stop"
                title="Stop"
              >
                ⏹
              </button>
            )}

            <button
              type="button"
              style={{
                ...styles.secondaryBtn,
                ...(hasHint ? {} : styles.disabledBtn),
              }}
              onClick={playHintL3}
              disabled={!hasHint}
            >
              Indice
            </button>

            <button
              type="button"
              style={styles.secondaryBtn}
              onClick={revealL3}
            >
              <img src="/images/saispas.png" alt="je ne sais pas" style={{width: 60, height: 60}} />
            </button>
          </div>
                  </section>
                )}
      {(state as any).mode === 3 && (
        <section style={styles.section}>
          
          <div style={styles.audioBox}>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Dernier enregistrement</div>
            {displayedRecording ? (
              <audio controls src={displayedRecording} style={{ width: "100%" }} />
            ) : (
              <div style={{ fontSize: 14, opacity: 0.7 }}>{t("l3.noRecordingHint")}</div>
            )}
          </div>

          <section style={{ ...styles.section, marginTop: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
              Réservé prof
            </div>

            <div style={styles.actions}>
              <button
                style={styles.primaryBtn}
                onClick={teacherValidateL3Ok}
                disabled={!displayedRecording}
              >
                OK
              </button>

              <button
                style={styles.secondaryBtn}
                onClick={teacherSendBackToL2}
              >
                Repasser au niveau 2
              </button>
            </div>
          </section>
          
        </section>
      )}
              </>
            )}


{/* Mode 4 NEW 3 */}
{(state as any).mode === 4 && (
  <section style={styles.section}>
    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
      Mots acquis
    </div>

    {l4Words.length === 0 ? (
      <div style={styles.hint}>Aucun mot acquis dans les familles sélectionnées.</div>
    ) : (
      <div style={styles.grid4Acquired}>
        {l4Words.map((w) => (
          <div key={w.id} style={styles.acquiredCard}>
            <div style={styles.acquiredVisual}>
              {w.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={w.imageUrl} alt="" style={styles.choiceImg} />
              ) : (
                <span style={{ fontSize: 44 }}>{w.imageEmoji ?? "✨"}</span>
              )}
            </div>

            <div style={styles.acquiredText}>
              <div style={{ fontWeight: 700 }}>
                {w.learning[uiLang]?.text ?? ""}
              </div>
              <div style={{ opacity: 0.75 }}>
                {w.learning[learningLang]?.text ?? ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
)}

            {/* Familles : toujours visibles en mode 1, même sans mot */}
            {(state as any).mode === 1 && (
              <section style={styles.section}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
                  {t("families.title")}
                </div>

                <div style={styles.familyGrid}>
                  {FAMILIES.map((f) => {
                    const selected = ((state as any).selectedFamilyIds ?? []).includes(f.id);
                    const { total, validated, pct } = familyStats(f.id);

                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => toggleFamily(f.id)}
                        style={{
                          ...styles.familyCard,
                          ...(selected ? styles.familyCardSelected : {}),
                        }}
                      >
                        <div
                          aria-hidden="true"
                          style={{
                            ...styles.familyCheck,
                            backgroundColor: selected ? "#4F46E5" : "#fff",
                            border: selected ? "2px solid #4F46E5" : "2px solid rgba(0,0,0,0.22)",
                            boxShadow: selected ? "0 6px 14px rgba(79,70,229,0.35)" : "none",
                          }}
                        >
                          <span
                            style={{
                              ...styles.familyCheckMark,
                              color: selected ? "#fff" : "transparent",
                            }}
                          >
                            ✓
                          </span>
                        </div>

                        <div style={styles.familyTopRow}>
                          <div style={styles.familyIcon}>{familyIcon(f)}</div>

                          <div style={{ display: "grid", gap: 4, flex: 1 }}>
                            <div style={styles.familyTitle}>{familyLabel(f, uiLang)}</div>
                            <div style={styles.familyCount}>
                              {validated} / {total} {t("families.countUnit")}
                            </div>
                          </div>
                        </div>

                        <div style={styles.progressTrack}>
                          <div style={{ ...styles.progressFill, width: `${pct}%`, background: f.color }} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!((state as any).selectedFamilyIds?.length) && (
                  <div style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>
                    {t("families.warnSelectAtLeastOne")}
                  </div>
                )}
              </section>
            )}
          </main>
        )}  
      </div>

      <style jsx global>{`
        @keyframes fly-to-tab {
          0% {
            transform: translate(0px, 0px) scale(1);
            opacity: 1;
            filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.18));
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) scale(0.45);
            opacity: 0;
            filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
          }
        }
      `}</style>
    </div>
  );
}

/* ---------------- Styles (inchangés) ---------------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 18,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "linear-gradient(180deg, #f6f7fb, #ffffff)",
    color: "#111",
  },
  card: {
    width: "min(980px, 100%)",
    background: "white",
    borderRadius: 14,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.06)",
    padding: 16,
    position: "relative",
  },

  // generic
  section: {
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.08)",
    padding: 14,
    background: "#fff",
  },
  h2: { margin: "0 0 10px", fontSize: 18 },
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 },
  hint: { marginTop: 10, fontSize: 13, opacity: 0.8 },

  primaryBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#111",
    color: "white",
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#f1f1f1",
    border: "1px solid #ddd",
    padding: "12px 18px",
    borderRadius: 16,
    fontSize: 14,
    cursor: "pointer",
  },
  dangerBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#b71c1c",
    color: "white",
    cursor: "pointer",
  },

  audioBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    border: "1px dashed rgba(0,0,0,0.18)",
    background: "#fcfcfc",
  },

  // mode bar + menus
  modeBar: {
    position: "relative",
    overflow: "visible",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "linear-gradient(180deg, #FFF2B8, #FFE79B)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    marginBottom: 12,
  },
  modeLeft: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },

  levelBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 14,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 900,
    maxWidth: 360,
  },
  levelBtnText: {
    fontSize: 18,
    fontWeight: 900,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 300,
  },
  levelBtnCaret: { opacity: 0.75, flex: "0 0 auto" },

  levelPopover: {
    position: "absolute",
    left: 0,
    top: "calc(100% + 8px)",
    width: 320,
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "#fff",
    boxShadow: "0 18px 50px rgba(0,0,0,0.14)",
    padding: 10,
    display: "grid",
    gap: 8,
    zIndex: 999,
  },
  levelList: { display: "grid", gap: 6 },
  levelListItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 10px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.06)",
    background: "#fafafa",
    cursor: "pointer",
    textAlign: "left",
  },
  levelListItemActive: {
    background: "#111",
    color: "#fff",
    border: "1px solid rgba(0,0,0,0.20)",
  },
  levelListItemDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  levelItemName: { flex: 1, fontWeight: 900 },
  levelLock: { marginLeft: 8, fontSize: 14, opacity: 0.9 },

  avatarWrap: { position: "relative", flex: "0 0 auto" },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  avatarImg: { fontSize: 18 },

  profilePopover: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 8px)",
    width: 240,
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "#fff",
    boxShadow: "0 18px 50px rgba(0,0,0,0.14)",
    padding: 10,
    display: "grid",
    gap: 8,
    zIndex: 999,
  },
  profilePopoverTitle: {
    fontSize: 12,
    fontWeight: 800,
    opacity: 0.65,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  profileList: { display: "grid", gap: 6 },
  profileListItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 10px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.06)",
    background: "#fafafa",
    cursor: "pointer",
    textAlign: "left",
  },
  profileListItemActive: {
    background: "#111",
    color: "#fff",
    border: "1px solid rgba(0,0,0,0.20)",
  },
  profileItemAvatar: { width: 22, textAlign: "center" },
  profileItemName: { flex: 1, fontWeight: 800 },
  profileItemCheck: { fontWeight: 900 },

  profilePopoverDivider: { height: 1, background: "rgba(0,0,0,0.08)" },
  profileSettingsBtn: {
    padding: "10px 10px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.06)",
    background: "#fff",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: 800,
  },

  // mode 3 big visual
  bigVisual: {
    borderRadius: 12,
    height: 220,
    background: "radial-gradient(circle at 30% 30%, #fff3e0, #f7f7ff)",
    border: "1px solid rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 90 },
  bigImage: { width: 160, height: 160, objectFit: "contain" },

  // level 2 grid
  grid4: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
optionBtn: {
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "#fff",
  padding: 18,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",   // 🔴 clé pour mettre le texte dessous
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 120,
},
  choiceImg: { width: 190, height: 190, objectFit: "contain" },

  // celebration / fly
  fly: {
    position: "fixed",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
    animationName: "fly-to-tab",
    animationTimingFunction: "cubic-bezier(0.2, 0.9, 0.2, 1)",
    animationFillMode: "forwards",
    pointerEvents: "none",
  },
  flyEmoji: { fontSize: 34, display: "inline-block" },
  flyImg: { width: 34, height: 34, objectFit: "contain" },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.08)",
    backdropFilter: "blur(2px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9998,
  },
  hi5Card: {
    width: "min(320px, 90vw)",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    padding: 18,
    textAlign: "center",
    boxShadow: "0 18px 50px rgba(0,0,0,0.14)",
  },

  // families
  familyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  familyCard: {
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "#fff",
    cursor: "pointer",
    textAlign: "left",
    position: "relative",
  },
  familyCardSelected: {
    border: "1px solid rgba(0,0,0,0.22)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  familyCheck: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 180ms ease",
  },
  familyCheckMark: {
    fontSize: 20,
    fontWeight: 900,
    lineHeight: 1,
    transform: "translateY(-1px)",
  },
  familyTopRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  familyIcon: { fontSize: 26, width: 34, textAlign: "center" },
  familyTitle: { fontSize: 16, fontWeight: 700 },
  familyCount: { fontSize: 13, opacity: 0.75 },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    background: "rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    transition: "width 220ms ease",
  },

  // level 1 card
  wordCard: {
    background: "#fff",
    borderRadius: 24,
    padding: 32,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 28,
    boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  },
  imageWrapper: { width: "100%", display: "flex", justifyContent: "center" },
  imageBox: {
    width: "100%",
    maxWidth: 420,
    height: 220,
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 120,
    background: "linear-gradient(135deg, #f4f1ea, #e9eef6)",
  },
  wordBlock: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  wordLatin: { fontSize: 28, fontWeight: 600 },
  wordFa: { fontSize: 34, fontWeight: 500 },
  wordTrans: { fontSize: 16, opacity: 0.6, letterSpacing: 1 },

  actionsColumn: { display: "flex", flexDirection: "column", gap: 14, alignItems: "center" },
  listenBtn: {
    background: "#111",
    color: "#fff",
    padding: "12px 22px",
    borderRadius: 18,
    border: "none",
    fontSize: 15,
    cursor: "pointer",
  },
  rowBtns: { display: "flex", gap: 12 },
  acquiredBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "#57a66f",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
  learnBtn: {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  background: "rgba(255,255,255,0.65)",
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 14,
  padding: "10px 12px",
  cursor: "pointer",
  fontWeight: 900,
},
learnBtnText: {
  fontSize: 14,
  fontWeight: 900,
  letterSpacing: 0.8,
  opacity: 0.9,
},
playerBtn: {
  width: 88,
  height: 88,
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "#111",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
},

playerBtnPlaying: {
  transform: "scale(1.03)",
  boxShadow: "0 14px 26px rgba(0,0,0,0.18)",
},

playerIcon: {
  fontSize: 30,
  lineHeight: 1,
  transform: "translateX(2px)", // play icon optique centrée
},
actionsRow: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 18,
  marginTop: 18,
},

iconBtnGhost: {
  width: 58,
  height: 58,
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.10)",
  background: "rgba(255,255,255,0.92)",
  boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
  fontSize: 24,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},

playBtn: {
  width: 86,
  height: 86,
  borderRadius: 999,
  border: "none",
  background: "#111",
  color: "#fff",
  boxShadow: "0 18px 44px rgba(0,0,0,0.18)",
  fontSize: 30,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},

iconBtnPrimary: {
  width: 58,
  height: 58,
  borderRadius: 999,
  border: "none",
  background: "#2E9E55",
  color: "#fff",
  boxShadow: "0 14px 34px rgba(46,158,85,0.22)",
  fontSize: 26,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},

recordBtn: {
  width: 88,
  height: 88,
  borderRadius: 999,
  border: "none",
  background: "#d32f2f",
  color: "#fff",
  boxShadow: "0 18px 44px rgba(211,47,47,0.22)",
  fontSize: 34,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},

recordBtnActive: {
  width: 88,
  height: 88,
  borderRadius: 999,
  border: "none",
  background: "#111",
  color: "#fff",
  boxShadow: "0 18px 44px rgba(0,0,0,0.18)",
  fontSize: 30,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},

disabledBtn: {
  opacity: 0.4,
  cursor: "not-allowed",
},
};