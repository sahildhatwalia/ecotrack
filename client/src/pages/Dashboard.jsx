import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Bell, User, MapPin, Navigation, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const Dashboard = () => {
    const { api, user } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState(null);
    const [weather, setWeather] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [chartFilter, setChartFilter] = useState('All');
    const [rewards] = useState([
      { id: 1, title: 'Redeem Coupon', desc: 'Receive discount approved for ECO50', points: 50 },
      { id: 2, title: 'Redeem Coupon', desc: 'Receive discount approved for ECO100', points: 100 },
      { id: 3, title: 'Redeem Coupon', desc: 'Receive discount approved for ECO150', points: 150 },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, leaderboardRes] = await Promise.all([
                    api.get('/analytics'),
                    api.get('/leaderboard')
                ]);
                setAnalytics(analyticsRes.data.data);
                setLeaderboard(leaderboardRes.data.data.slice(0, 5)); // Show only top 5 in widget
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
    const handleRedeem = () => {
        // Trigger happy confetti effect
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#34d399', '#ffffff'] // green eco colors
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full bg-green-50/50"
        >
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back to EcoTrack!</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column (Main Charts) */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    {/* Top row in Left Column: Score & Recent */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Carbon Score Gauge Widget */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">Carbon Score</h3>
                            </div>
                            <div className="relative flex-1 flex items-center justify-center min-h-[160px]">
                                <div className="absolute inset-0 flex items-end justify-center pb-4">
                                     <Doughnut data={gaugeData} options={{plugins: {legend: {display: false}, tooltip: {enabled: false}}, maintainAspectRatio: false }} />
                                </div>
                                <div className="absolute bottom-6 flex flex-col items-center">
                                    <span className="text-4xl font-black text-gray-800">{scoreVal.toFixed(0)}</span>
                                    <span className="text-xs text-gray-500 font-medium">Carbon saved</span>
                                </div>
                                <div className="absolute bottom-6 left-8 text-xs text-gray-400 font-bold">0</div>
                                <div className="absolute bottom-6 right-8 text-xs text-gray-400 font-bold">{maxScore}</div>
                            </div>
                        </div>

                        {/* Recent Activities Widget */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">Recent Activities</h3>
                                <Link to="/activities" className="text-green-600 text-sm font-semibold hover:underline">See All</Link>
                            </div>
                            <div className="space-y-4">
                                {analytics?.recentActivities?.slice(0, 2).map((activity, idx) => (
                                    <div key={idx} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-50">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.activityType.toLowerCase().includes('walk') ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {activity.activityType.toLowerCase().includes('walk') ? <TrendingUp size={20} /> : <Navigation size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800">{activity.activityType}</p>
                                            <p className="text-xs text-gray-500">{activity.co2Saved.toFixed(1)} kg • {new Date(activity.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-gray-300">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                        </div>
                                    </div>
                                )) || (
                                    <div className="text-sm text-gray-500 py-4 text-center">No recent activities.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Monthly Savings Area Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-gray-800">Monthly CO2 Savings</h3>
                                <p className="text-xs text-gray-500 mt-1">Monthly CO2 Savings over time.</p>
                            </div>
                            <select 
                                className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 font-medium outline-none cursor-pointer focus:ring-2 focus:ring-green-400"
                                value={chartFilter}
                                onChange={(e) => setChartFilter(e.target.value)}
                            >
                                <option value="All">All Savings</option>
                                <option value="Walking">Walking Only</option>
                                <option value="Cycling">Cycling Only</option>
                                <option value="Transport">Public Transport</option>
                            </select>
                        </div>
                        <div className="h-64">
                            <Line data={areaChartData} options={areaChartOptions} />
                        </div>
                    </div>
                </div>

                {/* Right Column (Side Widgets) */}
                <div className="flex flex-col gap-6">
                    {/* Leaderboard */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Leaderboard</h3>
                        <div className="flex text-xs font-semibold text-gray-400 mb-2 px-2 uppercase">
                            <span className="w-8">#</span>
                            <span className="flex-1">User</span>
                            <span className="w-16 text-right">Points</span>
                            <span className="w-16 text-right">Saved</span>
                        </div>
                        <div className="space-y-1">
                            {leaderboard.map((u, i) => (
                                <div key={u._id} className="flex items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition">
                                    <span className={`w-8 font-bold ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-500'}`}>{i + 1}</span>
                                    <div className="flex-1 flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 font-bold text-xs flex items-center justify-center uppercase">{u.username.substring(0, 1)}</div>
                                        <span className="font-medium text-gray-700">{u.username}</span>
                                    </div>
                                    <span className="w-16 text-right font-medium text-gray-600">{u.points}</span>
                                    <span className="w-16 text-right text-gray-500">{u.carbonFootprint.toFixed(0)}k</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Local AQI Map Widget placeholder */}
                    <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100 relative overflow-hidden h-48 flex-shrink-0 group">
                        {/* Placeholder Map Background */}
                        <div className="absolute inset-0 bg-gray-200 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105" 
                             style={{backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=13&size=400x400&maptype=roadmap&style=feature:all|element:labels|visibility:off&style=feature:water|color:0xbababa')"} }>
                        </div>
                        {/* Content */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full mx-auto mb-auto shadow-lg shadow-green-500/50">
                                <MapPin size={16} />
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 flex justify-between items-center shadow-lg">
                                <span className="font-semibold text-gray-800 text-sm">Local AQI: {weather ? '42' : 'Loading...'}</span>
                                <div className="flex items-center text-green-600 text-sm font-bold bg-green-100 px-2 py-1 rounded-md">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                    Good
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row (Rewards) */}
            <div className="mt-6 mb-6">
                 <h3 className="font-bold text-gray-800 mb-1">Rewards</h3>
                 <p className="text-xs text-gray-500 mb-4">Redeemable coupons to boost your footprint.</p>
                 <div className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar">
                     {rewards.map(reward => (
                         <div key={reward.id} className="min-w-[300px] flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-5 text-white flex justify-between relative overflow-hidden shadow-md shadow-green-200">
                             {/* Decorative bg element */}
                             <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                             
                             <div className="flex-1 relative z-10 w-3/4">
                                 <h4 className="font-bold text-lg mb-1">{reward.title}</h4>
                                 <p className="text-green-50 text-xs mb-4 max-w-[160px] opacity-90">{reward.desc}</p>
                                 <motion.button 
                                     whileHover={{ scale: 1.05 }}
                                     whileTap={{ scale: 0.95 }}
                                     onClick={handleRedeem}
                                     className="bg-white text-green-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-green-50 transition shadow-sm"
                                 >
                                     Redeem
                                 </motion.button>
                             </div>
                             
                             {/* Coupon tear line simulation */}
                             <div className="flex flex-col justify-between items-center py-1 opacity-50 absolute right-10 top-0 bottom-0 h-full border-l border-dashed border-white/40 pl-2">
                                  <div className="w-2 h-2 bg-white rounded-full -ml-[5px] mt-[-10px]"></div>
                                  <div className="text-[10px] transform rotate-90 whitespace-nowrap tracking-wider font-semibold">VALID COUPON</div>
                                  <div className="w-2 h-2 bg-white rounded-full -ml-[5px] mb-[-10px]"></div>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
         </motion.div>
    );
};

export default Dashboard;
