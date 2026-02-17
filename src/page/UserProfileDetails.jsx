import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserApi, toggleUserBlockApi, loginAsUserApi } from '../api/user-api';
import { MainHeading } from '../Component/Heading';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaNetworkWired, FaMoneyBillWave, FaLock, FaUnlock, FaSignInAlt, FaArrowLeft } from 'react-icons/fa';
import UserCards from '../Component/UserCards';

const UserProfileDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        setLoading(true);
        const res = await getUserApi(id);
        if (res.success) {
            setUser(res.data);
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    const handleBlockUnblock = async () => {
        if (!window.confirm(`Are you sure you want to ${user.active?.isBlocked ? 'unblock' : 'block'} this user?`)) return;
        const res = await toggleUserBlockApi(user._id || user.id); // Handle potential ID difference
        if (res.success) {
            toast.success(res.message);
            fetchUserDetails();
        } else {
            toast.error(res.message);
        }
    };

    const handleLoginAsUser = async () => {
        if (!window.confirm("Are you sure you want to login as this user?")) return;
        const res = await loginAsUserApi(user._id || user.id);
        if (res.success) {
            toast.success(res.message);
            // Default to root, assuming user panel is there or shared auth.
            window.open('/', '_blank');
        } else {
            toast.error(res.message);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
    if (!user) return <div className="p-10 text-center text-red-500">User not found</div>;

    const InfoRow = ({ icon, label, value }) => (
        <div className="flex items-center gap-3 py-3 border-b border-(--bs-border) last:border-0">
            <div className="text-(--text-second) text-lg opacity-70">{icon}</div>
            <div className="flex-1">
                <p className="text-xs text-(--text-second) uppercase font-semibold opacity-80">{label}</p>
                <p className="text-(--text) font-medium">{value || "N/A"}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-(--bs-btn-hover) text-(--text-second) bg-(--bg-box) rounded-lg transition-colors shadow-sm">
                        <FaArrowLeft />
                    </button>
                    <MainHeading title={user.fullName || user.username} subtitle={`User ID: ${user.id || 'N/A'}`} />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleLoginAsUser}
                        className="flex items-center gap-2 px-4 py-2 bg-(--bs-btn) text-(--text-white) rounded-lg hover:opacity-90 transition-opacity shadow-sm font-medium"
                    >
                        <FaSignInAlt /> Login as User
                    </button>
                    <button
                        onClick={handleBlockUnblock}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-opacity shadow-sm hover:opacity-90
                            ${user.active?.isBlocked ? 'bg-green-600' : 'bg-red-600'}
                        `}
                    >
                        {user.active?.isBlocked ? <><FaUnlock /> Unblock User</> : <><FaLock /> Block User</>}
                    </button>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <UserCards
                    icon={<FaMoneyBillWave className="text-green-600" />}
                    totalorders={"Total Income"}
                    iconBg='bg-green-100'
                    amount={`₹${user.income?.totalIncome?.toLocaleString() || 0}`}
                />
                <UserCards
                    icon={<FaNetworkWired className="text-blue-600" />}
                    totalorders={"Total Directs"}
                    iconBg='bg-blue-100'
                    amount={user.totalDirectUsers || 0}
                />
                <UserCards
                    icon={<FaNetworkWired className="text-purple-600" />}
                    totalorders={"Total Team"}
                    iconBg='bg-purple-100'
                    amount={user.totalDownlineUsers || 0}
                />
                <UserCards
                    icon={<FaMoneyBillWave className="text-yellow-600" />}
                    totalorders={"Wallet Balance"}
                    iconBg='bg-yellow-100'
                    amount={`₹${user.deposit?.toLocaleString() || 0}`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Info */}
                <div className="bg-(--bg-box) rounded-2xl p-6 shadow-sm border border-(--bs-border)">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-(--text)">
                        <FaUser className="text-(--bs-text-primary)" /> Personal Details
                    </h3>
                    <div className="space-y-1">
                        <InfoRow icon={<FaUser />} label="Full Name" value={user.fullName} />
                        <InfoRow icon={<FaUser />} label="Username" value={user.username} />
                        <InfoRow icon={<FaEnvelope />} label="Email" value={user.email} />
                        <InfoRow icon={<FaPhone />} label="Mobile" value={user.mobile} />
                        <InfoRow icon={<FaCalendarAlt />} label="Joined Date" value={new Date(user.createdAt).toLocaleDateString()} />
                        <InfoRow icon={<FaCalendarAlt />} label="Active Date" value={user.active?.activeDate ? new Date(user.active.activeDate).toLocaleDateString() : 'Not Active'} />
                    </div>
                </div>

                {/* Network Info */}
                <div className="bg-(--bg-box) rounded-2xl p-6 shadow-sm border border-(--bs-border)">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-(--text)">
                        <FaNetworkWired className="text-(--bs-text-primary)" /> Network Details
                    </h3>
                    <div className="space-y-1">
                        <InfoRow icon={<FaUser />} label="Sponsor ID" value={user.sponsor?.id} />
                        <InfoRow icon={<FaUser />} label="Sponsor Name" value={user.sponsor?.fullName || user.sponsor?.username} />
                        <InfoRow icon={<FaUser />} label="Parent (Placement)" value={user.binaryParent?.fullName || user.binaryParent?.username || "Root"} />
                        <InfoRow icon={<FaNetworkWired />} label="Position" value={user.position} />
                        <InfoRow icon={<FaNetworkWired />} label="Rank" value={user.rankName || "N/A"} />
                    </div>
                </div>

                {/* Income Details */}
                <div className="bg-(--bg-box) rounded-2xl p-6 shadow-sm border border-(--bs-border)">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-(--text)">
                        <FaMoneyBillWave className="text-(--bs-text-primary)" /> Income Breakdown
                    </h3>
                    <div className="space-y-1">
                        <InfoRow icon={<FaMoneyBillWave />} label="Direct Income" value={`₹${user.income?.directBonus?.toLocaleString() || 0}`} />
                        <InfoRow icon={<FaMoneyBillWave />} label="Level Income" value={`₹${user.income?.levelBonus?.toLocaleString() || 0}`} />
                        <InfoRow icon={<FaMoneyBillWave />} label="ROI Income" value={`₹${user.income?.roiBonus?.toLocaleString() || 0}`} />
                        <InfoRow icon={<FaMoneyBillWave />} label="Rank Reward" value={`₹${user.income?.rankBonus?.toLocaleString() || 0}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileDetails;
