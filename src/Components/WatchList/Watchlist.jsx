import React, { useEffect, useState } from 'react';
import { BrowserProvider, formatUnits } from 'ethers'; // Import necessary parts of ethers.js

const Watchlist = ({ watchlist, account }) => {
  const [balances, setBalances] = useState({}); // Store balances for each crypto

  useEffect(() => {
    if (account && watchlist.length > 0) {
      fetchBalances();
    }
  }, [account, watchlist]);

  // Function to fetch ETH balance
  const fetchBalances = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum); // Provider for interacting with MetaMask
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log('Fetching balances for account:', userAddress);
      const newBalances = {};

      // Fetch ETH balance
      const ethBalance = await provider.getBalance(userAddress);
      newBalances['ETH'] = ethBalance;
      console.log(`ETH Balance: ${formatUnits(ethBalance, 18)} ETH`);

      setBalances(newBalances); // Update state with fetched balances
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Watchlist & Balances</h2>
      {watchlist.length === 0 ? (
        <p>No cryptocurrencies in your watchlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlist.map((crypto) => (
            <div key={crypto.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
              {/* Display the icon */}
              <img
                src={crypto.image}
                alt={`${crypto.name} icon`}
                className="w-12 h-12 mb-2"
              />
              <h3 className="text-lg font-bold mb-2">{crypto.name}</h3>
              <p className="text-gray-500 mb-2">{crypto.symbol.toUpperCase()}</p>
              <p className="text-gray-700">
                {balances[crypto.symbol]
                  ? `${parseFloat(formatUnits(balances[crypto.symbol], 18)).toFixed(4)} ${crypto.symbol}`
                  : 'Loading...'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
