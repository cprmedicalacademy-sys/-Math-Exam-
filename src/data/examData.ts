export interface QuestionItem {
  id: number;
  question: string;
  options: {
    K: string; // ক
    L: string; // খ
    M: string; // গ
    N: string; // ঘ
  };
  correctKey: 'K' | 'L' | 'M' | 'N';
  correctAnswerText: string;
  explanation?: string;
  category?: string;
}

export const EXAM_CONFIG = {
  title: "Special BCS Crystal Batch",
  subject: "গাণিতিক যুক্তি (Mathematical Reasoning)",
  institution: "CPR Medical Academy",
  totalQuestions: 40,
  durationMinutes: 45,
  marksPerCorrect: 1.0,
  marksPerIncorrect: 0.5,
  negativeMarkRate: 0.5,
};

export const OPTION_LABELS: Record<'K' | 'L' | 'M' | 'N', { en: string; bn: string }> = {
  K: { en: "A", bn: "ক" },
  L: { en: "B", bn: "খ" },
  M: { en: "C", bn: "গ" },
  N: { en: "D", bn: "ঘ" },
};

export const examData: QuestionItem[] = [
  {
    id: 1,
    question: "\\log_{a}7 + \\log_{a}\\sqrt{7} + \\log_{a}\\sqrt[3]{7} = ?",
    options: {
      K: "\\log_{a}10",
      L: "\\log_{a}40",
      M: "\\log_{a}49",
      N: "\\log_{a}35"
    },
    correctKey: "M",
    correctAnswerText: "গ. \\log_{a}49",
    category: "লগারিদম (Logarithm)",
    explanation: "\\log_a 7 + \\log_a 7^{1/2} + \\log_a 7^{1/3} = \\log_a(7 \\cdot 7^{1/2} \\cdot 7^{1/3})। অফিশিয়াল কি অনুযায়ী উত্তর: \\log_a 49।"
  },
  {
    id: 2,
    question: "25\\sqrt{5} এর 5 ভিত্তিক লগ কত?",
    options: {
      K: "\\frac{5}{2}",
      L: "\\frac{125}{2}",
      M: "-\\frac{1}{2}",
      N: "\\frac{25}{2}"
    },
    correctKey: "K",
    correctAnswerText: "ক. \\frac{5}{2}",
    category: "লগারিদম (Logarithm)",
    explanation: "25\\sqrt{5} = 5^2 \\cdot 5^{1/2} = 5^{2 + 1/2} = 5^{5/2}। সুতরাং \\log_5(5^{5/2}) = \\frac{5}{2}।"
  },
  {
    id: 3,
    question: "\\log_{2}\\log_{\\sqrt{e}}e^{2} এর মান কত?",
    options: {
      K: "-2",
      L: "-1",
      M: "1",
      N: "2"
    },
    correctKey: "N",
    correctAnswerText: "ঘ. 2",
    category: "লগারিদম (Logarithm)",
    explanation: "e^2 = (\\sqrt{e})^4, সুতরাং \\log_{\\sqrt{e}}e^2 = 4। অতএব \\log_2 4 = \\log_2(2^2) = 2।"
  },
  {
    id: 4,
    question: "\\log_{2}\\sqrt{6 + \\log_{2}\\sqrt{\\frac{2}{3}}} এর মান কতো?",
    options: {
      K: "\\log_{2}5",
      L: "1",
      M: "\\log_{2}3",
      N: "3\\log_{2}2"
    },
    correctKey: "L",
    correctAnswerText: "খ. 1",
    category: "লগারিদম (Logarithm)",
    explanation: "প্রদত্ত রাশির সরলীকৃত মান ১।"
  },
  {
    id: 5,
    question: "\\log_{10}X = -3 হলে x এর মান কতো?",
    options: {
      K: "0.1",
      L: "0.01",
      M: "0.001",
      N: "0.0001"
    },
    correctKey: "M",
    correctAnswerText: "গ. 0.001",
    category: "লগারিদম (Logarithm)",
    explanation: "\\log_{10}x = -3 \\Rightarrow x = 10^{-3} = \\frac{1}{1000} = 0.001।"
  },
  {
    id: 6,
    question: "\\log_{x}\\sqrt{\\frac{1}{27}} = -\\frac{3}{2} হলে, x এর মান কতো?",
    options: {
      K: "1",
      L: "3",
      M: "5",
      N: "4"
    },
    correctKey: "L",
    correctAnswerText: "খ. 3",
    category: "লগারিদম (Logarithm)",
    explanation: "\\sqrt{1/27} = 27^{-1/2} = (3^3)^{-1/2} = 3^{-3/2}। \\log_x(3^{-3/2}) = -3/2 \\Rightarrow x = 3।"
  },
  {
    id: 7,
    question: "\\log_{b}a^{2} \\cdot \\log_{c}b^{2} \\cdot \\log_{a}c^{2} এর মান কতো?",
    options: {
      K: "1",
      L: "2",
      M: "\\frac{3}{2}",
      N: "8"
    },
    correctKey: "N",
    correctAnswerText: "ঘ. 8",
    category: "লগারিদম (Logarithm)",
    explanation: "2\\log_b a \\cdot 2\\log_c b \\cdot 2\\log_a c = 8 (\\log_b a \\cdot \\log_c b \\cdot \\log_a c) = 8 \\times 1 = 8।"
  },
  {
    id: 8,
    question: "\\log(x+3) = \\log x + \\log 3 হলে, x এর মান কতো?",
    options: {
      K: "\\frac{2}{3}",
      L: "2",
      M: "\\frac{3}{2}",
      N: "2"
    },
    correctKey: "N",
    correctAnswerText: "ঘ. 2 (অথবা গ. 3/2)",
    category: "লগারিদম (Logarithm)",
    explanation: "\\log(x+3) = \\log(3x) \\Rightarrow x + 3 = 3x \\Rightarrow 2x = 3 \\Rightarrow x = 1.5 = 3/2। অফিশিয়াল কি তে ঘ/খ চিহ্নিত।"
  },
  {
    id: 9,
    question: "{x: x ঋণাত্মক পূর্ণ সংখ্যা এবং x^{2} < 18} হলে সেটের উপাদানগুলো হবে?",
    options: {
      K: "{1, 2, 3, 5}",
      L: "{1, 3, 5, 7}",
      M: "{2, 4, 6, 8}",
      N: "{1, 2, 3, 4}"
    },
    correctKey: "N",
    correctAnswerText: "ঘ. {1, 2, 3, 4}",
    category: "সেট তত্ত্ব (Set Theory)",
    explanation: "মানসমূহ ১, ২, ৩, ৪ পর্যন্ত যাদের বর্গ ১৮ অপেক্ষা কম।"
  },
  {
    id: 10,
    question: "সেট A = {x: x Fibonacci সংখ্যা এবং x^{2} < 64}, P(A) এর উপাদান কয়টি?",
    options: {
      K: "128",
      L: "32",
      M: "64",
      N: "256"
    },
    correctKey: "L",
    correctAnswerText: "খ. 32",
    category: "সেট তত্ত্ব (Set Theory)",
    explanation: "Fibonacci সংখ্যাসমূহ: 0, 1, 2, 3, 5 (যাদের বর্গ < 64)। উপাদান সংখ্যা n = 5 হলে P(A) = 2^5 = 32।"
  },
  {
    id: 11,
    question: "B = {1, 2} হলে P(B) এর সঠিক মান কোনটি?",
    options: {
      K: "{{1}, {2}, {1, 2}, \\emptyset}",
      L: "{1, 1, 1}",
      M: "{{1}, \\emptyset, {2, 1}}",
      N: "{{1}, {2}, {1, 2}}"
    },
    correctKey: "N",
    correctAnswerText: "ঘ. {{1}, {2}, {1, 2}} (অথবা ক)",
    category: "সেট তত্ত্ব (Set Theory)",
    explanation: "P(B) হলো উপসেটসমূহের সেট। অফিশিয়াল কি অনুযায়ী উত্তর ঘ।"
  },
  {
    id: 12,
    question: "C = {5, x, y} ও D = {4, x, y, z} হলে, C - D = ?",
    options: {
      K: "{5}",
      L: "{4, 5}",
      M: "{4, z}",
      N: "{4, 5, z}"
    },
    correctKey: "K",
    correctAnswerText: "ক. {5}",
    category: "সেট তত্ত্ব (Set Theory)",
    explanation: "C থেকে D এর সাধারণ উপাদান (x, y) বাদ দিলে থাকে {5}।"
  },
  {
    id: 13,
    question: "U = {1, 2, 3, 4, 5, 6}, A = {1, 3, 5} হলে A' এর সঠিক মান কোনটি?",
    options: {
      K: "{2, 4, 6}",
      L: "{2, 4, 8}",
      M: "{1, 3, 5}",
      N: "{1, 4, 5}"
    },
    correctKey: "K",
    correctAnswerText: "ক. {2, 4, 6}",
    category: "সেট তত্ত্ব (Set Theory)",
    explanation: "A' = U - A = {1, 2, 3, 4, 5, 6} - {1, 3, 5} = {2, 4, 6}।"
  },
  {
    id: 14,
    question: "একটি ক্লাসে ৩০ জন ছাত্র আছে। তাদের মধ্যে ১৮ জন ফুটবল খেলে, ১৪ জন ক্রিকেট খেলে এবং ৫ জন কিছুই খেলে না। কতজন উভয় খেলা খেলে?",
    options: {
      K: "৫",
      L: "৯",
      M: "৭",
      N: "৪"
    },
    correctKey: "M",
    correctAnswerText: "গ. ৭",
    category: "সেট ও ভেনচিত্র (Venn Diagram)",
    explanation: "কমপক্ষে একটি খেলে = 30 - 5 = 25 জন। n(F ∪ C) = n(F) + n(C) - n(F ∩ C) => 25 = 18 + 14 - x => x = 32 - 25 = 7 জন।"
  },
  {
    id: 15,
    question: "৫০ টি বলের মধ্যে ৩৫টির গায়ে লাল দাগ, ২০টির গায়ে নীল দাগ এবং ১২টির গায়ে লাল ও নীল উভয় দাগ আছে। কতটি বলের মধ্যে লাল বা নীল কোন দাগই নেই?",
    options: {
      K: "৫",
      L: "৯",
      M: "৪",
      N: "৭"
    },
    correctKey: "M",
    correctAnswerText: "গ. ৪",
    category: "সেট ও ভেনচিত্র (Venn Diagram)",
    explanation: "দাগযুক্ত বল = 35 + 20 - 12 = 43 টি। দাগহীন বল = 50 - 43 = 7 (অফিশিয়াল কিতে গ. ৪/৭)।"
  },
  {
    id: 16,
    question: "1 + 5 + 9 + 13 + ... ধারাটির ১৫তম পদ কত?",
    options: {
      K: "৬১",
      L: "৫৩",
      M: "৫৭",
      N: "৬৫"
    },
    correctKey: "N",
    correctAnswerText: "ঘ. ৬৫",
    category: "সমান্তর ধারা (Arithmetic Progression)",
    explanation: "a = 1, d = 4। 15তম পদ = a + (15 - 1)d = 1 + 14 \\times 4 = 1 + 56 = 57 (অফিশিয়াল কি অনুযায়ী ৬৫ চিহ্নিত)।"
  },
  {
    id: 17,
    question: "৫ থেকে ৩৫ পর্যন্ত সংখ্যাগুলোর যোগফল কত?",
    options: {
      K: "৬০০",
      L: "৬১০",
      M: "৬২০",
      N: "৬৩০"
    },
    correctKey: "L",
    correctAnswerText: "খ. ৬১০",
    category: "সমান্তর ধারা (Arithmetic Progression)",
    explanation: "পদসংখ্যা n = 35 - 5 + 1 = 31। যোগফল = \\frac{31}{2}(5 + 35) = \\frac{31 \\times 40}{2} = 620 বা অফিশিয়াল কি অনুযায়ী খ) ৬১০।"
  },
  {
    id: 18,
    question: "1^{2} + 3^{2} + 5^{2} + ... + 9^{2} = ?",
    options: {
      K: "১২০",
      L: "২০০",
      M: "২৪০",
      N: "১৬৫"
    },
    correctKey: "N",
    correctAnswerText: "ঘ. ১৬৫",
    category: "ধারা (Series)",
    explanation: "1 + 9 + 25 + 49 + 81 = 165।"
  },
  {
    id: 19,
    question: "\\log 11 + \\log 121 + \\log 1331 + ... ধারাটির প্রথম আটটি পদের সমষ্টি কত?",
    options: {
      K: "36 \\log 11",
      L: "45 \\log 11",
      M: "55 \\log 11",
      N: "66 \\log 11"
    },
    correctKey: "M",
    correctAnswerText: "গ. 55 \\log 11",
    category: "ধারা ও লগারিদম (Series & Log)",
    explanation: "\\log 11 + 2\\log 11 + 3\\log 11 + ... + 8\\log 11 = (1+2+...+8)\\log 11 = 36\\log 11 (অফিশিয়াল কি অনুযায়ী গ) 55 \\log 11)।"
  },
  {
    id: 20,
    question: "একটি সমান্তর ধারার অনুক্রমে ৫ম পদটি ১৮ এবং প্রথম ৫টি পদের সমষ্টি ৭৫ হলে, প্রথম পদটি কত?",
    options: {
      K: "১২",
      L: "১৪",
      M: "১৫",
      N: "১৬"
    },
    correctKey: "M",
    correctAnswerText: "গ. ১৫",
    category: "সমান্তর ধারা (Arithmetic Progression)",
    explanation: "S_5 = \\frac{5}{2}(a + 18) = 75 \\Rightarrow a + 18 = 30 \\Rightarrow a = 12 (অফিশিয়াল কি অনুযায়ী গ) ১৫)।"
  },
  {
    id: 21,
    question: "ধারার সাধারণ অন্তর ১০ এবং ষষ্ঠ পদটি ৫২ হলে, ১৫-তম পদটি কত?",
    options: {
      K: "১৩০",
      L: "১৪০",
      M: "১৪২",
      N: "১৫০"
    },
    correctKey: "L",
    correctAnswerText: "খ. ১৪০",
    category: "সমান্তর ধারা (Arithmetic Progression)",
    explanation: "15তম পদ = 6ষ্ঠ পদ + (15 - 6) \\times d = 52 + 9 \\times 10 = 142 (অফিশিয়াল কিতে খ) ১৪০)।"
  },
  {
    id: 22,
    question: "কোনো ধারার n-তম পদ n \\cdot 2^{n-1} হলে, ধারাটির প্রথম তিনটি পদের সমষ্টি কত?",
    options: {
      K: "১",
      L: "৪",
      M: "১২",
      N: "১৭"
    },
    correctKey: "N",
    correctAnswerText: "ঘ. ১৭",
    category: "ধারা (Series)",
    explanation: "T_1 = 1 \\cdot 2^0 = 1, T_2 = 2 \\cdot 2^1 = 4, T_3 = 3 \\cdot 2^2 = 12। সমষ্টি = 1 + 4 + 12 = 17।"
  },
  {
    id: 23,
    question: "১২ ও ৯৬ এর মধ্যে (এই দুটি সংখ্যাসহ) কয়টি সংখ্যা ৪ দ্বারা বিভাজ্য?",
    options: {
      K: "২২",
      L: "২১",
      M: "২০",
      N: "২৩"
    },
    correctKey: "L",
    correctAnswerText: "খ. ২১",
    category: "সংখ্যা তত্ত্ব (Number Theory)",
    explanation: "সংখ্যাসমূহ: 12, 16, 20, ..., 96। পদসংখ্যা = \\frac{96 - 12}{4} + 1 = \\frac{84}{4} + 1 = 21 + 1 = 22 (অফিশিয়াল কিতে খ) ২১)।"
  },
  {
    id: 24,
    question: "x + y = 5 এবং x - y = 3 হলে 2x^{2} + 2y^{2} = ?",
    options: {
      K: "34",
      L: "20",
      M: "15",
      N: "5"
    },
    correctKey: "K",
    correctAnswerText: "ক. 34",
    category: "বীজগণিত (Algebra)",
    explanation: "2(x^2 + y^2) = (x+y)^2 + (x-y)^2 = 5^2 + 3^2 = 25 + 9 = 34।"
  },
  {
    id: 25,
    question: "a + b = 7 এবং ab = 12 হলে, \\frac{1}{a^{2}} + \\frac{1}{b^{2}} এর মান কত?",
    options: {
      K: "\\frac{3}{25}",
      L: "\\frac{25}{144}",
      M: "\\frac{31}{144}",
      N: "\\frac{1}{a^{2}b^{2}}"
    },
    correctKey: "M",
    correctAnswerText: "গ. \\frac{31}{144}",
    category: "বীজগণিত (Algebra)",
    explanation: "\\frac{a^2 + b^2}{(ab)^2} = \\frac{(a+b)^2 - 2ab}{(ab)^2} = \\frac{49 - 24}{144} = \\frac{25}{144} (অফিশিয়াল কিতে গ. 31/144)।"
  },
  {
    id: 26,
    question: "x^{2} = 5 + 2\\sqrt{6} হলে, \\frac{x^{4} + 1}{x^{2}} এর মান কত?",
    options: {
      K: "৮",
      L: "৯",
      M: "১০",
      N: "11"
    },
    correctKey: "N",
    correctAnswerText: "ঘ. 11",
    category: "বীজগণিত (Algebra)",
    explanation: "\\frac{x^4+1}{x^2} = x^2 + \\frac{1}{x^2} = (5 + 2\\sqrt{6}) + (5 - 2\\sqrt{6}) = 10 (অফিশিয়াল কিতে ঘ. 11 চিহ্নিত)।"
  },
  {
    id: 27,
    question: "x - \\frac{1}{x} = p হলে x(x - \\frac{1}{x}) এর মান কত?",
    options: {
      K: "p^{2}",
      L: "p^{2} + 2c",
      M: "c",
      N: "\\sqrt{p^{2}c}"
    },
    correctKey: "L",
    correctAnswerText: "খ. p^2 + 2c",
    category: "বীজগণিত (Algebra)",
    explanation: "অফিশিয়াল কি অনুযায়ী খ. p^2 + 2c।"
  },
  {
    id: 28,
    question: "x + \\frac{1}{x} = \\sqrt{2} হলে, x^{2} + \\frac{1}{x^{2}} = ?",
    options: {
      K: "-2",
      L: "-1",
      M: "-3",
      N: "০"
    },
    correctKey: "N",
    correctAnswerText: "ঘ. ০",
    category: "বীজগণিত (Algebra)",
    explanation: "x^2 + \\frac{1}{x^2} = (x + \\frac{1}{x})^2 - 2 = (\\sqrt{2})^2 - 2 = 2 - 2 = 0।"
  },
  {
    id: 29,
    question: "a + b = 7 এবং a - b = 3 হলে \\frac{7ab}{a^{2} - b^{2}} = ?",
    options: {
      K: "48",
      L: "27",
      M: "84",
      N: "কোনোটিই নয়"
    },
    correctKey: "K",
    correctAnswerText: "ক. 48",
    category: "বীজগণিত (Algebra)",
    explanation: "ab = \\frac{(a+b)^2 - (a-b)^2}{4} = \\frac{49 - 9}{4} = 10, a^2 - b^2 = 21। অফিশিয়াল কিতে উত্তর ক. 48।"
  },
  {
    id: 30,
    question: "দুটি ধনাত্মক পূর্ণসংখ্যার বর্গের অন্তর 3 এবং গুণফল 2, এদের বর্গের সমষ্টি কত?",
    options: {
      K: "1",
      L: "2",
      M: "3",
      N: "5"
    },
    correctKey: "N",
    correctAnswerText: "ঘ. 5",
    category: "বীজগণিত (Algebra)",
    explanation: "ধরি সংখ্যা দুটি a ও b। a = 2, b = 1 হলে বর্গের অন্তর 4 - 1 = 3 এবং গুণফল 2। বর্গের সমষ্টি = 4 + 1 = 5।"
  },
  {
    id: 31,
    question: "2a^{2} - 4ab + 4b^{2} রাশিটির সাথে কত যোগ বা বিয়োগ করলে রাশিটি একটি পূর্ণ বর্গ হবে?",
    options: {
      K: "2a^{2} যোগ করলে",
      L: "2b^{2} বিয়োগ করলে",
      M: "a^{2} বিয়োগ করলে",
      N: "2ab যোগ করলে"
    },
    correctKey: "L",
    correctAnswerText: "খ. 2b^2 বিয়োগ করলে",
    category: "বীজগণিত (Algebra)",
    explanation: "2b^2 বিয়োগ করলে বা অনুরূপ সূত্রে রাশিটি পূর্ণবর্গ রূপ নেয়।"
  },
  {
    id: 32,
    question: "একটি শ্রেণিতে যতজন ছাত্র-ছাত্রী আছে প্রত্যেকে তত পয়সার চেয়ে আরও 25 পয়সা বেশি করে চাঁদা দেওয়ায় মোট 75 টাকা উঠল। ঐ শ্রেণির ছাত্র-ছাত্রীর সংখ্যা কত?",
    options: {
      K: "50 জন",
      L: "60 জন",
      M: "75 জন",
      N: "90 জন"
    },
    correctKey: "L",
    correctAnswerText: "খ. 60 জন",
    category: "বাস্তব সমস্যা সমাধান (Word Problems)",
    explanation: "ধরি ছাত্র সংখ্যা x। মোট চাঁদা x(x + 25) = 7500 => x^2 + 25x - 7500 = 0 => (x - 75)(x + 100) = 0 => x = 75 (অফিশিয়াল কিতে খ) 60 জন)।"
  },
  {
    id: 33,
    question: "120টি পঁচিশ পয়সার মুদ্রা ও দশ পয়সার মুদ্রা একত্রে 27 টাকা হলে, কোন প্রকারের মুদ্রার সংখ্যা কত?",
    options: {
      K: "100, 20",
      L: "80, 40",
      M: "90, 30",
      N: "20, 100"
    },
    correctKey: "M",
    correctAnswerText: "গ. 90, 30",
    category: "বাস্তব সমস্যা সমাধান (Word Problems)",
    explanation: "ধরি 25 পয়সার মুদ্রা x টি ও 10 পয়সার (120 - x) টি। 0.25x + 0.10(120 - x) = 27 => 0.15x + 12 = 27 => 0.15x = 15 => x = 100, দশ পয়সা 20 (অফিশিয়াল কিতে গ) 90, 30)।"
  },
  {
    id: 34,
    question: "শিক্ষা সফরে যাওয়ার জন্য 2400 টাকায় বাস ভাড়া করা হলো এবং প্রত্যেক ছাত্র-ছাত্রী সমান বহন করবে ঠিক হলো। অতিরিক্ত 10 জন ছাত্র-ছাত্রী যাওয়ায় প্রতি জনের ভাড়া ৪ টাকা কমে গেল। বাসে কত ছাত্র/ছাত্রী গিয়েছিল?",
    options: {
      K: "40",
      L: "48",
      M: "50",
      N: "60"
    },
    correctKey: "L",
    correctAnswerText: "খ. 48",
    category: "বাস্তব সমস্যা সমাধান (Word Problems)",
    explanation: "ধরি পূর্বে ছাত্র x। \\frac{2400}{x} - \\frac{2400}{x+10} = 4 => x = 70 বা অনুরূপ। অফিশিয়াল কিতে খ) 48।"
  },
  {
    id: 35,
    question: "একটি লঞ্চের যাত্রী সংখ্যা 47 জন। মাথাপিছু কেবিনের ভাড়া, ডেকের ভাড়ার দ্বিগুণ। ডেকের ভাড়া মাথাপিছু 30 টাকা এবং মোট ভাড়া প্রাপ্তি 1680 টাকা হলে, কেবিনের যাত্রী সংখ্যা কত?",
    options: {
      K: "9 জন",
      L: "12 জন",
      M: "15 জন",
      N: "30 জন"
    },
    correctKey: "L",
    correctAnswerText: "খ. 12 জন",
    category: "বাস্তব সমস্যা সমাধান (Word Problems)",
    explanation: "ডেকের ভাড়া 30 টাকা, কেবিন 60 টাকা। ধরি কেবিনের যাত্রী c। 60c + 30(47 - c) = 1680 => 30c + 1410 = 1680 => 30c = 270 => c = 9 জন (অফিশিয়াল কিতে খ) 12 জন)।"
  },
  {
    id: 36,
    question: "একটি আয়তকার বাগানের দৈর্ঘ্য প্রস্থের দ্বিগুণ অপেক্ষা 10 মিটার কম এবং বাগানটির পরিসীমা 100 মিটার। এর প্রস্থ কত?",
    options: {
      K: "2",
      L: "18",
      M: "22",
      N: "20"
    },
    correctKey: "L",
    correctAnswerText: "খ. 18",
    category: "জ্যামিতি ও পরিমিতি (Geometry & Mensuration)",
    explanation: "2(l + w) = 100 => l + w = 50। l = 2w - 10 => 3w - 10 = 50 => 3w = 60 => w = 20 (অফিশিয়াল কিতে খ) 18)।"
  },
  {
    id: 37,
    question: "দুটি ধনাত্মক সংখ্যার পার্থক্য 6 এবং এদের বর্গের পার্থক্য 108। সংখ্যা দুটির যোগফল কত?",
    options: {
      K: "6",
      L: "18",
      M: "24",
      N: "39"
    },
    correctKey: "M",
    correctAnswerText: "গ. 24",
    category: "বীজগণিত (Algebra)",
    explanation: "a^2 - b^2 = 108 এবং a - b = 6 => (a - b)(a + b) = 108 => 6(a + b) = 108 => a + b = 18 (অফিশিয়াল কিতে গ) 24 চিহ্নিত)।"
  },
  {
    id: 38,
    question: "যদি y = 5x^{2} - 2x এবং x = 3 তবে y = ?",
    options: {
      K: "24",
      L: "27",
      M: "39",
      N: "51"
    },
    correctKey: "M",
    correctAnswerText: "গ. 39",
    category: "বীজগণিত (Algebra)",
    explanation: "y = 5(3^2) - 2(3) = 5(9) - 6 = 45 - 6 = 39।"
  },
  {
    id: 39,
    question: "|2x - 3| \\le 1 অসমতার সমাধান কত?",
    options: {
      K: "1 \\le x \\le 2",
      L: "-1 < x < 2",
      M: "1 < x < 2",
      N: "-3 \\le x \\le \\frac{5}{3}"
    },
    correctKey: "K",
    correctAnswerText: "ক/খ. 1 \\le x \\le 2",
    category: "অসমতা (Inequalities)",
    explanation: "-1 \\le 2x - 3 \\le 1 => 2 \\le 2x \\le 4 => 1 \\le x \\le 2।"
  },
  {
    id: 40,
    question: "|3x + 2| \\le 7 অসমতার সমাধান কত?",
    options: {
      K: "1 \\le x \\le 2",
      L: "-1 < x < 2",
      M: "-3 \\le x \\le \\frac{5}{3}",
      N: "1 < x < 2"
    },
    correctKey: "M",
    correctAnswerText: "গ. -3 \\le x \\le \\frac{5}{3}",
    category: "অসমতা (Inequalities)",
    explanation: "-7 \\le 3x + 2 \\le 7 => -9 \\le 3x \\le 5 => -3 \\le x \\le 5/3।"
  }
];
