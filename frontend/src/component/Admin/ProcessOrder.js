import React, { useEffect, Fragment, useState } from 'react'
import { useAlert } from 'react-alert'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Loader, MetaData } from '../layout'
import { Typography } from '@material-ui/core'
import Sidebar from './Sidebar'
import { getOrderDetails, clearErrors, updateOrder } from '../../redux/actions/orderActions'
import { AccountTree } from '@material-ui/icons'
import { Button } from '@material-ui/core'
import { UPDATE_ORDER_RESET } from '../../redux/constants/orderConstants'
import './ProcessOrder.css'

const ProcessOrder = () => {

    const alert = useAlert()
    const navigate = useNavigate()
    const { id } = useParams()
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.user)
    const { order, error: orderError, loading } = useSelector(state => state.orderDetails)
    const { error: updateError, isUpdated } = useSelector(state => state.order)

    const [status, setStatus] = useState('')

    const processOrderSubmitHandler = e => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set('status', status)

        dispatch(updateOrder(id, myForm))
    }

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/login')
            alert.error('You are not authorized to access this resource.')
        }

        if (orderError) {
            alert.error(orderError)
            dispatch(clearErrors())
        }

        if (updateError) {
            alert.error(updateError)
            dispatch(clearErrors())
        }

         if (isUpdated) {
            alert.success('Order status has been updated successfully.')
            dispatch({ type: UPDATE_ORDER_RESET })
         }

        dispatch(getOrderDetails(id))

    }, [user, navigate, alert, orderError, dispatch, id, updateError, isUpdated])

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title='Process Order - ADMIN' />

                    <div className='dashboard'>
                        <Sidebar />

                        <div className='create-product-container'>
                            <div className='confirm-order-page' style={{ display: order.orderStatus === 'Delivered' ? 'block' : 'grid' }}>
                                <div>
                                    <div className='confirm-shipping-area'>
                                        <Typography>Shipping Info</Typography>
                                        <div className="order-details-container-box">
                                            <div>
                                                <p>Name:</p>
                                                <span>{order.user && order.user.name}</span>
                                                {console.log('first', order)}
                                            </div>

                                            <div>
                                                <p>Phone:</p>
                                                <span>{order.shippingInfo && order.shippingInfo.contactNo}</span>
                                            </div>

                                            <div>
                                                <p>Address:</p>
                                                <span>
                                                    {order.shippingInfo && `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
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
                                                <span>{order.totalPrice && order.totalPrice}</span>
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
                                                    {order.orderStatus && order.orderStatus}
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                    <div className='confirm-cart-items'>
                                        <Typography>Your Cart Items:</Typography>
                                        <div className='confirm-cart-items-container'>
                                            {order.orderItems && order.orderItems.map(orderItem => (
                                                <div key={orderItem.product}>
                                                    <img src={orderItem.image} alt='Product' />
                                                    <Link to={`/product/${orderItem.product}`}>{orderItem.name}</Link>
                                                    <span>
                                                        {orderItem.quantity} X ₹{orderItem.price} ={" "}
                                                        <b>₹{orderItem.price * orderItem.quantity}</b>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: order.orderStatus === 'Delivered' ? 'none' : 'block' }}>
                                    <form
                                        className='updateOrderForm'
                                        encType='multipart/form-data'
                                        onSubmit={processOrderSubmitHandler}
                                    >
                                        <h1>Process Order</h1>

                                        <div>
                                            <AccountTree />
                                            <select onChange={e => setStatus(e.target.value)}>
                                                <option value=''>Choose Category</option>
                                                { order.orderStatus === 'Processing' && <option value='Shipped'>Shipped</option> }
                                                { order.orderStatus === 'Shipped' && <option value='Delivered'>Delivered</option> }
                                            </select>
                                        </div>

                                        <Button
                                            id='createProductButton'
                                            type='submit'
                                            disabled={loading || status === ''}
                                        >
                                            Process
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default ProcessOrder
