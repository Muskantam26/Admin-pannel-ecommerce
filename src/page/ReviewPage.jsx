import React, { useState } from 'react';
import { Heading, MainHeading } from '../Component/Heading';
import InputBox from '../Component/InputBox';

import {RiDeleteBin6Line } from 'react-icons/ri';
import ConfirmationModal from '../Component/Model/ConfirmationModal';
import { FaStar } from 'react-icons/fa';
import { Cross, Eye } from 'lucide-react';
import Modal from '../Component/Model/Modal';
import Button, { ActionButton } from '../Component/Btn';

const mockReviews = [
  {
    id: 'REV001',
    userName: 'John Doe',
    productName: 'Premium Package',
    rating: 5,
    reviewText: 'Excellent service, highly recommended!',
    date: '2023-10-25',
  },
  {
    id: 'REV002',
    userName: 'Jane Smith',
    productName: 'Standard Package',
    rating: 4,
    reviewText: 'Good value for money, but could improve support time.',
    date: '2023-10-26',
  },
  {
    id: 'REV003',
    userName: 'Alice Johnson',
    productName: 'Basic Package',
    rating: 2.5,
    reviewText: 'It is okay, serves the purpose.',
    date: '2023-10-27',
  },
   {
    id: 'REV004',
    userName: 'Robert Brown',
    productName: 'Ultimate Package',
    rating: 4,
    reviewText: 'Absolutely fantastic! Exceeded all my expectations.',
    date: '2023-10-28',
  },
   {
    id: 'REV005',
    userName: 'Michael Davis',
    productName: 'Premium Package',
    rating: 2,
    reviewText: 'Not what I expected. The features are lacking.',
    date: '2023-10-29',
  }
];

