export type UiLang = "fr" | "en";
import type { Mode } from "@/lib/profiles";
/**
 * Toutes les clés UI utilisées par l'app.
 * (Garde ce type, ça aide à éviter les fautes de frappe.)
 */
export type TKey =
  // Menus
  | "menu.levelsTitle"
  | "menu.profilesTitle"
  | "menu.addProfile"
  | "menu.rename"
  | "menu.resetProgress"
  | "menu.delete"
  | "menu.settings"

  // Mode / levels
  | "mode.levelLabel" // template "Level {level} — {label}"
  | "mode.1"
  | "mode.2"
  | "mode.3"
  | "mode.4"

  // Empty states
  | "empty.noProfilesTitle"
  | "empty.addProfileBtn"
  | "empty.noWordTitle"
  | "empty.noWordHint"

  // Families
  | "families.title"
  | "families.countUnit"
  | "families.warnSelectAtLeastOne"

  // L1
  | "l1.listenRepeat"
  | "l1.iKnow"
  | "l1.changeWord"

  // L2
  | "l2.title"
  | "l2.unlockHint"
  | "l2.hint"
  | "l2.listen"

  // L3
  | "l3.title"
  | "l3.hint"
  | "l3.relisten"
  | "l3.record"
  | "l3.stop"
  | "l3.lastRecordingTitle"
  | "l3.noRecordingHint"
  | "l3.ok"
  | "l3.fail"

  // Dialogs / browser
  | "dialogs.browserNoMic"
  | "dialogs.micAccessDenied"
  | "dialogs.l3Bravo"
  | "dialogs.renamePrompt"
  | "dialogs.deleteConfirm"
  | "dialogs.resetConfirm"

  // Celebration overlay
  | "celebration.highFive"
  | "celebration.validated"
  | "celebration.toRecognize";

/**
 * Dictionnaire unique (FR/EN) — pas de doublons.
 * IMPORTANT: on standardise les placeholders:
 * - mode.levelLabel => {level} et {label} (comme dans ton JSX)
 */
