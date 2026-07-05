import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import ScoreCard from '../components/ScoreCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ChevronDown, ChevronUp, CheckCircle2, XCircle, Lightbulb,
  ArrowLeft, Zap, Calendar, BarChart3, Trophy
} from 'lucide-react';

/* ── Accordion item for Q&A feedback ── */
function FeedbackItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 p-5 text-left"
        id={`qa-accordion-${index}`}
      >
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-bold flex items-center justify-center mt-0.5">
            Q{index + 1}
          </span>
          <p className="text-white/80 text-sm font-medium leading-relaxed">{item.question}</p>
        </div>
        <div className="flex-shrink-0 text-white/30">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
              {/* Answer */}
              <div>
                <p className="section-label mb-2">Your Answer</p>
                <p className="text-white/60 text-sm leading-relaxed bg-white/3 rounded-xl p-3">
                  {item.answer || <em className="text-white/30">No answer provided</em>}
                </p>
              </div>
              {/* AI comment */}
              <div>
                <p className="section-label mb-2 flex items-center gap-1.5">
                  <Lightbulb size={11} className="text-amber-400" /> AI Feedback
                </p>
                <p className="text-white/70 text-sm leading-relaxed bg-amber-500/5 border border-amber-500/15 rounded-xl p-3">
                  {item.comment}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Chip list ── */
function ChipList({ items, color }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className={`flex items-start gap-2.5 text-sm text-white/70 leading-relaxed`}
        >
          <span className={`flex-shrink-0 mt-0.5 ${color}`}>
            {color.includes('emerald') ? <CheckCircle2 size={15} /> :
             color.includes('red')     ? <XCircle size={15} />     :
                                         <Lightbulb size={15} />   }
          </span>
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function InterviewReport() {
  const { id }                  = useParams();
  const [interview, setInterview] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/interviews/${id}`);
        setInterview(res.data.interview);
      } catch (err) {
        setError(err.message || 'Failed to load report.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading your report..." />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-5xl">😕</div>
        <p className="text-white/60">{error}</p>
        <Link to="/" className="btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  const { domain, difficulty, evaluation, createdAt } = interview;
  const { score, strengths = [], weaknesses = [], suggestions = [], feedback = [] } = evaluation || {};

  const date = new Date(createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>

      {/* ── Hero: score + meta ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden glass-card p-8 md:p-10"
      >
        <div className="orb w-48 h-48 bg-brand-500 -top-16 -right-16 opacity-20" />
        <div className="orb w-36 h-36 bg-violet-500 bottom-0 left-0 opacity-15" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Score ring */}
          <div className="flex-shrink-0">
            <ScoreCard score={score} size={180} />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <p className="section-label mb-2">Interview Complete 🎉</p>
            <h1 className="text-3xl font-black text-white mb-3 leading-tight">
              Your AI Interview <span className="gradient-text">Report</span>
            </h1>

            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-4">
              <span className="badge-domain">{domain}</span>
              <span className={`badge ${difficulty === 'Easy' ? 'badge-easy' : difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`}>
                {difficulty}
              </span>
              <span className="flex items-center gap-1 text-white/40 text-xs">
                <Calendar size={11} /> {date}
              </span>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: 'Score',      value: `${score}/100`,            icon: BarChart3, color: 'text-brand-400' },
                { label: 'Strengths',  value: strengths.length,          icon: CheckCircle2, color: 'text-emerald-400' },
                { label: 'Suggestions',value: suggestions.length,        icon: Lightbulb, color: 'text-amber-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white/4 rounded-xl p-3 text-center">
                  <Icon size={14} className={`${color} mx-auto mb-1`} />
                  <div className={`font-bold ${color}`}>{value}</div>
                  <div className="text-white/30 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Strengths / Weaknesses / Suggestions ── */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 border border-emerald-500/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white">Strengths</h3>
          </div>
          {strengths.length > 0
            ? <ChipList items={strengths} color="text-emerald-400" />
            : <p className="text-white/30 text-sm">No specific strengths noted.</p>
          }
        </motion.div>

        {/* Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 border border-red-500/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/20 flex items-center justify-center">
              <XCircle size={16} className="text-red-400" />
            </div>
            <h3 className="font-semibold text-white">Weaknesses</h3>
          </div>
          {weaknesses.length > 0
            ? <ChipList items={weaknesses} color="text-red-400" />
            : <p className="text-white/30 text-sm">No major weaknesses noted.</p>
          }
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 border border-amber-500/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/20 flex items-center justify-center">
              <Lightbulb size={16} className="text-amber-400" />
            </div>
            <h3 className="font-semibold text-white">Suggestions</h3>
          </div>
          {suggestions.length > 0
            ? <ChipList items={suggestions} color="text-amber-400" />
            : <p className="text-white/30 text-sm">No specific suggestions.</p>
          }
        </motion.div>
      </div>

      {/* ── Q&A Review ── */}
      {feedback.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} className="text-brand-400" />
            <h2 className="text-lg font-bold text-white">Question-by-Question Review</h2>
          </div>
          <div className="space-y-3">
            {feedback.map((item, i) => (
              <FeedbackItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div>
          <h3 className="font-bold text-white mb-1">Ready for another round?</h3>
          <p className="text-white/40 text-sm">Practice makes perfect — take another interview!</p>
        </div>
        <Link to="/interview" className="btn-primary flex-shrink-0" id="try-again-btn">
          <Zap size={16} />
          New Interview
        </Link>
      </motion.div>
    </div>
  );
}
