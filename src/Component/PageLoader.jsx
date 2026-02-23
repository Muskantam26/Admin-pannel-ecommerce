import React from "react";
import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          className="absolute w-20 h-20 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className="absolute w-12 h-12 border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-purple-400 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
        
        {/* Center Pulse */}
        <motion.div
          className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </div>
        
    
               
    </div>
  );
};

export default PageLoader;