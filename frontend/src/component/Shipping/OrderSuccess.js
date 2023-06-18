import React from 'react'
import { CheckCircle } from '@material-ui/icons'
import { Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import './OrderSuccess.css'

const OrderSuccess = () => {
  return (
    <div className='order-success'>
      <CheckCircle />
      <Typography>Your order has been placed successfully.</Typography>
      <Link to='/orders'>View Orders</Link>
    </div>
  )
}

export default OrderSuccess
