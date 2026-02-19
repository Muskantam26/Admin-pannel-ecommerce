import React, { useEffect, useState } from 'react'
import { Heading, MainHeading } from '../../Component/Heading'
import { InputField } from '../../Component/InputBox'
import CommonDataTable from '../../Component/CommonDataTable'
import OrderProgressBar from '../../Component/OrderProgressBar'
import Button from '../../Component/Btn'
import { useParams } from 'react-router-dom'
import { getOrderByIdApi, updateOrderStatusApi } from '../../api/order-api'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slice/loadingSlice'
import ConfirmationModal from '../../Component/Model/ConfirmationModal'

const ViewOrdersDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const dispatch = useDispatch();
    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        isDanger: false
    });

    const fetchOrderDetails = async () => {
        dispatch(showLoader());
        try {
            const response = await getOrderByIdApi(id);
            if (response.success) {
                setOrder(response.data);
                dispatch(hideLoader());
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast.error("Failed to fetch order details");
            dispatch(hideLoader());
        } finally {
            dispatch(hideLoader());
        }
    };

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    const executeUpdateStatus = async (newStatus) => {
        try {
            const response = await updateOrderStatusApi(id, { status: newStatus });
            if (response.success) {
                toast.success(`Order marked as ${newStatus}`);
                fetchOrderDetails();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const handleUpdateStatus = (newStatus) => {
        setConfirmation({
            isOpen: true,
            title: `Mark as ${newStatus}`,
            message: `Are you sure you want to mark this order as ${newStatus}?`,
            onConfirm: () => executeUpdateStatus(newStatus),
            isDanger: newStatus === 'CANCELLED'
        });
    }

    const closeConfirmation = () => {
        setConfirmation(prev => ({ ...prev, isOpen: false }));
    };

    const columns = [
        {
            name: "Product Image",
            cell: (row) => (
                <img
                    src={row.image}
                    alt={row.name}
                    className="w-12 h-12 object-cover rounded-md"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                />
            ),
            width: "100px"
        },
        {
            name: "Product Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Price",
            selector: (row) => `₹${row.price}`,
        },
        {
            name: "Quantity",
            selector: (row) => row.quantity,
        },
        {
            name: "Total",
            selector: (row) => `₹${row.price * row.quantity}`,
        },
    ]

    if (!order) return <div className="p-10 text-center">Order not found</div>;

    return (
        <div>
            <MainHeading
                title={"Order Management"} />


            <div className='bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2xl'>

                <div className="flex justify-between items-center">
                    <Heading title={`Order Details (#${order.orderId || order._id.slice(-6).toUpperCase()})`} />
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                            order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                order.orderStatus === 'RETURNED' ? 'bg-gray-100 text-gray-700' :
                                    order.orderStatus === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                                        order.orderStatus === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
                                            order.orderStatus === 'PLACED' ? 'bg-indigo-100 text-indigo-700' :
                                                'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.orderStatus}
                    </span>
                </div>

                <p className='text-xs font-medium mt-10'>Basic Info</p>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 p-3 space-y-4'>
                    <InputField
                        label={"Order Id"}
                        value={order.orderId || "N/A"}
                        readOnly
                    />

                    <InputField
                        label={"Client Name"}
                        value={order.userId?.fullName || order.userId?.username || "N/A"}
                        readOnly
                    />

                    <InputField
                        label={"Contact Info"}
                        value={`${order.userId?.email || ''} / ${order.userId?.mobile || ''}`}
                        readOnly
                    />

                    <InputField
                        label={"Total Amount"}
                        value={`₹${order.totalPrice}`}
                        readOnly
                    />

                    <InputField
                        label={"Order Date"}
                        value={new Date(order.createdAt).toLocaleDateString()}
                        readOnly
                    />
                    <InputField
                        label={"Payment Method"}
                        value={order.paymentMethod}
                        readOnly
                    />
                </div>

                <p className='text-xs font-medium mt-5'>Shipping Address</p>
                <div className="p-4 bg-gray-50 rounded-lg mt-2 border border-gray-100">
                    <p className="font-semibold text-sm">{order.shippingAddress?.name}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
                    <p className="text-sm text-gray-600">Phone: {order.shippingAddress?.phone}</p>
                </div>

            </div>



            <div className='bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2xl  '>
                <Heading
                    title={"Order Items"} />

                <CommonDataTable
                    columns={columns}
                    data={order.items || []}
                    pagination={false} // Usually few items, no need for pagination
                />
            </div>


            <div className='bg-(--bg-box)  rounded-2xl p-5 mt-5 shadow-2xl '>
                <Heading
                    title={"Order Progress"} />

                <OrderProgressBar status={order.orderStatus} trackHistory={order.history} />

                <div className='flex justify-center gap-3 mt-7'>
                    {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
                        <Button
                            title={"Cancel Order"}
                            className='p-2 text-xs px-4 rounded-sm shadow-xl bg-red-500 hover:bg-red-600 text-white'
                            onClick={() => handleUpdateStatus('CANCELLED')}
                        />
                    )}

                    {/* Admin Actions for moving status forward manually if needed */}
                    {order.orderStatus === 'PENDING' && (
                        <Button
                            title={"Confirm Order"}
                            className='p-2 text-xs px-4 rounded-sm shadow-xl bg-blue-500 hover:bg-blue-600 text-white'
                            onClick={() => handleUpdateStatus('CONFIRMED')}
                        />
                    )}
                    {order.orderStatus === 'CONFIRMED' && (
                        <Button
                            title={"Mark as Shipped"}
                            className='p-2 text-xs px-4 rounded-sm shadow-xl bg-purple-500 hover:bg-purple-600 text-white'
                            onClick={() => handleUpdateStatus('SHIPPED')}
                        />
                    )}
                    {order.orderStatus === 'SHIPPED' && (
                        <Button
                            title={"Mark as Delivered"}
                            className='p-2 text-xs px-4 rounded-sm shadow-xl bg-green-500 hover:bg-green-600 text-white'
                            onClick={() => handleUpdateStatus('DELIVERED')}
                        />
                    )}

                </div>


            </div>

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={closeConfirmation}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
                message={confirmation.message}
                isDanger={confirmation.isDanger}
            />
        </div>
    )
}

export default ViewOrdersDetails