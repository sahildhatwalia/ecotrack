import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Activity, MapPin, Zap, RefreshCcw, Navigation, TrendingUp, CheckCircle, Lightbulb, ShieldCheck, Cpu } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const activityOptions = [
  {
    type: 'Walking',
    icon: <TrendingUp size={24} />,
    color: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-teal-600',
    fact: "Walking instead of driving saves around 0.16kg of CO2 per km. Every step counts towards a greener planet!"
  },
  {
    type: 'Running',
    icon: <Activity size={24} />,
    color: 'bg-rose-500',
    gradient: 'from-rose-500 to-orange-600',
    fact: "Running is a high-intensity eco-action! It burns calories and saves 0.18kg of CO2 per km."
  },
  {
    type: 'Cycling',
    icon: <Activity size={24} />,
    color: 'bg-teal-500',
    gradient: 'from-teal-500 to-cyan-600',
    fact: "Cycling is zero-emission transport! It saves roughly 0.21kg of CO2 per km compared to an average car."
  },
  {
    type: 'Public Transport',
    icon: <Navigation size={24} />,
    color: 'bg-cyan-600',
    gradient: 'from-cyan-600 to-blue-600',
    fact: "Taking a bus or train reduces your carbon footprint significantly, saving ~0.10kg CO2 per km."
  },
  {
    type: 'EV Trip',
    icon: <Zap size={24} />,
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-purple-600',
    fact: "Electric Vehicles save ~0.06kg of CO2 per km compared to fossil-fuel cars by utilizing cleaner energy grids."
  },
  {
    type: 'Recycling',
    icon: <RefreshCcw size={24} />,
    color: 'bg-lime-500',
    gradient: 'from-lime-500 to-emerald-500',
    fact: "Recycling a single plastic bottle can save enough energy to power a 60W light bulb for up to 6 hours!"
  },
  {
    type: 'Energy Saving',
    icon: <Zap size={24} />,
    color: 'bg-amber-500',
    gradient: 'from-amber-500 to-orange-500',
    fact: "Precision energy management cuts coal-based emissions and earns you premium points multipliers today."
  }
];

