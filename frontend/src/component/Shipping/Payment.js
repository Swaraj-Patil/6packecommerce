import React, { Fragment, useEffect, useRef } from 'react'
import CheckoutSteps from './CheckoutSteps'
import { useSelector, useDispatch } from 'react-redux'
import { MetaData } from '../layout'
import { Typography } from '@material-ui/core'
import { useAlert } from 'react-alert'
import axios from 'axios'
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js'
import './Payment.css'
import { CreditCard, Event, VpnKey } from '@material-ui/icons'
import { useNavigate } from 'react-router-dom'
import { createOrder, clearErrors } from '../../redux/actions/orderActions'

const Payment = () => {

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))

    const payButton = useRef(null)
    const navigate = useNavigate()
    const alert = useAlert()
    const stripe = useStripe()
    const elements = useElements()
    const dispatch = useDispatch()

    const { shippingInfo, cartItems } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.user)
    const { error } = useSelector(state => state.newOrder)

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100)
    }

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        payButton.current.disabled = true
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const { data } = await axios.post(
                '/api/v1/payment/process',
                paymentData,
                config
            )
            const client_secret = data.client_secret

            if (!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country
                        }
                    }
                }
            })

            if (result.error) {
                payButton.current.disabled = false
                alert.error(result.error.message)
                console.log(result.error.message)
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }
                    dispatch(createOrder(order))
                    navigate('/success')
                } else {
                    alert.error('There was some issue while processing your payment.')
                }
            }
            
        } catch (error) {
            payButton.current.disabled = false
            alert.error(error.response.data.message)
            console.log('second', error.response.data.message)
        }

    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
    }, [error, alert, dispatch])

    return (
        <Fragment>
            <MetaData title='Payment' />
            <CheckoutSteps activeStep={2} />

            <div className="payment-container">
                <form onSubmit={e => submitHandler(e)} className="paymentForm">
                    <Typography>Card Info</Typography>
                    <div>
                        <CreditCard />
                        <CardNumberElement className='payment-input' />
                    </div>

                    <div>
                        <Event />
                        <CardExpiryElement className='payment-input' />
                    </div>

                    <div>
                        <VpnKey />
                        <CardCvcElement className='payment-input' />
                    </div>

                    <input
                        type="submit"
                        value={`Pay - ₹ ${orderInfo && orderInfo.totalPrice}`}
                        ref={payButton}
                        className='payment-form-button'
                    />
                </form>
            </div>
        </Fragment>
    )
}

export default Payment
