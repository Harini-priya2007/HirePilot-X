import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, ChevronRight } from 'lucide-react';

const difficultyClass = {
  Easy:   'badge-easy',
  Medium: 'badge-medium',
  Hard:   'badge-hard',
};

/**
 * Card displayed in Dashboard history and History page.
 */
export default function InterviewCard({ interview, index = 0 }) {
  const score = interview?.evaluation?.score ?? 0;
  const date  = new Date(interview.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const scoreColor =
    score >= 75 ? 'text-emerald-400' :
    score >= 50 ? 'text-amber-400'   :
                  'text-red-400';

  const scoreBg =
    score >= 75 ? 'bg-emerald-500/10 border-emerald-500/20' :
    score >= 50 ? 'bg-amber-500/10 border-amber-500/20'     :
                  'bg-red-500/10 border-red-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      <Link
        to={`/interview/${interview._id}/report`}
        className="glass-card-hover flex items-center justify-between p-4 gap-4 group"
      >
        {/* Left — domain + date */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Score ring (mini) */}
          <div className={`flex-shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-sm ${scoreBg} ${scoreColor}`}>
            {score}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="badge-domain">{interview.domain}</span>
              <span className={difficultyClass[interview.difficulty]}>{interview.difficulty}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <Calendar size={11} />
              {date}
            </div>
          </div>
        </div>

        {/* Right — score + arrow */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <div className={`text-lg font-bold ${scoreColor}`}>{score}<span className="text-xs font-normal text-white/40">/100</span></div>
            <div className="text-xs text-white/40 flex items-center gap-1 justify-end">
              <Trophy size={10} /> Score
            </div>
          </div>
          <ChevronRight size={16} className="text-white/20 group-hover:text-brand-400 transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}
