import React, { useState, useEffect, useRef } from 'react';
import { MainHeading } from '../Component/Heading';
import { FiSearch, FiSend, FiMoreVertical, FiImage, FiPaperclip, FiCheckSquare } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";

const Message = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  // Mock Contacts Logic
  const initialContacts = [
    { id: 1, name: "Rahul Kumar", lastMsg: "Payment confirm ho gaya?", time: "10:30 AM", unread: 2, status: "online", ticketStatus: "open" },
    { id: 2, name: "Anita Singh", lastMsg: "Thanks for the support!", time: "Yesterday", unread: 0, status: "offline", ticketStatus: "closed" },
    { id: 3, name: "Vikram Malhotra", lastMsg: "Package kab deliver hoga?", time: "Yesterday", unread: 0, status: "online", ticketStatus: "open" },
    { id: 4, name: "Priya Sharma", lastMsg: "Can I upgrade my plan?", time: "2 days ago", unread: 1, status: "offline", ticketStatus: "open" },
  ];

  const [contacts, setContacts] = useState(initialContacts);

  // Mock Messages Logic
  const [messages, setMessages] = useState({
    1: [
      { id: 1, text: "Hello Sir, I have made the payment.", sender: "user", time: "10:28 AM" },
      { id: 2, text: "Payment confirm ho gaya?", sender: "user", time: "10:30 AM" },
    ],
    2: [
        { id: 1, text: "Issue resolved. Thanks!", sender: "user", time: "Yesterday" },
        { id: 2, text: "Thanks for the support!", sender: "user", time: "Yesterday" }
    ],
    3: [
        { id: 1, text: "Package kab deliver hoga?", sender: "user", time: "Yesterday" }
    ],
     4: [
        { id: 1, text: "Can I upgrade my plan?", sender: "user", time: "2 days ago" }
    ]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedContact]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedContact) return;

    // Check if ticket is closed (double check security)
    if (selectedContact.ticketStatus === 'closed') return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: "admin",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));

    setMessageInput("");
  };

  const handleCloseTicket = () => {
      if(!selectedContact) return;
      
      // Update contact status in state
      setContacts(prev => prev.map(c => 
          c.id === selectedContact.id ? {...c, ticketStatus: 'closed'} : c
      ));

      // Update selected contact as well to reflect immediately
      setSelectedContact(prev => ({...prev, ticketStatus: 'closed'}));
  };

  return (
    <div className='flex flex-col h-[calc(100vh-100px)] animate-fade-in-up gap-4'>
        <MainHeading
            title={"Messages"}
            subtitle={"Connect with your users directly"}
        />
        
        <div className="flex flex-1 bg-(--bg-box) rounded-xl overflow-hidden shadow-sm border border-(--border-color)">
            
            {/* LEFT SIDEBAR - CONTACTS */}
            <div className={`w-full md:w-80 border-r border-(--border-color) bg-(--bg-box) flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
                
                {/* Search Bar */}
                <div className="p-4 border-b border-(--border-color)">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-third)" />
                        <input 
                            type="text" 
                            placeholder="Search chats..." 
                            className="w-full pl-10 pr-4 py-2 bg-(--bg-main) rounded-lg text-sm outline-none focus:ring-1 focus:ring-(--text-second) transition-all text-(--text-main)"
                        />
                    </div>
                </div>

                {/* Contact List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {contacts.map(contact => (
                        <div 
                            key={contact.id}
                            onClick={() => setSelectedContact(contact)}
                            className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-(--border-color)/50 hover:bg-(--bg-main)
                                ${selectedContact?.id === contact.id ? 'bg-blue-50/50 border-rn-blue' : ''}
                            `}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                     <FaUserCircle className="text-gray-400 w-full h-full" />
                                </div>
                                {contact.status === 'online' && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className="font-semibold text-sm text-(--text-main) truncate">{contact.name}</h4>
                                    <span className="text-[10px] text-(--text-third) whitespace-nowrap">{contact.time}</span>
                                </div>
                                <p className="text-xs text-(--text-second) truncate">{contact.lastMsg}</p>
                            </div>
                            {contact.unread > 0 && (
                                <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                    {contact.unread}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT AREA - CHAT INTERFACE */}
            <div className={`flex-1 flex flex-col bg-(--bg-main) ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
                
                {selectedContact ? (
                    <>
                        <div className="p-4 bg-(--bg-box) border-b border-(--border-color) flex justify-between items-center shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedContact(null)} className="md:hidden text-(--text-main)">
                                    &larr;
                                </button>
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    <FaUserCircle className="text-gray-400 w-full h-full" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-sm text-(--text-main)">{selectedContact.name}</h3>
                                        {selectedContact.ticketStatus === 'closed' && (
                                            <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200">
                                                Ticket Closed
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-(--text-second)">{selectedContact.status === 'online' ? 'Active Now' : 'Offline'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-(--text-second)">
                                {selectedContact.ticketStatus === 'open' ? (
                                    <button 
                                        onClick={handleCloseTicket}
                                        className="text-xs font-medium bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-1"
                                    >
                                        <MdOutlineClose size={14} /> Close Ticket
                                    </button>
                                ) : ( 
                                    <span className="text-xs text-gray-400 italic flex items-center gap-1 cursor-not-allowed">
                                        <FiCheckSquare size={14} /> Closed
                                    </span>
                                )}
                                <FiMoreVertical className="cursor-pointer hover:text-blue-600 transition-colors" />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-(--bg-main) custom-scrollbar">
                           <div className="text-center text-xs text-(--text-third) my-4">Today</div>
                           {messages[selectedContact.id]?.map((msg) => (
                               <div 
                                    key={msg.id} 
                                    className={`flex w-full ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                   <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm
                                        ${msg.sender === 'admin' 
                                            ? 'bg-blue-600 text-white rounded-br-none' 
                                            : 'bg-(--bg-box) text-(--text-main) border border-(--border-color) rounded-bl-none'
                                        }
                                   `}>
                                       <p>{msg.text}</p>
                                       <span className={`text-[9px] block text-right mt-1 opacity-70
                                            ${msg.sender === 'admin' ? 'text-blue-100' : 'text-(--text-third)'}
                                       `}>
                                           {msg.time}
                                       </span>
                                   </div>
                               </div>
                           ))}
                           <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        
                        {selectedContact.ticketStatus === 'open' ? (
                        <div className="p-4 bg-(--bg-box) border-t border-(--border-color)">
                            <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                                <button type="button" className="text-(--text-second) hover:text-blue-600 p-2">
                                    <FiImage size={20} />
                                </button>
                                <button type="button" className="text-(--text-second) hover:text-blue-600 p-2">
                                    <FiPaperclip size={20} />
                                </button>
                                <input 
                                    type="text" 
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-(--bg-main) border border-(--border-color) rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-(--text-main)"
                                />
                                <button 
                                    type="submit" 
                                    className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 shadow-md shadow-blue-500/30 transition-transform active:scale-95"
                                >
                                    <FiSend size={18} className="translate-x-0.5" />
                                </button>
                            </form>
                        </div>
                        ) : (
                            <div className="p-6 bg-gray-50 border-t border-(--border-color) text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-xs font-medium">
                                    <MdOutlineClose size={14}/>
                                    This ticket is closed. No further replies are allowed.
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
                         <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                             <FiSend className="text-4xl text-blue-500" />
                         </div>
                         <h3 className="text-lg font-semibold text-(--text-main)">Select a Conversation</h3>
                         <p className="text-sm text-(--text-second) max-w-xs mt-2">
                             Choose a contact from the left sidebar to start messaging or view previous conversations.
                         </p>
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

export default Message;
