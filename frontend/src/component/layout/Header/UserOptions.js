import React, { Fragment, useState } from 'react'
import './Header.css'
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import { profilePng } from '../../../constants/assets'
import { Dashboard, Person, ExitToApp, ListAlt, ShoppingCart } from '@material-ui/icons'
import { Backdrop } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { logout } from '../../../redux/actions/userAction'

const UserOptions = ({ user }) => {

    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const alert = useAlert()

    const { cartItems } = useSelector(state => state.cart)

    const options = [
        {
            icon: <ListAlt />,
            name: 'Orders',
            func: orders
        },
        {
            icon: <Person />,
            name: 'Profile',
            func: account
        },
        {
            icon: <ShoppingCart style={{ color: cartItems.length > 0 ? 'tomato' : 'unset' }} />,
            name: `Cart(${cartItems.length})`,
            func: cart
        },
        {
            icon: <ExitToApp />,
            name: 'Logout',
            func: logoutUser
        }
    ]

    if (user.role === 'admin') {
        options.unshift({
            icon: <Dashboard />,
            name: 'Dashboard',
            func: dashboard
        })
    }

    function dashboard() {
        navigate('/admin/dashboard')
    }

    function orders() {
        navigate('/orders')
    }

    function account() {
        navigate('/account')
    }

    function cart() {
        navigate('/Cart')
    }

    function logoutUser() {
        dispatch(logout())
        alert.success('Logout successful')
    }

  return (
    <Fragment>
        <Backdrop open={open} style={{ zIndex: '10' }} />
      <SpeedDial
        ariaLabel='SpeedDial tooltip example'
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        direction='down'
        className='speedDial'
        style={{ zIndex: '11' }}
        icon={
            <img
                className='speedDialIcon'
                src={user.avatar.url ? user.avatar.url : profilePng}
                alt='Profile'
            />
        }
      >
        { options.map(item => (
            <SpeedDialAction 
                icon={item.icon} 
                tooltipTitle={item.name} 
                tooltipOpen={window.innerWidth <= 600}
                onClick={item.func} 
                key={item.name} 
            />
        )) }
      </SpeedDial>
    </Fragment>
  )
}

export default UserOptions