const Activities = () => {
  const [selectedActivity, setSelectedActivity] = useState(activityOptions[0]);
  const [distance, setDistance] = useState('');
  const [weatherSim, setWeatherSim] = useState('Clear');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userActivities, setUserActivities] = useState([]);
  const { api, user } = useContext(AuthContext);
  const { searchTerm } = useSearch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [api]);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities');
      setUserActivities(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setUserActivities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      // Simulate real sensor data for development
      const simulatedMetadata = {
        gpsAccuracy: Math.floor(Math.random() * 40) + 5,
        isMockLocation: false,
        weather: weatherSim,
        topSpeed: selectedActivity.type === 'Walking' ? 6 : (selectedActivity.type === 'Cycling' ? 22 : 60),
        stepCount: selectedActivity.type === 'Walking' ? (distance ? parseFloat(distance) * 1300 : Math.random() * 2000) : 0,
        avgStepFrequency: selectedActivity.type === 'Walking' ? 1.8 : 0,
      };

      const res = await api.post('/activities', {
        activityType: selectedActivity.type,
        distance: distance ? parseFloat(distance) : null,
        metadata: simulatedMetadata
      });

      const { co2Saved, points } = res.data.data;
      const { multipliers } = res.data;

      setMessage(`Log Confirmed! Saved ${co2Saved}kg CO2 and earned ${points} pts (Multiplier: x${multipliers.total}${multipliers.peak ? ' + Peak Hour' : ''})`);
      setDistance('');
      fetchActivities(); // Refresh activities list

      // Happy Interaction
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#fbbf24', '#ffffff'] // green eco colors
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log activity.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 10000); // Clear success msg
    }
  };


  const requiresDistance = ['Walking', 'Public Transport', 'Cycling'].includes(selectedActivity.type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-10 h-full bg-[#f8fbfa] overflow-y-auto hide-scrollbar p-6 md:p-10 perspective-container"
    >
      <div className="flex flex-col md:flex-row gap-12">

        {/* Left Col: Selections */}
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Data Capture</h1>
            <p className="text-neutral-500 mt-2 text-sm font-medium">Select your eco-directive for analysis and reward calculation.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {activityOptions.map((option) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={option.type}
                onClick={() => {
                  setSelectedActivity(option);
                  setMessage('');
                  setError('');
                }}
                className={`relative cursor-pointer rounded-3xl overflow-hidden h-36 flex items-end p-5 transition-all shadow-sm bg-gradient-to-br ${option.gradient} ${selectedActivity.type === option.type ? 'ring-4 ring-offset-4 ring-emerald-500 shadow-xl' : 'opacity-70 hover:opacity-100 hover:shadow-lg hover:ring-2 ring-neutral-200'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="relative z-10 flex flex-col gap-2 text-white">
                  <div className="bg-white/10 w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                    {option.icon}
                  </div>
                  <span className="font-extrabold text-xs tracking-widest uppercase bg-black/40 px-3 py-1 rounded-xl inline-block max-w-fit">{option.type}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Educational Block */}
          <AnimatePresence mode="wait">
            {selectedActivity && (
              <motion.div
                key={selectedActivity.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-900 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-[-50%] right-[-10%] w-48 h-48 bg-emerald-500/20 rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-start gap-5 relative z-10">
                  <div className={`p-4 rounded-2xl text-white ${selectedActivity.color} shadow-lg flex-shrink-0 group-hover:rotate-12 transition-transform`}>
                    <Lightbulb size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-emerald-400 mb-2 tracking-tight uppercase text-xs">Aeronautics & Impact</h3>
                    <p className="text-emerald-50 text-sm leading-relaxed font-medium">{selectedActivity.fact}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Col: Form Entry */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-neutral-100 sticky top-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Telemetry Entry</h2>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-neutral-900">{selectedActivity.type}</span>
                  <div className={`w-8 h-8 rounded-xl text-white ${selectedActivity.color} flex items-center justify-center shadow-md`}>
                    {selectedActivity.icon}
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">AI Secured</span>
              </div>
            </div>

            <AnimatePresence>
              {message && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-emerald-500 text-white p-5 rounded-2xl mb-8 font-bold flex items-center gap-4 shadow-lg shadow-emerald-500/30 overflow-hidden">
                  <CheckCircle size={24} className="flex-shrink-0" /> 
                  <span className="text-sm">{message}</span>
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-rose-50 text-rose-600 border border-rose-200 p-5 rounded-2xl mb-8 font-bold text-sm overflow-hidden">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {requiresDistance ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <label htmlFor="distance" className="block text-neutral-800 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
                    <MapPin size={18} className="text-emerald-500" /> Total Distance Covered
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      id="distance"
                      className="w-full bg-neutral-50 border-2 border-neutral-100 text-neutral-900 text-2xl rounded-2xl focus:ring-0 focus:border-emerald-500 outline-none transition-all py-5 px-6 font-black"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="0.0"
                      min="0"
                      step="0.1"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400 font-black text-xl group-focus-within:text-emerald-500 transition-colors">KM</div>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-3 ml-2 flex items-center gap-1.5">
                    <Cpu size={12} /> Auto-estimation protocol active
                  </p>
                  
                  <div className="mt-6">
                    <label className="block text-neutral-800 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
                       <Navigation size={18} className="text-emerald-500" /> Climate Conditions
                    </label>
                    <div className="flex gap-4">
                      {['Clear', 'Rain', 'Snow'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setWeatherSim(w)}
                          className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all border ${weatherSim === w ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg' : 'bg-neutral-50 text-neutral-400 border-neutral-100'}`}
                        >
                          {w === 'Clear' ? '☀️' : w === 'Rain' ? '🌧️' : '❄️'} {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="py-12 bg-neutral-50 rounded-[2rem] border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-4">
                    <CheckCircle className="text-emerald-500" size={32} />
                  </div>
                  <p className="text-neutral-900 font-black text-lg">No telemetry required</p>
                  <p className="text-neutral-400 text-sm mt-1 font-medium">Ready for immediate submission protocol.</p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                type="submit"
                className={`w-full text-white font-black text-lg py-5 rounded-[2rem] shadow-xl transition-all flex justify-center items-center gap-3 tracking-wide uppercase ${isSubmitting ? 'bg-neutral-800 cursor-not-allowed' : 'bg-neutral-900 hover:bg-black hover:shadow-2xl hover:translate-y-[-2px]'}`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Authenticating...
                  </>
                ) : `Commit ${selectedActivity.type}`}
              </motion.button>
            </form>


          </div>
        </div>

      </div>

      {/* Recent Logged History Cards */}
      <div className="mt-8">
        <div className="flex items-center gap-4 mb-8">
            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Activity Ledger</h3>
            <span className="bg-neutral-200 text-neutral-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{userActivities.length} Records</span>
        </div>
        
        {userActivities.length === 0 ? (
          <div className="bg-white p-16 rounded-[2.5rem] text-center border border-neutral-100 shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
                <Activity className="text-neutral-300" size={32} />
            </div>
            <p className="text-neutral-900 font-black text-xl mb-2">Ledger is Empty</p>
            <p className="text-neutral-500 text-sm">Initiate your first eco-directive to populate data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-container">
            {Array.isArray(userActivities) && userActivities
              .filter(a => a.activityType.toLowerCase().includes(searchTerm.toLowerCase()))
              .slice(0, 8).map((activity, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={activity._id}
                className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm hover-3d transition-all flex flex-col group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="font-black text-neutral-900 tracking-tight text-lg">{activity.activityType}</div>
                  <span className="text-[10px] font-black bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-1.5 rounded-xl uppercase tracking-widest shadow-sm">
                    +{activity.points} pts
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <div className="flex items-end gap-1.5 mb-2">
                    <span className="text-4xl font-black text-emerald-500 leading-none tracking-tighter">{activity.co2Saved.toFixed(1)}</span>
                    <span className="text-xs text-emerald-600/60 font-black uppercase tracking-widest mb-1">Kg CO2</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-black tracking-[0.2em] uppercase border-t border-neutral-100 pt-4 mt-2 flex justify-between items-center group-hover:text-emerald-600 transition-colors">
                    <span>Validation</span>
                    <span className="flex items-center gap-1"><ShieldCheck size={12} /> {(activity.trustScore || 100).toFixed(0)}%</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-bold mt-2">
                    {new Date(activity.createdAt).toLocaleDateString([], { weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default Activities;
