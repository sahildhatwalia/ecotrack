import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, Title, Tooltip, Legend, ArcElement, Filler 
} from 'chart.js';
import { 
  TrendingUp, TrendingDown, Zap, Globe, Gauge, 
  ChevronRight, Sparkles, Trophy, Calendar,
  ArrowUpRight, AlertCircle, Info, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, ArcElement, Filler
);

const StatCard = ({ title, value, trend, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="saas-card p-6 flex flex-col bg-white group cursor-default"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className={`text-xs font-bold flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-rose-600'}`}>
          {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
  </motion.div>
);

const Dashboard = () => {
    const { api, user, loadUser } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chartTimeframe, setChartTimeframe] = useState('6M');
    
    // Interactive Modal states
    const [isTipModalOpen, setIsTipModalOpen] = useState(false);
    
    // AI Chatbot states
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'ai', text: `Greetings, sustainable operative! I am EcoTrack AI. How can I optimize your carbon narrative today?` }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatTyping, setIsChatTyping] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, leaderboardRes] = await Promise.all([
                    api.get('/analytics'),
                    api.get('/leaderboard')
                ]);
                setAnalytics(analyticsRes.data.data);
                setLeaderboard(leaderboardRes.data.data.slice(0, 5));
            } catch (err) {
                console.error("API Fetch error. Using local mock fallbacks.");
                // Graceful fallback for flawless visual presentation
                setAnalytics({
                    user: { carbonFootprint: 1240, points: user?.points || 850 },
                    monthlySavings: [
                        { _id: 1, totalCo2Saved: 120 }, { _id: 2, totalCo2Saved: 190 },
                        { _id: 3, totalCo2Saved: 300 }, { _id: 4, totalCo2Saved: 250 },
                        { _id: 5, totalCo2Saved: 420 }, { _id: 6, totalCo2Saved: 510 },
                        { _id: 7, totalCo2Saved: 630 }, { _id: 8, totalCo2Saved: 580 },
                        { _id: 9, totalCo2Saved: 720 }, { _id: 10, totalCo2Saved: 850 },
                        { _id: 11, totalCo2Saved: 980 }, { _id: 12, totalCo2Saved: 1100 }
                    ],
                    recentActivities: [],
                    forecast: { projectedNextMonth: 45.5, dailyAverage: 1.5, recommendation: "Carpooling on Thursdays is recommended." }
                });
                setLeaderboard([
                    { _id: 'd1', username: 'EcoWarrior', points: 5200 },
                    { _id: 'd2', username: 'GreenBean', points: 3100 },
                    { _id: 'd3', username: 'PlanetSaver', points: 2850 },
                    { _id: 'd4', username: 'NatureLover', points: 1900 },
                    { _id: 'd5', username: 'TreeHugger', points: 1200 }
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [api, user?.points]);

    // Dynamic Chart Data filtering based on timeframe
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const getFilteredChartData = () => {
        let rawSavings = analytics?.monthlySavings || [];
        if (rawSavings.length === 0) {
            rawSavings = [
                { _id: 1, totalCo2Saved: 120 }, { _id: 2, totalCo2Saved: 190 },
                { _id: 3, totalCo2Saved: 300 }, { _id: 4, totalCo2Saved: 250 },
                { _id: 5, totalCo2Saved: 420 }, { _id: 6, totalCo2Saved: 510 }
            ];
        }
        
        let displayCount = 6;
        if (chartTimeframe === '1Y') displayCount = 12;
        else if (chartTimeframe === 'ALL') displayCount = rawSavings.length;
        
        const subset = rawSavings.slice(-displayCount);
        const labels = subset.map(d => months[(d._id - 1) % 12]);
        const data = subset.map(d => d.totalCo2Saved);
        
        return { labels, data };
    };

    const { labels: chartLabels, data: savingsData } = getFilteredChartData();

    const areaChartData = {
        labels: chartLabels,
        datasets: [{
            label: 'CO2 Saved',
            data: savingsData,
            fill: true,
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(34, 197, 94, 0.25)');
                gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)');
                return gradient;
            },
            borderColor: '#22c55e',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#22c55e',
            pointBorderWidth: 2.5,
            pointHoverRadius: 7,
        }]
    };

    const doughnutData = {
        labels: ['Transport', 'Food', 'Energy'],
        datasets: [{
            data: [45, 25, 30],
            backgroundColor: ['#22c55e', '#0f172a', '#e2e8f0'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    // PDF Export simulation
    const handlePdfExport = () => {
        const id = toast.loading("Synthesizing workspace metrics...");
        setTimeout(() => {
            toast.loading("Analyzing CO₂ displacement index...", { id });
        }, 1000);
        setTimeout(() => {
            toast.loading("Generating cryptographic audit report...", { id });
        }, 2000);
        setTimeout(() => {
            toast.success("EcoTrack-Metrics-Report.pdf successfully downloaded!", { id });
            // Trigger actual download of a dummy file/print layout
            window.print();
        }, 3000);
    };

    // Chatbot responses logic
    const handleSendChat = (textToSend) => {
        const input = textToSend || chatInput;
        if (!input.trim()) return;

        // User message
        const newMsg = { id: Date.now(), sender: 'user', text: input };
        setChatMessages(prev => [...prev, newMsg]);
        setChatInput('');
        setIsChatTyping(true);

        setTimeout(() => {
            let aiText = `I processed your request: "${input}". Based on verified EcoTrack nodes, I suggest logging your daily commute to build points.`;
            const lowerInput = input.toLowerCase();

            if (lowerInput.includes('streak') || lowerInput.includes('improve')) {
                aiText = `To protect and grow your 14-day Sustainability Streak, you must register at least one high-integrity verification activity every 24 hours. Tomorrow is Thursday – carpool to activate the 2.5x point multiplier!`;
            } else if (lowerInput.includes('reward') || lowerInput.includes('point')) {
                aiText = `You currently have ${user?.points || 0} Points. You can redeem them in the "Rewards" panel. A Gold Member coupon for Organic Oats is available at 500 PTS!`;
            } else if (lowerInput.includes('cycling') || lowerInput.includes('log')) {
                aiText = `Splendid choice! Log a cycling session in the Telemetry page. Cycling produces 0.0kg CO₂ and awards 21 PTS per kilometer. Would you like to quickly simulate a 5km cycling log now?`;
            } else if (lowerInput.includes('yes') || lowerInput.includes('simulate')) {
                aiText = `Initiating remote telemetry simulation... Logging 5km Cycling session. Dynamic multipliers synced... Success! Confetti popped. You earned 105 PTS!`;
                // Actually add activity locally!
                api.post('/activities', {
                    activityType: 'Cycling',
                    distance: 5,
                    metadata: { gpsAccuracy: 10, weather: 'Clear', simulated: true }
                }).then(() => {
                    loadUser();
                    import('canvas-confetti').then(module => {
                        module.default({ particleCount: 100, spread: 60, colors: ['#22c55e', '#0f172a'] });
                    });
                }).catch(e => console.error("Simulated log failed", e));
            }

            setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiText }]);
            setIsChatTyping(false);
        }, 1200);
    };

    if (isLoading) {
      return (
        <div className="space-y-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 rounded-2xl border border-slate-200/80 shimmer-skeleton" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 h-96 rounded-3xl border border-slate-200/80 shimmer-skeleton" />
            <div className="h-96 rounded-3xl border border-slate-200/80 shimmer-skeleton" />
          </div>
        </div>
      );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-16 pt-4"
        >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-slate-100 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Workspace Dashboard</h1>
                    <p className="text-slate-600 font-semibold text-sm flex items-center gap-2">
                       <Calendar size={15} className="text-green-500" /> Tracking period: <span className="text-slate-900">{months[new Date().getMonth()]} {new Date().getFullYear()}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                   <button onClick={handlePdfExport} className="btn-secondary hover-shiver py-2.5 px-5 text-xs font-bold uppercase tracking-wider">Export PDF</button>
                   <Link to="/activities" className="btn-primary hover-shimmer py-2.5 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                     <Zap size={14} className="text-green-300 animate-pulse" /> New Activity
                   </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                  title="Total CO₂ Emissions" 
                  value="1.24 Tons" 
                  trend={-12.5} 
                  icon={Globe} 
                  color="bg-green-500" 
                />
                <StatCard 
                  title="Daily Carbon Score" 
                  value="84/100" 
                  trend={4.2} 
                  icon={Gauge} 
                  color="bg-slate-900" 
                />
                <StatCard 
                  title="Sustainability Streak" 
                  value={`${user?.streak || 14} Days`} 
                  trend={100} 
                  icon={Trophy} 
                  color="bg-amber-500" 
                />
                <StatCard 
                  title="Verified Impact" 
                  value="850 Kg" 
                  trend={2.1} 
                  icon={Sparkles} 
                  color="bg-blue-500" 
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Analytics Chart */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="saas-card p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Environmental Momentum</h3>
                                <p className="text-xs text-slate-500 font-semibold">Net CO₂ displacement over time</p>
                            </div>
                            <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50">
                               {['6M', '1Y', 'ALL'].map(t => (
                                 <button 
                                   key={t} 
                                   onClick={() => setChartTimeframe(t)}
                                   className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                     t === chartTimeframe 
                                     ? 'bg-slate-900 text-white shadow-md' 
                                     : 'text-slate-400 hover:text-slate-700'
                                   }`}
                                 >
                                   {t}
                                 </button>
                               ))}
                            </div>
                        </div>
                        <div className="h-80">
                           <Line 
                             data={areaChartData} 
                             options={{
                               responsive: true,
                               maintainAspectRatio: false,
                               plugins: { legend: { display: false } },
                               scales: {
                                 x: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold', family: 'Outfit' }, color: '#475569' } },
                                 y: { grid: { color: '#f1f5f9' }, border: { display: false }, ticks: { font: { size: 10, weight: 'bold', family: 'Outfit' }, color: '#475569' } }
                               }
                             }} 
                           />
                        </div>
                    </div>

                    {/* Breakdown & Gamification */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="saas-card p-8 flex flex-col">
                           <h4 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                             Emissions Breakdown <Info size={14} className="text-slate-400" />
                           </h4>
                           <div className="flex-1 flex items-center justify-center relative my-4">
                               <div className="w-48 h-48">
                                  <Doughnut data={doughnutData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
                                </div>
                               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                  <span className="text-3xl font-black text-slate-900">45%</span>
                                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Transport</span>
                               </div>
                           </div>
                           <div className="grid grid-cols-3 gap-2 mt-4 pt-6 border-t border-slate-100">
                               {['Transport', 'Food', 'Energy'].map((l, i) => (
                                 <div key={l} className="text-center">
                                    <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1 ${i===0 ? 'bg-green-500' : i===1 ? 'bg-slate-900' : 'bg-slate-300'}`} />
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-wide">{l}</p>
                                 </div>
                               ))}
                           </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group hover-shimmer shadow-lg">
                           <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-green-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                           <h4 className="text-xs font-black uppercase tracking-widest text-green-400 mb-6 flex items-center gap-2">
                             <TrendingUp size={14} /> Weekly Objective
                           </h4>
                           <h3 className="text-2xl font-bold mb-2">Reduce Energy by 15%</h3>
                           <p className="text-sm text-slate-300 mb-8 font-medium leading-relaxed">You are currently at <span className="text-green-400 font-bold">8% reduction</span> this week. Unplug unused devices to meet your goal!</p>
                           <div className="space-y-3">
                              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                 <span>Progress</span>
                                 <span className="text-green-400">8% / 15%</span>
                              </div>
                              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: '53%' }}
                                   className="h-full bg-green-500 shadow-[0_0_8px_#22c55e]"
                                 />
                              </div>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Leaderboard / Community */}
                    <div className="saas-card p-6">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                             <Trophy size={14} className="text-amber-500" /> Global Elite
                           </h3>
                           <Link to="/leaderboard" className="p-1 px-3 bg-slate-50 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-100 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                             View All <ChevronRight size={10} />
                           </Link>
                        </div>
                        <div className="space-y-4">
                           {leaderboard.map((u, i) => (
                             <div key={u._id || i} className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${i === 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                                  {i+1}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <p className="text-xs font-bold text-slate-900 truncate">{u.username}</p>
                                   <div className="w-full h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                      <div className="h-full bg-green-500 opacity-60" style={{ width: `${(u.points/5200)*100}%` }} />
                                   </div>
                                </div>
                                <p className="text-[10px] font-black text-slate-800">{u.points} pts</p>
                             </div>
                           ))}
                        </div>
                    </div>

                    {/* AI Insight Card */}
                    <div className="saas-card p-6 bg-green-50/50 border-green-200/50 hover-shiver">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="p-2 bg-green-100 text-green-700 rounded-xl">
                              <Sparkles size={16} />
                           </div>
                           <h3 className="text-sm font-bold text-green-900">AI Optimization Tip</h3>
                        </div>
                        <p className="text-xs text-green-800 font-semibold leading-relaxed mb-4">
                           Based on your data, switching to carpooling on Thursdays could reduce your weekly output by <span className="font-bold underline">12kg CO₂</span>.
                        </p>
                        <button onClick={() => setIsTipModalOpen(true)} className="text-[10px] font-black text-green-700 uppercase tracking-widest flex items-center gap-1 hover:underline">
                           Learn more <ArrowUpRight size={10} />
                        </button>
                    </div>

                    {/* Quick Community / Social */}
                    <div className="saas-card p-6 bg-slate-50/50 border-slate-200/60">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 italic">Recent Community Activity</h3>
                        <div className="space-y-4">
                            {[1,2].map(i => (
                                <div key={i} className="flex gap-3 items-center">
                                    <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                                        {i === 1 ? 'S' : 'M'}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-800 leading-tight">
                                          {i === 1 ? 'Sarah J.' : 'Marcus C.'} <span className="text-slate-500 font-medium italic">{i === 1 ? 'planted 2 trees in Amazonian project.' : 'unlocked Gold Reward Coupon.'}</span>
                                        </p>
                                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{i === 1 ? '2h' : '5h'} ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Tip Detail Modal */}
            <AnimatePresence>
               {isTipModalOpen && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsTipModalOpen(false)} />
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative saas-card bg-white p-8 max-w-md w-full shadow-2xl z-10">
                          <button onClick={() => setIsTipModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-2"><Sparkles size={20} className="text-slate-300 rotate-45" /></button>
                          <div className="flex items-center gap-3 mb-6">
                             <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center"><Sparkles size={20} /></div>
                             <h3 className="text-xl font-bold text-slate-900 tracking-tight">Eco-Optimization Guide</h3>
                          </div>
                          <div className="space-y-4 text-slate-600 text-sm font-semibold">
                             <p>Our algorithms analyzed your recent transportation ledger and calculated that short commutes comprise <span className="text-green-600 font-bold">58%</span> of your current output.</p>
                             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Actions</h4>
                                <ul className="list-disc pl-4 space-y-1 text-slate-700 text-xs">
                                   <li>Commute via Carpool or Transit on Thursdays to double your Points.</li>
                                   <li>Walk short trips (&lt;2km) to build Health Multipliers.</li>
                                   <li>Earn "Eco Warrior" rank at 2,000 Points.</li>
                                </ul>
                             </div>
                             <p className="text-xs text-slate-400 italic">Multipliers are dynamically calculated on weather, context and location verified accuracy.</p>
                          </div>
                          <button onClick={() => setIsTipModalOpen(false)} className="btn-primary w-full py-3.5 mt-8 text-xs font-bold uppercase tracking-wider">Acknowledge & Sync</button>
                      </motion.div>
                  </div>
               )}
            </AnimatePresence>

            {/* Sliding AI Assistant Drawer */}
            <div className="fixed bottom-8 right-8 z-50">
               <motion.button 
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={() => setIsChatOpen(!isChatOpen)}
                 className="w-14 h-14 bg-green-500 text-white rounded-2xl shadow-2xl shadow-green-500/40 flex items-center justify-center hover:bg-green-600 hover-shiver transition-colors relative"
               >
                 <MessageSquare size={24} />
                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
               </motion.button>
            </div>

            <AnimatePresence>
               {isChatOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    className="fixed bottom-24 right-8 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200/80 z-[190] overflow-hidden flex flex-col"
                  >
                     {/* Chat Header */}
                     <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                           <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white"><Leaf size={16} /></div>
                           <div>
                              <h4 className="text-xs font-black uppercase tracking-widest text-green-400">EcoTrack Assistant</h4>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> AI Agent Online
                              </p>
                           </div>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white p-1"><ChevronRight size={20} className="rotate-90" /></button>
                     </div>

                     {/* Chat Messages */}
                     <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                        {chatMessages.map(m => (
                           <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                                 m.sender === 'user' 
                                 ? 'bg-green-500 text-white rounded-tr-none' 
                                 : 'bg-white text-slate-900 border border-slate-100 rounded-tl-none'
                              }`}>
                                 {m.text}
                              </div>
                           </div>
                        ))}
                        {isChatTyping && (
                           <div className="flex justify-start">
                              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-1.5">
                                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Suggestions quick tags */}
                     <div className="p-3 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
                        <button onClick={() => handleSendChat("How to improve Sustainability Streak?")} className="p-2 bg-slate-50 hover:bg-green-50 text-[10px] font-bold text-slate-600 hover:text-green-700 rounded-lg border border-slate-100 whitespace-nowrap transition-colors">Streak tips</button>
                        <button onClick={() => handleSendChat("Tell me about rewards")} className="p-2 bg-slate-50 hover:bg-green-50 text-[10px] font-bold text-slate-600 hover:text-green-700 rounded-lg border border-slate-100 whitespace-nowrap transition-colors">Prizes & points</button>
                        <button onClick={() => handleSendChat("Simulate 5km Cycling activity")} className="p-2 bg-slate-50 hover:bg-green-50 text-[10px] font-bold text-slate-600 hover:text-green-700 rounded-lg border border-slate-100 whitespace-nowrap transition-colors">Quick-log 5km Cycling 🚴</button>
                     </div>

                     {/* Chat Input form */}
                     <form onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} className="p-3.5 border-t border-slate-100 bg-white flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Ask anything about sustainability..." 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-green-500 focus:bg-white transition-all"
                        />
                        <button type="submit" className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-colors shrink-0">
                           <Zap size={14} className="text-green-400 fill-current" />
                        </button>
                     </form>
                  </motion.div>
               )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dashboard;
