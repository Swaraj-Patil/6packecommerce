import React, { Fragment } from 'react'
import './Cart.css'
import CartItemCard from './CartItemCard'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'
import { addItemsToCart, removeCartItem } from '../../redux/actions/cartActions'
import { RemoveShoppingCart } from '@material-ui/icons'
import { Typography } from '@material-ui/core'
import { Link, useNavigate } from 'react-router-dom'
import { MetaData } from '../layout'

const Cart = () => {

    const navigate = useNavigate()
    const alert = useAlert()
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.cart)

    const increaseQuantity = (id, quantity, stock) => {
        const newQuantity = quantity + 1

        if (stock <= quantity) {
            alert.error('Stock limit exceed.')
            return
        }

        dispatch(addItemsToCart(id, newQuantity))
    }

    const decreaseQuantity = (id, quantity) => {
        const newQuantity = quantity - 1

        if (1 >=  quantity) {
            alert.error('Use remove button to remove item.')
            return
        }

        dispatch(addItemsToCart(id, newQuantity))
    }

    const deleteCartItem = id => {
        dispatch(removeCartItem(id))
    }

    const handleCheckout = () => {
        navigate('/login?redirect=shipping')
    }

    return (
        <Fragment>
            <MetaData title='Your Cart - ECOMMERCE' />
            { cartItems.length === 0 ? (
                <div className='empty-cart'>
                    <RemoveShoppingCart />
                    <Typography>Your cart is empty.</Typography>
                    <Link to='/products'>Browse products</Link>
                </div>
            ) : (
                <Fragment>
                    <MetaData title='Your Cart - ECOMMERCE' />
                    <div className="cart-page">
                        <div className="cart-header">
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>

                        { cartItems && cartItems.map((cartItem, index) => (
                            <div key={index} className="cart-container">
                                <CartItemCard key={cartItem.product} cartItem={cartItem} deleteCartItem={deleteCartItem} />
                                <div className='cart-input'>
                                    <button onClick={() => decreaseQuantity(cartItem.product, cartItem.quantity)}>-</button>
                                    <input type='number' readOnly value={cartItem.quantity} />
                                    <button onClick={() => increaseQuantity(cartItem.product, cartItem.quantity, cartItem.stock)}>+</button>
                                </div>

                                <p className='cart-subtotal'>{`₹${ cartItem.price * cartItem.quantity }`}</p>
                            </div>
                        )) }


                        <div className='cart-gross-total'>
                            <div></div>
                            <div className='cart-gross-total-box'>
                                <p>Gross Total</p>
                                <p>{`₹${cartItems.reduce((acc, cartItem) => acc + cartItem.quantity * cartItem.price, 0)}`}</p>
                            </div>
                            <div></div>

                            <div className='checkout-button'>
                                <button onClick={handleCheckout}>Checkout</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            ) }
        </Fragment>
    )
}

export default Cart
