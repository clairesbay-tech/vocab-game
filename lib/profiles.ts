// lib/profiles.ts
import { WORDS, type LearningLang } from "./words";
import { FAMILIES } from "./families";

/**
 * Niveaux / modes
 * 1 = Répéter
 * 2 = Reconnaître
 * 3 = Dire
 * 4 = Mot acquis
 */
export type Level = 1 | 2 | 3 | 4;
export type Mode = 1 | 2 | 3 | 4;

/** Langue de l’UI (labels, noms des familles, menus…) */
export type ProfileLang = "fr" | "en";

/** Etat d’un mot */
export type ProfileWordState = {
  level: Level;
  l1ListenCount: number; // 0..3
};

/** Etat global du profil (progression + prefs de jeu) */
export type ProfileState = {
  mode: Mode;

  // Langues d’apprentissage gérées par le profil (multi-langues)
  learningLangs: LearningLang[]; // ex: ["fa","es"]
  activeLearningLang: LearningLang; // langue courante (dropdown)

  // Progression & enregistrements par langue apprise
  wordsByLang: Record<LearningLang, Record<string, ProfileWordState>>;
  recordingsByLang: Record<LearningLang, Record<string, string | null>>;

  // Mot sélectionné (par langue, par mode)
  selectedByLang: Partial<Record<LearningLang, Partial<Record<Mode, string>>>>;

  selectedFamilyIds: string[];
};

export type Profile = {
  id: string;
  name: string;
  avatar?: string;

  /** UI language */
  lang: ProfileLang;

  state: ProfileState;
};

export type RootState = {
  activeProfileId: string;
  profiles: Profile[];
};

// ✅ vu que tu changes la structure, change la clé pour repartir clean
const STORAGE_KEY = "learning-root-v2";

/* ------------------------- Constants / Builders helpers ------------------------- */

const ALL_LEARNING_LANGS: LearningLang[] = ["fa", "es", "fr", "en"];

export function buildInitWords(): Record<string, ProfileWordState> {
  const init: Record<string, ProfileWordState> = {};
  for (const w of WORDS) init[w.id] = { level: 1, l1ListenCount: 0 };
  return init;
}

function buildInitWordsByLang(): Record<LearningLang, Record<string, ProfileWordState>> {
  const base = buildInitWords();
  const out = {} as Record<LearningLang, Record<string, ProfileWordState>>;
  for (const lng of ALL_LEARNING_LANGS) out[lng] = { ...base };
  return out;
}

function buildInitRecordingsByLang(): Record<LearningLang, Record<string, string | null>> {
  const perWord = Object.fromEntries(WORDS.map((w) => [w.id, null])) as Record<string, string | null>;
  const out = {} as Record<LearningLang, Record<string, string | null>>;
  for (const lng of ALL_LEARNING_LANGS) out[lng] = { ...perWord };
  return out;
}

/* ------------------------- Builders ------------------------- */

export function buildInitialProfileState(): ProfileState {
  return {
    mode: 1,

    // multi-langues activées + langue courante
    learningLangs: ["fa"],
    activeLearningLang: "fa",

    wordsByLang: buildInitWordsByLang(),
    recordingsByLang: buildInitRecordingsByLang(),
    selectedByLang: {},

    selectedFamilyIds: FAMILIES.map((f) => f.id),
  };
}

