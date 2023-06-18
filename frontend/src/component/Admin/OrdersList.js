import React, { useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'
import { getAllOrders, clearErrors, deleteOrder } from '../../redux/actions/orderActions'
import Sidebar from './Sidebar'
import { DataGrid } from '@material-ui/data-grid'
import { MetaData } from '../layout'
import { Edit, Delete } from '@material-ui/icons'
import { Button } from '@material-ui/core'
import { Link, useNavigate } from 'react-router-dom'
import { DELETE_ORDER_RESET } from '../../redux/constants/orderConstants'

const OrdersList = () => {

    const navigate = useNavigate()
    const alert = useAlert()
    const dispatch = useDispatch()
    
    const { user } = useSelector(state => state.user)
    const { orders, error: orderError } = useSelector(state => state.allOrders)
    const { isDeleted, error: deleteError } = useSelector(state => state.order)

    const columns = [
        {
            field: 'id',
            headerName: 'Order ID',
            minWidth: 300,
            flex: 0.5
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 150,
            flex: 0.4,
            cellClassName: params => {
                return params.getValue(params.id, 'status') === 'Delivered'
                    ? 'greenColor'
                    : 'redColor'
            }
        },
        {
            field: 'itemsQty',
            headerName: 'Items Quantity',
            type: 'number',
            minWidth: 150,
            flex: 0.4
        },
        {
            field: 'amount',
            headerName: 'Amount',
            type: 'number',
            minWidth: 270,
            flex: 0.5
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'number',
            minWidth: 150,
            flex: 0.3,
            renderCell: params => (
                <Fragment>
                    <Link to={`/admin/order/${params.getValue(params.id, 'id')}`}>
                        <Edit />
                    </Link>

                    <Button onClick={() => deleteOrderHandler(params.getValue(params.id, 'id'))}>
                        <Delete />
                    </Button>
                </Fragment>
            )
        }
    ]

    const rows = []

    orders && orders.forEach(order => {
        rows.push({
            id: order._id,
            itemsQty: order.orderItems.length,
            amount: order.totalPrice,
            status: order.orderStatus
        })
    })

    const deleteOrderHandler = id => {
        dispatch(deleteOrder(id))
    }

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/login')
            alert.error('You are not autorized to access this resource.')
        }

        if (orderError) {
            alert.error(orderError)
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError)
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success('Order deleted successfully.')
            navigate('/admin/orders')
            dispatch({ type: DELETE_ORDER_RESET })
        }

        dispatch(getAllOrders())

    }, [user, navigate, alert, orderError, dispatch, deleteError, isDeleted])
    return (
        <Fragment>
            <MetaData title='All Orders - ADMIN' />

            <div className='dashboard'>
                <Sidebar />

                <div className='product-list-container'>
                    <h1 className='product-list-heading'>ALL ORDERS</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className='product-list-table'
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>
    )
}

export default OrdersList
