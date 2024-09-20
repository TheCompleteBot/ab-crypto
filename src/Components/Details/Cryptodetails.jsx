import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import LoaderComp from '../Loader/LoaderComp';
import ErrorComponent from '../Error/ErrorComp';
import { FaSearch } from 'react-icons/fa'; // Import search icon

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoHistoricalData = () => {
  const [cryptoId, setCryptoId] = useState('bitcoin'); // Default cryptoId
  const [selectedCrypto, setSelectedCrypto] = useState(null); // Store selected crypto before searching
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cryptoList, setCryptoList] = useState([]); // List of available cryptocurrencies
  const [searchTerm, setSearchTerm] = useState(''); // Search term for the search bar
  const [isSearchListVisible, setIsSearchListVisible] = useState(false); // Controls visibility of search list
  const [timeRange, setTimeRange] = useState('30'); // Default time range (30 days)

  // Fetch list of cryptocurrencies with their icons for search functionality
  const fetchCryptoList = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 250, // Number of coins to fetch, you can adjust this number
          page: 1,
          sparkline: false
        }
      });
      setCryptoList(response.data);
    } catch (error) {
      console.error('Error fetching cryptocurrency list:', error);
      setError('Failed to load cryptocurrency list');
    }
  };

  // Fetch historical data for the selected cryptocurrency and time range
  const fetchHistoricalData = async () => {
    if (!cryptoId) return;

    setLoading(true); // Set loading state before fetching
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: timeRange, // Fetch data for the selected time range
          interval: timeRange <= 7 ? 'hourly' : 'daily' // Use 'hourly' for short ranges and 'daily' for longer
        }
      });
      setHistoricalData(response.data.prices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setError('Failed to load historical data. Please check the cryptocurrency ID.');
      setLoading(false);
    }
  };

  // Fetch crypto list once on component mount
  useEffect(() => {
    fetchCryptoList();
  }, []);

  // Fetch historical data whenever cryptoId or timeRange changes
  useEffect(() => {
    fetchHistoricalData();
  }, [cryptoId, timeRange]);

  // Handle search and selection of cryptocurrency
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setIsSearchListVisible(true); // Show the list when typing
  };

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto); // Store the selected cryptocurrency temporarily
    setSearchTerm(crypto.name); // Set the search bar value to the selected crypto name
    setIsSearchListVisible(false); // Hide the search list
    setError(null); // Clear any previous errors
  };

  // Handle search bar focus to show the list
  const handleSearchFocus = () => {
    setIsSearchListVisible(true);
  };

  // Handle time range change
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (selectedCrypto) {
      setCryptoId(selectedCrypto.id); // Set the cryptoId for the graph update
    }
  };

  // Prepare data for Chart.js
  const chartData = {
    labels: historicalData.map((data) => {
      const date = new Date(data[0]);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: `${cryptoId} Price (USD)`,
        data: historicalData.map((data) => data[1]),
        fill: true, // Enable fill for the area under the line
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light red fill color
        borderColor: 'rgba(255, 99, 132, 1)', // Red border color
        pointBackgroundColor: 'rgba(255, 99, 132, 1)', // Point color
        pointBorderColor: '#fff', // Point border color
        pointHoverBackgroundColor: '#fff', // Point hover color
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)', // Point hover border color
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${cryptoId} Price Chart (${timeRange} Days)`,
      },
    },
    scales: {
      y: {
        beginAtZero: false, // Start y-axis from the lowest value in the dataset
        ticks: {
          color: '#333', // Change the y-axis ticks color
        },
      },
      x: {
        ticks: {
          color: '#333', // Change the x-axis ticks color
        },
      },
    },
  };

  if (loading) return <div><LoaderComp /></div>;
  if (error) return <div><ErrorComponent /></div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Cryptocurrency Historical Data</h2>

      {/* Search bar for selecting a cryptocurrency */}
      <div className="mb-4 relative">
        <div className="relative">
          <input
            type="text"
            className="border rounded w-full py-2 px-3 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search cryptocurrency..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        {isSearchListVisible && (
          <div className="absolute z-10 w-full bg-white max-h-48 overflow-y-auto border rounded mt-1 shadow-lg">
            {cryptoList
              .filter((crypto) => crypto.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .slice(0, 10) // Limit the number of suggestions shown for performance
              .map((crypto) => (
                <div
                  key={crypto.id}
                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center"
                  onClick={() => handleCryptoSelect(crypto)}
                >
                  <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-2" />
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Time range selector and Search button */}
      <div className="mb-6 flex items-center space-x-4 justify-center">
        <div>
          <label className="block mb-2 font-semibold">Select Time Range:</label>
          <select
            className="border rounded py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={handleTimeRangeChange}
          >
            <option value="7">1 Week</option>
            <option value="30">1 Month</option>
            <option value="90">3 Months</option>
            <option value="365">1 Year</option>
            <option value="1825">5 Years</option>
          </select>
        </div>
        <button
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>

      {/* Line chart for historical data */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CryptoHistoricalData;