const ReviewPage = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, data: null });
  const [viewModalConfig, setViewModalConfig] = useState({ isOpen: false, data: null });
  const rowsPerPage = 10;

  const handleViewClick = (review) => {
    setViewModalConfig({ isOpen: true, data: review });
  };

  const handleDeleteClick = (review) => {
    setModalConfig({ isOpen: true, data: review });
  };

  const confirmDelete = () => {
    if (modalConfig.data) {
      setReviews(reviews.filter(r => r.id !== modalConfig.data.id));
    }
    setModalConfig({ isOpen: false, data: null });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"} size={14} />
        ))}
      </div>
    );
  };


  const filteredReviews = reviews.filter((review) =>
    (review.userName || "").toLowerCase().includes(search.toLowerCase()) ||
    (review.productName || "").toLowerCase().includes(search.toLowerCase()) ||
    (review.reviewText || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReviews.length / rowsPerPage);
  const paginatedData = filteredReviews.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <div>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <MainHeading
          title={"Review Management"}
          subtitle={"Monitor and manage customer reviews"}
        />
      </div>

      <div className='bg-(--bg-box) rounded-2xl p-5 mt-5 shadow-sm border border-(--bs-border)'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
          <Heading title={"All Reviews"} />
          <div className="w-full sm:w-auto md:w-80">
            <InputBox
              placeholder="Search Review by Name, Product or Text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-(--bg-main)"
            />
          </div>
        </div>
        
        {/* Review Cards List (Grid Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
          {paginatedData.length > 0 ? (
            paginatedData.map((review) => (
              <div 
                key={review.id} 
                className=" grediant-img border border-(--bs-border) rounded-xl p-2 hover:border-blue-400 transition-all shadow-sm hover:shadow-md group relative flex flex-col h-full justify-between"
              >
                <div>
                  <div className="flex flex-col gap-3 mb-3">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h3 className="font-bold text-(--text-main) text-[15px] truncate">{review.userName}</h3>
                        <p className="text-(--text-second) text-[11px] mt-0.5 truncate">{review.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1 border-b border-(--bs-border) border-dashed pb-3">
                      <span className="text-[11px] text-(--text-second) font-medium flex items-center gap-1.5 truncate max-w-[60%]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                        <span className="truncate">{review.productName}</span>
                      </span>
                      <div className="bg-amber-50 dark:bg-amber-900/10 px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-800/20 flex-shrink-0">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-(--text-main) text-[13.5px] leading-relaxed mb-5 mt-3 line-clamp-3">
                    "{review.reviewText}"
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                   <ActionButton
                      title='View Details'
                      onClick={() => handleViewClick(review)}
                      icon={<Eye size={13} />}
                      bg="bg-(--btn-hover)"
                      textColor="text-(--text-hover)"
                      className="px-4 py-1.5 font-medium flex text-[12px]"
                   />
                   <ActionButton
                      title='Delete'
                      onClick={() => handleDeleteClick(review)}
                      icon={<RiDeleteBin6Line size={13} />}
                      bg="bg-(--bs-del)"
                      textColor="text-(--bs-red)"
                      className="px-4 py-1.5 font-medium hover:bg-red-100 flex text-[12px]"
                   />
                </div>
              </div>
            ))
          ) : (
             <div className="py-10 col-span-full text-center text-(--text-second) border border-dashed border-(--bs-border) rounded-xl">
               No reviews found matching "{search}"
             </div>
          )}
        </div>

        {/* Custom Pagination matching CommonDataTable */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4 w-full border-t border-(--bs-border) pt-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-center md:justify-start">
              <p className="text-xs text-(--text-third) whitespace-nowrap">
                Showing {rowsPerPage} Entries
              </p>
            </div>

            <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 text-xs rounded bg-(--bg-main) disabled:opacity-50 whitespace-nowrap"
              >
                Prev
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 text-xs rounded whitespace-nowrap min-w-[2rem]
                        ${currentPage === index + 1
                        ? "bg-(--bg-green) text-(--text-white)"
                        : "bg-(--bg-main)"
                        }`}
                    >
                    {index + 1}
                    </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 text-xs rounded bg-(--bg-main) disabled:opacity-50 whitespace-nowrap"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false, data: null })}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        isDanger={true}
        confirmText="Delete"
      />

      <Modal isOpen={viewModalConfig.isOpen}>
        <div className="p-6 sm:p-8 w-full max-w-2xl mx-auto bg-(--bg-box) rounded-2xl relative shadow-2xl border border-(--bs-border)">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-(--bs-border)">
            <h2 className="text-xl font-bold text-(--text-main) flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                <Eye size={20} />
              </span>
              Review & Rating
            </h2>
            <button
              onClick={() => setViewModalConfig({ isOpen: false, data: null })}
              className="p-2 rounded-full hover:bg-red-50 text-(--text-second) hover:text-red-500 transition-all duration-200 focus:outline-none"
              title="Close"
            >
             
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          {viewModalConfig.data && (
            <div className="space-y-6">
              
              {/* Product Info Highlights */}
              <div className="flex items-center gap-3 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-800/20">
                 <span className="text-[12px] font-semibold text-(--text-second) uppercase tracking-wide">Product</span>
                 <span className="text-(--text-second)">›</span>
                 <span className="text-[14px] font-bold text-(--text-main)">{viewModalConfig.data.productName}</span>
              </div>

              {/* Reviewer Details Array */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-(--bs-border) p-5 rounded-xl bg-(--bg-main)">
              <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xl flex-shrink-0 shadow-sm border border-(--bs-border)">
                    {viewModalConfig.data.userName.charAt(0).toUpperCase()}
                 </div>
                 <div>
                       <p className="text-[16px] font-bold text-(--text-main)">{viewModalConfig.data.userName}</p>
                       <p className="text-[12px] font-medium text-(--text-second) flex items-center gap-1.5 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          {viewModalConfig.data.date}
                       </p>
                 </div>
              </div>

                 <div className="flex flex-col items-start sm:items-end gap-1.5 bg-(--bg-box) p-2 px-4 rounded-lg border border-(--bs-border)">
                    <div className="flex items-center gap-2">
                       {renderStars(viewModalConfig.data.rating)}
                       <span className="bg-green-100 text-green-700 font-bold text-[12px] px-2 py-0.5 rounded-full">
                          {viewModalConfig.data.rating.toFixed(1)}
                       </span>
              </div>
                 </div>
              </div>

              {/* The Actual Review Text */}
              <div className="bg-(--bg-main) p-6 rounded-xl border border-(--bs-border) relative">
                 <div className="absolute top-4 left-4 opacity-10">
                  
                  
                 
                 </div>
                 <p className="text-[15px] font-medium text-(--text-main) leading-loose relative z-10 sm:px-6">
                   {viewModalConfig.data.reviewText}
                 </p>
              </div>

            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ReviewPage;
