import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Bell, User, MapPin, Navigation, TrendingUp, ShieldCheck, ShieldAlert, Cpu, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import AdBanner from '../components/AdBanner';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const Dashboard = () => {
    const { api, user } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState(null);
    const [weather, setWeather] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [chartFilter, setChartFilter] = useState('All');
    const [rewards, setRewards] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, leaderboardRes, rewardsRes] = await Promise.all([
                    api.get('/analytics'),
                    api.get('/leaderboard'),
                    api.get('/rewards')
                ]);
                setAnalytics(analyticsRes.data.data);
                setLeaderboard(leaderboardRes.data.data.slice(0, 5));
                setRewards(rewardsRes.data.data.slice(0, 3)); // Show top 3 rewards
            } catch (err) {
                console.error(err);
            }
        };

        const fetchWeather = () => {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const weatherRes = await api.get(`/weather?lat=${latitude}&lon=${longitude}`);
                    setWeather(weatherRes.data.data);
                } catch (err) {
                    console.error(err);
                }
            }, () => {
                console.error("Geolocation is not supported or permission denied.");
            });
        };

        fetchData();
        fetchWeather();
    }, [api]);

    // Data for Carbon Score Gauge
    const scoreVal = user?.carbonFootprint || 0;
    const maxScore = 150; 
    const gaugeData = {
        labels: ['Score', 'Remaining'],
        datasets: [{
            data: [scoreVal, maxScore - scoreVal > 0 ? maxScore - scoreVal : 0],
            backgroundColor: ['#10B981', '#E5E7EB'], // Emerald-500 and Gray-200
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
            cutout: '80%',
        }]
    };

    // Filter Logic for Mock Graph Data interactivity
    const getFilteredSavingsData = () => {
        const baseData = analytics?.monthlySavings.map(d => d.totalCo2Saved) || [50, 130, 80, 200, 140, 210, 180, 140, 250];
        if (chartFilter === 'All') return baseData;
        if (chartFilter === 'Walking') return baseData.map(v => v * 0.3); // mock lower share
        if (chartFilter === 'Cycling') return baseData.map(v => v * 0.4);
        if (chartFilter === 'Transport') return baseData.map(v => v * 0.2);
        return baseData;
    };

    // Data for Monthly Savings Area Chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const savingsData = getFilteredSavingsData();
    const chartLabels = analytics?.monthlySavings.map(d => months[d._id - 1] || `M${d._id}`) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

    const areaChartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Monthly CO2 Savings',
                data: savingsData,
                fill: true,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)'); // emerald-500 with opacity
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
                    return gradient;
                },
                borderColor: '#10B981', // emerald-500
                borderWidth: 2,
                tension: 0.4, // Smooth curves
                pointRadius: 0,
            },
        ],
    };

    const areaChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { grid: { display: false } },
            y: {
               grid: { color: '#F3F4F6', drawBorder: false }, // gray-100
               min: 0,
            }
        }
    };

    const trustScore = user?.trustScore || 0;
    const isHighTrust = trustScore >= 80;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full bg-[#f8fbfa]"
        >
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">System Overview</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Real-time Analytics Active</p>
                    </div>
                </div>
                
                {/* AI Trust Badge */}
                <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border ${isHighTrust ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'} shadow-sm transition-all hover:scale-105 group`}>
                    <div className={`p-1.5 rounded-lg ${isHighTrust ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}>
                        {isHighTrust ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">AI Trust Score</span>
                            <Cpu size={10} className="opacity-40 group-hover:rotate-180 transition-transform duration-500" />
                        </div>
                        <p className="text-sm font-black leading-none">{trustScore}% Verified</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column (Main Charts) */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                    {/* Top row in Left Column: Score & Recent */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Carbon Score Gauge Widget */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-neutral-100 flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <TrendingUp size={80} />
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-neutral-900 uppercase tracking-widest text-[10px] bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100">Performance Index</h3>
                                <span className="text-xs font-bold text-emerald-600">+12% vs last month</span>
                            </div>
                            <div className="relative flex-1 flex items-center justify-center min-h-[180px]">
                                <div className="absolute inset-0 flex items-end justify-center pb-4">
                                     <Doughnut data={gaugeData} options={{plugins: {legend: {display: false}, tooltip: {enabled: false}}, maintainAspectRatio: false }} />
                                </div>
                                <div className="absolute bottom-6 flex flex-col items-center">
                                    <span className="text-5xl font-black text-neutral-900 tracking-tighter">{scoreVal.toFixed(0)}</span>
                                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Kg CO2 Saved</span>
                                </div>
                            </div>
                            <div className="flex justify-between mt-4 px-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-neutral-300 uppercase">Target</span>
                                    <span className="text-sm font-black text-neutral-700">150 Kg</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-neutral-300 uppercase">Efficiency</span>
                                    <span className="text-sm font-black text-emerald-500">{((scoreVal/maxScore)*100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activities Widget */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-neutral-100">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-black text-neutral-900 uppercase tracking-widest text-[10px] bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100">Live Activity Feed</h3>
                                <Link to="/activities" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                            <div className="space-y-6">
                                {analytics?.recentActivities?.slice(0, 3).map((activity, idx) => (
                                    <div key={idx} className="flex items-center gap-5 group cursor-pointer">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${activity.activityType.toLowerCase().includes('walk') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-sky-50 text-sky-600 border border-sky-100'}`}>
                                            {activity.activityType.toLowerCase().includes('walk') ? <TrendingUp size={22} /> : <Navigation size={22} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm font-black text-neutral-800">{activity.activityType}</p>
                                                <span className="text-[10px] font-bold text-emerald-500">+{activity.points} pts</span>
                                            </div>
                                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{activity.co2Saved.toFixed(2)} kg saved • {new Date(activity.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                        </div>
                                    </div>
                                )) || (
                                    <div className="text-[10px] text-neutral-400 py-10 text-center font-black uppercase tracking-[0.2em]">Awaiting Data...</div>
                                )}
                            </div>
                            <Link to="/activities" className="mt-8 w-full block py-4 bg-neutral-50 border border-neutral-100 text-neutral-900 rounded-2xl text-center text-xs font-black uppercase tracking-widest hover:bg-neutral-100 transition-colors">Log New Entry</Link>
                        </div>
                    </div>

                    {/* Monthly Savings Area Chart */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-neutral-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                            <div>
                                <h3 className="text-xl font-black text-neutral-900 tracking-tight">Eco Impact Velocity</h3>
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">Aggregated CO2 displacement across all vectors</p>
                            </div>
                            <div className="flex bg-neutral-50 p-1.5 rounded-2xl border border-neutral-100">
                                {['All', 'Walking', 'Cycling'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setChartFilter(f)}
                                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${chartFilter === f ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100' : 'text-neutral-400 hover:text-neutral-600'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-72">
                            <Line data={areaChartData} options={areaChartOptions} />
                        </div>
                    </div>
                    
                    {/* Big Production Ad */}
                    <AdBanner className="mt-4" />
                </div>

                {/* Right Column (Side Widgets) */}
                <div className="flex flex-col gap-8">
                    {/* Leaderboard Card */}
                    <div className="bg-neutral-900 rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
                        <h3 className="text-lg font-black mb-8 tracking-tight flex items-center justify-between">
                            Global Elite
                            <span className="bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest">LIVE</span>
                        </h3>
                        <div className="space-y-4 relative z-10">
                            {leaderboard.map((u, i) => (
                                <div key={u._id} className="flex items-center gap-4 group/item cursor-pointer">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/20 scale-110' : 'bg-white/5 text-neutral-400 border border-white/10'}`}>
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black group-hover/item:text-emerald-400 transition-colors tracking-tight">{u.username}</p>
                                        <div className="w-full h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                                            <div className={`h-full ${i === 0 ? 'bg-yellow-400' : 'bg-emerald-500'}`} style={{ width: `${(u.points/leaderboard[0].points)*100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-white">{u.points}</p>
                                        <p className="text-[8px] font-bold text-neutral-500 tracking-tighter uppercase">PTS</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Local Environment Widget */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-neutral-100 flex flex-col group relative overflow-hidden">
                        <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-sky-400/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <h3 className="font-black text-neutral-900 uppercase tracking-widest text-[10px] bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100 w-max mb-6">Local Environment</h3>
                        
                        {weather ? (
                            <>
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <div>
                                        <p className="text-4xl font-black text-neutral-900 tracking-tighter">{Math.round(weather.main?.temp || 0)}°<span className="text-xl text-neutral-400">C</span></p>
                                        <p className="text-xs font-bold text-neutral-500 capitalize">{weather.weather?.description || 'Loading...'}</p>
                                    </div>
                                    <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-sky-100 group-hover:scale-110 transition-transform">
                                        🌤️
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mt-auto relative z-10">
                                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center">
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Humidity</span>
                                        <span className="text-lg font-black text-neutral-800">{weather.main?.humidity || 0}%</span>
                                    </div>
                                    <div className={`p-4 rounded-2xl flex flex-col items-center justify-center border ${weather.aqi <= 2 ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : weather.aqi <= 4 ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                                        <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">AQI Index</span>
                                        <span className="text-lg font-black">{weather.aqi || 2} / 5</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Scanning Environment...</p>
                            </div>
                        )}
                    </div>

                    {/* Small Ad Sidebar */}
                    <AdBanner type="sidebar" className="mt-auto" />
                </div>
            </div>
         </motion.div>
    );
};

export default Dashboard;
