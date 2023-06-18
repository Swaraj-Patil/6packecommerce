import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MetaData, Loader } from '../layout'
import { getOrderDetails, clearErrors } from '../../redux/actions/orderActions'
import { Link, useParams } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { Typography } from '@material-ui/core'
import './OrderDetails.css'

const OrderDetails = () => {

    const { loading, error, order } = useSelector(state => state.orderDetails)

    const dispatch = useDispatch()
    const alert = useAlert()
    const { id } = useParams()

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        dispatch(getOrderDetails(id))
    }, [error, alert, dispatch, id])
    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title='Order Details' />
                    <div className="order-details-page">
                        <div className="order-details-container">
                            <Typography component='h1'>
                                Order #{order && order._id}
                            </Typography>

                            <Typography>Shipping Info</Typography>
                            <div className="order-details-container-box">
                                <div>
                                    <p>Name:</p>
                                    <span>{order.user && order.user.name}</span>
                                </div>

                                <div>
                                    <p>Phone:</p>
                                    <span>{order.shippingInfo && order.shippingInfo.contactNo}</span>
                                </div>

                                <div>
                                    <p>Address:</p>
                                    <span>
                                        { order.shippingInfo && `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}` }
                                    </span>
                                </div>
                            </div>

                            <Typography>Payment</Typography>
                            <div className="order-details-container-box">
                                <div>
                                    <p
                                        className={
                                            order.paymentInfo && order.paymentInfo.status === 'succeeded'
                                                ? 'greenColor'
                                                : 'redColor'
                                        }
                                    >{
                                        order.paymentInfo && order.paymentInfo.status === 'succeeded'
                                        ? 'PAID'
                                        : 'NOT PAID' 
                                    }</p>
                                </div>

                                <div>
                                    <p>Amount:</p>
                                    <span>{ order.totalPrice && order.totalPrice }</span>
                                </div>
                            </div>

                            <Typography>Order Status</Typography>
                            <div className="order-details-container-box">
                                <div>
                                    <p
                                        className={
                                            order.orderStatus && order.orderStatus === 'Delivered'
                                                ? 'greenColor'
                                                : 'redColor'
                                        }
                                    >
                                        { order.orderStatus && order.orderStatus }
                                    </p>
                                </div>

                            </div>

                        </div>

                        <div className="order-details-cart-items">
                            <Typography>Order Items:</Typography>
                            <div className="order-details-cart-items-container">
                                { order.orderItems && order.orderItems.map(orderItem => (
                                    <div key={orderItem.product}>
                                        <img src={orderItem.image} alt='Product' />
                                        <Link to={`/product/${orderItem.product}`}>{ orderItem.name }</Link>
                                        <span>
                                            {orderItem.quantity} X ₹{orderItem.price} =
                                            <b>₹{orderItem.price * orderItem.quantity}</b>
                                        </span>
                                    </div>
                                )) }
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default OrderDetails
