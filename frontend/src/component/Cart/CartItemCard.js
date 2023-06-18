import React from 'react'
import './CartItemCard.css'
import { Link } from 'react-router-dom'

const CartItemCard = ({ cartItem, deleteCartItem }) => {
  return (
    <div className='cart-item-card'>
      <img src={cartItem.image} alt='ssa' />

      <div>
        <Link to={`/product/${cartItem.product}`}>{ cartItem.name }</Link>
        <span>{ `Price: ₹${cartItem.price}` }</span>
        <p onClick={() => deleteCartItem(cartItem.product)}>Remove</p>
      </div>
    </div>
  )
}

export default CartItemCard
