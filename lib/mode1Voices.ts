import type { LearningLang } from "./words";

export type Mode1Voice =
  | "turtle"
  | "child"
  | "robot"
  | "hero"
  | "maman"
  | "pirate";

export const MODE1_VOICES: Mode1Voice[] = [
  "turtle",
  "child",
  "robot",
  "hero",
  "maman",
  "pirate",
];

export function getMode1AudioUrl(
  learningLang: LearningLang,
  wordId: string,
  voice: Mode1Voice
): string {
  return `/audio/${learningLang}/${voice}/${wordId}.mp3`;
}

export function getMode1AudioCandidates(
  learningLang: LearningLang,
  wordId: string,
  voice: Mode1Voice
): string[] {
  const primary = getMode1AudioUrl(learningLang, wordId, voice);
  const fallback = getMode1AudioUrl(learningLang, wordId, "maman");

  return voice === "maman" ? [primary] : [primary, fallback];
}

export function getMode1VoiceLabel(voice: Mode1Voice): string {
  switch (voice) {
    case "turtle":
      return "🐢 Tortue";
    case "child":
      return "🧒 Enfant";
    case "robot":
      return "🤖 Robot";
    case "hero":
      return "🦸 Super-héros";
    case "maman":
      return "▶︎";
    case "pirate":
      return "🏴‍☠️ Pirate";
  }
}

export function pickTwoMode1Voices(): [Mode1Voice, Mode1Voice] {
  const pool = [...MODE1_VOICES];

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return [pool[0], pool[1]];
}