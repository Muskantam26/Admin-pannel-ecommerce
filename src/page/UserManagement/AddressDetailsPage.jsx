import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainHeading } from '../../Component/Heading';
import { getAddressByIdApi } from '../../api/address-api'; // We need to add this
import { FiArrowLeft, FiMapPin, FiUser, FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiPhone } from 'react-icons/fi';
import { toast } from 'react-toastify';


const AddressDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAddressDetails();
    }, [id]);

    const fetchAddressDetails = async () => {
        setLoading(true);
        const res = await getAddressByIdApi(id);
        if (res.success) {
            setAddress(res.data);
        } else {
            toast.error(res.message);
            navigate('/address-requests');
        }
        setLoading(false);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-(--bg-main)">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!address) return null;

    return (
        <div className="pb-20 min-h-screen bg-(--bg-main)">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-[var(--bg-main)] rounded-lg transition-colors text-(--text-second) bg-[var(--bg-box)] border border-(--bs-border) shadow-sm"
                >
                    <FiArrowLeft size={22} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-(--text-main)">Address Details</h1>
                    <p className="text-(--text-second) text-sm mt-0.5">View address information.</p>
                </div>
                <div className="ml-auto">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border shadow-sm
                        ${address.status === 'VERIFIED' ? 'bg-green-50 text-green-700 border-green-200' :
                            address.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'}`}
                    >
                        {address.status === 'VERIFIED' ? <FiCheckCircle /> :
                            address.status === 'REJECTED' ? <FiXCircle /> : <FiClock />}
                        {address.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* User Info Card */}
                <div className="lg:col-span-1">
                    <div className="bg-(--bg-box) rounded-3xl p-6 shadow-sm border border-(--bs-border) sticky top-6">
                        <div className="flex items-center gap-2 mb-6 text-(--text-main)">
                            <FiUser size={20} className="text-(--bs-primary)" />
                            <h3 className="text-lg font-bold">User Information</h3>
                        </div>

                        <div className="flex flex-col items-center mb-6">
                            <img
                                src={address.userId?.picture || "https://img.icons8.com/color/96/user-male--v2.png"}
                                className="w-24 h-24 rounded-full object-cover border-4 border-[var(--bg-box)] shadow-md bg-[var(--bg-main)] mb-4"
                                alt=""
                            />
                            <h2 className="text-xl font-bold text-(--text-main)">{address.userId?.username}</h2>
                            <p className="text-sm text-(--text-second)">{address.userId?.email}</p>
                            <span className="mt-2 px-3 py-1 bg-[var(--bg-main)] text-(--text-second) rounded-full text-xs font-mono border border-[var(--bs-border)]">
                                ID: {address.userId?.id}
                            </span>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-dashed border-(--bs-border)">
                            <div>
                                <span className="text-xs font-bold text-(--text-second) uppercase tracking-wide block mb-1">Mobile</span>
                                <p className="font-medium text-(--text-main)">{address.userId?.mobile || "N/A"}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-(--text-second) uppercase tracking-wide block mb-1">Joined Date</span>
                                <p className="font-medium text-(--text-main)">{new Date(address.userId?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Details Card */}
                <div className="lg:col-span-2">
                    <div className="bg-(--bg-box) rounded-3xl p-8 shadow-sm border border-(--bs-border) relative overflow-hidden group">

                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <FiMapPin size={150} />
                        </div>

                        <div className="flex items-center gap-2 mb-8 text-(--text-main) relative z-10">
                            <div className="p-3 bg-[var(--bg-main)] text-[var(--bs-primary)] rounded-xl border border-[var(--bs-border)]">
                                <FiMapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Address Information</h3>
                                <p className="text-sm text-(--text-second)">Full address details</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div>
                                <span className="text-xs font-bold text-(--text-second) uppercase tracking-wider block mb-1.5">Recipient Name</span>
                                <p className="text-lg font-bold text-(--text-main)">{address.name}</p>
                            </div>

                            <div>
                                <span className="text-xs font-bold text-(--text-second) uppercase tracking-wider block mb-1.5">Mobile Number</span>
                                <p className="text-lg font-mono font-medium text-(--text-main) flex items-center gap-2">
                                    <FiPhone className="text-[var(--icon-color)]" size={16} /> {address.mobile}
                                </p>
                            </div>

                            <div className="md:col-span-2 p-5 bg-[var(--bg-main)] rounded-2xl border border-[var(--bs-border)]">
                                <span className="text-xs font-bold text-(--text-second) uppercase tracking-wider block mb-2">Full Address</span>
                                <p className="text-base text-(--text-main) leading-relaxed">
                                    {address.locality}, {address.address}
                                </p>
                                <p className="text-base text-(--text-main) mt-1 font-medium">
                                    {address.city}, {address.state} - <span className="font-mono text-[var(--bs-primary)]">{address.pincode}</span>
                                </p>
                                {address.landmark && (
                                    <p className="text-sm text-(--text-second) mt-3 pt-3 border-t border-[var(--bs-border)] flex items-center gap-2">
                                        <span className="font-semibold">Landmark:</span> {address.landmark}
                                    </p>
                                )}
                            </div>

                            <div>
                                <span className="text-xs font-bold text-(--text-second) uppercase tracking-wider block mb-1.5">Address Type</span>
                                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-block
                                     ${address.addressType === 'HOME' ? 'bg-[var(--bg-main)] text-[var(--text-main)] border-[var(--bs-border)]' : 'bg-[var(--bg-main)] text-[var(--text-second)] border-[var(--bs-border)]'}`}>
                                    {address.addressType}
                                </span>
                            </div>

                            {address.alternatePhone && (
                                <div>
                                    <span className="text-xs font-bold text-(--text-second) uppercase tracking-wider block mb-1.5">Alternate Phone</span>
                                    <p className="font-mono text-(--text-main)">{address.alternatePhone}</p>
                                </div>
                            )}

                            <div>
                                <span className="text-xs font-bold text-(--text-second) uppercase tracking-wider block mb-1.5">Default Address</span>
                                <p className={`font-medium ${address.isDefault ? 'text-green-600' : 'text-[var(--text-second)]'}`}>
                                    {address.isDefault ? "Yes" : "No"}
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-bold text-(--text-second) uppercase tracking-wider block mb-1.5">Created On</span>
                                <p className="font-mono text-(--text-main) flex items-center gap-2">
                                    <FiCalendar className="text-[var(--icon-color)]" /> {new Date(address?.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressDetailsPage;
