import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ArrowRight, Mail, Lock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back to the grid.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
      
      <div className="w-full max-w-md px-6 relative z-10">
        <div className="text-center mb-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <ShieldCheck size={12} /> Secure Auth Node
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Access EcoTrack</h1>
           <p className="text-slate-400 font-medium text-sm">Resuming sustainable contribution sequences.</p>
        </div>

        <div className="saas-card bg-white p-10 border-slate-700/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terminal</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input
                   type="email"
                   className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-green-500 transition-all outline-none text-slate-900 font-bold"
                   placeholder="operative@ecotrack.ai"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Passkey</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input
                   type="password"
                   className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-green-500 transition-all outline-none text-slate-900 font-bold"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                 />
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              type="submit" 
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 uppercase tracking-widest text-xs h-14"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Initialize Session <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
             <p className="text-sm font-bold text-slate-400">
               New operative? <Link to="/signup" className="text-green-600 hover:text-green-700 transition-colors">Apply for membership</Link>
             </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
           &copy; 2026 EcoTrack Systems &bull; High Integrity Mode Active
        </p>
      </div>
    </div>
  );
};

export default Login;
