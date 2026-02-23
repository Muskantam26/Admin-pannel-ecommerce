import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../../Component/Heading';
import { FiArrowLeft, FiCheckCircle, FiUser, FiSearch, FiX, FiCreditCard } from 'react-icons/fi';
import { createBankByAdminApi } from '../../api/bank-api';
import { searchUserApi } from '../../api/user-api';
import { toast } from 'react-toastify';

const AddBankPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // User Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        branchName: '',
        upiId: ''
    });

    const [ifscLoading, setIfscLoading] = useState(false);

    const [verifyingAccount, setVerifyingAccount] = useState(false);
    const [verifyingUpi, setVerifyingUpi] = useState(false);

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

    // IFSC Auto-fill
    useEffect(() => {
        const fetchBankDetails = async () => {
            const ifsc = formData.ifscCode.toUpperCase();
            if (ifsc.length === 11) {
                setIfscLoading(true);
                try {
                    // Use a direct fetch or axios without the base URL interceptor if possible
                    // Or just use fetch to avoid axios instance issues
                    const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
                    if (response.ok) {
                        const data = await response.json();
                        setFormData(prev => ({
                            ...prev,
                            bankName: data.BANK,
                            branchName: data.BRANCH
                        }));
                        toast.success("Bank Details Found!");
                    } else {
                        toast.error("Invalid IFSC Code");
                        setFormData(prev => ({
                            ...prev,
                            bankName: '',
                            branchName: ''
                        }));
                    }
                } catch (error) {
                    console.error("IFSC Error", error);
                    toast.error("Error fetching bank details");
                } finally {
                    setIfscLoading(false);
                }
            }
        };

        const timeout = setTimeout(() => {
            if (formData.ifscCode.length === 11) {
                fetchBankDetails();
            }
        }, 500); // 500ms debounce for IFSC

        return () => clearTimeout(timeout);
    }, [formData.ifscCode]);

    // Mock Account Number Verification
    useEffect(() => {
        const verifyAccount = () => {
            if (formData.accountNumber.length > 8) {
                setVerifyingAccount(true);
                setTimeout(() => {
                    setVerifyingAccount(false);
                    if (selectedUser) {
                        setFormData(prev => ({ ...prev, accountHolderName: selectedUser.username }));
                        toast.success("Account Holder Verified");
                    } else {
                        toast.error("Please select a user to verify account");
                    }
                }, 1500);
            }
        };

        const timeout = setTimeout(() => {
            if (formData.accountNumber.length > 8) {
                verifyAccount();
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [formData.accountNumber, selectedUser]); // Removed formData.accountHolderName to allow overwrite

    // Mock UPI Verification
    useEffect(() => {
        const verifyUpi = () => {
            if (formData.upiId.length > 5 && formData.upiId.includes('@')) {
                setVerifyingUpi(true);
                setTimeout(() => {
                    setVerifyingUpi(false);
                    if (selectedUser) {
                        setFormData(prev => ({ ...prev, accountHolderName: selectedUser.username }));
                        toast.success("UPI ID Verified");
                    } else {
                        toast.error("Please select a user to verify UPI");
                    }
                }, 1500);
            }
        };

        const timeout = setTimeout(() => {
            if (formData.upiId.length > 5 && formData.upiId.includes('@')) {
                verifyUpi();
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [formData.upiId, selectedUser]);


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
        // setFormData(prev => ({ ...prev, accountHolderName: user.username })); // Removed auto-fill on select to simulate fetch
        setSearchQuery('');
        setUserResults([]);
    };

    const handleClearUser = () => {
        setSelectedUser(null);
        setSearchQuery('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            toast.error("Please search and select a user first");
            return;
        }
        if (!formData.bankName || !formData.accountNumber || !formData.ifscCode || !formData.accountHolderName) {
            toast.error("Please fill all required fields");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                userId: selectedUser._id,
                ...formData
            };

            const res = await createBankByAdminApi(payload);
            if (res.success) {
                toast.success("Bank Details Added Successfully");
                navigate('/bank-requests');
            } else {
                toast.error(res.message || "Failed to add bank details");
            }
        } catch (error) {
            console.error("Add Bank Error", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-20 relative min-h-screen bg-[var(--bg-main)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/bank-requests')} className="p-2 hover:bg-[var(--bg-box)] rounded-lg transition-colors text-[var(--text-second)] cursor-pointer">
                        <FiArrowLeft size={22} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-main)]">Add Bank Details</h1>
                        <p className="text-[var(--text-second)] text-sm mt-0.5">Manually add bank account for a user.</p>
                    </div>
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
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                                        {userResults.map(user => (
                                            <div
                                                key={user._id}
                                                onClick={() => handleSelectUser(user)}
                                                className="p-3 hover:bg-[var(--bg-box)] cursor-pointer flex items-center gap-3 border-b border-[var(--bs-border)] last:border-0 transition"
                                            >
                                                <img src={user.picture || "https://img.icons8.com/color/48/user-male--v2.png"} alt="" className="w-10 h-10 rounded-full object-cover bg-[var(--bg-main)]" />
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
                            <div className="bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border-2 border-[var(--bg-main)] shadow-sm overflow-hidden bg-[var(--bg-box)]">
                                        <img src={selectedUser.picture || "https://img.icons8.com/color/48/user-male--v2.png"} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--text-main)]">{selectedUser.username}</p>
                                        <p className="text-xs text-[var(--text-second)]">{selectedUser.email}</p>
                                        <span className="text-[10px] bg-[var(--bg-main)] border border-[var(--bs-border)] text-[var(--bs-primary)] px-1.5 py-0.5 rounded font-mono mt-1 inline-block">{selectedUser.id}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClearUser}
                                    className="p-2 hover:bg-[var(--bg-box)] rounded-lg text-red-500 transition shadow-sm border border-transparent hover:border-(--bs-border) cursor-pointer"
                                    title="Remove User"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-[var(--bg-box)] rounded-2xl p-6 shadow-sm border border-[var(--bs-border)]">
                        <Heading title="Bank Information" titleSize="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2" icon={<FiCreditCard />} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Bank Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="bankName"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Enter Bank Name"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Branch Name</label>
                                <input
                                    type="text"
                                    name="branchName"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Enter Branch Name"
                                    value={formData.branchName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Account Holder Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="accountHolderName"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Enter Account Holder Name"
                                    value={formData.accountHolderName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Account Number <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)] pr-10"
                                        placeholder="Enter Account Number"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                    />
                                    {verifyingAccount && (
                                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">IFSC Code <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="ifscCode"
                                        className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)] uppercase pr-10"
                                        placeholder="Enter IFSC Code"
                                        value={formData.ifscCode}
                                        onChange={handleChange}
                                        maxLength={11}
                                    />
                                    {ifscLoading && (
                                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">UPI ID (Optional)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="upiId"
                                        className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)] pr-10"
                                        placeholder="Enter UPI ID"
                                        value={formData.upiId}
                                        onChange={handleChange}
                                    />
                                    {verifyingUpi && (
                                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Section */}
                <div className="lg:col-span-1">
                    <div className="bg-[var(--bg-box)] rounded-2xl p-6 shadow-sm border border-[var(--bs-border)] sticky top-6">
                        <Heading title="Action" titleSize="text-lg font-bold text-[var(--text-main)] mb-4" />
                        <p className="text-sm text-[var(--text-second)] mb-6">
                            The bank details will be added and automatically marked as <strong>Verified</strong>.
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
                                    <FiCheckCircle size={18} /> Add Bank
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => navigate('/bank-requests')}
                            disabled={loading}
                            className="w-full mt-3 py-3 bg-[var(--bg-main)] hover:bg-[var(--bg-box)] border border-[var(--bs-border)] text-[var(--text-second)] rounded-xl font-bold transition-all flex justify-center items-center gap-2 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBankPage;
