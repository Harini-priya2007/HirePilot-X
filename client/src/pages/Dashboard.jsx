import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import InterviewCard from '../components/InterviewCard';
import { Zap, Trophy, BarChart3, Clock, ArrowRight, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/users/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const firstName = data?.user?.name?.split(' ')[0]
    || user?.displayName?.split(' ')[0]
    || 'there';

  const stats = [
    {
      id: 'total-interviews',
      label: 'Interviews Done',
      value: data?.stats?.totalInterviews ?? 0,
      icon: Clock,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10 border-brand-500/20',
      suffix: '',
    },
    {
      id: 'average-score',
      label: 'Average Score',
      value: data?.stats?.averageScore ?? 0,
      icon: BarChart3,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      suffix: '/100',
    },
    {
      id: 'best-score',
      label: 'Best Score',
      value: data?.recentInterviews?.length
        ? Math.max(...(data.recentInterviews.map((i) => i.evaluation?.score ?? 0)))
        : 0,
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      suffix: '/100',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* ── Hero greeting ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden glass-card p-8 md:p-10"
      >
        {/* Background glow */}
        <div className="orb w-64 h-64 bg-brand-500 -top-20 -right-20 opacity-15" />
        <div className="orb w-48 h-48 bg-violet-500 bottom-0 left-1/2 opacity-10" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="section-label mb-2">Welcome back 👋</p>
            {loading ? (
              <div className="h-10 w-64 bg-white/5 rounded-xl animate-pulse mb-3" />
            ) : (
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Hello, <span className="gradient-text">{firstName}!</span>
              </h1>
            )}
            <p className="text-white/50 text-sm max-w-md">
              {data?.stats?.totalInterviews === 0
                ? "You haven't done any interviews yet. Start your first one now!"
                : `You've completed ${data?.stats?.totalInterviews} interview${data?.stats?.totalInterviews > 1 ? 's' : ''}. Keep up the great work!`}
            </p>
          </div>

          <Link
            to="/interview"
            id="start-interview-btn"
            className="btn-primary text-base px-8 py-4 flex-shrink-0 group"
          >
            <Zap size={18} className="group-hover:animate-pulse" />
            Start Interview
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            id={stat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={`glass-card p-6 border ${stat.bg}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} border flex items-center justify-center`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              {loading && (
                <div className="h-8 w-12 bg-white/5 rounded-lg animate-pulse" />
              )}
            </div>
            {!loading && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08, type: 'spring' }}
              >
                <div className={`text-3xl font-black ${stat.color} mb-1`}>
                  {stat.value}<span className="text-sm font-normal text-white/30">{stat.suffix}</span>
                </div>
              </motion.div>
            )}
            <p className="text-white/50 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Recent Interviews ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-400" />
            <h2 className="text-lg font-bold text-white">Recent Interviews</h2>
          </div>
          {data?.recentInterviews?.length > 0 && (
            <Link to="/interview" className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
              New Interview <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card h-20 animate-pulse" />
            ))}
          </div>
        ) : data?.recentInterviews?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-white font-semibold mb-2">No interviews yet</h3>
            <p className="text-white/40 text-sm mb-6">
              Take your first AI-powered mock interview and get instant feedback.
            </p>
            <Link to="/interview" className="btn-primary">
              <Zap size={16} />
              Start Now
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {data.recentInterviews.map((interview, i) => (
              <InterviewCard key={interview._id} interview={interview} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
