import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const Rewards = () => {
  const { api, user } = useContext(AuthContext);
  const [rewards, setRewards] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRewards();
  }, [api]);

  const fetchRewards = async () => {
    try {
      const res = await api.get('/rewards');
      setRewards(res.data.data);
    } catch (err) {
      console.error("Error fetching rewards:", err);
      setError("Failed to load rewards.");
    }
  };

  const handleRedeem = async (rewardId) => {
    setMessage('');
    setError('');
    try {
      const res = await api.post(`/rewards/${rewardId}/redeem`);
      setMessage(res.data.message);
      // Optionally, refresh user data or rewards list if points change
      // For now, just show message
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to redeem reward.');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Eco Rewards</h1>

      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <p className="text-lg mb-4">Your current points: <span className="font-bold text-yellow-500">{user?.points || 0}</span></p>

      {rewards.length === 0 ? (
        <p>No rewards available yet. Check back later!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div key={reward._id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{reward.name}</h2>
              <p className="text-gray-600 mb-4">{reward.description}</p>
              <p className="text-lg font-bold text-green-600 mb-4">{reward.pointsRequired} Points</p>
              <button
                onClick={() => handleRedeem(reward._id)}
                disabled={user?.points < reward.pointsRequired}
                className={`w-full py-2 px-4 rounded font-bold ${
                  user?.points >= reward.pointsRequired
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {user?.points >= reward.pointsRequired ? 'Redeem' : `Need ${reward.pointsRequired - (user?.points || 0)} more points`}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rewards;
