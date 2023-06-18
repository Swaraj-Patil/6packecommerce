import React, { Fragment, useEffect } from 'react'
import { MetaData, Loader } from '../layout'
import { useSelector, useDispatch } from 'react-redux'
import { myOrders, clearErrors } from '../../redux/actions/orderActions'
import { Typography } from '@material-ui/core'
import { Launch } from '@material-ui/icons'
import { DataGrid } from '@material-ui/data-grid'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import './MyOrders.css'

const MyOrders = () => {

  const alert = useAlert()
  const dispatch = useDispatch()

  const { loading, error, orders } = useSelector(state => state.myOrders)
  const { user } = useSelector(state => state.user)

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
      cellClassName: (params) => {
        return params.getValue(params.id, 'status') === 'Delivered' ? 'greenColor' : 'redColor'
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
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.getValue(params.id, 'id')}`}>
            <Launch />
          </Link>
        )
      }
    }
  ]

  const rows = []
  orders && orders.forEach(order => {
    rows.push({
      itemsQty: order.orderItems.length,
      id: order._id,
      status: order.orderStatus,
      amount: order.totalPrice
    })
  })

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(myOrders())
  }, [error, alert, dispatch])

  return (
    <Fragment>
      <MetaData title={`${user.name} - Orders`} />

      {loading ? <Loader /> : (
        <div className="my-orders-page">
          <DataGrid
            className='my-orders-table'
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          <Typography id='myOrdersHeading'>{user.name}'s Orders</Typography>
        </div>
      )}
    </Fragment>
  )
}

export default MyOrders
