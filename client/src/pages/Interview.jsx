import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Code2, Server, Layers, BarChart2, Users,
  ChevronRight, Loader2, Send, ArrowLeft, BrainCircuit, Sparkles
} from 'lucide-react';

/* ── Config ─────────────────────────────────────────────────────────────────── */
const DOMAINS = [
  { id: 'Frontend',     label: 'Frontend',     icon: Code2,    color: 'from-cyan-500/20 to-cyan-600/10',     border: 'border-cyan-500/30',     text: 'text-cyan-400',    desc: 'HTML, CSS, JS, React, Vue' },
  { id: 'Backend',      label: 'Backend',      icon: Server,   color: 'from-violet-500/20 to-violet-600/10', border: 'border-violet-500/30',   text: 'text-violet-400',  desc: 'Node, Python, APIs, DBs' },
  { id: 'Full Stack',   label: 'Full Stack',   icon: Layers,   color: 'from-brand-500/20 to-brand-600/10',  border: 'border-brand-500/30',    text: 'text-brand-400',   desc: 'End-to-end development' },
  { id: 'Data Analyst', label: 'Data Analyst', icon: BarChart2,color: 'from-amber-500/20 to-amber-600/10',  border: 'border-amber-500/30',    text: 'text-amber-400',   desc: 'SQL, Python, Excel, BI' },
  { id: 'HR',           label: 'HR',           icon: Users,    color: 'from-pink-500/20 to-pink-600/10',    border: 'border-pink-500/30',     text: 'text-pink-400',    desc: 'Behavioral & soft skills' },
];

