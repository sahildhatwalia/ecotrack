import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Award, BarChart3, ShieldCheck, Mail, Lock, User, ArrowRight, ChevronRight } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Welcome = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.username, formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isLogin ? 'login' : 'sign up'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Leaf className="w-6 h-6 text-emerald-500" />, title: 'Track Your Impact', description: 'Log your daily eco-friendly activities and see your carbon footprint shrink.' },
    { icon: <Award className="w-6 h-6 text-amber-500" />, title: 'Earn Rewards', description: 'Get points for sustainable choices and redeem them for exclusive rewards.' },
    { icon: <BarChart3 className="w-6 h-6 text-blue-500" />, title: 'Real-time Analytics', description: 'Monitor your progress with beautiful, intuitive visualizations.' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fdfdfd] overflow-hidden perspective-container">
      {/* Left Side: Marketing/Hero */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-[#004d39] via-[#003d29] to-[#012a1d] text-white p-12 flex-col justify-between overflow-hidden">
        {/* Background Decorative Elements */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-400/30 rounded-full blur-[120px]"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 15, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[100px]"
        ></motion.div>
        
        {/* Floating Joyful Icons */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-[20%] right-[15%] text-emerald-300 opacity-20"><Leaf size={60} /></motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-[20%] left-[10%] text-emerald-200 opacity-20"><ShieldCheck size={80} /></motion.div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-12"
          >
            <div className="p-2 bg-emerald-500 rounded-xl">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">EcoTrack</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-6xl font-black leading-tight mb-6 tracking-tight">
              Let's Make Our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-100">Planet Smile!</span> 😊
            </h2>
            <p className="text-xl text-emerald-50/80 max-w-lg mb-12 leading-relaxed font-medium">
              Join the happiest community on Earth! Track your eco-acts, spread positivity, and watch your impact grow like a beautiful garden.
            </p>
          </motion.div>

          <div className="space-y-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-start gap-4 p-5 rounded-[2.5rem] bg-white/10 border border-white/20 backdrop-blur-md hover-3d cursor-default group"
              >
                <div className="p-3 bg-emerald-500 rounded-2xl shrink-0 shadow-lg group-hover:rotate-12 transition-transform">
                  {React.cloneElement(feature.icon, { className: "w-6 h-6 text-white" })}
                </div>
                <div>
                  <h3 className="font-extrabold text-xl mb-1">{feature.title}</h3>
                  <p className="text-emerald-50/70 text-sm font-medium">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="relative z-10 mt-12 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#003d29] bg-neutral-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="user" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-[#003d29] bg-emerald-500 flex items-center justify-center text-[10px] font-bold">
              +2k
            </div>
          </div>
          <p className="text-sm text-emerald-50/70">Users joined this week</p>
        </motion.div>
        
        {/* Hero Illustration Placeholder - Using generated image */}
        <div className="absolute bottom-0 right-0 w-full h-1/3 opacity-20 pointer-events-none overflow-hidden">
           <img src="/hero.png" alt="sustainable life" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-[#f8fbfa] relative overflow-hidden">
        {/* Mobile Header and Hero */}
        <div className="md:hidden flex flex-col gap-8 mb-10 w-full max-w-md">
          <div className="flex items-center gap-2 self-start">
            <div className="p-2 bg-emerald-500 rounded-xl">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#003d29]">EcoTrack</h1>
          </div>
          
          <div className="bg-[#003d29] p-8 rounded-[2rem] text-white overflow-hidden relative">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-emerald-400/20 rounded-full blur-[40px]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold leading-tight mb-4 text-emerald-400">
                Small Steps, <br/>Big Impact.
              </h2>
              <p className="text-emerald-50/70 text-sm leading-relaxed mb-6">
                Join our mission to save the planet. Track your eco-actions, earn points, and make a real difference today.
              </p>
              
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                 <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-[#003d29] bg-neutral-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" />
                      </div>
                    ))}
                 </div>
                 <span className="text-[10px] font-bold text-emerald-50/80 tracking-widest uppercase">2k+ People Joined</span>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-500">
              {isLogin 
                ? 'Sign in to continue your sustainable journey' 
                : 'Start tracking your eco-impact today'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-neutral-100 p-8 relative overflow-hidden">
            {/* Tabs */}
            <div className="flex p-1 bg-neutral-100 rounded-xl mb-8">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLogin ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-6 text-sm flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="block w-full pl-10 pr-3 py-3 bg-neutral-50 border border-neutral-200 text-gray-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-neutral-50 border border-neutral-200 text-gray-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  {isLogin && <a href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-500">Forgot?</a>}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-neutral-50 border border-neutral-200 text-gray-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-neutral-100 text-center">
              <p className="text-sm text-gray-500">
                By continuing, you agree to EcoTrack's{' '}
                <a href="#" className="underline decoration-emerald-200 hover:text-emerald-600 transition-colors">Terms</a> and{' '}
                <a href="#" className="underline decoration-emerald-200 hover:text-emerald-600 transition-colors">Privacy Policy</a>.
              </p>
            </div>
          </div>
          
          <div className="mt-12 md:hidden">
             <div className="grid grid-cols-3 gap-4">
                 {features.map((f, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                        <div className="p-3 bg-emerald-100 rounded-full mb-2">
                           {React.cloneElement(f.icon, {className: "w-5 h-5 text-emerald-600"})}
                        </div>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">{f.title.split(' ')[0]}</span>
                    </div>
                 ))}
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
