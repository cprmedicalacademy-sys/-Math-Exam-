import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Award,
  Bookmark,
  Printer,
  User,
  GraduationCap,
  Calculator,
  HelpCircle,
  FileText,
  Sparkles,
  TrendingUp,
  HeartHandshake,
  Check
} from 'lucide-react';
import { examData, EXAM_CONFIG, OPTION_LABELS, QuestionItem } from './data/examData';
import { MathRenderer } from './components/MathRenderer';

// Helper to convert English digits to Bengali digits
const toBengaliNumber = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
};

export default function App() {
  // Navigation / Views
  const [view, setView] = useState<'welcome' | 'exam' | 'result'>('welcome');

  // Candidate Registration State
  const [candidateName, setCandidateName] = useState('');
  const [candidateRegNo, setCandidateRegNo] = useState('');
  const batchName = 'Special BCS Crystal Batch (Session-2026)';
  const [examMode, setExamMode] = useState<'timed' | 'practice'>('timed');

  // Exam Progress State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, 'K' | 'L' | 'M' | 'N'>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_CONFIG.durationMinutes * 60);
  const [timeSpent, setTimeSpent] = useState(0);

  // Modals & UI States
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isTimeOutModalOpen, setIsTimeOutModalOpen] = useState(false);
  const [paletteFilter, setPaletteFilter] = useState<'all' | 'answered' | 'unanswered' | 'marked'>('all');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'wrong' | 'unattempted'>('all');
  const [isReviewOpen, setIsReviewOpen] = useState(true);

  // Ref for timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start Exam Handler
  const handleStartExam = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!candidateName.trim() || !candidateRegNo.trim()) {
      alert('দয়া করে আপনার নাম এবং রেজিস্ট্রেশন নম্বর লিখুন।');
      return;
    }

    setUserAnswers({});
    setMarkedForReview({});
    setCurrentQuestionIndex(0);
    setTimeLeft(EXAM_CONFIG.durationMinutes * 60);
    setTimeSpent(0);
    setView('exam');
  };

  // Timer Effect
  useEffect(() => {
    if (view === 'exam' && examMode === 'timed') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmitOnTimeout();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    } else if (view === 'exam' && examMode === 'practice') {
      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view, examMode]);

  // Timeout handler
  const handleAutoSubmitOnTimeout = () => {
    setIsSubmitModalOpen(false);
    setIsTimeOutModalOpen(true);
    finishExam();
  };

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Answer selection handler
  const handleSelectOption = (key: 'K' | 'L' | 'M' | 'N') => {
    const qId = examData[currentQuestionIndex].id;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: key,
    }));
  };

  // Toggle mark for review
  const handleToggleMark = () => {
    const qId = examData[currentQuestionIndex].id;
    setMarkedForReview((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Finish exam and calculate scores
  const finishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setView('result');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if confetti not supported
    }
  };

  // Score statistics calculations
  const stats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    examData.forEach((q) => {
      const ans = userAnswers[q.id];
      if (!ans) {
        unattempted++;
      } else if (ans === q.correctKey) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const totalQuestions = examData.length;
    // BCS Standard formula: Correct * 1 - Incorrect * 0.5
    const rawScore = correct * EXAM_CONFIG.marksPerCorrect - incorrect * EXAM_CONFIG.marksPerIncorrect;
    const finalScore = Math.max(0, rawScore);
    const percentage = Math.round((finalScore / totalQuestions) * 100);

    return {
      totalQuestions,
      correct,
      incorrect,
      unattempted,
      answeredCount: correct + incorrect,
      finalScore: Number(finalScore.toFixed(2)),
      percentage,
      negativeDeducted: Number((incorrect * EXAM_CONFIG.marksPerIncorrect).toFixed(2)),
    };
  }, [userAnswers]);

  // Performance Remark generator based on score
  const performanceRemark = useMemo(() => {
    const score = stats.finalScore;
    const percentage = stats.percentage;

    if (percentage >= 70) {
      return {
        category: 'high',
        title: 'অসাধারণ সাফল্য! আপনাকে আন্তরিক শুভকামনা!',
        subtitle: 'আপনার গাণিতিক যুক্তির প্রস্তুতি অত্যন্ত চমৎকার ও প্রশংসনীয়!',
        message:
          'বিসিএস প্রিলিমিনারি পরীক্ষায় ভালো ক্যাডার অর্জনের পথে আপনি অনেক দূর এগিয়ে আছেন। আপনার বেসিক ও গাণিতিক দক্ষতা খুবই চমৎকার। এই আত্মবিশ্বাস বজায় রেখে নিয়মিত রিভিশন ও পূর্ণাঙ্গ মডেল টেস্টে অংশগ্রহণ বজায় রাখুন।',
        badgeText: '🏆 চমৎকার স্কোর (Outstanding)',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        cardBg: 'bg-gradient-to-br from-emerald-50/90 to-teal-50/50 border-emerald-200',
        iconBg: 'bg-emerald-600 text-white',
        icon: <Award className="w-8 h-8" />,
        tips: [
          'কঠিন প্রশ্নগুলোতে নির্ভুলতা বজায় রেখে ক্যালকুলেশন স্পিড আরও কিছুটা বাড়ানোর অভ্যাস করুন।',
          'গণিতের পাশাপাশি অন্যান্য বিষয়েও সমান গুরুত্ব দিয়ে ভারসাম্য রক্ষা করুন।',
          'পরীক্ষার শেষ দিন পর্যন্ত নিয়মিত চর্চা ও টাইমড মক টেস্ট চালিয়ে যান।'
        ]
      };
    } else if (percentage >= 45) {
      return {
        category: 'medium',
        title: 'ভালো প্রচেষ্টা! আরও কিছুটা উন্নতির সুযোগ রয়েছে!',
        subtitle: 'আপনি পাসিং স্কোরের কাছাকাছি আছেন, আরেকটু যত্নে নিশ্চিত ভালো স্কোর আসবে!',
        message:
          'আপনার প্রচেষ্টা প্রশংসনীয় হলেও কিছু অসাবধানতাবশত ভুলের কারণে নেগেটিভ মার্কিংয়ে মূল্যবান নম্বর কাটা গেছে। যেসব অধ্যায়ে (লগারিদম, ধারা বা বাস্তব সমস্যা) বেশি ভুল হয়েছে, সেগুলো চিহ্নিত করে সমাধানগুলো আবার ভালোভাবে আয়ত্ত করুন।',
        badgeText: '⚡ সন্তোষজনক অগ্রগতি (Satisfactory)',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        cardBg: 'bg-gradient-to-br from-amber-50/90 to-orange-50/50 border-amber-200',
        iconBg: 'bg-amber-600 text-white',
        icon: <TrendingUp className="w-8 h-8" />,
        tips: [
          'নেগেটিভ মার্কিং কমাতে শতভাগ নিশ্চিত না হয়ে অনুমানভিত্তিক উত্তর দেওয়া পরিহার করুন।',
          'ভুল হওয়া প্রশ্নগুলোর অফিশিয়াল সমাধান দেখে নিজের খাতায় সমাধানটি লিখে প্র্যাকটিস করুন।',
          'পরবর্তী মক টেস্টে ভুলের সংখ্যা ৫টির নিচে নামিয়ে আনার লক্ষ্য নির্ধারণ করুন।'
        ]
      };
    } else {
      return {
        category: 'low',
        title: 'পরবর্তী পরীক্ষার জন্য এখন থেকেই পূর্ণ প্রস্তুতি নিন!',
        subtitle: 'মন খারাপ বা হতাশ হওয়ার কিছু নেই, নিয়মিত অনুশীলনে আপনিও সেরা হবেন!',
        message:
          'বিসিএস একটি দীর্ঘমেয়াদী অধ্যবসায়ের পরীক্ষা। প্রথমবারে কাঙ্ক্ষিত নম্বর না পেলেও হতাশ হওয়ার কিছু নেই। আপনার দুর্বল ক্ষেত্রগুলো চিহ্নিত করে বেসিক থেকে নতুন উদ্যমে শুরু করুন। নিয়মিত প্র্যাকটিস করলে দ্রুতই আপনার স্কোর বহুগুণ বৃদ্ধি পাবে। CPR Medical Academy আপনার এই পথচলায় সবসময় পাশে আছে।',
        badgeText: '🎯 পরবর্তী পরীক্ষার জন্য প্রস্তুতি নিন (Needs More Practice)',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        cardBg: 'bg-gradient-to-br from-rose-50/90 to-red-50/50 border-rose-200',
        iconBg: 'bg-rose-600 text-white',
        icon: <HeartHandshake className="w-8 h-8" />,
        tips: [
          'প্রতিটি অধ্যায়ের মৌলিক নিয়ম ও সূত্রগুলো নতুন করে খাতায় লিখে অনুশীলন করুন।',
          'এই পরীক্ষার অফিশিয়াল উত্তরপত্র ও প্রতিটি প্রশ্নের সমাধান মনোযোগ দিয়ে রিভিশন দিন।',
          'ক্যালকুলেশন স্পিড ও নির্ভুলতা বাড়াতে প্রতিদিন অন্তত ২০টি গণিত সমাধান করার অভ্যাস করুন।'
        ]
      };
    }
  }, [stats]);

  // Current question data
  const currentQ = examData[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQ?.id];
  const isCurrentMarked = markedForReview[currentQ?.id] || false;

  // Filtered palette questions
  const filteredPaletteQuestions = useMemo(() => {
    return examData.map((q, idx) => {
      const isAnswered = Boolean(userAnswers[q.id]);
      const isMarked = Boolean(markedForReview[q.id]);
      return { q, idx, isAnswered, isMarked };
    }).filter(({ isAnswered, isMarked }) => {
      if (paletteFilter === 'answered') return isAnswered;
      if (paletteFilter === 'unanswered') return !isAnswered;
      if (paletteFilter === 'marked') return isMarked;
      return true;
    });
  }, [userAnswers, markedForReview, paletteFilter]);

  // Filtered review questions
  const filteredReviewQuestions = useMemo(() => {
    return examData.map((q, idx) => {
      const userChoice = userAnswers[q.id];
      const isAnswered = Boolean(userChoice);
      const isCorrect = userChoice === q.correctKey;
      return { q, idx, userChoice, isAnswered, isCorrect };
    }).filter(({ isAnswered, isCorrect }) => {
      if (reviewFilter === 'correct') return isCorrect;
      if (reviewFilter === 'wrong') return isAnswered && !isCorrect;
      if (reviewFilter === 'unattempted') return !isAnswered;
      return true;
    });
  }, [userAnswers, reviewFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-200 ring-2 ring-indigo-100">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight font-serif-academy">
                  CPR Medical Academy
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Crystal Batch
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium font-bengali">
                Special BCS Crystal Batch • গাণিতিক যুক্তি (Math Exam)
              </p>
            </div>
          </div>

          {/* Right Header: Active Timer & Candidate Info */}
          <div className="flex items-center gap-3">
            {view === 'exam' && (
              <div
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  timeLeft <= 300 && examMode === 'timed'
                    ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse ring-2 ring-rose-200'
                    : timeLeft <= 600 && examMode === 'timed'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="font-mono tracking-wider font-bold">
                  {examMode === 'timed' ? formatTime(timeLeft) : formatTime(timeSpent)}
                </span>
                {examMode === 'practice' && (
                  <span className="text-[10px] uppercase font-bold bg-indigo-200/70 text-indigo-900 px-1.5 py-0.5 rounded">
                    Practice
                  </span>
                )}
              </div>
            )}

            {candidateName && view !== 'welcome' && (
              <div className="hidden md:flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium max-w-[140px] truncate">{candidateName}</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500 font-medium">রেজি: <span className="font-mono font-bold">{candidateRegNo}</span></span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col justify-start">
        {/* ============================================================== */}
        {/* VIEW 1: WELCOME & REGISTRATION                                */}
        {/* ============================================================== */}
        {view === 'welcome' && (
          <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-10 transition-all">
              {/* Badge & Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-indigo-100">
                  <GraduationCap className="w-4 h-4" />
                  <span>BCS Preliminary Mock Test Series</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 font-bengali">
                  গাণিতিক যুক্তি (Mathematical Reasoning)
                </h2>
                <p className="text-slate-600 text-sm sm:text-base font-serif-academy">
                  CPR Medical Academy • Special BCS Crystal Batch Exam Portal
                </p>
              </div>

              {/* Exam Rules Breakdown Card */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-5 sm:p-6 border border-slate-200/70 mb-6 space-y-3.5 text-sm text-slate-700">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>মোট প্রশ্নসংখ্যা (Total Questions):</span>
                  </span>
                  <span className="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                    ৪০ টি বহুনির্বাচনি (40 MCQs)
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>নির্ধারিত সময় (Time Limit):</span>
                  </span>
                  <span className="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                    ৪৫ মিনিট (45 Minutes)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>নেগেটিভ মার্কিং (Marking Scheme):</span>
                  </span>
                  <span className="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 text-right">
                    সঠিক +১.০০ • ভুল -০.৫০
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleStartExam} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    পরীক্ষার্থীর পূর্ণ নাম (Full Name) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Md. Rahim Uddin / Dr. Nusrat Jahan"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    রেজিস্ট্রেশন নং (Registration No.) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateRegNo}
                    onChange={(e) => setCandidateRegNo(e.target.value)}
                    placeholder="e.g. REG-2026-504"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition bg-white font-mono"
                  />
                </div>

                {/* Batch - Fixed only to Special BCS Crystal Batch (Session-2026) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    ব্যাচ (Batch)
                  </label>
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-indigo-200 bg-indigo-50/50 text-indigo-950 font-medium text-sm">
                    <span className="font-bold">{batchName}</span>
                    <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> নির্ধারিত ব্যাচ
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    পরীক্ষার ধরন (Exam Mode)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setExamMode('timed')}
                      className={`p-3 rounded-xl border text-sm font-medium transition text-left flex items-start gap-2.5 ${
                        examMode === 'timed'
                          ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">টাইমড মক টেস্ট</div>
                        <div className="text-xs text-slate-500">৪৫ মিনিট স্বয়ংক্রিয় কাউন্টডাউন</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExamMode('practice')}
                      className={`p-3 rounded-xl border text-sm font-medium transition text-left flex items-start gap-2.5 ${
                        examMode === 'practice'
                          ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">অনুশীলন মোড</div>
                        <div className="text-xs text-slate-500">সময়সীমার চাপ ছাড়াই অনুশীলন</div>
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 flex items-center justify-center space-x-2 text-base cursor-pointer"
                >
                  <span className="font-bengali">পরীক্ষা শুরু করুন (Start Exam)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: ACTIVE EXAM QUIZ                                      */}
        {/* ============================================================== */}
        {view === 'exam' && (
          <div className="space-y-6">
            {/* Top Bar: Progress & Question Palette Toggle */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <div className="w-full sm:w-auto">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      প্রশ্ন নং {toBengaliNumber(currentQuestionIndex + 1)} / {toBengaliNumber(examData.length)}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      উত্তরিত: {toBengaliNumber(Object.keys(userAnswers).length)} / {toBengaliNumber(examData.length)}
                    </span>
                  </div>

                  <div className="w-full sm:w-72 bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentQuestionIndex + 1) / examData.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Palette Filters */}
                <div className="flex items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setPaletteFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      paletteFilter === 'all' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    সকল ({examData.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaletteFilter('answered')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      paletteFilter === 'answered' ? 'bg-white text-emerald-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    উত্তরিত ({Object.keys(userAnswers).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaletteFilter('unanswered')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      paletteFilter === 'unanswered' ? 'bg-white text-slate-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    বাকি ({examData.length - Object.keys(userAnswers).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaletteFilter('marked')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      paletteFilter === 'marked' ? 'bg-white text-amber-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    চিহ্নিত ({Object.values(markedForReview).filter(Boolean).length})
                  </button>
                </div>
              </div>

              {/* Question Jump Palette Grid */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {filteredPaletteQuestions.map(({ q, idx, isAnswered, isMarked }) => {
                  const isCurrent = idx === currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`min-w-8 h-8 px-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center border font-mono relative cursor-pointer ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200'
                          : isMarked
                          ? 'border-amber-400 bg-amber-50 text-amber-800'
                          : isAnswered
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                      title={`Question ${idx + 1}`}
                    >
                      {idx + 1}
                      {isMarked && !isCurrent && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-200/80 p-6 sm:p-10 transition-all">
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-lg font-mono">
                    প্রশ্ন {toBengaliNumber(currentQuestionIndex + 1)}
                  </span>
                  {currentQ.category && (
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg font-bengali">
                      {currentQ.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleMark}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      isCurrentMarked
                        ? 'border-amber-400 bg-amber-50 text-amber-800 font-bold'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isCurrentMarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{isCurrentMarked ? 'রিভিউ এর জন্য চিহ্নিত' : 'রিভিউ এর জন্য রাখুন'}</span>
                  </button>

                  {currentAnswer ? (
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      উত্তরিত
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                      অনুত্তরিত
                    </span>
                  )}
                </div>
              </div>

              {/* Question Content */}
              <div className="mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed font-bengali">
                  <span className="text-indigo-600 font-bold mr-2">{toBengaliNumber(currentQuestionIndex + 1)}.</span>
                  <MathRenderer content={currentQ.question} />
                </h3>
              </div>

              {/* Options Selection */}
              <div className="space-y-3 mb-8">
                {(['K', 'L', 'M', 'N'] as const).map((key) => {
                  const isSelected = currentAnswer === key;
                  const optionText = currentQ.options[key];
                  const label = OPTION_LABELS[key];

                  return (
                    <label
                      key={key}
                      onClick={() => handleSelectOption(key)}
                      className={`flex items-center p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`quiz-option-${currentQ.id}`}
                        checked={isSelected}
                        onChange={() => handleSelectOption(key)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                      />
                      <div className="ml-3.5 flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {label.bn}
                        </span>
                        <span className="text-slate-800 text-sm sm:text-base font-medium font-bengali">
                          <MathRenderer content={optionText} />
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Action Buttons: Previous, Next */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>পূর্ববর্তী (Previous)</span>
                </button>

                {currentQuestionIndex < examData.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(examData.length - 1, prev + 1))}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-100 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>পরবর্তী (Next)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-200 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>সম্পূর্ণ করুন (Finish)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Final Submit Floating Bar */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <div className="text-xs text-slate-500 font-bengali">
                মোট ৪০ টি প্রশ্নের মধ্যে {toBengaliNumber(Object.keys(userAnswers).length)} টির উত্তর দিয়েছেন।
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-emerald-100 transition flex items-center space-x-2 text-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>পরীক্ষা জমা দিন (Submit Exam)</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: RESULT & OFFICIAL ANSWER KEY REVIEW                    */}
        {/* ============================================================== */}
        {view === 'result' && (
          <div className="space-y-8">
            {/* Grand Score Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-10 text-center relative overflow-hidden">
              <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-emerald-200">
                <Award className="w-10 h-10" />
              </div>

              <span className="inline-block bg-emerald-50 text-emerald-700 font-semibold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 border border-emerald-200">
                Examination Completed
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-2 font-bengali">
                পরীক্ষার ফলাফল ও মূল্যায়ন
              </h2>

              <p className="text-slate-600 text-sm sm:text-base font-serif-academy mb-6">
                পরীক্ষার্থী: <span className="font-bold text-slate-900">{candidateName}</span> • রেজিস্ট্রেশন নং:{' '}
                <span className="font-bold text-slate-900 font-mono">{candidateRegNo}</span> • ব্যাচ:{' '}
                <span className="font-bold text-indigo-700">{batchName}</span>
              </p>

              {/* 4-Stat Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-6">
                <div className="bg-indigo-50/70 p-4 sm:p-5 rounded-2xl border border-indigo-100">
                  <p className="text-xs text-indigo-700 font-bold uppercase mb-1 font-sans">অর্জিত নম্বর (Score)</p>
                  <p className="text-3xl sm:text-4xl font-black text-indigo-600 font-mono">
                    {stats.finalScore}
                    <span className="text-xs font-normal text-slate-500"> / ৪০</span>
                  </p>
                </div>

                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1 font-sans">সঠিক উত্তর</p>
                  <p className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">
                    {stats.correct}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1 font-sans">ভুল উত্তর (-০.৫)</p>
                  <p className="text-3xl sm:text-4xl font-black text-rose-500 font-mono">
                    {stats.incorrect}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1 font-sans">শতাংশ (Percentage)</p>
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
                    {stats.percentage}%
                  </p>
                </div>
              </div>

              {/* Negative Marking Formula Note */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-xs sm:text-sm text-slate-700 font-medium max-w-xl mx-auto flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-left font-bengali">
                  <span>বিসিএস নেগেটিভ মার্কিং হিসাব: </span>
                  <span className="font-bold">সঠিক ({stats.correct}) - (ভুল × ০.৫ = {stats.negativeDeducted}) = {stats.finalScore}</span>
                </div>
              </div>

              {/* Dynamic Performance Evaluation & Encouragement Card */}
              <div className={`rounded-3xl p-6 sm:p-8 border mb-8 text-left transition-all ${performanceRemark.cardBg}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${performanceRemark.iconBg}`}>
                      {performanceRemark.icon}
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border mb-1 ${performanceRemark.badgeClass}`}>
                        {performanceRemark.badgeText}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-bengali">
                        {performanceRemark.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-800 mb-4 font-bengali leading-relaxed">
                  {performanceRemark.message}
                </p>

                <div className="bg-white/90 rounded-2xl p-4 border border-slate-200/80">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>পরামর্শ ও পরবর্তী পরীক্ষার প্রস্তুতি নির্দেশিকা (Actionable Tips):</span>
                  </p>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-bengali">
                    {performanceRemark.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 no-print">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(!isReviewOpen)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-indigo-100 transition flex items-center space-x-2 text-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isReviewOpen ? 'রিভিউ শিট বন্ধ করুন' : 'অফিশিয়াল উত্তরপত্র ও রিভিউ দেখুন'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold py-3 px-5 rounded-xl shadow-xs transition flex items-center space-x-2 text-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>প্রিন্ট / সেভ (Print)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setView('welcome');
                    setUserAnswers({});
                    setMarkedForReview({});
                    setCurrentQuestionIndex(0);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-5 rounded-xl transition flex items-center space-x-2 text-sm cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>পুনরায় পরীক্ষা দিন (Retake)</span>
                </button>
              </div>
            </div>

            {/* Official Answer Key & Detailed Review Section */}
            {isReviewOpen && (
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-200/80 p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-bengali">
                      অফিশিয়াল উত্তরপত্র ও সমাধান (Answer Key & Review)
                    </h3>
                    <p className="text-xs text-slate-500">
                      CPR Medical Academy Crystal Batch Official Answer Scheme
                    </p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium no-print">
                    <button
                      type="button"
                      onClick={() => setReviewFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        reviewFilter === 'all' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      সকল (৪০)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('correct')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        reviewFilter === 'correct' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      সঠিক ({stats.correct})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('wrong')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        reviewFilter === 'wrong' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      ভুল ({stats.incorrect})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('unattempted')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        reviewFilter === 'unattempted' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      অনুত্তরিত ({stats.unattempted})
                    </button>
                  </div>
                </div>

                {/* Review Questions List */}
                <div className="space-y-5">
                  {filteredReviewQuestions.map(({ q, idx, userChoice, isAnswered, isCorrect }) => {
                    const officialCorrectLabel = OPTION_LABELS[q.correctKey];

                    return (
                      <div
                        key={q.id}
                        className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                          !isAnswered
                            ? 'border-slate-200 bg-slate-50/50'
                            : isCorrect
                            ? 'border-emerald-200 bg-emerald-50/20'
                            : 'border-rose-200 bg-rose-50/20'
                        }`}
                      >
                        {/* Question Status Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold font-mono text-slate-500">
                            প্রশ্ন {idx + 1}
                          </span>

                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
                              !isAnswered
                                ? 'bg-slate-200 text-slate-700'
                                : isCorrect
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {!isAnswered ? (
                              <>
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>উত্তর দেননি (Skipped)</span>
                              </>
                            ) : isCorrect ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>সঠিক (+১.০০)</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>ভুল (-০.৫০)</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Question Title */}
                        <h4 className="text-base font-semibold text-slate-900 mb-4 font-bengali">
                          <MathRenderer content={q.question} />
                        </h4>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 bg-white p-3.5 rounded-xl border border-slate-200/70">
                          {(['K', 'L', 'M', 'N'] as const).map((key) => {
                            const optionText = q.options[key];
                            const label = OPTION_LABELS[key];
                            const isUserPick = userChoice === key;
                            const isCorrectOpt = q.correctKey === key;

                            let optionBadgeClass = 'border-slate-200 text-slate-700 bg-slate-50';
                            if (isCorrectOpt) {
                              optionBadgeClass = 'border-emerald-400 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-300';
                            } else if (isUserPick && !isCorrectOpt) {
                              optionBadgeClass = 'border-rose-400 bg-rose-50 text-rose-900 font-bold line-through ring-1 ring-rose-300';
                            }

                            return (
                              <div
                                key={key}
                                className={`p-2.5 rounded-lg border text-sm flex items-center justify-between font-bengali ${optionBadgeClass}`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs uppercase w-5 text-center">
                                    {label.bn}.
                                  </span>
                                  <span>
                                    <MathRenderer content={optionText} />
                                  </span>
                                </div>

                                {isCorrectOpt && (
                                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                    সঠিক উত্তর
                                  </span>
                                )}
                                {isUserPick && !isCorrectOpt && (
                                  <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                                    আপনার উত্তর
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Official Answer Key Footer */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-indigo-700">অফিশিয়াল উত্তর:</span>
                            <span className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-2.5 py-1 rounded-md font-bold font-bengali">
                              <MathRenderer content={q.correctAnswerText} />
                            </span>
                          </div>

                          {q.explanation && (
                            <div className="text-slate-500 font-bengali text-xs">
                              <span className="font-semibold text-slate-700">ব্যাখ্যা: </span>
                              <MathRenderer content={q.explanation} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* CONFIRMATION SUBMISSION MODAL                                  */}
      {/* ============================================================== */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 transform transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 font-bengali">
              পরীক্ষা জমা দিতে চান?
            </h3>
            <p className="text-slate-600 text-sm mb-5 font-bengali">
              পরীক্ষা সাবমিট করার পর আর পরিবর্তন করা যাবে না। নিচে আপনার বর্তমান বিবরণ দেওয়া হলো:
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-6 space-y-2 text-sm font-bengali">
              <div className="flex justify-between">
                <span className="text-slate-600">মোট প্রশ্ন:</span>
                <span className="font-bold text-slate-900">{toBengaliNumber(examData.length)} টি</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">উত্তর দিয়েছেন:</span>
                <span className="font-bold text-emerald-700">{toBengaliNumber(Object.keys(userAnswers).length)} টি</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-600">উত্তর বাকি আছে:</span>
                <span className="font-bold text-rose-600">
                  {toBengaliNumber(examData.length - Object.keys(userAnswers).length)} টি
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">রিভিউ চিহ্নিত:</span>
                <span className="font-bold text-amber-700">
                  {toBengaliNumber(Object.values(markedForReview).filter(Boolean).length)} টি
                </span>
              </div>
            </div>

            <div className="flex space-x-3 justify-end">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition cursor-pointer"
              >
                ফিরে যান (Cancel)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  finishExam();
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-100 transition cursor-pointer"
              >
                নিশ্চিত জমা দিন (Confirm Submit)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeout Alert Modal */}
      {isTimeOutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-4">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-bengali">সময় সমাপ্ত! (Time's Up)</h3>
            <p className="text-slate-600 text-sm mb-6 font-bengali">
              আপনার নির্ধারিত ৪৫ মিনিট সময় সমাপ্ত হয়েছে। আপনার উত্তরপত্রটি স্বয়ংক্রিয়ভাবে জমা নেওয়া হয়েছে।
            </p>
            <button
              type="button"
              onClick={() => setIsTimeOutModalOpen(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition cursor-pointer"
            >
              ফলাফল দেখুন
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-serif-academy mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700">CPR Medical Academy • BCS Preparation Wing</p>
          <p className="text-slate-400 mt-1">Special Crystal Batch Live Mock Test & Online OMR Evaluation System</p>
        </div>
      </footer>
    </div>
  );
}
