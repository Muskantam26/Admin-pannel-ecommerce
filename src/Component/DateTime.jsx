import React from 'react';

const DateTime = ({ date }) => {
    if (!date) return <span className="text-gray-400">N/A</span>;

    const d = new Date(date);
    const formattedDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">{formattedDate}</span>
            <span className="text-xs text-gray-500">{formattedTime}</span>
        </div>
    );
};

export default DateTime;
