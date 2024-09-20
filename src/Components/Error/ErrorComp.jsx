import React from 'react';
import errorImage from '../../assets/error_image.webp'; // Update this path to the correct image location

const ErrorComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* Error Image */}
      <img src={errorImage} alt="API Error" className="w-48 h-48 mb-6" />
      
      {/* Error Message */}
      <div className="text-center">
        <strong className="text-2xl font-bold text-red-700 block">Error:</strong>
        <span className="text-lg text-red-600">Try again later, we have reached the API limit.</span>
      </div>
    </div>
  );
};

export default ErrorComponent;
