// lib/words.ts

// Quand j'ajoute un mot, je dois vérifier que la famille existe
export type LearningLang = "fa" | "es" | "fr" | "en";

import type { Mode1Voice } from "./mode1Voices";
export type WordDef = {
  id: string;
  families: string[];
  imageEmoji?: string;
  imageUrl?: string;
  learning: Partial<
    Record<
      LearningLang,
      {
        text: string; // mot dans la langue
        trans?: string; // prononciation (latin)
        audioUrl?: string; // audio du modèle
        hintAudioUrl?: string; // audio indice avec la première syllabe
      }
    >
  >;
  mode1Voices?: Mode1Voice[];
};

// helper: audio par convention /public/audio/<lang>/<id>.m4a
const A = (lang: LearningLang, id: string) => `/audio/${lang}/${id}.m4a`;

export const WORDS: WordDef[] = [
  // ERFAN
  {
    id: "parconsequent",
    families: ["erfan"],
    learning: {
      fa: { text: "نَتیجَتاً", trans: "NA-TI-DJA-TAN", audioUrl: A("fa", "natijatan"), hintAudioUrl: A("fa", "natijatan_hint") },
      fr: { text: "par conséquent", trans: "", audioUrl: A("fr", "parconsequent") },
      es: { text: "?", trans: "?", audioUrl: A("es", "?") },
      en: { text: "as a result", trans: "AZ EU RIZEULT", audioUrl: A("en", "asaresult") },
    },
  },
  {
    id: "matlab",
    families: ["erfan"],
    learning: {
      fa: { text: "مَطلَب", trans: "MAT-LAB", audioUrl: A("fa", "matlab"), hintAudioUrl: A("fa", "ma_hint")},
      fr: { text: "sujet", trans: "SU-JET", audioUrl: A("fr", "sujet") },
    },
  },

  // COULEURS
{
  id: "jaune",
  families: ["couleurs"],
  imageEmoji: "🟡",
  learning: {
    fa: { text: "زرد", trans: "zard", audioUrl: A("fa", "jaune") },
    fr: { text: "jaune", audioUrl: A("fr", "jaune") },
    en: { text: "yellow", audioUrl: A("en", "jaune") },
  },
},
{
  id: "bleu",
  families: ["couleurs"],
  imageEmoji: "🔵",
  learning: {
    fa: { text: "آبی", trans: "âbi", audioUrl: A("fa", "bleu") },
    fr: { text: "bleu", audioUrl: A("fr", "bleu") },
    en: { text: "blue", audioUrl: A("en", "bleu") },
  },
},
{
  id: "rouge",
  families: ["couleurs"],
  imageEmoji: "🔴",
  learning: {
    fa: { text: "قرمز", trans: "ghermez", audioUrl: A("fa", "rouge") },
    fr: { text: "rouge", audioUrl: A("fr", "rouge") },
    en: { text: "red", audioUrl: A("en", "rouge") },
  },
},
{
  id: "violet",
  families: ["couleurs"],
  imageEmoji: "🟣",
  learning: {
    fa: { text: "بنفش", trans: "banafshe", audioUrl: A("fa", "violet") },
    fr: { text: "violet", audioUrl: A("fr", "violet") },
    en: { text: "purple", audioUrl: A("en", "violet") },
  },
},
{
  id: "orange",
  families: ["couleurs"],
  imageEmoji: "🟠",
  learning: {
    fa: { text: "نارنجی", trans: "nârenji", audioUrl: A("fa", "orange") },
    fr: { text: "orange", audioUrl: A("fr", "orange") },
    en: { text: "orange", audioUrl: A("en", "orange") },
  },
},
{
  id: "noir",
  families: ["couleurs"],
  imageEmoji: "⚫",
  learning: {
    fa: { text: "سیاه", trans: "siyâh", audioUrl: A("fa", "noir") },
    fr: { text: "noir", audioUrl: A("fr", "noir") },
    en: { text: "black", audioUrl: A("en", "noir") },
  },
},
{
  id: "vert",
  families: ["couleurs"],
  imageEmoji: "🟢",
  learning: {
    fa: { text: "سبز", trans: "sabz", audioUrl: A("fa", "vert") },
    fr: { text: "vert", audioUrl: A("fr", "vert") },
    en: { text: "green", audioUrl: A("en", "vert") },
  },
},

  // FRUITS
  {
    id: "apple",
    families: ["fruits"],
    imageEmoji: "🍎",
    learning: {
      fa: { text: "سیب", trans: "SIB", audioUrl: A("fa", "sib"), hintAudioUrl: A("fa", "hint_si")},
      fr: { text: "pomme", trans: "POM", audioUrl: A("fr", "apple") },
      es: { text: "manzana", trans: "man-THA-na", audioUrl: A("es", "apple") },
      en: { text: "apple", trans: "A-PUL", audioUrl: A("en", "apple") },
    },
  },
  {
    id: "banana",
    families: ["fruits"],
    imageEmoji: "🍌",
    learning: {
      fa: { text: "موز", trans: "MOZ", audioUrl: A("fa", "moz"), hintAudioUrl: A("fa", "moz_hint")},
      fr: { text: "banane", trans: "BA-NAN", audioUrl: A("fr", "banana") },
      en: { text: "banana", trans: "BA-NA-NA", audioUrl: A("en", "banana") },
      es: { text: "plátano", trans: "PLA-TA-NO", audioUrl: A("es", "banana") },
    },
  },
  {
    id: "orange",
    families: ["fruits"],
    imageEmoji: "🍊",
    learning: {
      fa: { text: "پرتقال", trans: "POR-TE-GHAL", audioUrl: A("fa", "orange"), hintAudioUrl: A("fa", "orange_hint")},
      fr: { text: "orange", trans: "O-RANJ", audioUrl: A("fr", "orange") },
      en: { text: "orange", trans: "OR-ANJ", audioUrl: A("en", "orange") },
      es: { text: "naranja", trans: "NA-RAN-KHA", audioUrl: A("es", "orange") },
    },
  },
  {
    id: "grape",
    families: ["fruits"],
    imageEmoji: "🍇",
    learning: {
      fa: { text: "انگور", trans: "AN-GOUR", audioUrl: A("fa", "grape"), hintAudioUrl: A("fa", "grape_hint")},
      fr: { text: "raisin", trans: "RÈ-ZIN", audioUrl: A("fr", "grape") },
      en: { text: "grape", trans: "GREYP", audioUrl: A("en", "grape") },
      es: { text: "uva", trans: "OU-VA", audioUrl: A("es", "grape") },
    },
  },
  {
    id: "strawberry",
    families: ["fruits"],
    imageEmoji: "🍓",
    learning: {
      fa: { text: "توت فرنگی", trans: "TOUT FA-RAN-GUI", audioUrl: A("fa", "toutfarangi") },
      fr: { text: "fraise", trans: "FRÈZ", audioUrl: A("fr", "fraise") },
      en: { text: "strawberry", trans: "STRAO-BEH-RI", audioUrl: A("en", "strawberry") },
      es: { text: "fresa", trans: "FRÈ-SA", audioUrl: A("es", "strawberry") },
    },
  },
  {
    id: "pear",
    families: ["fruits"],
    imageEmoji: "🍐",
    learning: {
      fa: { text: "گلابی", trans: "GO-LÂ-BI", audioUrl: A("fa", "golabi") },
      fr: { text: "poire", trans: "PWAR", audioUrl: A("fr", "pear") },
      en: { text: "pear", trans: "PER", audioUrl: A("en", "pear") },
      es: { text: "pera", trans: "PÉ-RA", audioUrl: A("es", "pear") },
    },
  },
  {
    id: "watermelon",
    families: ["fruits"],
    imageEmoji: "🍉",
    learning: {
      fa: { text: "هندوانه", trans: "HEN-DE-VÂ-NEH", audioUrl: A("fa", "hendevouneh") },
      fr: { text: "pastèque", trans: "PAS-TÈK", audioUrl: A("fr", "watermelon") },
      en: { text: "watermelon", trans: "WA-TER-ME-LON", audioUrl: A("en", "watermelon") },
      es: { text: "sandía", trans: "SAN-DI-A", audioUrl: A("es", "watermelon") },
    },
  },
  {
    id: "pineapple",
    families: ["fruits"],
    imageEmoji: "🍍",
    learning: {
      fa: { text: "آناناس", trans: "Â-NÂ-NÂS", audioUrl: A("fa", "ananas") },
      fr: { text: "ananas", trans: "A-NA-NA", audioUrl: A("fr", "ananas") },
      en: { text: "pineapple", trans: "PAÏN-A-PUL", audioUrl: A("en", "pineapple") },
      es: { text: "piña", trans: "PI-NYA", audioUrl: A("es", "pineapple") },
    },
  },
  {
    id: "cherry",
    families: ["fruits"],
    imageEmoji: "🍒",
    learning: {
      fa: { text: "گیلاس", trans: "GUI-LÂS", audioUrl: A("fa", "cherry") },
      fr: { text: "cerise", trans: "SE-RIZ", audioUrl: A("fr", "cherry") },
      en: { text: "cherry", trans: "TCHÉ-RI", audioUrl: A("en", "cherry") },
      es: { text: "cereza", trans: "SÉ-RÉ-THA", audioUrl: A("es", "cherry") },
    },
  },
  {
    id: "peach",
    families: ["fruits"],
    imageEmoji: "🍑",
    learning: {
      fa: { text: "هلو", trans: "HO-LOU", audioUrl: A("fa", "holou") },
      fr: { text: "pêche", trans: "PÈSH", audioUrl: A("fr", "peach") },
      en: { text: "peach", trans: "PITCH", audioUrl: A("en", "peach") },
      es: { text: "melocotón", trans: "ME-LO-KO-TON", audioUrl: A("es", "peach") },
    },
  },


// QUESTIONS
  {
    id: "cestquoi",
    families: ["questions"],
    imageUrl: "/images/cestquoi.png",
    mode1Voices: ["maman"],
    learning: {
      fa: { text: "این چیه؟", trans: "IN TCHI-E", audioUrl: A("fa", "intchieh"), hintAudioUrl: A("fa", "hint_intchieh")},
      fr: { text: "C'est quoi ça ?", trans: "KES KEU SÈ", audioUrl: A("fr", "cestquoi")},
      en: { text: "What is it?", trans: "OUAT IZ IT", audioUrl: A("en", "cestquoi") },
      es: { text: "perro", trans: "PÉ-RRO", audioUrl: A("es", "cestquoi") },
    },
  },

  // ANIMALS
  {
    id: "dog",
    families: ["animals"],
    imageEmoji: "🐶",
    learning: {
      fa: { text: "سگ", trans: "SAG", audioUrl: A("fa", "sag"), hintAudioUrl: A("fa", "hint_sag") },
      fr: { text: "chien", trans: "SHI-EN", audioUrl: A("fr", "dog") },
      en: { text: "dog", trans: "DOG", audioUrl: A("en", "dog") },
      es: { text: "perro", trans: "PÉ-RRO", audioUrl: A("es", "dog") },
    },
  },
  {
    id: "cat",
    families: ["animals"],
    imageEmoji: "🐱",
    learning: {
      fa: { text: "گربه", trans: "GOR-BEH", audioUrl: A("fa", "gorbeh"), hintAudioUrl: A("fa", "gorbeh_hint")},
      fr: { text: "chat", trans: "SHA", audioUrl: A("fr", "cat") },
      en: { text: "cat", trans: "KAT", audioUrl: A("en", "cat") },
      es: { text: "gato", trans: "GA-TO", audioUrl: A("es", "cat") },
    },
  },
  {
    id: "bird",
    families: ["animals"],
    imageEmoji: "🐦",
    learning: {
      fa: { text: "پرنده", trans: "PA-RAN-DEH", audioUrl: A("fa", "parandeh"), hintAudioUrl: A("fa", "hint_parandeh")},
      fr: { text: "oiseau", trans: "WA-ZO", audioUrl: A("fr", "bird") },
      en: { text: "bird", trans: "BERD", audioUrl: A("en", "bird") },
      es: { text: "pájaro", trans: "PA-KHA-RO", audioUrl: A("es", "bird") },
    },
  },
  {
    id: "fish",
    families: ["animals"],
    imageEmoji: "🐟",
    learning: {
      fa: { text: "ماهی", trans: "MÂ-HI", audioUrl: A("fa", "mahi") },
      fr: { text: "poisson", trans: "PWA-SON", audioUrl: A("fr", "fish") },
      en: { text: "fish", trans: "FISH", audioUrl: A("en", "fish") },
      es: { text: "pez", trans: "PÈS", audioUrl: A("es", "fish") },
    },
  },
  {
    id: "horse",
    families: ["animals"],
    imageEmoji: "🐴",
    learning: {
      fa: { text: "اسب", trans: "ASB", audioUrl: A("fa", "asb") },
      fr: { text: "cheval", trans: "SHE-VAL", audioUrl: A("fr", "horse") },
      en: { text: "horse", trans: "HORS", audioUrl: A("en", "horse") },
      es: { text: "caballo", trans: "KA-BA-YO", audioUrl: A("es", "horse") },
    },
  },
  {
    id: "cow",
    families: ["animals"],
    imageEmoji: "🐮",
    learning: {
      fa: { text: "گاو", trans: "GÂV", audioUrl: A("fa", "gav"), hintAudioUrl: A("fa", "hint_gav") },
      fr: { text: "vache", trans: "VASH", audioUrl: A("fr", "cow") },
      en: { text: "cow", trans: "KAO", audioUrl: A("en", "cow") },
      es: { text: "vaca", trans: "BA-KA", audioUrl: A("es", "cow") },
    },
  },
  {
    id: "sheep",
    families: ["animals"],
    imageEmoji: "🐑",
    learning: {
      fa: { text: "گوسفند", trans: "GOUS-FAND", audioUrl: A("fa", "gousfand") },
      fr: { text: "mouton", trans: "MOU-TON", audioUrl: A("fr", "sheep") },
      en: { text: "sheep", trans: "SHIP", audioUrl: A("en", "sheep") },
      es: { text: "oveja", trans: "O-VÉ-KHA", audioUrl: A("es", "sheep") },
    },
  },
  {
    id: "chicken",
    families: ["animals"],
    imageEmoji: "🐔",
    learning: {
      fa: { text: "مرغ", trans: "MORGH", audioUrl: A("fa", "morgh") },
      fr: { text: "poulet", trans: "POU-LÈ", audioUrl: A("fr", "chicken") },
      en: { text: "chicken", trans: "TCHI-KEN", audioUrl: A("en", "chicken") },
      es: { text: "pollo", trans: "PO-YO", audioUrl: A("es", "chicken") },
    },
  },
  {
    id: "rabbit",
    families: ["animals"],
    imageEmoji: "🐰",
    learning: {
      fa: { text: "خرگوش", trans: "KHAR-GOUSH", audioUrl: A("fa", "khargoush"), hintAudioUrl: A("fa", "khargoush_hint") },
      fr: { text: "lapin", trans: "LA-PIN", audioUrl: A("fr", "rabbit") },
      en: { text: "rabbit", trans: "RA-BIT", audioUrl: A("en", "rabbit") },
      es: { text: "conejo", trans: "KO-NÉ-KHO", audioUrl: A("es", "rabbit") },
    },
  },
  {
    id: "lion",
    families: ["animals"],
    imageEmoji: "🦁",
    learning: {
      fa: { text: "شیر", trans: "SHIR", audioUrl: A("fa", "shir") },
      fr: { text: "lion", trans: "LI-ON", audioUrl: A("fr", "lion") },
      en: { text: "lion", trans: "LAÏ-ON", audioUrl: A("en", "lion") },
      es: { text: "león", trans: "LÉ-ON", audioUrl: A("es", "lion") },
    },
  },

  // VÊTEMENTS
  {
    id: "robe",
    families: ["vetements"],
    imageEmoji: "👗",
    learning: {
      fa: { text: "پیراهن", trans: "PI-RÂ-HAN", audioUrl: A("fa", "pirhan") },
      fr: { text: "robe", trans: "ROB", audioUrl: A("fr", "robe") },
      en: { text: "dress", trans: "DRES", audioUrl: A("en", "robe") },
      es: { text: "vestido", trans: "VES-TI-DO", audioUrl: A("es", "robe") },
    },
  },
  {
    id: "pantalon",
    families: ["vetements"],
    imageEmoji: "👖",
    learning: {
      fa: { text: "شلوار", trans: "SHAL-VÂR", audioUrl: A("fa", "pantalon") },
      fr: { text: "pantalon", trans: "PAN-TA-LON", audioUrl: A("fr", "pantalon") },
      en: { text: "pants", trans: "PANTS", audioUrl: A("en", "pantalon") },
      es: { text: "pantalón", trans: "PAN-TA-LON", audioUrl: A("es", "pantalon") },
    },
  },
  {
    id: "tshirt",
    families: ["vetements"],
    imageEmoji: "👕",
    learning: {
      fa: { text: "تی‌شرت", trans: "TI-SHORT", audioUrl: A("fa", "tshirt") },
      fr: { text: "t-shirt", trans: "TI-SHERT", audioUrl: A("fr", "tshirt") },
      en: { text: "t-shirt", trans: "TI-SHERT", audioUrl: A("en", "tshirt") },
      es: { text: "camiseta", trans: "KA-MI-SÉ-TA", audioUrl: A("es", "tshirt") },
    },
  },
  {
    id: "manteau",
    families: ["vetements"],
    imageEmoji: "🧥",
    learning: {
      fa: { text: "پالتو", trans: "PÂL-TO", audioUrl: A("fa", "manteau") },
      fr: { text: "manteau", trans: "MAN-TO", audioUrl: A("fr", "manteau") },
      en: { text: "coat", trans: "KOT", audioUrl: A("en", "manteau") },
      es: { text: "abrigo", trans: "A-BRI-GO", audioUrl: A("es", "manteau") },
    },
  },
  {
    id: "chaussettes",
    families: ["vetements"],
    imageEmoji: "🧦",
    learning: {
      fa: { text: "جوراب", trans: "DJOU-RÂB", audioUrl: A("fa", "jourab"), hintAudioUrl: A("fa", "jourab_hint") },
      fr: { text: "chaussette", trans: "SHO-SET", audioUrl: A("fr", "chaussettes") },
      en: { text: "sock", trans: "SOK", audioUrl: A("en", "chaussettes") },
      es: { text: "calcetín", trans: "KAL-SE-TIN", audioUrl: A("es", "chaussettes") },
    },
  },
  {
    id: "chaussures",
    families: ["vetements"],
    imageEmoji: "👟",
    learning: {
      fa: { text: "کفش", trans: "KAFSH", audioUrl: A("fa", "kafsh") },
      fr: { text: "chaussure", trans: "SHO-SUR", audioUrl: A("fr", "chaussures") },
      en: { text: "shoe", trans: "SHOU", audioUrl: A("en", "chaussures") },
      es: { text: "zapato", trans: "THA-PA-TO", audioUrl: A("es", "chaussures") },
    },
  },
  {
    id: "chapeau",
    families: ["vetements"],
    imageEmoji: "🎩",
    learning: {
      fa: { text: "کلاه", trans: "KO-LÂ", audioUrl: A("fa", "kola") },
      fr: { text: "chapeau", trans: "SHA-PO", audioUrl: A("fr", "chapeau") },
      en: { text: "hat", trans: "HAT", audioUrl: A("en", "chapeau") },
      es: { text: "sombrero", trans: "SOM-BRÉ-RO", audioUrl: A("es", "chapeau") },
    },
  },
  { id: "1", families: ["nombres"], imageEmoji: "1", learning: { fa: { text: "یک", trans: "yek", audioUrl: A("fa", "1") }, fr: { text: "un", audioUrl: A("fr", "1") }, en: { text: "one", audioUrl: A("en", "1") }, es: { text: "uno", audioUrl: A("es", "1") } } },
  { id: "2", families: ["nombres"], imageEmoji: "2", learning: { fa: { text: "دو", trans: "do", audioUrl: A("fa", "2") }, fr: { text: "deux", audioUrl: A("fr", "2") }, en: { text: "two", audioUrl: A("en", "2") }, es: { text: "dos", audioUrl: A("es", "2") } } },
  { id: "3", families: ["nombres"], imageEmoji: "3", learning: { fa: { text: "سه", trans: "se", audioUrl: A("fa", "3") }, fr: { text: "trois", audioUrl: A("fr", "3") }, en: { text: "three", audioUrl: A("en", "3") }, es: { text: "tres", audioUrl: A("es", "3") } } },
  { id: "4", families: ["nombres"], imageEmoji: "4", learning: { fa: { text: "چهار", trans: "chahâr", audioUrl: A("fa", "4") }, fr: { text: "quatre", audioUrl: A("fr", "4") }, en: { text: "four", audioUrl: A("en", "4") }, es: { text: "cuatro", audioUrl: A("es", "4") } } },
  { id: "5", families: ["nombres"], imageEmoji: "5", learning: { fa: { text: "پنج", trans: "panj", audioUrl: A("fa", "5") }, fr: { text: "cinq", audioUrl: A("fr", "5") }, en: { text: "five", audioUrl: A("en", "5") }, es: { text: "cinco", audioUrl: A("es", "5") } } },
  { id: "6", families: ["nombres"], imageEmoji: "6", learning: { fa: { text: "شش", trans: "shesh", audioUrl: A("fa", "6") }, fr: { text: "six", audioUrl: A("fr", "6") }, en: { text: "six", audioUrl: A("en", "6") }, es: { text: "seis", audioUrl: A("es", "6") } } },
  { id: "7", families: ["nombres"], imageEmoji: "7", learning: { fa: { text: "هفت", trans: "haft", audioUrl: A("fa", "7") }, fr: { text: "sept", audioUrl: A("fr", "7") }, en: { text: "seven", audioUrl: A("en", "7") }, es: { text: "siete", audioUrl: A("es", "7") } } },
  { id: "8", families: ["nombres"], imageEmoji: "8", learning: { fa: { text: "هشت", trans: "hasht", audioUrl: A("fa", "8") }, fr: { text: "huit", audioUrl: A("fr", "8") }, en: { text: "eight", audioUrl: A("en", "8") }, es: { text: "ocho", audioUrl: A("es", "8") } } },
  { id: "9", families: ["nombres"], imageEmoji: "9", learning: { fa: { text: "نه", trans: "noh", audioUrl: A("fa", "9") }, fr: { text: "neuf", audioUrl: A("fr", "9") }, en: { text: "nine", audioUrl: A("en", "9") }, es: { text: "nueve", audioUrl: A("es", "9") } } },
  { id: "10", families: ["nombres"], imageEmoji: "10", learning: { fa: { text: "ده", trans: "dah", audioUrl: A("fa", "10") }, fr: { text: "dix", audioUrl: A("fr", "10") }, en: { text: "ten", audioUrl: A("en", "10") }, es: { text: "diez", audioUrl: A("es", "10") } } },

  { id: "11", families: ["nombres"], imageEmoji: "11", learning: { fa: { text: "یازده", trans: "yâzdah", audioUrl: A("fa", "11") }, fr: { text: "onze", audioUrl: A("fr", "11") }, en: { text: "eleven", audioUrl: A("en", "11") }, es: { text: "once", audioUrl: A("es", "11") } } },
  { id: "12", families: ["nombres"], imageEmoji: "12", learning: { fa: { text: "دوازده", trans: "davâzdah", audioUrl: A("fa", "12") }, fr: { text: "douze", audioUrl: A("fr", "12") }, en: { text: "twelve", audioUrl: A("en", "12") }, es: { text: "doce", audioUrl: A("es", "12") } } },
  { id: "13", families: ["nombres"], imageEmoji: "13", learning: { fa: { text: "سیزده", trans: "sizdah", audioUrl: A("fa", "13") }, fr: { text: "treize", audioUrl: A("fr", "13") }, en: { text: "thirteen", audioUrl: A("en", "13") }, es: { text: "trece", audioUrl: A("es", "13") } } },
  { id: "14", families: ["nombres"], imageEmoji: "14", learning: { fa: { text: "چهارده", trans: "TCH-HÂR-DAH", audioUrl: A("fa", "14") }, fr: { text: "quatorze", audioUrl: A("fr", "14") }, en: { text: "fourteen", audioUrl: A("en", "14") }, es: { text: "catorce", audioUrl: A("es", "14") } } },
  { id: "15", families: ["nombres"], imageEmoji: "15", learning: { fa: { text: "پانزده", trans: "POUNZ-DAH", audioUrl: A("fa", "15") }, fr: { text: "quinze", audioUrl: A("fr", "15") }, en: { text: "fifteen", audioUrl: A("en", "15") }, es: { text: "quince", audioUrl: A("es", "15") } } },
  { id: "16", families: ["nombres"], imageEmoji: "16", learning: { fa: { text: "شانزده", trans: "SHOUNZ-DAH", audioUrl: A("fa", "16") }, fr: { text: "seize", audioUrl: A("fr", "16") }, en: { text: "sixteen", audioUrl: A("en", "16") }, es: { text: "dieciséis", audioUrl: A("es", "16") } } },
  { id: "17", families: ["nombres"], imageEmoji: "17", learning: { fa: { text: "هفده", trans: "HIV-DAH", audioUrl: A("fa", "17") }, fr: { text: "dix-sept", audioUrl: A("fr", "17") }, en: { text: "seventeen", audioUrl: A("en", "17") }, es: { text: "diecisiete", audioUrl: A("es", "17") } } },
  { id: "18", families: ["nombres"], imageEmoji: "18", learning: { fa: { text: "هجده", trans: "HIJ-DAH", audioUrl: A("fa", "18") }, fr: { text: "dix-huit", audioUrl: A("fr", "18") }, en: { text: "eighteen", audioUrl: A("en", "18") }, es: { text: "dieciocho", audioUrl: A("es", "18") } } },
  { id: "19", families: ["nombres"], imageEmoji: "19", learning: { fa: { text: "نوزده", trans: "noozdah", audioUrl: A("fa", "19") }, fr: { text: "dix-neuf", audioUrl: A("fr", "19") }, en: { text: "nineteen", audioUrl: A("en", "19") }, es: { text: "diecinueve", audioUrl: A("es", "19") } } },
  { id: "20", families: ["nombres"], imageEmoji: "20", learning: { fa: { text: "بیست", trans: "BIST", audioUrl: A("fa", "20") }, fr: { text: "vingt", audioUrl: A("fr", "20") }, en: { text: "twenty", audioUrl: A("en", "20") }, es: { text: "veinte", audioUrl: A("es", "20") } } },

  { id: "30", families: ["nombres"], imageEmoji: "30", learning: { fa: { text: "سی", trans: "si", audioUrl: A("fa", "30") }, fr: { text: "trente", audioUrl: A("fr", "30") }, en: { text: "thirty", audioUrl: A("en", "30") }, es: { text: "treinta", audioUrl: A("es", "30") } } },
  { id: "40", families: ["nombres"], imageEmoji: "40", learning: { fa: { text: "چهل", trans: "chehel", audioUrl: A("fa", "40") }, fr: { text: "quarante", audioUrl: A("fr", "40") }, en: { text: "forty", audioUrl: A("en", "40") }, es: { text: "cuarenta", audioUrl: A("es", "40") } } },
  { id: "50", families: ["nombres"], imageEmoji: "50", learning: { fa: { text: "پنجاه", trans: "panjâh", audioUrl: A("fa", "50") }, fr: { text: "cinquante", audioUrl: A("fr", "50") }, en: { text: "fifty", audioUrl: A("en", "50") }, es: { text: "cincuenta", audioUrl: A("es", "50") } } },
  { id: "60", families: ["nombres"], imageEmoji: "60", learning: { fa: { text: "شصت", trans: "shast", audioUrl: A("fa", "60") }, fr: { text: "soixante", audioUrl: A("fr", "60") }, en: { text: "sixty", audioUrl: A("en", "60") }, es: { text: "sesenta", audioUrl: A("es", "60") } } },
  { id: "70", families: ["nombres"], imageEmoji: "70", learning: { fa: { text: "هفتاد", trans: "haftâd", audioUrl: A("fa", "70") }, fr: { text: "soixante-dix", audioUrl: A("fr", "70") }, en: { text: "seventy", audioUrl: A("en", "70") }, es: { text: "setenta", audioUrl: A("es", "70") } } },
  { id: "80", families: ["nombres"], imageEmoji: "80", learning: { fa: { text: "هشتاد", trans: "hashtâd", audioUrl: A("fa", "80") }, fr: { text: "quatre-vingts", audioUrl: A("fr", "80") }, en: { text: "eighty", audioUrl: A("en", "80") }, es: { text: "ochenta", audioUrl: A("es", "80") } } },
  { id: "90", families: ["nombres"], imageEmoji: "90", learning: { fa: { text: "نود", trans: "navad", audioUrl: A("fa", "90") }, fr: { text: "quatre-vingt-dix", audioUrl: A("fr", "90") }, en: { text: "ninety", audioUrl: A("en", "90") }, es: { text: "noventa", audioUrl: A("es", "90") } } },
  { id: "100", families: ["nombres"], imageEmoji: "100", learning: { fa: { text: "صد", trans: "sad", audioUrl: A("fa", "100") }, fr: { text: "cent", audioUrl: A("fr", "100") }, en: { text: "one hundred", audioUrl: A("en", "100") }, es: { text: "cien", audioUrl: A("es", "100") } } },
];