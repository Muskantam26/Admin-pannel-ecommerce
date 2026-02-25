import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserApi, updateUserApi } from '../api/user-api';
import { MainHeading } from '../Component/Heading';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaArrowLeft, FaSave } from 'react-icons/fa';

const UserProfileEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        dob: '',
        gender: '',
        nomineeName: '',
        nomineeRelation: '',
        nomineeDob: '',
        nomineeMobile: ''
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        setLoading(true);
        const res = await getUserApi(id);
        if (res.success) {
            const user = res.data;
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                mobile: user.mobile || '',
                dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
                gender: user.gender || '',
                nomineeName: user.nominee?.name || '',
                nomineeRelation: user.nominee?.relation || '',
                nomineeDob: user.nominee?.dob ? new Date(user.nominee.dob).toISOString().split('T')[0] : '',
                nomineeMobile: user.nominee?.mobile || ''
            });
        } else {
            toast.error(res.message);
            navigate(-1);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const payload = {
            fullName: formData.fullName,
            email: formData.email,
            mobile: formData.mobile,
            dob: formData.dob,
            gender: formData.gender,
            nominee: {
                name: formData.nomineeName,
                relation: formData.nomineeRelation,
                dob: formData.nomineeDob,
                mobile: formData.nomineeMobile
            }
        };

        const res = await updateUserApi(id, payload);
        if (res.success) {
            toast.success(res.message);
            navigate(-1); // Go back to profile details
        } else {
            toast.error(res.message);
        }
        setFormLoading(false);
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    const InputField = ({ label, name, type = "text", value, onChange, icon }) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-(--text-second) flex items-center gap-2">
                {icon} {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="p-2 rounded-lg border border-(--bs-border) bg-(--bg-box) text-(--text) focus:outline-none focus:ring-2 focus:ring-(--bs-btn-hover)"
            />
        </div>
    );

    const SelectField = ({ label, name, value, onChange, options, icon }) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-(--text-second) flex items-center gap-2">
                {icon} {label}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="p-2 rounded-lg border border-(--bs-border) bg-(--bg-box) text-(--text) focus:outline-none focus:ring-2 focus:ring-(--bs-btn-hover)"
            >
                <option value="">Select {label}</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-(--bs-btn-hover) text-(--text-second) bg-(--bg-box) rounded-lg transition-colors shadow-sm">
                        <FaArrowLeft />
                    </button>
                    <MainHeading title="Edit User Profile" subtitle="Update user information" />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        form="edit-user-form"
                        disabled={formLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-(--bs-btn) text-(--text-white) rounded-lg hover:opacity-90 transition-opacity shadow-sm font-medium text-sm disabled:opacity-50"
                    >
                        <FaSave /> {formLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <form id="edit-user-form" onSubmit={handleSubmit} className="bg-(--bg-box) rounded-2xl p-6 shadow-sm border border-(--bs-border) space-y-6">

                {/* Personal Info */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-(--text) border-b border-(--bs-border) pb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField icon={<FaUser />} label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                        <InputField icon={<FaEnvelope />} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                        <InputField icon={<FaPhone />} label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} />
                        <InputField icon={<FaCalendarAlt />} label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                        <SelectField icon={<FaUser />} label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['MALE', 'FEMALE', 'OTHER']} />
                    </div>
                </div>

                {/* Nominee Info */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-(--text) border-b border-(--bs-border) pb-2">Nominee Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField icon={<FaUser />} label="Nominee Name" name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
                        <InputField icon={<FaUser />} label="Relationship" name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
                        <InputField icon={<FaCalendarAlt />} label="Nominee DOB" name="nomineeDob" type="date" value={formData.nomineeDob} onChange={handleChange} />
                        <InputField icon={<FaPhone />} label="Nominee Mobile" name="nomineeMobile" value={formData.nomineeMobile} onChange={handleChange} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserProfileEditPage;
