import React from 'react';
import { Check } from 'lucide-react';

const OrderProgressBar = () => {
  const steps = [
    { label: 'Sampling', date: 'Wed, 11th Jan', status: 'completed' },
    { label: 'Artwork', date: 'Sat, 13th Jan', status: 'completed' },
    { label: 'Raw Material', date: 'Tus, 11th Jan', status: 'completed' },
    { label: 'Packaging', date: 'Mon 16th Jan', status: 'completed' },
    { label: 'Production', date: 'Expected by, Mon 17th', status: 'current' },
    { label: 'QC', date: 'Expected by, Mon 18th', status: 'pending' },
    { label: 'Dispatch', date: 'Expected by, Mon 06h', status: 'pending' },
  ];

  return (
    <div className="mt-5">
      

      <div className="relative flex justify-between items-start">
        {/* The Connector Lines (Background Layer) */}
        <div className="absolute top-13.75 left-0 w-full h-1 flex px-10">
            {steps.map((step, index) => (
                index < steps.length - 1 && (
                    <div 
                        key={index}
                        className={`h-full flex-1 ${
                            step.status === 'completed' && steps[index+1].status === 'completed' ? 'bg-emerald-500' : 
                            step.status === 'completed' || step.status === 'current' ? 'bg-orange-400' : 'bg-gray-300'
                        }`}
                    />
                )
            ))}
        </div>

        {/* The Steps (Top Layer) */}
        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center flex-1">
            {/* Label */}
            <span className={`text-sm font-medium mb-6 ${
              step.status === 'completed' ? 'text-emerald-500' : 
              step.status === 'current' ? 'text-(--text-second)' : 'text-(--text-second)'
            }`}>
              {step.label}
            </span>



            {/* Icon Circle */}
            <div className={`w-6 h-6 rounded-full  flex items-center justify-center transition-colors duration-300 ${
              step.status === 'completed' ? 'border-emerald-500 bg-emerald-500' : 
              step.status === 'current' ? 'bg-orange-400' : 'bg-gray-300'
            }`}>
                
              {step.status === 'completed' ? (
                <Check className="w-3 h-3 text-(--text-white) stroke-[3px]" />
              ) : (
                <div className={`w-2 h-2 rounded-full ${step.status === 'current' ? 'bg-orange-400' : ''}`} />
              )}
            </div>

            {/* Date */}
            <span className="mt-6 text-xs text-(--text-second)  text-center px-2">
              {step.date}
            </span>
          </div>    
        ))}
      </div>

     
    </div>
  );
};

export default OrderProgressBar;