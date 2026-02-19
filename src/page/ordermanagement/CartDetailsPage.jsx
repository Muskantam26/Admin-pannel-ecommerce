import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/slice/loadingSlice';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiArrowLeft,
    FiUser,
    FiPackage,
    FiShoppingBag,
    FiMail,
    FiPhone,
    FiHash,
    FiInfo,
    FiChevronRight
} from 'react-icons/fi';
import { getCartByUserIdApi } from '../../api/cart-api';

const CartDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);

    const getCartDetails = async () => {
        dispatch(showLoader());
        const res = await getCartByUserIdApi(id);
        if (res.success) {
            setCart(res.data);
        } else {
            toast.error(res.message);
        }
        dispatch(hideLoader());
    };

    useEffect(() => {
        if (id) {
            getCartDetails();
        }
    }, [id]);

    if (!cart) return null;

    const totalItems = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const totalPrice = cart.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="p-4 md:p-8 min-h-screen bg-(--bg-main)">
            {/* Header / Breadcrumbs */}
            <div className="max-w-7xl mx-auto mb-8">
                <nav className="flex items-center gap-2 text-sm text-(--text-third) mb-4">
                    <button onClick={() => navigate('/order-management')} className="hover:text-(--bs-primary) transition-colors">Order Management</button>
                    <FiChevronRight size={14} />
                    <button onClick={() => navigate('/all-carts')} className="hover:text-(--bs-primary) transition-colors">All Carts</button>
                    <FiChevronRight size={14} />
                    <span className="text-(--bs-primary) font-medium">Cart Details</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-xl bg-(--bg-box) border border-(--bs-border) flex items-center justify-center text-(--text-main) hover:bg-(--bs-primary) hover:text-white transition-all shadow-sm"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-(--text-main) flex items-center gap-3">
                                <FiShoppingBag className="text-(--bs-primary)" /> Cart Details
                            </h1>
                            <p className="text-(--text-third) text-sm mt-1">Viewing items currently in {cart.userId?.fullName || 'User'}'s cart</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar: User Info & Summary */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* User Profile Card */}
                        <div className="bg-(--bg-box) rounded-3xl shadow-sm border border-(--bs-border) overflow-hidden group">
                            <div className="h-24 bg-gradient-to-r from-(--bs-primary) to-blue-600 relative">
                                <div className="absolute -bottom-10 left-6">
                                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg border-4 border-white">
                                        <div className="w-full h-full rounded-xl bg-blue-50 flex items-center justify-center text-(--bs-primary) text-2xl font-black">
                                            {getInitials(cart.userId?.fullName)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-(--text-main)">{cart.userId?.fullName || "N/A"}</h2>
                                    <p className="text-(--text-third) text-sm font-medium">@{cart.userId?.username || "username"}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-(--bg-main) border border-(--bs-border) group-hover:border-(--bs-primary) transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-(--bs-primary) shadow-sm">
                                            <FiMail size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] uppercase font-bold text-(--text-third) tracking-wider">Email Address</p>
                                            <p className="text-sm font-semibold text-(--text-main) truncate">{cart.userId?.email || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-(--bg-main) border border-(--bs-border) group-hover:border-(--bs-primary) transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-green-500 shadow-sm">
                                            <FiPhone size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase font-bold text-(--text-third) tracking-wider">Mobile Number</p>
                                            <p className="text-sm font-semibold text-(--text-main)">{cart.userId?.mobile || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-(--bg-main) border border-(--bs-border) group-hover:border-(--bs-primary) transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-orange-500 shadow-sm">
                                            <FiHash size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase font-bold text-(--text-third) tracking-wider">User ID</p>
                                            <p className="text-xs font-mono font-bold text-(--text-main)">{cart.userId?.id || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-(--bs-border) flex justify-between items-center text-xs">
                                    <span className="text-(--text-third) font-medium">Cart ID: <span className="font-mono text-(--text-second)">{cart.id}</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Card */}
                        <div className="bg-(--bg-box) rounded-3xl shadow-lg border border-(--bs-border) p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-(--bs-primary) opacity-[0.03] rounded-bl-full"></div>
                            <h2 className="text-xl font-bold text-(--text-main) mb-6 flex items-center gap-2">
                                <FiInfo className="text-(--bs-primary)" /> Cart Summary
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-(--bs-border) border-dashed">
                                    <span className="text-(--text-second) font-medium">Unique Products</span>
                                    <span className="font-bold text-(--text-main) bg-(--bg-main) px-3 py-1 rounded-xl border border-(--bs-border)">{cart.items?.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-(--bs-border) border-dashed">
                                    <span className="text-(--text-second) font-medium">Total Quantity</span>
                                    <span className="font-bold text-(--text-main) bg-(--bg-main) px-3 py-1 rounded-xl border border-(--bs-border)">{totalItems} Units</span>
                                </div>
                                <div className="pt-2 flex flex-col gap-2">
                                    <span className="text-(--text-third) text-xs font-bold uppercase tracking-widest">Total Estimated Value</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-(--bs-primary)">₹{totalPrice.toLocaleString()}</span>
                                        <span className="text-sm font-bold text-(--text-third)">INR</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Items List */}
                    <div className="lg:col-span-8">
                        <div className="bg-(--bg-box) rounded-3xl shadow-sm border border-(--bs-border) overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-(--bs-border) bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-xl font-bold text-(--text-main) flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <FiPackage className="text-(--bs-primary)" />
                                    </div>
                                    Cart Items <span className="text-sm font-normal text-(--text-third) ml-2">({totalItems} items)</span>
                                </h2>
                            </div>

                            <div className="divide-y divide-(--bs-border)">
                                {cart.items?.length > 0 ? (
                                    cart.items.map((item, index) => (
                                        <div key={index} className="p-6 md:p-8 hover:bg-gray-50/50 transition-all group">
                                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                                {/* Product Image */}
                                                <div className="w-32 h-32 md:w-28 md:h-28 shrink-0 rounded-2xl overflow-hidden border border-(--bs-border) bg-white p-2 shadow-sm group-hover:shadow-md transition-all">
                                                    <img
                                                        src={item.productId?.image || "https://via.placeholder.com/150"}
                                                        alt={item.productId?.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 text-center md:text-left">
                                                    <div className="mb-2">
                                                        <span className="inline-block px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-2">Category</span>
                                                        <h3 className="text-lg font-bold text-(--text-main) leading-tight group-hover:text-(--bs-primary) transition-colors">
                                                            {item.productId?.name || "Product Unavailable"}
                                                        </h3>
                                                    </div>

                                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                                                        {item.variant?.color && (
                                                            <div className="flex items-center gap-1.5 bg-(--bg-main) px-3 py-1 rounded-full border border-(--bs-border) text-xs font-semibold text-(--text-second)">
                                                                <span className="w-2.5 h-2.5 rounded-full border border-gray-200" style={{ backgroundColor: item.variant.color.toLowerCase() }}></span>
                                                                Color: {item.variant.color}
                                                            </div>
                                                        )}
                                                        {item.variant?.size && (
                                                            <div className="flex items-center gap-1.5 bg-(--bg-main) px-3 py-1 rounded-full border border-(--bs-border) text-xs font-semibold text-(--text-second)">
                                                                Size: {item.variant.size}
                                                            </div>
                                                        )}
                                                        <div className="text-xs font-medium text-(--text-third)">
                                                            SKU/ID: <span className="font-mono">{item?.productId?.id || item?.productId?._id}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Price & Quantity Breakdown */}
                                                <div className="grid grid-cols-3 md:flex md:items-center gap-4 md:gap-8 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-(--bs-border) border-dashed">
                                                    <div className="text-center md:text-right">
                                                        <p className="text-[10px] uppercase font-bold text-(--text-third) tracking-wider mb-1">Price</p>
                                                        <p className="font-bold text-(--text-main)">₹{item.price?.toLocaleString()}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] uppercase font-bold text-(--text-third) tracking-wider mb-1">Qty</p>
                                                        <p className="font-black text-(--text-main) bg-white border border-(--bs-border) w-10 h-10 flex items-center justify-center rounded-xl mx-auto shadow-sm group-hover:border-(--bs-primary) group-hover:text-(--bs-primary) transition-all">
                                                            {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-center md:text-right md:pl-8 md:border-l border-(--bs-border) border-dashed">
                                                        <p className="text-[10px] uppercase font-bold text-(--text-third) tracking-wider mb-1">Subtotal</p>
                                                        <p className="text-lg font-black text-(--bs-primary)">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-20 text-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                                            <FiShoppingBag size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-(--text-main) mb-2">Cart is empty</h3>
                                        <p className="text-(--text-third) max-w-sm mx-auto">This user doesn't have any items in their cart at the moment.</p>
                                        <button
                                            onClick={() => navigate('/all-carts')}
                                            className="mt-8 px-6 py-3 bg-(--bs-primary) text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg"
                                        >
                                            Return to All Carts
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Footer for the items list */}
                            {cart.items?.length > 0 && (
                                <div className="p-8 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-(--bs-border) flex items-center justify-center text-(--bs-primary)">
                                            <FiInfo />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-(--text-main)">Total Cart Value</p>
                                            <p className="text-xs text-(--text-third)">Including all variants and quantities</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-(--text-main)">₹{totalPrice.toLocaleString()}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CartDetailsPage;
