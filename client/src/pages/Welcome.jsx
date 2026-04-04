import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, Award, BarChart3, ShieldCheck, Mail, Lock, User, 
  ArrowRight, ChevronRight, Check, Zap, Smartphone, 
  Target, Globe, BarChart, Sparkles, X, Menu, Play, PlayCircle, Star, Users, TrendingUp, Quote
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const Welcome = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    
    const { login, signup, token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) navigate('/');
    }, [token, navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success('Access Restored.');
            } else {
                await signup(formData.username, formData.email, formData.password);
                toast.success('Membership Initialized.');
            }
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Authentication sequence failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        { label: 'Active Savers', value: '142k+', icon: <Users size={18} /> },
        { label: 'CO2 Displaced', value: '3.8M kg', icon: <TrendingUp size={18} /> },
        { label: 'Verified Offset', value: '100%', icon: <ShieldCheck size={18} /> },
    ];

    const testimonials = [
        { name: 'Sarah Jenkins', role: 'Architect', text: "EcoTrack transformed how I think about project footprints. The AI tips are incredibly specific." },
        { name: 'Marcus Chen', role: 'Sustainability Lead', text: "The most professional tracking interface we've tested. Beautiful, fast, and data-dense." },
        { name: 'Elena Rossi', role: 'Nature Advocate', text: "Seeing my daily savings visualised keeps me motivated every single morning." },
    ];

    return (
        <div className="min-h-screen bg-white selection:bg-green-100">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-50">
                <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-green-400">
                            <Leaf size={24} />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900">EcoTrack</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <div className="flex gap-8">
                           {['Product', 'Intelligence', 'Pricing'].map(item => (
                               <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">{item}</a>
                           ))}
                        </div>
                        <div className="h-4 w-[1px] bg-slate-100" />
                        <button onClick={() => { setIsLogin(true); setIsModalOpen(true); }} className="text-xs font-black uppercase tracking-widest text-slate-900">Access</button>
                        <button onClick={() => { setIsLogin(false); setIsModalOpen(true); }} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95">Enroll</button>
                    </div>
                </div>
            </nav>

            {/* Hero Alpha */}
            <section className="pt-52 pb-32 px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center relative">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-[10px] font-black text-green-700 uppercase tracking-[0.2em] mb-12"
                        >
                           <Sparkles size={12} /> System Update: Season 02 Active
                        </motion.div>
                        
                        <motion.h1 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-10"
                        >
                           Measure. Master.<br />
                           Live <span className="text-green-500">Cleaner.</span>
                        </motion.h1>
                        
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium mb-12 leading-relaxed"
                        >
                           The high-integrity platform for tracking verified carbon reduction. Join a global network of eco-operatives displacing millions of tons of CO2.
                        </motion.p>

                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                           <button onClick={() => { setIsLogin(false); setIsModalOpen(true); }} className="btn-primary py-5 px-10 text-xs w-full sm:w-auto shadow-2xl shadow-green-500/20">Initiate Profile</button>
                           <button onClick={() => setIsVideoOpen(true)} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-900 group">
                              <span className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50 transition-colors"><Play size={14} fill="currentColor" /></span>
                              Watch Demo
                           </button>
                        </motion.div>
                    </div>

                    {/* Immersive UI Preview */}
                    <motion.div 
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="mt-32 relative max-w-6xl mx-auto"
                    >
                        <div className="absolute inset-0 bg-green-500/10 blur-[120px] rounded-full scale-90" />
                        <div className="saas-card p-0 bg-slate-900/5 overflow-hidden border-slate-100 shadow-2xl relative group cursor-crosshair">
                           <img src="/dashboard_preview.png" alt="SaaS UI" className="w-full opacity-0 pointer-events-none" onLoad={(e) => e.target.className = "w-full transition-opacity duration-1000 opacity-100"} />
                           <div className="absolute inset-0 border-[12px] border-white/50 rounded-2xl pointer-events-none" />
                           <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Impact Counters */}
            <section className="py-24 bg-slate-900 text-white px-8">
               <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                     {stats.map((s, i) => (
                        <div key={i} className="space-y-4">
                           <div className="w-12 h-12 bg-white/10 rounded-xl mx-auto flex items-center justify-center text-green-400">{s.icon}</div>
                           <p className="text-4xl font-black tracking-tighter">{s.value}</p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* How it Intelligence */}
            <section id="intelligence" className="py-32 px-8">
               <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <div>
                     <h2 className="text-xs font-black uppercase tracking-[0.3em] text-green-500 mb-6">Autonomous Insight</h2>
                     <h3 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight mb-8">Verification. Not Speculation.</h3>
                     <p className="text-slate-500 font-medium mb-10 leading-relaxed">Our AI engine doesn't just guess your footprint. It cross-references verified global emission standards to deliver displacement data you can trust.</p>
                     
                     <div className="space-y-6">
                        {[
                           { t: 'Multi-Node Data Sync', d: 'Connect various endpoints for a unified view.' },
                           { t: 'Behavioral Rewiring', d: 'Personalized prompts tailored to your lifestyle.' },
                           { t: 'Impact Certification', d: 'Export verified reduction reports for season audits.' }
                        ].map((m, i) => (
                           <div key={i} className="flex gap-4">
                              <div className="mt-1 w-5 h-5 rounded bg-green-500 text-white flex items-center justify-center shrink-0"><Check size={12} strokeWidth={4} /></div>
                              <div>
                                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{m.t}</p>
                                 <p className="text-xs text-slate-400 font-medium">{m.d}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="relative">
                     <div className="saas-card aspect-square bg-slate-50 border-slate-100 flex items-center justify-center group overflow-hidden">
                        <img src="/hero_lifestyle.png" alt="Lifestyle" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent" />
                        <div className="relative p-10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white text-center">
                           <Globe className="mx-auto mb-4" />
                           <p className="text-sm font-black tracking-widest uppercase">Global Verified Status</p>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 bg-slate-50 px-8">
               <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-20">
                     <h2 className="text-3xl font-black text-slate-900 tracking-tight">The EcoTrack Community</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {testimonials.map((t, i) => (
                        <div key={i} className="saas-card bg-white p-10 flex flex-col items-start text-left border-slate-100">
                           <Quote className="text-green-500 mb-6 opacity-20" size={32} />
                           <p className="text-slate-600 font-medium mb-8 leading-relaxed italic">"{t.text}"</p>
                           <div className="mt-auto flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-black uppercase text-xs">{t.name[0]}</div>
                              <div>
                                 <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{t.name}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">{t.role}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Footer */}
            <footer className="py-24 border-t border-slate-100 bg-white px-8">
               <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-green-400">
                        <Leaf size={18} />
                     </div>
                     <span className="text-lg font-black tracking-tighter text-slate-900">EcoTrack</span>
                  </div>
                  <div className="flex gap-10">
                     <a href="#" className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 tracking-widest">Privacy</a>
                     <a href="#" className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 tracking-widest">GitHub</a>
                     <a href="#" className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 tracking-widest">Legal</a>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">© 2026 EcoTrack Sustainability Systems</p>
               </div>
            </footer>

            {/* Video Modal */}
            <AnimatePresence>
               {isVideoOpen && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 md:p-20">
                     <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" 
                        onClick={() => setIsVideoOpen(false)}
                     />
                     <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                     >
                        <button onClick={() => setIsVideoOpen(false)} className="absolute top-6 right-6 z-10 p-2 bg-white/10 text-white rounded-full hover:bg-white/20"><X size={20} /></button>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10 text-center">
                           <PlayCircle size={80} className="text-green-500 mb-6 animate-pulse" />
                           <h4 className="text-3xl font-black mb-2">Platform Demonstration</h4>
                           <p className="text-white/60 text-sm max-w-sm">Initializing encrypted video feed. Discover how EcoTrack synchronizes your sustainable lifestyle.</p>
                        </div>
                        <img src="/demo_video_thumb.png" alt="Demo" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" />
                     </motion.div>
                  </div>
               )}
            </AnimatePresence>

            {/* Auth Modal */}
            <AnimatePresence>
               {isModalOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                     <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative saas-card bg-white p-12 max-w-md w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)]">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900"><X size={20} /></button>
                        
                        <div className="text-center mb-10">
                           <div className="w-12 h-12 bg-slate-900 text-green-400 rounded-xl flex items-center justify-center mx-auto mb-6"><Leaf size={24} /></div>
                           <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{isLogin ? 'Access Portal' : 'Enroll Now'}</h2>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isLogin ? 'Authorized Entry Only' : 'Start Your Green Narrative'}</p>
                        </div>

                        <form onSubmit={handleAuthSubmit} className="space-y-6">
                           {!isLogin && (
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
                                 <input name="username" required type="text" value={formData.username} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-slate-900" placeholder="John Doe" />
                              </div>
                           )}
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terminal</label>
                              <input name="email" required type="email" value={formData.email} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-slate-900" placeholder="user@domain.ai" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Passkey</label>
                              <input name="password" required type="password" value={formData.password} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-slate-900" placeholder="••••••••" />
                           </div>
                           <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-xs h-14 flex items-center justify-center">
                              {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : (isLogin ? 'Initialize Session' : 'Create Credentials')}
                           </button>
                        </form>

                        <div className="mt-10 text-center pt-8 border-t border-slate-50">
                           <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">
                              {isLogin ? 'Request New Membership' : 'Existing Credentials Found?'}
                           </button>
                        </div>
                     </motion.div>
                  </div>
               )}
            </AnimatePresence>
        </div>
    );
};

export default Welcome;
