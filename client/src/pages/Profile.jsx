import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  User, Building2, BookOpen, Target, Save, CheckCircle2, Loader2
} from 'lucide-react';

const fields = [
  { id: 'name',       label: 'Full Name',    icon: User,      type: 'text',  placeholder: 'e.g. Arjun Sharma' },
  { id: 'college',    label: 'College',      icon: Building2, type: 'text',  placeholder: 'e.g. IIT Madras' },
  { id: 'department', label: 'Department',   icon: BookOpen,  type: 'text',  placeholder: 'e.g. Computer Science' },
  { id: 'targetRole', label: 'Target Role',  icon: Target,    type: 'text',  placeholder: 'e.g. Frontend Developer' },
];

export default function Profile() {
  const { user } = useAuth();
  const [form,    setForm]    = useState({ name: '', college: '', department: '', targetRole: '' });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        const u   = res.data.user;
        setForm({
          name:       u.name       || '',
          college:    u.college    || '',
          department: u.department || '',
          targetRole: u.targetRole || '',
        });
      } catch (err) {
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required.');
    setSaving(true);
    try {
      await api.put('/users/profile', form);
      toast.success('Profile updated!');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="section-label mb-2">Account Settings</p>
        <h1 className="text-3xl font-black text-white">Your Profile</h1>
        <p className="text-white/50 text-sm mt-1">
          This info is used to personalise your interview experience.
        </p>
      </motion.div>

      {/* Avatar card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-6 mb-6 flex items-center gap-5"
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500/30" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-2xl font-black shadow-brand">
            {form.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <div>
          <p className="font-semibold text-white">{form.name || 'Add your name →'}</p>
          <p className="text-white/40 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            {form.college    && <span className="badge-domain text-xs">{form.college}</span>}
            {form.department && <span className="badge bg-violet-500/20 text-violet-400 border-violet-500/20 text-xs">{form.department}</span>}
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSave}
        className="glass-card p-6 space-y-5"
        id="profile-form"
      >
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          fields.map(({ id, label, icon: Icon, type, placeholder }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
            >
              <label htmlFor={`profile-${id}`} className="block text-sm font-medium text-white/70 mb-2">
                <span className="flex items-center gap-1.5">
                  <Icon size={14} className="text-brand-400" />
                  {label}
                </span>
              </label>
              <input
                id={`profile-${id}`}
                type={type}
                placeholder={placeholder}
                value={form[id]}
                onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                className="input-field"
              />
            </motion.div>
          ))
        )}

        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <button
              id="profile-save-btn"
              type="submit"
              disabled={saving}
              className={`btn-primary w-full py-3.5 transition-all ${saved ? 'from-emerald-500 to-emerald-600 shadow-none' : ''}`}
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : saved ? (
                <><CheckCircle2 size={18} /> Saved!</>
              ) : (
                <><Save size={18} /> Save Changes</>
              )}
            </button>
          </motion.div>
        )}
      </motion.form>
    </div>
  );
}
