export type UiLang = "fr" | "en";

export type FamilyDef = {
  id: string;
  fr: string;
  eng: string;
  emoji?: string;     // simple (ex: 🍌)
  imageUrl?: string;
  color: string;
  
};

export const FAMILIES: FamilyDef[] = [
  {
    id: "fruits",
    fr: "Fruits",
    eng: "Fruits",
    emoji: "🍌",
    color: "#F3C64B",
  },
  {
    id: "couleurs",
    fr: "Couleurs",
    eng: "Colors",
    emoji: "🎨",
    color: "#8B5CF6",
  },

  {
    id: "animals",
    fr: "Animaux",
    eng: "Animals",
    emoji: "🐶",
    color: "#69C2A8",
  },
  {
    id: "vetements",
    fr: "Vêtements",
    eng: "Cloths",
    emoji: "👗",
    color: "#43adcb",
  },

    {
    id: "questions",
    fr: "Questions",
    eng: "Questions",
    emoji: "❔",
    color: "#c49dc7",
  },
  {
    id: "erfan",
    fr: "Soufisme",
    eng: "Sufism",
    emoji: "🐦‍🔥",
    color: "#f75a5a",
  },
  {
  id: "nombres",
  fr: "Nombres",
  eng: "Numbers",
  emoji: "💯",
  color: "#7C3AED",
}
];

export function familyIcon(f: FamilyDef) {
  return f.emoji ?? "📚";
}