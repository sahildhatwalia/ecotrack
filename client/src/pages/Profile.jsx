import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-700 text-lg font-semibold">Username:</p>
          <p className="text-gray-900 text-xl">{user.username}</p>
        </div>
        <div>
          <p className="text-gray-700 text-lg font-semibold">Email:</p>
          <p className="text-gray-900 text-xl">{user.email}</p>
        </div>
        <div>
          <p className="text-gray-700 text-lg font-semibold">Total CO2 Saved:</p>
          <p className="text-green-600 text-xl">{user.carbonFootprint.toFixed(2)} kg</p>
        </div>
        <div>
          <p className="text-gray-700 text-lg font-semibold">Total Points:</p>
          <p className="text-yellow-500 text-xl">{user.points}</p>
        </div>
        <div>
          <p className="text-gray-700 text-lg font-semibold">Member Since:</p>
          <p className="text-gray-900 text-xl">{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      {/* Add options to update profile, change password etc. here */}
    </div>
  );
};

export default Profile;
