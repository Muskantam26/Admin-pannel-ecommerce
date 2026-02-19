import React from 'react';
import { Check } from 'lucide-react';

const OrderProgressBar = ({ status, trackHistory = [] }) => {
  // Define standard order steps
  const steps = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Placed', value: 'PLACED' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Shipped', value: 'SHIPPED' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Returned', value: 'RETURNED' },
  ];

  // Helper to determine step status
  const getStepStatus = (stepValue, index) => {
    const statusOrder = ['PENDING', 'PLACED', 'PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'RETURNED'];
    const currentStatusIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepValue);

    if (status === 'CANCELLED') {
      // If cancelled, maybe show all as pending or handle specifically. 
      // For now, let's keep it simple or show 'failed' style if we had one.
      return 'pending';
    }

    // If status is RETURNED, everything should be green (completed) up to Delivered? 
    // Or just Returned is green? Usually Returned means it WAS delivered then returned.
    // Let's assume standard flow: PENDING -> ... -> DELIVERED -> RETURNED.
    // So if current is RETURNED, everything before it (index < current) is completed.

    if (stepIndex < currentStatusIndex) return 'completed';
    if (stepIndex === currentStatusIndex) return 'completed'; // Current step is also completed state (Green tick)

    return 'pending';
  };

  // Find date for a step from history if available
  const getStepDate = (stepValue) => {
    const historyItem = trackHistory.find(h => h.status === stepValue);
    if (historyItem) {
      return new Date(historyItem.changedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return '';
  };

  return (
    <div className="mt-8 px-4">
      <div className="relative flex justify-between items-start">
        {/* The Connector Lines (Background Layer) */}
        <div className="absolute top-3 left-0 w-full h-1 flex px-10 -z-0">
          {steps.map((step, index) => (
            index < steps.length - 1 && (
              <div
                key={index}
                className={`h-full flex-1 transition-colors duration-500 ${getStepStatus(step.value) === 'completed' ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
              />
            )
          ))}
        </div>

        {/* The Steps (Top Layer) */}
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.value);
          return (
            <div key={index} className="relative z-10 flex flex-col items-center flex-1">
              {/* Icon Circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${stepStatus === 'completed' ? 'border-emerald-500 bg-emerald-500' :
                stepStatus === 'current' ? 'border-orange-200 bg-orange-500' : 'border-white bg-gray-200'
                }`}>
                {stepStatus === 'completed' ? (
                  <Check className="w-4 h-4 text-white stroke-[3px]" />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${stepStatus === 'current' ? 'bg-white' : ''}`} />
                )}
              </div>

              {/* Label */}
              <span className={`text-xs font-semibold mt-3 uppercase tracking-wider ${stepStatus === 'completed' ? 'text-emerald-600' :
                stepStatus === 'current' ? 'text-orange-600' : 'text-gray-400'
                }`}>
                {step.label}
              </span>

              {/* Date */}
              <span className="mt-1 text-[10px] text-gray-500 font-medium">
                {getStepDate(step.value) || '-'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgressBar;