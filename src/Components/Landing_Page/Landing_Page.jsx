import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  

  const navigate = useNavigate();

 

  return (
    <div className="relative h-screen bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden">
     
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Welcome to AB Crypto</h1>
          <p className="text-xl text-gray-300 mb-8">Explore the exciting world of cryptocurrencies</p>
          <button onClick = {()=> navigate('/dashboard')} className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition duration-300">
            Login With Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;