const DIFFICULTIES = [
  { id: 'Easy',   emoji: '🌱', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', desc: 'Freshers & entry-level' },
  { id: 'Medium', emoji: '🔥', color: 'text-amber-400',   border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   desc: '1-3 years experience' },
  { id: 'Hard',   emoji: '⚡', color: 'text-red-400',     border: 'border-red-500/30',     bg: 'bg-red-500/10',     desc: 'Senior / expert level' },
];

/* ── Interview page has 3 steps ──────────────────────────────────────────────
   STEP 0: Select domain + difficulty
   STEP 1: Answer questions one-by-one
   STEP 2: Submitting (loading state)
*/
export default function Interview() {
  const navigate = useNavigate();

  // Step 0 state
  const [domain,     setDomain]     = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [starting,   setStarting]   = useState(false);

  // Step 1 state
  const [step,        setStep]        = useState(0);         // 0=setup, 1=questions
  const [interviewId, setInterviewId] = useState(null);
  const [questions,   setQuestions]   = useState([]);
  const [currentQ,    setCurrentQ]    = useState(0);
  const [answers,     setAnswers]     = useState(Array(5).fill(''));
  const [submitting,  setSubmitting]  = useState(false);

  /* ── Start interview ── */
  const handleStart = async () => {
    if (!domain)     return toast.error('Please select a domain.');
    if (!difficulty) return toast.error('Please select a difficulty.');
    setStarting(true);
    try {
      const res = await api.post('/interviews/start', { domain, difficulty });
      setInterviewId(res.data.interviewId);
      setQuestions(res.data.questions);
      setStep(1);
    } catch (err) {
      toast.error(err.message || 'Failed to generate questions. Try again.');
    } finally {
      setStarting(false);
    }
  };

  /* ── Navigate questions ── */
  const updateAnswer = (val) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentQ] = val;
      return copy;
    });
  };

  const goNext = () => {
    if (!answers[currentQ].trim()) return toast.error('Please provide an answer before continuing.');
    if (currentQ < 4) {
      setCurrentQ((q) => q + 1);
    }
  };

  const goPrev = () => {
    if (currentQ > 0) setCurrentQ((q) => q - 1);
  };

  /* ── Submit all answers ── */
  const handleSubmit = async () => {
    if (!answers[currentQ].trim()) return toast.error('Please answer the last question.');
    const empty = answers.findIndex((a) => !a.trim());
    if (empty !== -1) return toast.error(`Please answer question ${empty + 1} before submitting.`);

    setSubmitting(true);
    try {
      await api.post(`/interviews/${interviewId}/submit`, { answers });
      toast.success('Interview submitted! Generating your report...');
      navigate(`/interview/${interviewId}/report`);
    } catch (err) {
      toast.error(err.message || 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER — Step 0: Setup
  ══════════════════════════════════════════════════════════════════════════ */
  if (step === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="section-label mb-2">AI Mock Interview</p>
          <h1 className="text-3xl font-black text-white">
            Set Up Your <span className="gradient-text">Interview</span>
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Choose your domain and difficulty — Gemini AI will generate 5 tailored questions.
          </p>
        </motion.div>

        {/* Domain selection */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <p className="section-label mb-4">Step 1 — Choose Domain</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DOMAINS.map(({ id, label, icon: Icon, color, border, text, desc }) => (
              <button
                key={id}
                id={`domain-${id.replace(' ', '-').toLowerCase()}`}
                onClick={() => setDomain(id)}
                className={`relative p-5 rounded-2xl border text-left transition-all duration-200
                  bg-gradient-to-br ${color}
                  ${domain === id
                    ? `${border} shadow-brand scale-[1.02]`
                    : 'border-white/8 hover:border-white/20 hover:scale-[1.01]'
                  }`}
              >
                {domain === id && (
                  <motion.div
                    layoutId="domain-ring"
                    className="absolute inset-0 rounded-2xl border-2 border-brand-500/60"
                    transition={{ type: 'spring', bounce: 0.3 }}
                  />
                )}
                <Icon size={22} className={`${text} mb-3`} />
                <div className={`font-semibold ${domain === id ? text : 'text-white'} mb-1`}>{label}</div>
                <div className="text-white/40 text-xs">{desc}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Difficulty selection */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          <p className="section-label mb-4">Step 2 — Choose Difficulty</p>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map(({ id, emoji, color, border, bg, desc }) => (
              <button
                key={id}
                id={`difficulty-${id.toLowerCase()}`}
                onClick={() => setDifficulty(id)}
                className={`relative p-5 rounded-2xl border text-center transition-all duration-200
                  ${difficulty === id
                    ? `${bg} ${border} scale-[1.02]`
                    : 'bg-white/3 border-white/8 hover:border-white/20 hover:scale-[1.01]'
                  }`}
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <div className={`font-semibold ${difficulty === id ? color : 'text-white'} mb-1`}>{id}</div>
                <div className="text-white/40 text-xs hidden sm:block">{desc}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Start button */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <button
            id="start-interview-btn"
            onClick={handleStart}
            disabled={!domain || !difficulty || starting}
            className="btn-primary w-full py-4 text-base"
          >
            {starting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating Questions with Gemini AI...
              </>
            ) : (
              <>
                <BrainCircuit size={20} />
                Generate My Interview
                <Sparkles size={16} />
              </>
            )}
          </button>

          {(domain || difficulty) && (
            <p className="text-center text-white/30 text-xs mt-3">
              {domain && difficulty
                ? `${difficulty} ${domain} — 5 AI questions ready to generate`
                : domain
                ? `${domain} selected — now choose a difficulty`
                : 'Now pick a domain above'}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER — Step 1: Questions
  ══════════════════════════════════════════════════════════════════════════ */
  const progressPct = ((currentQ + 1) / 5) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Progress header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="badge-domain">{domain}</span>
            <span className={`badge ${difficulty === 'Easy' ? 'badge-easy' : difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`}>
              {difficulty}
            </span>
          </div>
          <span className="text-white/40 text-sm font-medium">
            {currentQ + 1} <span className="text-white/20">/ 5</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 md:p-8 mb-5"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center font-bold text-sm shadow-brand">
              Q{currentQ + 1}
            </div>
            <div>
              <p className="section-label mb-1.5">Question {currentQ + 1} of 5</p>
              <p className="text-white text-lg font-semibold leading-relaxed">
                {questions[currentQ]}
              </p>
            </div>
          </div>

          <label className="block text-sm text-white/50 mb-2 font-medium">Your Answer</label>
          <textarea
            id={`answer-${currentQ}`}
            value={answers[currentQ]}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder="Type your answer here... Be as detailed as possible."
            rows={7}
            className="input-field resize-none w-full leading-relaxed text-sm"
          />

          <div className="flex items-center justify-between text-xs text-white/25 mt-2">
            <span>{answers[currentQ].length > 0 ? `${answers[currentQ].length} characters` : 'No answer yet'}</span>
            <span>Tip: Clear, structured answers score higher</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {currentQ > 0 && (
          <button onClick={goPrev} className="btn-secondary py-3 px-5">
            <ArrowLeft size={16} /> Back
          </button>
        )}

        <div className="flex-1" />

        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentQ
                  ? 'bg-brand-500 scale-125'
                  : answers[i]?.trim()
                  ? 'bg-brand-500/50'
                  : 'bg-white/15'
              }`}
            />
          ))}
        </div>

        <div className="flex-1" />

        {currentQ < 4 ? (
          <button id="next-question-btn" onClick={goNext} className="btn-primary py-3 px-6">
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            id="submit-interview-btn"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary py-3 px-6"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Evaluating...</>
            ) : (
              <><Send size={16} /> Submit Interview</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
