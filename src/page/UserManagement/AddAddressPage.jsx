import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../../Component/Heading';
import { FiArrowLeft, FiCheckCircle, FiUser, FiSearch, FiX, FiMapPin } from 'react-icons/fi';
import { createAddressByAdminApi } from '../../api/address-api';
import { searchUserApi } from '../../api/user-api';
import { toast } from 'react-toastify';

const AddAddressPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // User Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        landmark: '',
        alternatePhone: '',
        addressType: 'HOME'
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
        setFormData(prev => ({ ...prev, name: user.fullName || user.username, mobile: user.mobile }));
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
        if (!formData.name || !formData.mobile || !formData.pincode || !formData.locality || !formData.address || !formData.city || !formData.state) {
            toast.error("Please fill all required fields");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                userId: selectedUser._id,
                ...formData
            };

            const res = await createAddressByAdminApi(payload);
            if (res.success) {
                toast.success("Address Added Successfully");
                navigate('/address-requests');
            } else {
                toast.error(res.message || "Failed to add address");
            }
        } catch (error) {
            console.error("Add Address Error", error);
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
                    <button onClick={() => navigate('/address-requests')} className="p-2 hover:bg-[var(--bg-box)] rounded-lg transition-colors text-[var(--text-second)] cursor-pointer">
                        <FiArrowLeft size={22} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-main)]">Add Address</h1>
                        <p className="text-[var(--text-second)] text-sm mt-0.5">Manually add address for a user.</p>
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
                        <Heading title="Address Information" titleSize="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2" icon={<FiMapPin />} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Enter Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Mobile <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="mobile"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Enter Mobile No"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Pincode <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="pincode"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Enter Pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Locality <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="locality"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Enter Locality"
                                    value={formData.locality}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Address Area/Street <span className="text-red-500">*</span></label>
                                <textarea
                                    name="address"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)] min-h-[100px]"
                                    placeholder="Enter Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">City <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="city"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Enter City"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">State <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="state"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Enter State"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Landmark</label>
                                <input
                                    type="text"
                                    name="landmark"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Enter Landmark"
                                    value={formData.landmark}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Alternate Phone</label>
                                <input
                                    type="text"
                                    name="alternatePhone"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    placeholder="Enter Alt Phone"
                                    value={formData.alternatePhone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-second)] mb-1">Address Type</label>
                                <select
                                    name="addressType"
                                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--bs-border)] rounded-xl focus:ring-2 focus:ring-[var(--bs-primary)] outline-none text-[var(--text-main)]"
                                    value={formData.addressType}
                                    onChange={handleChange}
                                >
                                    <option value="HOME">HOME</option>
                                    <option value="WORK">WORK</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Section */}
                <div className="lg:col-span-1">
                    <div className="bg-[var(--bg-box)] rounded-2xl p-6 shadow-sm border border-[var(--bs-border)] sticky top-6">
                        <Heading title="Action" titleSize="text-lg font-bold text-[var(--text-main)] mb-4" />
                        <p className="text-sm text-[var(--text-second)] mb-6">
                            The address details will be added and automatically marked as <strong>Verified</strong>.
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
                                    <FiCheckCircle size={18} /> Add Address
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => navigate('/address-requests')}
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

export default AddAddressPage;
