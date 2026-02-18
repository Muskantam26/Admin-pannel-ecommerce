import { useRef } from 'react';
import { FaCheckCircle, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import { FiShield, FiDownload, FiFileText } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

const IdentityCard = ({ user }) => {
    const cardRef = useRef(null);
    
    const handleDownloadPNG = async () => {
        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: null });
                const link = document.createElement('a');
                link.download = `${user.fullName || 'User'}_ID_Card.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (error) {
                console.error("Error downloading PNG:", error);
                toast.error("Failed to download ID Card");
            }
        }
    };

    const handleDownloadPDF = async () => {
        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: null });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('landscape', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                // Center the image
                const x = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
                const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

                pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
                pdf.save(`${user.fullName || 'User'}_ID_Card.pdf`);
            } catch (error) {
                console.error("Error downloading PDF:", error);
                toast.error("Failed to download ID Card PDF");
            }
        }
    };

    return (
        <div className="flex flex-col gap-6 items-center">
            <div className="flex gap-3">
                <button
                    onClick={handleDownloadPNG}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold cursor-pointer"
                >
                    <FiDownload /> Download PNG
                </button>
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-semibold cursor-pointer"
                >
                    <FiFileText /> Download PDF
                </button>
            </div>

            <div ref={cardRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-4 bg-transparent">
                {/* FRONT SIDE */}
                <div className="relative w-full max-w-[480px] aspect-[1.586] rounded-3xl overflow-hidden shadow-2xl text-white select-none">
                    {/* Background */}
                    <div className="absolute inset-0 bg-[#1a3c2f] z-0">
                        {/* Texture/Pattern */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2a5c48] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0f261e] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: '1px', borderStyle: 'solid' }}>
                                    {/* <FaCheckCircle className="text-[#a8d5ba]" size={20} /> */}
                                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-2xl font-serif tracking-wide font-bold">AYURVEDA</span>
                            </div>
                            <div className="opacity-80">
                                <FiShield size={24} />
                            </div>
                        </div>

                        {/* Middle - Photo & Details */}
                        <div className="flex items-center gap-6 my-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-2 border-[#a8d5ba] p-1">
                                    <img
                                        src={user.picture || "https://img.icons8.com/color/48/user-male--v2.png"}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover bg-white"
                                    />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-[#a8d5ba] text-[#1a3c2f] rounded-full p-1 border-2 border-[#1a3c2f]">
                                    <FaCheckCircle size={12} />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold font-serif mb-1">{user.fullName || user.username}</h2>
                                <p className="text-[#a8d5ba] font-medium tracking-wider text-sm uppercase mb-1">
                                    {user.basicDetails?.rankName || "Distributor"}
                                </p>
                                <p className="text-xs font-mono tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    ID: {user.id || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] text-[#a8d5ba] uppercase tracking-wider mb-1">Valid Thru</p>
                                <p className="font-mono text-lg font-bold">12/2028</p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                {/* Signature Placeholder */}
                                <div className="text-center">
                                    <p className="font-cursive text-xl opacity-90 leading-none" style={{ fontFamily: 'cursive' }}>{user.fullName?.split(' ')[0] || user.username} S.</p>
                                    <div className="h-px w-24 my-1" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                                    <p className="text-[8px] text-[#a8d5ba] uppercase tracking-wider">Authorized Signature</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-6 right-6">
                            <div className="w-12 h-12 bg-white rounded-xl p-1">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.id}`} alt="QR" className="w-full h-full object-contain" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* BACK SIDE */}
                <div className="relative w-full max-w-[480px] aspect-[1.586] rounded-3xl overflow-hidden shadow-2xl text-white select-none">
                    {/* Background (Same as front) */}
                    <div className="absolute inset-0 bg-[#1a3c2f] z-0">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2a5c48] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0f261e] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-white/20 pb-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-lg font-serif tracking-wide font-bold">TERMS & CONDITIONS</span>
                        </div>

                        {/* Instructions */}
                        <div className="flex-1 py-3">
                            <ul className="space-y-2 text-xs opacity-90 leading-relaxed font-light">
                                <li className="flex gap-2">
                                    <span className="text-[#a8d5ba] font-bold">1.</span>
                                    <span>This card is the property of <b className="text-[#a8d5ba]">Ayurveda</b> and is non-transferable.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-[#a8d5ba] font-bold">2.</span>
                                    <span>The holder of this card is an authorized distributor of Ayurveda products.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-[#a8d5ba] font-bold">3.</span>
                                    <span>If found, please return to the nearest Ayurveda office or contact the support number below.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-[#a8d5ba] font-bold">4.</span>
                                    <span>Misuse of this card may result in termination of the distributorship.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Footer / Contact */}
                        <div className="border-t border-white/20 pt-4 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[10px] opacity-80">
                                    <FaPhoneAlt className="text-[#a8d5ba]" />
                                    <span>+91 123 456 7890</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] opacity-80">
                                    <FaEnvelope className="text-[#a8d5ba]" />
                                    <span>support@ayurveda.com</span>
                                </div>
                            </div>

                            <div className="space-y-1 text-right">
                                <div className="flex items-center justify-end gap-2 text-[10px] opacity-80">
                                    <span>123, Wellness City, India</span>
                                    <FaMapMarkerAlt className="text-[#a8d5ba]" />
                                </div>
                                <div className="flex items-center justify-end gap-2 text-[10px] opacity-80">
                                    <span>www.ayurveda.com</span>
                                    <FaGlobe className="text-[#a8d5ba]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdentityCard;
