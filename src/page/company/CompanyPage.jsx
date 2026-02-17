import React, { useState, useEffect } from "react";
import { MainHeading } from "../../Component/Heading";
import { getCompanyApi } from "../../api/company-api";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/slice/loadingSlice";
import { useNavigate } from "react-router-dom";
import { PathRoutes } from "../../constant/Path";
import {
    MapPin,
    Phone,
    Mail,
    Building2,
    CreditCard,
    QrCode,
    Globe,
    Server,
    Key,
    Edit,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Youtube,
    Image as ImageIcon,
    CheckCircle2
} from "lucide-react";

// Reusable Card Component matching Dashboard style
const DashboardCard = ({ children, className = "" }) => (
    <div className={`bg-(--bg-box) rounded-4xl p-6 shadow-sm ${className}`}>
        {children}
    </div>
);

const SectionHeading = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-(--bs-btn-mod) text-(--bs-btn-forth)">
            <Icon size={20} />
        </div>
        <h3 className="font-bold text-lg text-(--text-main)">{title}</h3>
    </div>
);

const DetailRow = ({ label, value, isCopyable = false }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-dashed border-gray-100 last:border-0">
        <span className="text-xs font-medium text-(--text-third) uppercase tracking-wide">{label}</span>
        <div className="flex items-center gap-2 mt-1 sm:mt-0">
            <span className="font-semibold text-(--text-main) text-right">{value || "N/A"}</span>
        </div>
    </div>
);

const CompanyPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const fetchCompanyData = async () => {
        dispatch(showLoader());
        try {
            const res = await getCompanyApi();
            if (res.success && res.data) {
                setCompany(res.data);
            }
        } catch (error) {
            console.error("Error fetching company data:", error);
        } finally {
            dispatch(hideLoader());
        }
    };

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="bg-(--bg-box) p-10 rounded-4xl shadow-sm max-w-lg w-full">
                    <Building2 size={64} className="mx-auto text-(--text-third) mb-6 opacity-50" />
                    <MainHeading title="Setup Organization" subtitle="Configure your company profile to get started" />
                    <button
                        onClick={() => navigate(PathRoutes.COMPANY_FORM)}
                        className="mt-8 bg-(--bs-btn-third) text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition w-full"
                    >
                        Add Company Details
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="md:mt-5 overflow-x-hidden pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <MainHeading
                    title="Organization Profile"
                    subtitle="Manage your company's identity and configurations"
                />
                <button
                    onClick={() => navigate(PathRoutes.COMPANY_FORM)}
                    className="flex items-center gap-2 bg-(--bs-btn-third) text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:opacity-90 transition active:scale-95"
                >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Left Column: Identity & Overview */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Identity Card */}
                    <DashboardCard className="text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-50 z-0"></div>
                        <div className="relative z-10 pt-16">
                            <div className="w-40 h-40 mx-auto bg-white rounded-3xl shadow-lg p-3 mb-4 flex items-center justify-center">
                                {company.logo ? (
                                    <img src={company.logo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <ImageIcon size={48} className="text-gray-300" />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-(--text-main) mb-1">{company.companyName}</h2>
                            <div className="flex items-center justify-center gap-2 text-(--text-second) text-sm mb-4">
                                <span className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    <CheckCircle2 size={12} /> Verified Business
                                </span>
                            </div>
                        </div>
                    </DashboardCard>

                    {/* Contact Information */}
                    <DashboardCard>
                        <SectionHeading icon={Phone} title="Contact Details" />
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                                <div className="p-2 bg-white rounded-xl shadow-sm text-blue-500"><Phone size={20} /></div>
                                <div>
                                    <p className="text-xs text-(--text-third) font-bold uppercase">Mobile Number</p>
                                    <p className="font-semibold text-(--text-main)">{company.mobile}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                                <div className="p-2 bg-white rounded-xl shadow-sm text-red-500"><Mail size={20} /></div>
                                <div>
                                    <p className="text-xs text-(--text-third) font-bold uppercase">Email Address</p>
                                    <p className="font-semibold text-(--text-main)">{company.email?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-2xl">
                                <div className="p-2 bg-white rounded-xl shadow-sm text-green-500 shrink-0"><MapPin size={20} /></div>
                                <div>
                                    <p className="text-xs text-(--text-third) font-bold uppercase">Registered Office</p>
                                    <p className="font-semibold text-(--text-main) text-sm leading-relaxed">
                                        {company.address?.street}, {company.address?.city}, {company.address?.state} - {company.address?.zipCode}, {company.address?.country}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DashboardCard>

                    {/* Social Links */}
                    <DashboardCard>
                        <SectionHeading icon={Globe} title="Social Media" />
                        <div className="flex flex-wrap gap-3">
                            {[
                                { icon: Facebook, link: company.socialLinks?.facebook, color: "text-blue-600", bg: "bg-blue-50" },
                                { icon: Instagram, link: company.socialLinks?.instagram, color: "text-pink-600", bg: "bg-pink-50" },
                                { icon: Twitter, link: company.socialLinks?.twitter, color: "text-blue-400", bg: "bg-blue-50" },
                                { icon: Linkedin, link: company.socialLinks?.linkedin, color: "text-blue-700", bg: "bg-blue-50" },
                                { icon: Youtube, link: company.socialLinks?.youtube, color: "text-red-600", bg: "bg-red-50" },
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.link || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center justify-center w-12 h-12 rounded-2xl ${social.link ? social.bg + ' ' + social.color : 'bg-gray-50 text-gray-300 pointer-events-none'} transition hover:scale-110`}
                                >
                                    <social.icon size={22} />
                                </a>
                            ))}
                        </div>
                    </DashboardCard>
                </div>

                {/* Right Column: Financials & Verification */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Financial Overview - Two Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bank Details */}
                        <DashboardCard className="bg-gradient-to-br from-white to-gray-50">
                            <SectionHeading icon={Building2} title="Banking Information" />
                            <div className="space-y-1">
                                <DetailRow label="Bank Name" value={company.bankDetails?.bankName} />
                                <DetailRow label="Account Holder" value={company.bankDetails?.accountName} />
                                <DetailRow label="Account Number" value={company.bankDetails?.accountNumber} />
                                <DetailRow label="IFSC Code" value={company.bankDetails?.ifscCode} />
                                <DetailRow label="Branch" value={company.bankDetails?.branch} />
                            </div>
                        </DashboardCard>

                        {/* UPI */}
                        <DashboardCard className="bg-gradient-to-br from-white to-gray-50">
                            <SectionHeading icon={CreditCard} title="UPI Configuration" />
                            <div className="flex flex-col h-[calc(100%-60px)] justify-between">
                                <DetailRow label="Merchant UPI ID" value={company.upiDetails?.upiId} />
                                <div className="mt-6 bg-white p-4 rounded-3xl border border-dashed border-gray-200 text-center">
                                    {company.upiDetails?.qrCode ? (
                                        <>
                                            <img src={company.upiDetails.qrCode} alt="QR Code" className="w-32 h-32 object-contain mx-auto mix-blend-multiply" />
                                            <p className="text-xs text-gray-400 mt-2">Scan to Verify Payment</p>
                                        </>
                                    ) : (
                                        <div className="py-8 text-gray-300">
                                            <QrCode size={40} className="mx-auto mb-2" />
                                            <p className="text-xs">QR Code Not Available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* Technical Configuration */}
                    <DashboardCard>
                        <SectionHeading icon={Server} title="System Configurations" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* SMTP */}
                            <div className="bg-[#f2f7fa] p-5 rounded-3xl">
                                <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <Mail size={16} /> SMTP Settings
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Host</span>
                                        <span className="font-medium text-gray-800">{company.email?.host}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Port</span>
                                        <span className="font-medium text-gray-800">{company.email?.port}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Encryption</span>
                                        <span className={`font-medium ${company.email?.secure ? "text-green-600" : "text-gray-800"}`}>
                                            {company.email?.secure ? "SSL/TLS" : "None"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ImageKit */}
                            <div className="bg-[#f2f7fa] p-5 rounded-3xl">
                                <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <ImageIcon size={16} /> ImageKit
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Endpoint</span>
                                        <span className="font-medium text-gray-800 break-all text-right w-1/2">{company.imageKit?.urlEndpoint}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Public Key</span>
                                        <span className="font-medium text-gray-800 break-all text-right w-1/2">{company.imageKit?.publicKey}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
};

export default CompanyPage;
