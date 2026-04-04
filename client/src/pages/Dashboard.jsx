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
    const { api, user } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
                toast.error("Failed to sync production analytics.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [api]);

    // Chart Data Configs
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartLabels = analytics?.monthlySavings.map(d => months[d._id - 1]) || months.slice(0, 6);
    const savingsData = analytics?.monthlySavings.map(d => d.totalCo2Saved) || [120, 190, 300, 250, 420, 510];

    const areaChartData = {
        labels: chartLabels,
        datasets: [{
            label: 'CO2 Saved',
            data: savingsData,
            fill: true,
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
                gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)');
                return gradient;
            },
            borderColor: '#22c55e',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#22c55e',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
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

    if (isLoading) {
      return (
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 h-96 bg-slate-100 rounded-3xl" />
            <div className="h-96 bg-slate-100 rounded-3xl" />
          </div>
        </div>
      );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-10"
        >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Workspace Dashboard</h1>
                    <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                       <Calendar size={14} /> Tracking period: {months[new Date().getMonth()]} {new Date().getFullYear()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                   <button onClick={() => toast.success("Exporting report...")} className="btn-secondary py-2 px-4 text-xs">Export PDF</button>
                   <button className="btn-primary py-2 px-4 text-xs flex items-center gap-2">
                     <Zap size={14} /> New Activity
                   </button>
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
                  value="14 Days" 
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
                                <p className="text-xs text-slate-400">Net CO₂ displacement over time</p>
                            </div>
                            <div className="flex gap-2">
                               {['6M', '1Y', 'ALL'].map(t => (
                                 <button key={t} className={`px-3 py-1 rounded-md text-[10px] font-bold ${t === '6M' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}>{t}</button>
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
                                 x: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } },
                                 y: { grid: { color: '#f1f5f9' }, border: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } }
                               }
                             }} 
                           />
                        </div>
                    </div>

                    {/* Breakdown & Gamification */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="saas-card p-8 flex flex-col">
                           <h4 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                             Emissions Breakdown <Info size={14} className="text-slate-300" />
                           </h4>
                           <div className="flex-1 flex items-center justify-center relative">
                               <div className="w-48 h-48">
                                  <Doughnut data={doughnutData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
                               </div>
                               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                  <span className="text-2xl font-black text-slate-900">45%</span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase">Transport</span>
                               </div>
                           </div>
                           <div className="grid grid-cols-3 gap-2 mt-8">
                               {['Transport', 'Food', 'Energy'].map((l, i) => (
                                 <div key={l} className="text-center">
                                    <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${i===0 ? 'bg-green-500' : i===1 ? 'bg-slate-900' : 'bg-slate-200'}`} />
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">{l}</p>
                                 </div>
                               ))}
                           </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group">
                           <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-green-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                           <h4 className="text-xs font-black uppercase tracking-widest text-green-400 mb-6 flex items-center gap-2">
                             <TrendingUp size={14} /> Weekly Objective
                           </h4>
                           <h3 className="text-2xl font-bold mb-2">Reduce Energy by 15%</h3>
                           <p className="text-sm text-slate-400 mb-8 font-medium">You are currently at 8% reduction this week. Unplug unused devices to meet your goal!</p>
                           <div className="space-y-3">
                              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                 <span>Progress</span>
                                 <span className="text-green-500">8% / 15%</span>
                              </div>
                              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: '53%' }}
                                   className="h-full bg-green-500"
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
                           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic group-hover:scale-110">Global Elite</h3>
                           <Link to="/leaderboard" className="p-1 px-2.5 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                             View All <ChevronRight size={10} />
                           </Link>
                        </div>
                        <div className="space-y-4">
                           {leaderboard.map((u, i) => (
                             <div key={u._id} className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-400'}`}>
                                  {i+1}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <p className="text-xs font-bold text-slate-900 truncate">{u.username}</p>
                                   <div className="w-full h-1 bg-slate-50 rounded-full mt-1 overflow-hidden">
                                      <div className="h-full bg-green-500 opacity-50" style={{ width: `${(u.points/leaderboard[0].points)*100}%` }} />
                                   </div>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500">{u.points} pts</p>
                             </div>
                           ))}
                        </div>
                    </div>

                    {/* AI Insight Card */}
                    <div className="saas-card p-6 bg-green-50 border-green-100/50">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                              <Sparkles size={16} />
                           </div>
                           <h3 className="text-sm font-bold text-green-900">AI Optimization Tip</h3>
                        </div>
                        <p className="text-xs text-green-800 font-medium leading-relaxed mb-4">
                           Based on your data, switching to carpooling on Thursdays could reduce your weekly output by <span className="font-bold underline">12kg CO₂</span>.
                        </p>
                        <button className="text-[10px] font-bold text-green-700 uppercase tracking-widest flex items-center gap-1 hover:underline">
                           Learn more <ArrowUpRight size={10} />
                        </button>
                    </div>

                    {/* Quick Community / Social */}
                    <div className="saas-card p-6 bg-slate-50 border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 italic">Recent Community Activity</h3>
                        <div className="space-y-4">
                            {[1,2].map(i => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100" />
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-900 leading-tight">Sarah J. <span className="text-slate-400 font-medium italic">planted 2 trees in Amazonian project.</span></p>
                                        <p className="text-[10px] text-slate-400 mt-1">2h ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Chat Button */}
            <div className="fixed bottom-8 right-8 z-50">
               <motion.button 
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={() => toast("AI Support Coming Soon!")}
                 className="w-14 h-14 bg-green-500 text-white rounded-2xl shadow-2xl shadow-green-500/40 flex items-center justify-center hover:bg-green-600 transition-colors"
               >
                 <MessageSquare size={24} />
               </motion.button>
            </div>
        </motion.div>
    );
};

export default Dashboard;
