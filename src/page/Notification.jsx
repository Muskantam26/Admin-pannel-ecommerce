import React from 'react'
import { MainHeading } from '../Component/Heading'
import { GoBell } from "react-icons/go";
import { FiClock, FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";

const Notification = () => {

    const notifications = [
        {
            id: 1,
            title: "New User Registration",
            message: "A new user 'Rahul Kumar' has registered on the platform.",
            time: "2 mins ago",
            type: "info", // info, success, warning, alert
            isRead: false
        },
        {
            id: 2,
            title: "Order #ORD-2024-001 Placed",
            message: "New order received for 'Smart Watch Series 7' worth ₹4,500.",
            time: "1 hour ago",
            type: "success",
            isRead: false
        },
        {
            id: 3,
            title: "Server Maintenance Scheduled",
            message: "Routine server maintenance is scheduled for tonight at 2:00 AM.",
            time: "4 hours ago",
            type: "warning",
            isRead: true
        },
        {
            id: 4,
            title: "Payment Failed",
            message: "Payment for Order #ORD-2023-998 failed. User notified.",
            time: "Yesterday",
            type: "alert",
            isRead: true
        },
         {
            id: 5,
            title: "New Bronze Package Added",
            message: "Admin (You) added a new 'Bronze' membership package.",
            time: "2 days ago",
            type: "info",
            isRead: true
        },
    ];

    const getIcon = (type) => {
        switch(type) {
            case 'success': return <FiCheckCircle className="text-green-500" size={20} />;
            case 'warning': return <FiAlertCircle className="text-orange-500" size={20} />;
            case 'alert': return <FiAlertCircle className="text-red-500" size={20} />;
            default: return <FiInfo className="text-blue-500" size={20} />;
        }
    }

  return (
    <div className='space-y-6 animate-fade-in-up'>
       <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <MainHeading
                title={"Notifications"}
                subtitle={"Stay updated with system alerts"}
            />
            <button className='text-xs font-medium text-(--text-second) hover:text-(--text-main) cursor-pointer self-end sm:self-auto'>
                Mark all as read
            </button>
        </div>

        <div className="flex flex-col gap-4">
            {notifications.map((item) => (
                <div 
                    key={item.id} 
                    className={`
                        bg-(--bg-box) p-4 rounded-xl flex items-start gap-4 border border-transparent hover:border-(--border-color) transition-all
                        ${!item.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''}
                    `}
                >
                    <div className="mt-1 p-2 bg-(--bg-main) rounded-full">
                        {getIcon(item.type)}
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className={`font-semibold text-sm ${!item.isRead ? 'text-black' : 'text-(--text-main)'}`}>
                                {item.title}
                            </h3>
                            <span className="text-[10px] text-(--text-second) flex items-center gap-1">
                                <FiClock size={10} /> {item.time}
                            </span>
                        </div>
                        <p className="text-xs text-(--text-second) mt-1 leading-relaxed">
                            {item.message}
                        </p>
                    </div>

                    
                </div>
            ))}

            {notifications.length === 0 && (
                <div className="text-center py-20 bg-(--bg-box) rounded-xl">
                    <GoBell className="mx-auto text-4xl text-(--text-third) mb-3" />
                    <p className="text-(--text-second)">No new notifications</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default Notification
