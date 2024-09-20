import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoaderComp from '../Loader/LoaderComp';
import ErrorComponent from '../Error/ErrorComp';

const CryptoCurrencyList = ({ addToWatchlist, watchlist, setWatchlist }) => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 50,
            page: 1,
          }
        });
        setCryptos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching crypto data", error);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to check if a crypto is already in the watchlist
  const isAddedToWatchlist = (crypto) => {
    return watchlist.some((item) => item.id === crypto.id);
  };

  // Function to remove a crypto from the watchlist
  const removeFromWatchlist = (crypto) => {
    setWatchlist((prevWatchlist) => {
      return prevWatchlist.filter((item) => item.id !== crypto.id);
    });
  };

  if (loading) return <div><LoaderComp/></div>;
  if (error) return <div><ErrorComponent/></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Top Cryptocurrencies</h1>

      {/* Cards container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cryptos.map((crypto) => (
          <div key={crypto.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
            <img src={crypto.image} alt={crypto.name} className="w-16 h-16 mb-4" />
            <h2 className="text-lg font-bold mb-2">{crypto.name}</h2>
            <p className="text-gray-500 mb-2">{crypto.symbol.toUpperCase()}</p>
            <p className="text-gray-700">Rank: {crypto.market_cap_rank}</p>
            <p className="text-gray-700">Price: ${crypto.current_price.toLocaleString()}</p>
            <p className="text-gray-700">Market Cap: ${crypto.market_cap.toLocaleString()}</p>

            <div className="flex space-x-2 mt-4">
              {isAddedToWatchlist(crypto) ? (
                <>
                  <button
                    className="bg-black text-white px-4 py-2 rounded-full border-2 border-black transition duration-300"
                    disabled
                  >
                    Done
                  </button>
                  <button
                    className="bg-transparent hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-500 px-4 py-2 rounded-full transition duration-300"
                    onClick={() => removeFromWatchlist(crypto)}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <button
                  className="bg-transparent hover:bg-black text-black hover:text-white border-2 border-black px-4 py-2 rounded-full transition duration-300"
                  onClick={() => addToWatchlist(crypto)}
                >
                  Add to Watchlist
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoCurrencyList;
