import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Animated SVG score ring with counting number.
 * @param {number} score - 0 to 100
 * @param {number} size  - px size of the ring
 */
export default function ScoreCard({ score = 0, size = 180 }) {
  const radius       = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress     = (score / 100) * circumference;

  const color =
    score >= 75 ? '#10b981' :
    score >= 50 ? '#f59e0b' :
                  '#f43f5e';

  /* Counting animation using requestAnimationFrame — properly re-renders */
  const [displayScore, setDisplayScore] = useState(0);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || score === 0) return;

    const duration   = 1400;
    const startTime  = performance.now();

    const tick = (now) => {
      const elapsed  = now - startTime;
      const t        = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplayScore(Math.round(eased * score));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, score]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={12}
          />
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
          />
        </svg>

        {/* Center number — now uses real state so it matches the arc */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black" style={{ color }}>
            {displayScore}
          </span>
          <span className="text-white/40 text-xs font-medium mt-0.5">out of 100</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color }}>
          {score >= 75 ? '🌟 Excellent' : score >= 50 ? '👍 Good' : '📈 Keep Practicing'}
        </p>
      </div>
    </div>
  );
}