function makeId(prefix = "p") {
  const rnd =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? // @ts-ignore
        crypto.randomUUID()
      : `${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;

  return `${prefix}_${rnd}`;
}

function normalizeUiLang(x: any): ProfileLang {
  return x === "en" ? "en" : "fr";
}

function normalizeLearningLang(x: any): LearningLang {
  if (x === "fa" || x === "es" || x === "fr" || x === "en") return x;
  return "fa";
}

/** ✅ Root initial : 1 profil FR */
export function buildInitialRootState(): RootState {
  const p1: Profile = {
    id: makeId("profile"),
    name: "Profil 1",
    avatar: "👧",
    lang: "fr",
    state: buildInitialProfileState(),
  };

  return {
    activeProfileId: p1.id,
    profiles: [p1],
  };
}

/* ------------------------- Normalizers ------------------------- */

function normalizeProfileWordState(raw: any): ProfileWordState {
  const level: Level = raw?.level === 2 || raw?.level === 3 || raw?.level === 4 ? raw.level : 1;
  const l1 = Number.isFinite(raw?.l1ListenCount) ? Math.max(0, raw.l1ListenCount) : 0;
  return { level, l1ListenCount: Math.min(3, l1) };
}

function normalizeWordsByLang(raw: any): Record<LearningLang, Record<string, ProfileWordState>> {
  const init = buildInitWordsByLang();
  const out = { ...init } as Record<LearningLang, Record<string, ProfileWordState>>;

  for (const lng of ALL_LEARNING_LANGS) {
    const savedLangBlock = raw?.[lng];
    if (!savedLangBlock || typeof savedLangBlock !== "object") continue;

    const merged: Record<string, ProfileWordState> = { ...init[lng] };
    for (const w of WORDS) {
      const saved = (savedLangBlock as any)[w.id];
      if (!saved) continue;
      merged[w.id] = normalizeProfileWordState(saved);
    }
    out[lng] = merged;
  }

  return out;
}

function normalizeRecordingsByLang(raw: any): Record<LearningLang, Record<string, string | null>> {
  const init = buildInitRecordingsByLang();
  const out = { ...init } as Record<LearningLang, Record<string, string | null>>;

  for (const lng of ALL_LEARNING_LANGS) {
    const savedLangBlock = raw?.[lng];
    if (!savedLangBlock || typeof savedLangBlock !== "object") continue;

    const merged: Record<string, string | null> = { ...init[lng] };
    for (const w of WORDS) {
      const val = (savedLangBlock as any)[w.id];
      merged[w.id] = typeof val === "string" ? val : null;
    }
    out[lng] = merged;
  }

  return out;
}

function normalizeSelectedByLang(raw: any): Partial<Record<LearningLang, Partial<Record<Mode, string>>>> {
  const allIds = new Set(WORDS.map((w) => w.id));
  const out: Partial<Record<LearningLang, Partial<Record<Mode, string>>>> = {};

  if (!raw || typeof raw !== "object") return out;

  for (const lng of ALL_LEARNING_LANGS) {
    const savedLng = raw[lng];
    if (!savedLng || typeof savedLng !== "object") continue;

    const perMode: Partial<Record<Mode, string>> = {};
    for (const m of [1, 2, 3, 4] as Mode[]) {
      const sel = (savedLng as any)[m];
      if (typeof sel === "string" && allIds.has(sel)) perMode[m] = sel;
    }

    if (Object.keys(perMode).length) out[lng] = perMode;
  }

  return out;
}

function normalizeSelectedFamilyIds(raw: any): string[] {
  const familyIds = new Set(FAMILIES.map((f) => f.id));
  const arr = Array.isArray(raw) ? raw : null;

  const cleaned =
    arr?.filter((id: any) => typeof id === "string" && familyIds.has(id)) ??
    FAMILIES.map((f) => f.id);

  // sécurité : au moins 1 famille
  return cleaned.length ? cleaned : FAMILIES.map((f) => f.id);
}

function normalizeLearningLangs(raw: any): LearningLang[] {
  const arr = Array.isArray(raw) ? raw : null;
  const cleaned = (arr ?? ["fa"])
    .map(normalizeLearningLang)
    .filter((x, i, a) => a.indexOf(x) === i);

  return cleaned.length ? cleaned : ["fa"];
}

function normalizeProfileState(state: Partial<ProfileState> | undefined): ProfileState {
  const mode: Mode =
    state?.mode === 2 || state?.mode === 3 || state?.mode === 4 ? state.mode : 1;

  const learningLangs = normalizeLearningLangs((state as any)?.learningLangs);
  const activeLearningLangRaw = normalizeLearningLang((state as any)?.activeLearningLang);
  const activeLearningLang = learningLangs.includes(activeLearningLangRaw)
    ? activeLearningLangRaw
    : learningLangs[0];

  const wordsByLang = normalizeWordsByLang((state as any)?.wordsByLang);
  const recordingsByLang = normalizeRecordingsByLang((state as any)?.recordingsByLang);
  const selectedByLang = normalizeSelectedByLang((state as any)?.selectedByLang);

  const selectedFamilyIds = normalizeSelectedFamilyIds((state as any)?.selectedFamilyIds);

  return {
    mode,
    learningLangs,
    activeLearningLang,
    wordsByLang,
    recordingsByLang,
    selectedByLang,
    selectedFamilyIds,
  };
}

function normalizeRootState(raw: any): RootState {
  const fallback = buildInitialRootState();

  const profilesRaw: any[] = Array.isArray(raw?.profiles) ? raw.profiles : [];
  const profiles: Profile[] = profilesRaw
    .map((p) => {
      if (!p?.id || !p?.name) return null;

      return {
        id: String(p.id),
        name: String(p.name),
        avatar: typeof p.avatar === "string" ? p.avatar : "👧",
        lang: normalizeUiLang(p.lang),
        state: normalizeProfileState(p.state),
      } satisfies Profile;
    })
    .filter(Boolean) as Profile[];

  if (!profiles.length) return fallback;

  const activeProfileId =
    profiles.some((p) => p.id === raw?.activeProfileId) ? String(raw.activeProfileId) : profiles[0].id;

  return { activeProfileId, profiles };
}

/* ------------------------- Storage ------------------------- */

export function loadRootState(): RootState {
  if (typeof window === "undefined") return buildInitialRootState();

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return buildInitialRootState();

  try {
    const parsed = JSON.parse(raw);
    return normalizeRootState(parsed);
  } catch {
    return buildInitialRootState();
  }
}

export function saveRootState(root: RootState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
}

/* ------------------------- Helpers ------------------------- */

export function getActiveProfile(root: RootState): Profile {
  if (!root.profiles?.length) {
    return {
      id: "fallback",
      name: "Profil 1",
      avatar: "👧",
      lang: "fr",
      state: buildInitialProfileState(),
    };
  }
  return root.profiles.find((p) => p.id === root.activeProfileId) ?? root.profiles[0];
}

export function setActiveProfile(root: RootState, profileId: string): RootState {
  if (!root.profiles.some((p) => p.id === profileId)) return root;
  return { ...root, activeProfileId: profileId };
}

export function updateActiveProfileState(root: RootState, nextState: ProfileState): RootState {
  const active = getActiveProfile(root);
  return {
    ...root,
    profiles: root.profiles.map((p) => (p.id === active.id ? { ...p, state: nextState } : p)),
  };
}

export function setActiveProfileLang(root: RootState, lang: ProfileLang): RootState {
  const active = getActiveProfile(root);
  return {
    ...root,
    profiles: root.profiles.map((p) => (p.id === active.id ? { ...p, lang } : p)),
  };
}

/** ✅ Change la langue apprise courante (dropdown dans l'UI de jeu) */
export function setActiveLearningLang(root: RootState, profileId: string, learningLang: LearningLang): RootState {
  const active = getActiveProfile(root);
  const next = normalizeLearningLang(learningLang);

  return {
    ...root,
    profiles: root.profiles.map((p) => {
      if (p.id !== active.id) return p;

      const learningLangs = p.state.learningLangs.includes(next)
        ? p.state.learningLangs
        : [...p.state.learningLangs, next];

      return {
        ...p,
        state: {
          ...p.state,
          learningLangs,
          activeLearningLang: next,
        },
      };
    }),
  };
}

/* ------------------------- Profile CRUD ------------------------- */

export function addProfile(root: RootState, name?: string, lang: ProfileLang = "fr"): RootState {
  const newProfile: Profile = {
    id: makeId("profile"),
    name: name?.trim() ? name.trim() : `Profil ${root.profiles.length + 1}`,
    avatar: "👧",
    lang,
    state: buildInitialProfileState(),
  };

  return {
    activeProfileId: newProfile.id,
    profiles: [...root.profiles, newProfile],
  };
}

export function renameProfile(root: RootState, profileId: string, name: string): RootState {
  const nextName = name.trim();
  if (!nextName) return root;

  return {
    ...root,
    profiles: root.profiles.map((p) => (p.id === profileId ? { ...p, name: nextName } : p)),
  };
}

export function deleteProfile(root: RootState, profileId: string): RootState {
  if (root.profiles.length <= 1) return root;

  const remaining = root.profiles.filter((p) => p.id !== profileId);

  const nextActive = remaining.some((p) => p.id === root.activeProfileId)
    ? root.activeProfileId
    : remaining[0].id;

  return { activeProfileId: nextActive, profiles: remaining };
}