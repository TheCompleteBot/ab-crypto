import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0
import Cryptocurrency from '../Cryptocurrency/Cryptocurrency';
import Watchlist from '../WatchList/Watchlist';
import Sendcrypto from '../Sendcrypto/Sendcrypto';
import Cryptodetails from '../Details/Cryptodetails';
import axios from 'axios';
import { useNavigate, useNavigation } from 'react-router-dom';



const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Tab1');
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, getAccessTokenSilently } = useAuth0(); // Use Auth0 functions

  const addToWatchlist = (crypto) => {
    setWatchlist((prevWatchlist) => {
      // Check if the crypto is already in the watchlist
      if (prevWatchlist.some((item) => item.id === crypto.id)) {
        alert(`${crypto.name} is already in your watchlist!`);
        return prevWatchlist;
      }
      return [...prevWatchlist, crypto];
    });
  };

  useEffect(() => {
    const saveUserToDB = async () => {
      if (isAuthenticated && user) {
        try {
          // Get the token from Auth0
          const token = await getAccessTokenSilently({
            audience: 'https://mycryptoworld/api', // Ensure this matches the API identifier
            scope: 'read:crypto write:crypto', // Include required scopes if necessary
          });
          console.log('Access Token:', token);
  
          // Send the user data to the backend
          await axios.post('http://localhost:5001/auth/save-user', {
            user,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Error fetching access token or saving user to DB:', error);
  
          // Handle specific Auth0 errors
          if (error.error === 'login_required') {
            console.log('User needs to log in.');
          } else if (error.error === 'consent_required') {
            console.log('User needs to consent to scopes.');
          } else {
            console.log('An unknown error occurred:', error.message);
          }
        }
      }
    };
  
    saveUserToDB();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Navbar */}
      <div className="w-full bg-white text-black flex items-center justify-between p-4 shadow-md">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Crypto</h1>
        
        {/* Tabs */}
        <ul className="flex space-x-4">
          <li>
            <button
              className={`p-2 rounded ${activeTab === 'Tab1' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => handleTabClick('Tab1')}
            >
              Crypto List
            </button>
          </li>
          <li>
            <button
              className={`p-2 rounded ${activeTab === 'Tab2' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => handleTabClick('Tab2')}
            >
              Watch List
            </button>
          </li>
          <li>
            <button
              className={`p-2 rounded ${activeTab === 'Tab3' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => handleTabClick('Tab3')}
            >
              Crypto Transfer
            </button>
          </li>
          <li>
            <button
              className={`p-2 rounded ${activeTab === 'Tab5' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => handleTabClick('Tab5')}
            >
              Crypto Graph
            </button>
          </li>
          <li>
            <button
              className={`p-2 rounded ${activeTab === 'Tab5' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => navigate('/')}
            >
              Logout
            </button>
          </li>
        </ul>

        {/* User Profile and Logout */}
        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <div className="flex items-center space-x-2">
              {user.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span>{user.name}</span>
            </div>
            {/* Logout Button */}
            <button
              onClick={() => logout({ returnTo: window.location.origin + '/' })} // Redirect to landing page after logout
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-8">
        {activeTab === 'Tab1' && <div><Cryptocurrency addToWatchlist={addToWatchlist} watchlist={watchlist} setWatchlist={setWatchlist} /></div>}
        {activeTab === 'Tab2' && <div><Watchlist watchlist={watchlist} /></div>}
        {activeTab === 'Tab3' && <div><Sendcrypto /></div>}
        {activeTab === 'Tab5' && <div><Cryptodetails /></div>}
      </div>
    </div>
  );
};

export default Navbar;
