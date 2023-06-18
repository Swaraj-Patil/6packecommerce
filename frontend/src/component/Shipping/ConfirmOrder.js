import React, { Fragment } from 'react'
import CheckoutSteps from './CheckoutSteps'
import { useSelector } from 'react-redux'
import { MetaData } from '../layout'
import './ConfirmOrder.css'
import { Link, useNavigate } from 'react-router-dom'
import { Typography } from '@material-ui/core'

const ConfirmOrder = () => {

    const navigate = useNavigate()
    const { shippingInfo, cartItems } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.user)

    const subtotal = cartItems.reduce((acc, cartItem) => acc + cartItem.quantity * cartItem.price, 0)
    const shippingCharges = subtotal > 1000 ? 0 : 200
    const tax = subtotal * .18
    const totalPrice = subtotal + shippingCharges + tax
    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country}`

    const proceedToPayment = () => {
        const data = {
            subtotal,
            shippingCharges,
            tax,
            totalPrice
        }

        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        navigate('/process/payment')
    }

    return (
        <Fragment>
            <MetaData title='Confirm Order' />
            <CheckoutSteps activeStep={1} />

            <div className='confirm-order-page'>
                <div>
                    <div className='confirm-shipping-area'>
                        <Typography>Shipping Info</Typography>
                        <div className='conform-shipping-area-box'>
                            <div>
                                <p>Name:</p>
                                <span>{user.name}</span>
                            </div>
                            <div>
                                <p>Phone:</p>
                                <span>{shippingInfo.phone}</span>
                            </div>
                            <div>
                                <p>Address:</p>
                                <span>{address}</span>
                            </div>
                        </div>
                        </div>

                        <div className='confirm-cart-items'>
                            <Typography>Your Cart Items:</Typography>
                            <div className='confirm-cart-items-container'>
                                {cartItems && cartItems.map(cartItem => (
                                    <div key={cartItem.product}>
                                        <img src={cartItem.image} alt='Product' />
                                        <Link to={`/product/${cartItem.product}`}>{cartItem.name}</Link>
                                        <span>
                                            {cartItem.quantity} X ₹{cartItem.price} ={" "}
                                            <b>₹{cartItem.price * cartItem.quantity}</b>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                </div>

                <div>
                    <div className='order-summary'>
                        <Typography>Order Summary</Typography>
                        <div>
                            <div>
                                <p>Subtotal:</p>
                                <span>₹{subtotal}</span>
                            </div>
                            <div>
                                <p>Shipping Charges:</p>
                                <span>₹{shippingCharges}</span>
                            </div>
                            <div>
                                <p>GST:</p>
                                <span>₹{tax}</span>
                            </div>
                        </div>

                        <div className='order-summary-total'>
                            <p><b>Total:</b></p>
                            <span>₹{totalPrice}</span>
                        </div>

                        <button onClick={proceedToPayment}>Proceed to Payment</button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ConfirmOrder
