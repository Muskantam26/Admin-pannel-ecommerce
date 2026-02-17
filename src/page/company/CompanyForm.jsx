import React, { useState, useEffect } from "react";
import { Heading } from "../../Component/Heading";
import { InputField } from "../../Component/InputBox";
import Button from "../../Component/Btn";
import { Axios } from "../../constant/MainContent";
import { toast } from "react-toastify";
import ImageUpload from "../../Component/Inputs/ImageUpload";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/slice/loadingSlice";

const CompanyForm = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        companyName: "",
        mobile: "",
        email: { email: "", password: "", host: "", port: 465, secure: true },
        logo: "",
        bankDetails: {
            accountName: "",
            accountNumber: "",
            bankName: "",
            ifscCode: "",
            branch: ""
        },
        upiDetails: { upiId: "", qrCode: "" },
        imageKit: { publicKey: "", privateKey: "", urlEndpoint: "" },
        socialLinks: { facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "" },
        address: { street: "", city: "", state: "", zipCode: "", country: "India" }
    });

    const [logoPreview, setLogoPreview] = useState("");
    const [qrPreview, setQrPreview] = useState("");

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const fetchCompanyData = async () => {
        dispatch(showLoader());
        try {
            const res = await Axios.get("/company/get");
            if (res.data.success && res.data.data) {
                const data = res.data.data;
                setFormData(prev => ({
                    ...prev,
                    ...data,
                    email: { ...prev.email, ...data.email },
                    bankDetails: { ...prev.bankDetails, ...data.bankDetails },
                    upiDetails: { ...prev.upiDetails, ...data.upiDetails },
                    imageKit: { ...prev.imageKit, ...data.imageKit },
                    socialLinks: { ...prev.socialLinks, ...data.socialLinks },
                    address: { ...prev.address, ...data.address }
                }));
                // Set previews
                if (data.logo) setLogoPreview(data.logo);
                if (data.upiDetails?.qrCode) setQrPreview(data.upiDetails.qrCode);
            }
        } catch (error) {
            console.error("Error fetching company data:", error);
            // Don't toast error if just not found (first time setup)
        } finally {
            dispatch(hideLoader());
        }
    };

    const handleChange = (e, section = null) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;

        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: val }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleUploadComplete = (url, type) => {
        if (type === "logo") {
            setFormData(prev => ({ ...prev, logo: url }));
            setLogoPreview(url);
        } else if (type === "qr") {
            setFormData(prev => ({
                ...prev,
                upiDetails: { ...prev.upiDetails, qrCode: url }
            }));
            setQrPreview(url);
        }
    };

    const handleSubmit = async () => {
        if (!formData.companyName) return toast.error("Company Name is required");

        dispatch(showLoader());
        try {
            const res = await Axios.post("/company/save", formData);
            if (res.data.success) {
                toast.success(res.data.message);
                fetchCompanyData(); // Refresh data/state
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Error saving company:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            dispatch(hideLoader());
        }
    };

    return (
        <div className="card shadow-lg bg-white w-full h-full p-4 rounded-lg mb-10 overflow-y-auto">
            <Heading title="Company Settings" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                {/* Basic Info */}
                <div className="col-span-2">
                    <h3 className="font-bold text-lg mb-2">Basic Information</h3>
                </div>
                <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
                <InputField label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} />

                <div className="col-span-1">
                    <ImageUpload
                        label="Company Logo"
                        onUploadComplete={(url) => handleUploadComplete(url, 'logo')}
                        previewUrl={logoPreview}
                        onRemove={() => { setLogoPreview(""); setFormData(p => ({ ...p, logo: "" })) }}
                        folder="company/logo"
                    />
                </div>

                {/* Address */}
                <div className="col-span-2 mt-4">
                    <h3 className="font-bold text-lg mb-2">Address</h3>
                </div>
                <InputField label="Street" name="street" value={formData.address.street} onChange={(e) => handleChange(e, 'address')} />
                <InputField label="City" name="city" value={formData.address.city} onChange={(e) => handleChange(e, 'address')} />
                <InputField label="State" name="state" value={formData.address.state} onChange={(e) => handleChange(e, 'address')} />
                <InputField label="Zip Code" name="zipCode" value={formData.address.zipCode} onChange={(e) => handleChange(e, 'address')} />
                <InputField label="Country" name="country" value={formData.address.country} onChange={(e) => handleChange(e, 'address')} />

                {/* Email Settings */}
                <div className="col-span-2 mt-4">
                    <h3 className="font-bold text-lg mb-2">Email Settings (SMTP)</h3>
                </div>
                <InputField label="Email" name="email" value={formData.email.email} onChange={(e) => handleChange(e, 'email')} />
                <InputField label="Password" name="password" type="password" value={formData.email.password} onChange={(e) => handleChange(e, 'email')} />
                <InputField label="Host" name="host" value={formData.email.host} onChange={(e) => handleChange(e, 'email')} />
                <div className="flex gap-4">
                    <InputField label="Port" name="port" type="number" value={formData.email.port} onChange={(e) => handleChange(e, 'email')} />
                    <div className="flex items-center gap-2 mt-6">
                        <input type="checkbox" name="secure" checked={formData.email.secure} onChange={(e) => handleChange(e, 'email')} />
                        <label>Secure (SSL/TLS)</label>
                    </div>
                </div>

                {/* Bank Details */}
                <div className="col-span-2 mt-4">
                    <h3 className="font-bold text-lg mb-2">Bank Details</h3>
                </div>
                <InputField label="Account Name" name="accountName" value={formData.bankDetails.accountName} onChange={(e) => handleChange(e, 'bankDetails')} />
                <InputField label="Account Number" name="accountNumber" value={formData.bankDetails.accountNumber} onChange={(e) => handleChange(e, 'bankDetails')} />
                <InputField label="Bank Name" name="bankName" value={formData.bankDetails.bankName} onChange={(e) => handleChange(e, 'bankDetails')} />
                <InputField label="IFSC Code" name="ifscCode" value={formData.bankDetails.ifscCode} onChange={(e) => handleChange(e, 'bankDetails')} />
                <InputField label="Branch" name="branch" value={formData.bankDetails.branch} onChange={(e) => handleChange(e, 'bankDetails')} />

                {/* UPI Details */}
                <div className="col-span-2 mt-4">
                    <h3 className="font-bold text-lg mb-2">UPI Details</h3>
                </div>
                <InputField label="UPI ID" name="upiId" value={formData.upiDetails.upiId} onChange={(e) => handleChange(e, 'upiDetails')} />
                <div className="col-span-1">
                    <ImageUpload
                        label="QR Code"
                        onUploadComplete={(url) => handleUploadComplete(url, 'qr')}
                        previewUrl={qrPreview}
                        onRemove={() => { setQrPreview(""); setFormData(p => ({ ...p, upiDetails: { ...p.upiDetails, qrCode: "" } })) }}
                        folder="company/qr"
                    />
                </div>

                {/* ImageKit Settings */}
                <div className="col-span-2 mt-4">
                    <h3 className="font-bold text-lg mb-2">ImageKit Configuration</h3>
                </div>
                <InputField label="Public Key" name="publicKey" value={formData.imageKit.publicKey} onChange={(e) => handleChange(e, 'imageKit')} />
                <InputField label="Private Key" name="privateKey" type="password" value={formData.imageKit.privateKey} onChange={(e) => handleChange(e, 'imageKit')} />
                <InputField label="URL Endpoint" name="urlEndpoint" value={formData.imageKit.urlEndpoint} onChange={(e) => handleChange(e, 'imageKit')} />

                {/* Social Links */}
                <div className="col-span-2 mt-4">
                    <h3 className="font-bold text-lg mb-2">Social Links</h3>
                </div>
                <InputField label="Facebook" name="facebook" value={formData.socialLinks.facebook} onChange={(e) => handleChange(e, 'socialLinks')} />
                <InputField label="Instagram" name="instagram" value={formData.socialLinks.instagram} onChange={(e) => handleChange(e, 'socialLinks')} />
                <InputField label="Twitter" name="twitter" value={formData.socialLinks.twitter} onChange={(e) => handleChange(e, 'socialLinks')} />
                <InputField label="LinkedIn" name="linkedin" value={formData.socialLinks.linkedin} onChange={(e) => handleChange(e, 'socialLinks')} />
                <InputField label="YouTube" name="youtube" value={formData.socialLinks.youtube} onChange={(e) => handleChange(e, 'socialLinks')} />

            </div>

            <div className="mt-8 flex justify-end">
                <Button
                    title="Save Changes"
                    onClick={handleSubmit}
                    className="bg-(--bs-btn-third) px-6 py-2 text-white rounded hover:opacity-90"
                />
            </div>
        </div>
    );
};

export default CompanyForm;
