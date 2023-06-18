import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAdminProducts, clearErrors, deleteProduct } from '../../redux/actions/productActions'
import { useAlert } from 'react-alert'
import Sidebar from './Sidebar'
import './ProductList.css'
import { DataGrid } from '@material-ui/data-grid'
import { MetaData } from '../layout'
import { Edit, Delete } from '@material-ui/icons'
import { Button } from '@material-ui/core'
import { Link, useNavigate } from 'react-router-dom'
import { DELETE_PRODUCT_RESET } from '../../redux/constants/productConstants'

const ProductList = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const { products, error } = useSelector(state => state.products)
    const { error: deleteError, isDeleted } = useSelector(state => state.product)

    const columns = [
        {
            field: 'id',
            headerName: 'Product ID',
            minWidth: 200,
            flex: 0.5
        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 350,
            flex: 1
        },
        {
            field: 'stock',
            headerName: 'Stock',
            type: 'number',
            minWidth: 150,
            flex: 0.3
        },
        {
            field: 'price',
            headerName: 'Price',
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
            renderCell: params => (
                <Fragment>
                    <Link to={`/admin/product/${params.getValue(params.id, 'id')}`}>
                        <Edit />
                    </Link>

                    <Button onClick={() => deleteProductHandler(params.getValue(params.id, 'id'))}>
                        <Delete />
                    </Button>
                </Fragment>
            )
        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 350,
            flex: 1
        },
    ]

    const rows = []

    products && products.forEach(product => {
        rows.push({
            id: product._id,
            stock: product.stock,
            price: product.price,
            name: product.name,
        })
    })

    const deleteProductHandler = id => {
        dispatch(deleteProduct(id))
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError)
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success('Product deleted successfully.')
            navigate('/admin/dashboard')
            dispatch({ type: DELETE_PRODUCT_RESET })
        }

        dispatch(getAdminProducts())
    }, [error, alert, dispatch, deleteError, isDeleted, navigate])

    return (
        <Fragment>
            <MetaData title='All Products - ADMIN' />
            
            <div className='dashboard'>
                <Sidebar />

                <div className='product-list-container'>
                    <h1 className='product-list-heading'>ALL PRODUCTS</h1>

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

export default ProductList