const I18N: Record<UiLang, Record<TKey, string>> = {
  fr: {
    // Menus
    "menu.levelsTitle": "Niveaux",
    "menu.profilesTitle": "Profils",
    "menu.addProfile": "➕ Ajouter un profil",
    "menu.rename": "✏️ Renommer",
    "menu.resetProgress": "♻️ Réinitialiser la progression",
    "menu.delete": "🗑️ Supprimer",
    "menu.settings": "Paramètres",

    // Mode / levels
    "mode.levelLabel": "{level} — {label}",
    "mode.1": "Répéter",
    "mode.2": "Reconnaître",
    "mode.3": "Dire",
    "mode.4": "Mot acquis",

    // Empty states
    "empty.noProfilesTitle": "Crée un profil pour commencer 🙂",
    "empty.addProfileBtn": "➕ Ajouter un profil",
    "empty.noWordTitle": "Aucun mot disponible dans ce niveau.",
    "empty.noWordHint": "(Sélectionne une famille de mots pour jouer.)",

    // Families
    "families.title": "Sélectionner des familles de mots",
    "families.countUnit": "mots",
    "families.warnSelectAtLeastOne": "⚠️ Sélectionne au moins une famille pour jouer.",

    // L1
    "l1.listenRepeat": "🔊 Écouter et répéter",
    "l1.iKnow": "✓ Je connais",
    "l1.changeWord": "🔄 Changer de mot",

    // L2
    "l2.title": "Je reconnais",
    "l2.unlockHint": "🔒 Débloqué quand (Niveau 1 + Niveau 2) ≥ 4",
    "l2.hint": "Écoute, puis sélectionne la bonne image.",
    "l2.listen": "🔊 Écoute",

    // L3
    "l3.title": "Je sais dire",
    "l3.hint": "Si tu connais le mot, enregistre-le",
    "l3.relisten": "🔊 Réécouter le modèle",
    "l3.record": "🎙️ Enregistrer ma réponse",
    "l3.stop": "⏹️ Stop",
    "l3.lastRecordingTitle": "Dernier enregistrement",
    "l3.noRecordingHint": "(Enregistre ta réponse pour l’écouter.)",
    "l3.ok": "✅ OK",
    "l3.fail": "↩️ Je me suis trompé",

    // Dialogs
    "dialogs.browserNoMic": "Ton navigateur ne semble pas autoriser le micro.",
    "dialogs.micAccessDenied": "Accès au micro refusé. Autorise le micro puis réessaie.",
    "dialogs.l3Bravo": "Bravo 🎉",
    "dialogs.renamePrompt": "Nouveau nom du profil :",
    "dialogs.deleteConfirm": "Supprimer ce profil ? (La progression sera perdue)",
    "dialogs.resetConfirm": "Réinitialiser la progression de ce profil ?",

    // Celebration overlay
    "celebration.highFive": "High five !",
    "celebration.validated": "Validé ✅",
    "celebration.toRecognize": "→ Je reconnais",
  },

  en: {
    // Menus
    "menu.levelsTitle": "Levels",
    "menu.profilesTitle": "Profiles",
    "menu.addProfile": "➕ Add profile",
    "menu.rename": "✏️ Rename",
    "menu.resetProgress": "♻️ Reset progress",
    "menu.delete": "🗑️ Delete",
    "menu.settings": "Settings",

    // Mode / levels
    "mode.levelLabel": "{level} — {label}",
    "mode.1": "Repeat",
    "mode.2": "Recognize",
    "mode.3": "Say",
    "mode.4": "Known",

    // Empty states
    "empty.noProfilesTitle": "Create a profile to start 🙂",
    "empty.addProfileBtn": "➕ Add profile",
    "empty.noWordTitle": "No word available for this level.",
    "empty.noWordHint": "(Select a word family to play.)",

    // Families
    "families.title": "Select word families",
    "families.countUnit": "words",
    "families.warnSelectAtLeastOne": "⚠️ Select at least one family to play.",

    // L1
    "l1.listenRepeat": "🔊 Listen & repeat",
    "l1.iKnow": "✓ I know it",
    "l1.changeWord": "🔄 Change word",

    // L2
    "l2.title": "I recognize",
    "l2.unlockHint": "🔒 Unlocked when (Level 1 + Level 2) ≥ 4",
    "l2.hint": "Tap Listen, then choose the correct image.",
    "l2.listen": "🔊 Listen",

    // L3
    "l3.title": "I can say it",
    "l3.hint": "Say the word (no text). You can replay the model if needed.",
    "l3.relisten": "🔊 Replay model",
    "l3.record": "🎙️ Record my answer",
    "l3.stop": "⏹️ Stop",
    "l3.lastRecordingTitle": "Latest recording",
    "l3.noRecordingHint": "(Record your answer to listen to it.)",
    "l3.ok": "✅ OK",
    "l3.fail": "↩️ I was wrong",

    // Dialogs
    "dialogs.browserNoMic": "Your browser doesn't seem to support microphone recording.",
    "dialogs.micAccessDenied": "Microphone access denied. Please allow it and try again.",
    "dialogs.l3Bravo": "Well done 🎉",
    "dialogs.renamePrompt": "New profile name:",
    "dialogs.deleteConfirm": "Delete this profile? (Progress will be lost)",
    "dialogs.resetConfirm": "Reset this profile’s progress?",

    // Celebration overlay
    "celebration.highFive": "High five!",
    "celebration.validated": "Validated ✅",
    "celebration.toRecognize": "→ I recognize",
  },
};

function format(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_m, k) =>
    vars[k] === undefined || vars[k] === null ? `{${k}}` : String(vars[k])
  );
}

/**
 * Usage:
 * tt(uiLang, "mode.levelLabel", { level: 1, label: tt(uiLang, "mode.1") })
 */
export function tt(lang: UiLang, key: TKey, params?: Record<string, string | number>) {
  const template = I18N[lang]?.[key] ?? I18N.fr[key] ?? (key as string);
  return format(template, params);
}
export type ModeKey = `mode.${Mode}`;