import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllReviews, deleteReviews, clearErrors } from '../../redux/actions/productActions'
import { DELETE_REVIEW_RESET } from '../../redux/constants/productConstants'
import { useAlert } from 'react-alert'
import Sidebar from './Sidebar'
import { useNavigate } from 'react-router-dom'
import { DataGrid } from '@material-ui/data-grid'
import { MetaData } from '../layout'
import { Delete, Star } from '@material-ui/icons'
import { Button } from '@material-ui/core'
import './ProductReviews.css'

const ProductReviews = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const { user } = useSelector(state => state.user)
    const { reviews, error: reviewsError, loading } = useSelector(state => state.productReviews)
    const { isDeleted, error: deleteError } = useSelector(state => state.review)

    const [productId, setProductId] = useState('')

    const columns = [
        {
            field: 'id',
            headerName: 'Review ID',
            minWidth: 200,
            flex: 0.5
        },
        {
            field: 'user',
            headerName: 'User',
            minWidth: 200,
            flex: 0.6
        },
        {
            field: 'comment',
            headerName: 'Comment',
            minWidth: 350,
            flex: 1
        },
        {
            field: 'rating',
            headerName: 'Rating',
            type: 'number',
            minWidth: 180,
            flex: 0.4,
            cellClassName: params => (
                params.getValue(params.id, 'rating') < 3
                    ? 'redColor'
                    : 'greenColor'
            )
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
                    <Button onClick={() => deleteReviewHandler(params.getValue(params.id, 'id'))}>
                        <Delete />
                    </Button>
                </Fragment>
            )
        },
    ]

    const rows = []

    reviews && reviews.forEach(review => {
        rows.push({
            id: review._id,
            rating: review.rating,
            comment: review.comment,
            user: review.name,
        })
    })

    const deleteReviewHandler = reviewId => {
        dispatch(deleteReviews(reviewId, productId))
    }

    const productReviewsSubmitHandler = e => {
        e.preventDefault()
        dispatch(getAllReviews(productId))
    }

    useEffect(() => {

        if (user.role !== 'admin') {
            navigate('/login')
            alert.error('You are not authorized to access this resource.')
        }

        if (productId.length === 24) {
            dispatch(getAllReviews(productId))
        }

        if (reviewsError) {
            alert.error(reviewsError)
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError)
            console.log(deleteError)
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success('Review deleted successfully.')
            navigate('/admin/reviews')
            dispatch({ type: DELETE_REVIEW_RESET })
        }

    }, [reviewsError, alert, dispatch, deleteError, isDeleted, navigate, user, productId])

    return (
        <Fragment>
            <MetaData title='All Reviews - ADMIN' />

            <div className='dashboard'>
                <Sidebar />

                <div className='product-reviews-container'>

                    <form
                        className='productReviewsForm'
                        onSubmit={productReviewsSubmitHandler}
                    >
                        <h1 className='product-reviews-form-heading'>ALL REVIEWS</h1>

                        <div>
                            <Star />
                            <input
                                type='text'
                                placeholder='Product ID'
                                required
                                value={productId}
                                onChange={e => setProductId(e.target.value)}
                            />
                        </div>

                        <Button
                            id='createProductButton'
                            type='submit'
                            disabled={loading || productId === ''}
                        >
                            Search
                        </Button>
                    </form>

                    { reviews && reviews.length > 0 ? (
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            disableSelectionOnClick
                            className='product-list-table'
                            autoHeight
                        />
                    ) : (
                        <h1 className='product-reviews-form-heading'>No reviews found</h1>
                    )}

                </div>
            </div>
        </Fragment>
    )
}

export default ProductReviews

