import React, { useState, useEffect } from 'react';
import { Heading, MainHeading } from '../Component/Heading';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiUploadCloud, FiTrash2, FiUser, FiCreditCard, FiSearch, FiX, FiDollarSign } from 'react-icons/fi';
import { uploadFile, convertToBase64 } from '../utils/fileUpload';
import { depositFundApi } from '../api/transaction-api'; // Ensure this is exported from api
import { searchUserApi } from '../api/user-api';
import { toast } from 'react-toastify';
import { FaIndianRupeeSign } from 'react-icons/fa6';

const DepositPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // User Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const [formData, setFormData] = useState({
        amount: '',
        type: 'DEPOSIT',
        paymentMode: 'CASH',
        transactionId: '',
        remarks: '',
        screenshot: null,
        screenshotPreview: null
    });

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 3 && !selectedUser) {
                handleSearch();
            } else if (searchQuery.length < 3) {
                setUserResults([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = async () => {
        setIsSearching(true);
        const res = await searchUserApi(searchQuery);
        if (res.success) {
            setUserResults(res.data);
        } else {
            setUserResults([]);
        }
        setIsSearching(false);
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchQuery(''); // Clear search query to hide results
        setUserResults([]);
    };

    const handleClearUser = () => {
        setSelectedUser(null);
        setSearchQuery('');
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        setFormData(prev => ({
            ...prev,
            screenshot: file,
            screenshotPreview: preview
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            toast.error("Please search and select a user first");
            return;
        }
        if (!formData.amount || Number(formData.amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setLoading(true);
        try {
            // Upload Screenshot if exists
            let screenshotUrl = null;
            if (formData.screenshot) {
                const base64 = await convertToBase64(formData.screenshot);
                screenshotUrl = await uploadFile(base64, "deposits");
                if (!screenshotUrl) throw new Error("Screenshot upload failed");
            }

            // Submit Deposit
            const payload = {
                userId: selectedUser._id,
                amount: formData.amount,
                type: formData.type, // Send type (DEPOSIT/WITHDRAWAL)
                paymentMode: formData.paymentMode,
                transactionId: formData.transactionId || `ADMIN-${Date.now()}`,
                remarks: formData.remarks,
                screenShot: screenshotUrl
            };

            const res = await depositFundApi(payload);
            if (res.success) {
                toast.success(res.message);
                navigate('/deposit-requests'); // Redirect to list
            } else {
                toast.error(res.message || "Failed to process transaction");
            }

        } catch (error) {
            console.error("Deposit Error", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-20 relative min-h-screen bg-[var(--bg-main)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/deposit-requests')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[var(--text-second)]">
                        <FiArrowLeft size={22} />
                    </button>
                    <MainHeading 
                        title="Add Manual Deposit"
                        subtitle="Credit funds to user wallet manually."
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">

                    {/* User Selection */}
                    <div className="bg-[var(--bg-box)] rounded-2xl p-6 shadow-sm border border-[var(--bs-border)] relative">
                        <Heading title="Select User" titleSize="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2" icon={<FiUser />} />

                        {!selectedUser ? (
                            <div className="relative">
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Search User (Username / ID / Email)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)] transition-all"
                                        placeholder="Type to search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoComplete="off"
                                    />
                                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-second)]" size={18} />
                                    {isSearching && <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
                                </div>

                                {/* Search Results Dropdown */}
                                {userResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--bs-border)] rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                                        {userResults.map(user => (
                                            <div
                                                key={user._id}
                                                onClick={() => handleSelectUser(user)}
                                                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-0 transition"
                                            >
                                                <img src={user.picture || "https://img.icons8.com/color/48/user-male--v2.png"} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                                                <div>
                                                    <p className="text-sm font-bold text-[var(--text-main)]">{user.username}</p>
                                                    <p className="text-xs text-[var(--text-second)]">{user.email} • {user.id}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Selected User Card */
                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-200">
                                        <img src={selectedUser.picture || "https://img.icons8.com/color/48/user-male--v2.png"} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--text-main)]">{selectedUser.username}</p>
                                        <p className="text-xs text-[var(--text-second)]">{selectedUser.email}</p>
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono mt-1 inline-block">{selectedUser.id}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClearUser}
                                    className="p-2 hover:bg-white rounded-lg text-red-500 transition shadow-sm border border-transparent hover:border-gray-200"
                                    title="Remove User"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-[var(--bg-box)] rounded-2xl p-6 shadow-sm border border-[var(--bs-border)]">
                        <Heading title="Deposit Details" titleSize="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2" icon={<FiCreditCard />} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Amount (₹) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <FaIndianRupeeSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-second)]" />
                                    <input
                                        type="number"
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Transaction Type</label>
                                <select
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)] appearance-none"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="DEPOSIT">Deposit (Credit)</option>
                                    <option value="WITHDRAWAL">Withdrawal (Debit)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Payment Mode</label>
                                <select
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)] appearance-none"
                                    value={formData.paymentMode}
                                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                                >
                                    <option value="CASH">CASH</option>
                                    <option value="BANK_TRANSFER">BANK TRANSFER</option>
                                    <option value="UPI">UPI</option>
                                    <option value="MANUAL">MANUAL ADJUSTMENT</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Transaction ID (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Enter Tx ID or Leave Blank"
                                    value={formData.transactionId}
                                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Remarks (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Any notes..."
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Screenshot Upload */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-second)] mb-2">Screenshot (Optional)</label>
                            <div className="border-2 border-dashed border-[var(--bs-border)] rounded-xl p-4 text-center hover:bg-[var(--bg-main)] transition cursor-pointer relative overflow-hidden h-40 flex items-center justify-center bg-[var(--bg-box)]">
                                {formData.screenshotPreview ? (
                                    <>
                                        <img src={formData.screenshotPreview} alt="Screenshot" className="absolute inset-0 w-full h-full object-contain p-2" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, screenshot: null, screenshotPreview: null })}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg shadow-sm z-10 hover:bg-red-600 transition"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-50 p-3 rounded-full mb-2">
                                            <FiUploadCloud className="text-blue-500" size={24} />
                                        </div>
                                        <span className="text-sm font-medium text-[var(--text-main)]">Click to Upload Proof</span>
                                        <span className="text-xs text-[var(--text-second)] mt-1">JPG, PNG (Max 5MB)</span>
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Section */}
                <div className="lg:col-span-1">
                    <div className="bg-[var(--bg-box)] rounded-2xl p-6 shadow-sm border border-[var(--bs-border)] sticky top-6">
                        <Heading title="Action" titleSize="text-lg font-bold text-[var(--text-main)] mb-4" />
                        <p className="text-sm text-[var(--text-second)] mb-6">
                            By clicking submit, the funds will be <strong>immediately credited</strong> to the user's wallet.
                        </p>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3 bg-(--btn-hover) hover:opacity-90 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <FiCheckCircle size={18} /> Submit & Credit
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => navigate('/deposit-requests')}
                            disabled={loading}
                            className="w-full mt-3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepositPage;
