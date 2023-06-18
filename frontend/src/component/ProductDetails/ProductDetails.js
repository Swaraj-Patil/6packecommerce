import React, { Fragment, useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel'
import './ProductDetails.css'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProductDetails, newReview } from '../../redux/actions/productActions'
import { useParams } from 'react-router-dom'
import ReviewCard from './ReviewCard'
import { Loader, MetaData } from '../layout'
import { useAlert } from 'react-alert'
import { addItemsToCart } from '../../redux/actions/cartActions'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button
} from '@material-ui/core'
import { Rating } from '@material-ui/lab'
import { NEW_REVIEW_RESET } from '../../redux/constants/productConstants'

const ProductDetails = () => {

    const alert = useAlert()
    const dispatch = useDispatch()
    const { id } = useParams()

    const [quantity, setQuantity] = useState(1)
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const { product, loading, error } = useSelector(state => state.productDetails)
    const { success, error: reviewError } = useSelector(state => state.newReview)

    function increaseQuantity() {
        if (quantity < product.stock) {
            const qty = quantity + 1
            setQuantity(qty)
        } else {
            alert.error('Stock limit exceed')
        }
    }
    
    function decreaseQuantity() {
        if (quantity > 1) {
            const qty = quantity - 1
            setQuantity(qty)
        }
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity))
        alert.success('Item added to cart.')
    }

    const submitReviewToggle = () => {
        setOpen(!open)
    }

    const reviewSubmitHandler = () => {
        const myForm = new FormData()

        myForm.set('rating', rating)
        myForm.set('comment', comment)
        myForm.set('productId', id)

        dispatch(newReview(myForm))
        setOpen(false)
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (reviewError) {
            alert.error(reviewError)
            dispatch(clearErrors())
        }

        if(success) {
            alert.success('Review Submitted Successfully.')
            dispatch({ type: NEW_REVIEW_RESET })
        }
        dispatch(getProductDetails(id))
    }, [dispatch, id, error, alert, reviewError, success, product])

    const options = {
        size: 'large',
        value: product.ratings,
        readOnly: true,
        precision: 0.5
    }

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={`${product.name} - ECOMMERCE`} />

                    <div className='product-details'>
                        <div>
                            <Carousel className='CarouselImage'>
                                {
                                    product.images && product.images.map((image, index) => (
                                        <img
                                            className='CarouselImage'
                                            key={index}
                                            src={image.url}
                                            alt={`${index} Slide`}
                                        />
                                    ))
                                }
                            </Carousel>
                        </div>

                        <div>
                            <div className='details-block1'>
                                <h2>{product.name}</h2>
                                <p>Product #{product._id}</p>
                            </div>

                            <div className='details-block2'>
                                <Rating {...options} />
                                <span className='details-block2-span'>{`(${product.numOfReviews} Reviews)`}</span>
                            </div>

                            <div className='details-block3'>
                                <h1>{`₹ ${product.price}`}</h1>
                                <div className='details-block3-1'>
                                    <div className='details-block3-1-1'>
                                        <button onClick={decreaseQuantity}>-</button>
                                        <input readOnly value={quantity} type='number' />
                                        <button onClick={increaseQuantity}>+</button>
                                    </div>{" "}
                                    <button disabled={!product.stock} onClick={addToCartHandler}>Add to Cart</button> {/** product.stock < 1 */}
                                </div>
                                <p>
                                    Status: {" "}
                                    <b className={product.stock < 1 ? 'redColor' : 'greenColor'}>
                                        {product.stock < 1 ? 'Out of Stock' : 'In Stock'}
                                    </b>
                                </p>
                            </div>

                            <div className='details-block4'>
                                Description: <p>{product.desc}</p>
                            </div>

                            <button onClick={submitReviewToggle} className='submit-review'>Submit Review</button>
                        </div>
                    </div>

                    <h3 className='review-heading'>REVIEWS</h3>

                    <Dialog
                        aria-labelledby='simple-dialog-title'
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className='submit-dialog'>
                            <Rating
                                value={rating}
                                onChange={e => setRating(e.target.value)}
                                size='large'
                            />

                            <textarea
                                className='submit-dialog-textarea'
                                rows='5'
                                columns='30'
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                placeholder='Add a comment.'
                            ></textarea>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={submitReviewToggle} color='secondary'>Cancel</Button>
                            <Button onClick={reviewSubmitHandler} color='primary'>Submit</Button>
                        </DialogActions>
                    </Dialog>

                    {product.reviews && product.reviews[0] ? (
                        <div className='reviews'>
                            {product.reviews && product.reviews.map(review => <ReviewCard review={review} />)}
                        </div>
                    ) : (<p className='no-reviews'>No Reviews yet</p>)}
                </Fragment>
            )}
        </Fragment>
    )
}

export default ProductDetails