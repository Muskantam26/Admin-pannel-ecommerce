import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderByIdApi } from '../../api/order-api';
import PageLoader from '../../Component/PageLoader';
import { MainContent } from '../../constant/MainContent';
import { toast } from 'react-toastify';
import { FiPrinter, FiDownload } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CommonDataTable from '../../Component/CommonDataTable';

const InvoicePage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const invoiceRef = useRef();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await getOrderByIdApi(id);
                if (response.success) {
                    setOrder(response.data);
                }
            } catch (error) {
                console.error("Error fetching order:", error);
                toast.error("Failed to load invoice data");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        const element = invoiceRef.current;
        if (!element) return;

        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Invoice_${order?.orderId || 'Order'}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error("Failed to generate PDF");
        }
    };

    if (loading) return <PageLoader />;
    if (!order) return <div className="p-10 text-center text-red-500">Invoice not found</div>;

    const invoiceColumns = [
        {
            name: "Image",
            selector: (row) => row.image,
            imageSelector: (row) => row.image, // required for CommonDataTable excel export
            cell: (row) => (
                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                    <img
                        src={row.image}
                        alt={row.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/50?text=IMG'
                        }}
                    />
                </div>
            ),
            width: "80px"
        },
        {
            name: "Item Details",
            cell: (row) => (
                <div>
                    <p className="font-bold text-[var(--text-main)] text-sm mb-1 print:text-gray-900">{row.name}</p>
                    {row.variants && row.variants.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {row.variants.map((v, i) => (
                                <span key={i} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded font-medium border border-gray-200">
                                    {v.variantType}: {v.variantValue}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )
        },
        {
            name: "Qty",
            selector: (row) => row.quantity,
            center: true,
            width: "100px"
        },
        {
            name: "Price",
            selector: (row) => `₹${row.price.toLocaleString()}`,
            right: true,
            width: "120px"
        },
        {
            name: "Total",
            selector: (row) => `₹${(row.price * row.quantity).toLocaleString()}`,
            right: true,
            width: "120px"
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 print:bg-white print:p-0 font-sans">
            <style type="text/css" media="print">
                {`
                @page { size: auto; margin: 0; }
                body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                `}
            </style>

            {/* Actions Bar - Hidden on Print */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-end gap-3 print:hidden">
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm font-medium"
                >
                    <FiDownload /> Download PDF
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors shadow-md text-sm font-medium"
                >
                    <FiPrinter /> Print Invoice
                </button>
            </div>

            {/* Invoice Container */}
            <div
                ref={invoiceRef}
                className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none"
                id="invoice-content"
            >
                {/* Decorative Top Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 print:from-blue-600 print:to-indigo-600"></div>

                <div className="p-8 md:p-12 print:p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <img src={MainContent.appLogo} alt="Logo" className="h-12 w-auto object-contain" />
                            </div>
                            <div className="text-gray-500 text-sm leading-relaxed font-medium">
                                <p>123 Business Street, Tech City</p>
                                <p>Maharashtra, India - 400001</p>
                                <p className="mt-1">support@aayucare.com</p>
                                <p>+91 98765 43210</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h1 className="text-5xl font-extrabold text-gray-100 uppercase tracking-tighter mb-2 print:text-gray-200">Invoice</h1>
                            <p className="text-gray-900 font-bold text-lg">#{order.orderId}</p>
                            <p className="text-gray-500 text-sm mt-1 font-medium">Date: <span className="text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</span></p>

                            <div className="mt-3">
                                {order.orderStatus === 'PAID' || order.paymentStatus === 'PAID' ? (
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-green-50 text-green-700 border border-green-200">
                                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                        Paid
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-red-50 text-red-700 border border-red-200">
                                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                                        Unpaid
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 print:bg-white print:border-gray-200 print:p-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Bill To</h3>
                            <div className="text-gray-700 text-sm leading-relaxed">
                                <p className="font-bold text-gray-900 text-base mb-1">{order.userId?.fullName || order.userId?.username}</p>
                                <p className="mb-1">{order.userId?.email}</p>
                                <p>{order.userId?.mobile}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 print:bg-white print:border-gray-200 print:p-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Ship To</h3>
                            <div className="text-gray-700 text-sm leading-relaxed">
                                <p className="font-bold text-gray-900 text-base mb-1">{order.shippingAddress?.name}</p>
                                <p className="mb-1">{order.shippingAddress?.address}</p>
                                <p className="mb-1">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
                                <p>Ph: {order.shippingAddress?.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="mb-10 overflow-hidden rounded-xl border border-gray-200 shadow-sm print:shadow-none print:border-gray-300">
                        <CommonDataTable 
                            columns={invoiceColumns}
                            data={order.items || []}
                            selectable={false}
                            rowsPerPage={order.items?.length || 0}
                            currentPage={1}
                            totalPages={1}
                            onPageChange={() => {}}
                        />
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end mb-12">
                        <div className="w-80 space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100 print:bg-white print:border-none print:p-0">
                            <div className="flex justify-between text-sm text-gray-600 font-medium">
                                <span>Subtotal</span>
                                <span>₹{order.subTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 font-medium">
                                <span>Shipping Cost</span>
                                <span>₹{order.shippingCost.toLocaleString()}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-emerald-600 font-medium">
                                    <span>Discount</span>
                                    <span>- ₹{order.discount.toLocaleString()}</span>
                                </div>
                            )}
                            {order.coupon?.discountValue > 0 && (
                                <div className="flex justify-between text-sm text-emerald-600 font-medium">
                                    <span>Coupon ({order.coupon.code})</span>
                                    <span>- ₹{order.coupon.discountValue.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-gray-600 font-medium">
                                <span>Tax (GST)</span>
                                <span>₹{order.tax.toLocaleString()}</span>
                            </div>
                            <div className="border-t-2 border-dashed border-gray-200 pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                <span className="text-2xl font-bold text-blue-600">₹{order.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 pt-8 mt-4">
                        <div className="grid grid-cols-2 gap-8 items-end">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Terms & Conditions</h4>
                                <ul className="text-gray-500 text-xs space-y-1 list-disc list-inside">
                                    <li>All checks to be made payable to {MainContent.appName}.</li>
                                    <li>Goods once sold will not be taken back.</li>
                                    <li>Subject to local jurisdiction.</li>
                                    <li>This is a computer generated invoice.</li>
                                </ul>
                            </div>
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    {/* Placeholder for Signature Image if available */}
                                    {/* <img src="/signature.png" alt="Sig" className="h-12 opacity-50" /> */}
                                    <div className="h-16 w-32"></div>
                                </div>
                                <div className="border-t border-gray-300 w-48 mx-auto pt-2">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Authorized Signature</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="h-2 w-full bg-gray-800 print:hidden"></div>
            </div>

            <div className="text-center mt-8 text-gray-400 text-xs print:hidden">
                &copy; {new Date().getFullYear()} {MainContent.appName}. All rights reserved.
            </div>
        </div>
    );
};

export default InvoicePage;
