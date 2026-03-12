import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Activity, MapPin, Zap, RefreshCcw, Navigation, TrendingUp, CheckCircle, Lightbulb } from 'lucide-react';

const activityOptions = [
  {
    type: 'Walking',
    icon: <TrendingUp size={24} />,
    color: 'bg-emerald-500',
    image: 'https://images.unsplash.com/photo-1552504829-9ac7eec9bf4d?auto=format&fit=crop&q=80&w=1000',
    fact: "Walking instead of driving saves around 0.15kg of CO2 per km. Every step counts towards a greener planet!"
  },
  {
    type: 'Cycling',
    icon: <Activity size={24} />,
    color: 'bg-teal-500',
    image: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&q=80&w=1000',
    fact: "Cycling is zero-emission transport! It saves roughly 0.25kg of CO2 per km compared to an average car."
  },
  {
    type: 'Public Transport',
    icon: <Navigation size={24} />,
    color: 'bg-cyan-600',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000',
    fact: "Taking a bus or train reduces your carbon footprint by sharing the emission load, saving ~0.08kg CO2 per km."
  },
  {
    type: 'Recycling',
    icon: <RefreshCcw size={24} />,
    color: 'bg-lime-500',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1000',
    fact: "Recycling a single plastic bottle can save enough energy to power a 60W light bulb for up to 6 hours!"
  },
  {
    type: 'Energy Saving',
    icon: <Zap size={24} />,
    color: 'bg-amber-500',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1000',
    fact: "Turning off unused appliances and replacing bulbs translates to massive power grid savings and cuts coal-based emissions."
  }
];

const Activities = () => {
  const [selectedActivity, setSelectedActivity] = useState(activityOptions[0]);
  const [distance, setDistance] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userActivities, setUserActivities] = useState([]);
  const { api } = useContext(AuthContext);
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
      const res = await api.post('/activities', {
        activityType: selectedActivity.type,
        distance: distance ? parseFloat(distance) : null
      });

      setMessage(`Activity logged! You saved ${res.data.data.co2Saved.toFixed(2)} kg CO2 and earned ${res.data.data.points} points.`);
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
      setTimeout(() => setMessage(''), 6000); // Clear success msg
    }
  };

  const requiresDistance = ['Walking', 'Public Transport', 'Cycling'].includes(selectedActivity.type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8 h-full bg-green-50/30 overflow-y-auto hide-scrollbar pb-10"
    >
      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Col: Selections */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Log Activity</h1>
            <p className="text-gray-500 mt-2">What eco-friendly action did you take today?</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {activityOptions.map((option) => (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                key={option.type}
                onClick={() => {
                  setSelectedActivity(option);
                  setMessage('');
                  setError('');
                }}
                className={`relative cursor-pointer rounded-2xl overflow-hidden h-32 flex items-end p-4 transition-all shadow-sm ${selectedActivity.type === option.type ? 'ring-4 ring-offset-2 ring-emerald-500' : 'opacity-80 hover:opacity-100'}`}
              >
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${option.image}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="relative z-10 flex flex-col gap-1 text-white">
                  <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md">
                    {option.icon}
                  </div>
                  <span className="font-bold text-sm tracking-wide bg-black/30 px-2 py-0.5 rounded-md inline-block max-w-max">{option.type}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Educational Block */}
          {selectedActivity && (
            <motion.div
              key={selectedActivity.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full text-white ${selectedActivity.color} shadow-lg shadow-emerald-200`}>
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-900 mb-1">Impact Knowledge</h3>
                  <p className="text-emerald-800 text-sm leading-relaxed">{selectedActivity.fact}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Col: Form Entry */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-between">
              <span>Record {selectedActivity.type}</span>
              <div className={`w-10 h-10 rounded-full text-white ${selectedActivity.color} flex items-center justify-center`}>
                {selectedActivity.icon}
              </div>
            </h2>

            <AnimatePresence>
              {message && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 font-medium flex items-center gap-2">
                  <CheckCircle size={20} /> {message}
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-6 font-medium">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {requiresDistance ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <label htmlFor="distance" className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                    <MapPin size={18} className="text-emerald-500" /> Tracked Distance (km)
                  </label>
                  <input
                    type="number"
                    id="distance"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition py-3 px-4 font-semibold"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="e.g. 5.5"
                    min="0"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-400 mt-2 ml-1">Leave empty to auto-estimate based on average sessions.</p>
                </motion.div>
              ) : (
                <div className="py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <CheckCircle className="text-emerald-500" size={24} />
                  </div>
                  <p className="text-gray-600 font-medium">No distance needed.</p>
                  <p className="text-gray-400 text-sm mt-1">Ready to log your sustainable action!</p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                type="submit"
                className={`w-full text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'}`}
              >
                {isSubmitting ? 'Recording...' : `Log ${selectedActivity.type}`}
              </motion.button>
            </form>
          </div>
        </div>

      </div>

      {/* Recent Logged History Cards (Replaces Table) */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Logged History</h3>
        {userActivities.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-gray-100 shadow-sm text-gray-500">
            You haven't logged any eco-friendly actions yet. Start tracking today!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.isArray(userActivities) && userActivities.slice(0, 8).map((activity, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={activity._id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="font-bold text-gray-800">{activity.activityType}</div>
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md max-w-fit">
                    +{activity.points} pts
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-end mt-4">
                  <div className="text-3xl font-black text-emerald-500 mb-1">{activity.co2Saved.toFixed(1)}<span className="text-sm text-emerald-600/60 font-medium ml-1">kg</span></div>
                  <div className="text-xs text-gray-400 font-medium tracking-wide uppercase">CO2 Redux</div>
                  <div className="text-xs text-gray-400 font-medium mt-3 border-t border-gray-50 pt-3">
                    {new Date(activity.createdAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
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
