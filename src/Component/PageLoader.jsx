import React from 'react';

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black/60 fixed top-0 left-0 z-999 w-full h-full">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin z-10 relative"></div>
    </div>
  );
};

export default PageLoader;