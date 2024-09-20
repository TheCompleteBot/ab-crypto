import React, { useState, useEffect } from 'react';
import { BrowserProvider, parseEther, formatUnits } from 'ethers';

const CryptoSender = () => {
  const [account, setAccount] = useState(null); // Store the user's wallet address
  const [balance, setBalance] = useState(''); // Store the user's ETH balance
  const [amount, setAmount] = useState(''); // Amount to send
  const [recipient, setRecipient] = useState(''); // Recipient address
  const [transactionHash, setTransactionHash] = useState(''); // Transaction Hash
  const [status, setStatus] = useState(''); // Transaction status

  // Connect MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum); // Use BrowserProvider
        await provider.send('eth_requestAccounts', []); // Request account access
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);
        setStatus('Wallet connected');

        // Fetch balance after connecting
        fetchBalance(userAddress, provider);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setStatus('Failed to connect wallet');
      }
    } else {
      setStatus('MetaMask is not installed. Please install MetaMask to use this feature.');
    }
  };

  // Fetch the ETH balance
  const fetchBalance = async (userAddress, provider) => {
    try {
      const balance = await provider.getBalance(userAddress);
      setBalance(formatUnits(balance, 18)); // Convert balance from Wei to ETH
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Send ETH
  const sendCrypto = async () => {
    if (!recipient || !amount || !account) {
      setStatus('Please fill in all fields.');
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum); // Use BrowserProvider
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: recipient, // Recipient's address
        value: parseEther(amount), // Amount to send in ETH
      });

      setTransactionHash(tx.hash);
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait(); // Wait for the transaction to be confirmed
      setStatus('Transaction confirmed!');

      // Update balance after sending
      fetchBalance(account, provider);
    } catch (error) {
      console.error('Transaction error:', error);
      setStatus('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Send Cryptocurrency</h1>

        {/* Wallet connection */}
        {!account && (
          <div className="text-center">
            <button
              className="border-2 border-black text-black font-bold py-2 px-4 rounded-full hover:bg-black hover:text-white transition duration-300"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Show balance and form if wallet is connected */}
        {account && (
          <div>
            <div className="mb-4 text-center">
              {/* Reduce the font size and ensure text doesn't overflow */}
              <h2 className="text-sm font-semibold truncate">
                Connected: <span className="break-all">{account}</span>
              </h2>
              <h2 className="text-sm font-semibold">Balance: {balance} ETH</h2>
            </div>

            {/* Form to send crypto */}
            <div>
              <div className="mb-4">
                <label className="block mb-2">Recipient Address:</label>
                <input
                  type="text"
                  className="border rounded w-full py-2 px-3"
                  placeholder="Enter recipient address"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Amount (ETH):</label>
                <input
                  type="text"
                  className="border rounded w-full py-2 px-3"
                  placeholder="Enter amount in ETH"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                onClick={sendCrypto}
              >
                Send Crypto
              </button>

              {transactionHash && (
                <div className="mt-4 text-center">
                  <p>
                    Transaction Hash: <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">{transactionHash}</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status messages */}
        {status && (
          <div className="mt-4 text-center">
            <p>{status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoSender;
