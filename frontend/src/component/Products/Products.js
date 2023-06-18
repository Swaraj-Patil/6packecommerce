import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './Products.css'
import { useSelector, useDispatch } from 'react-redux'
import { getProduct, clearErrors } from '../../redux/actions/productActions'
import { Loader, MetaData } from '../layout'
import { ProductCard } from '../../component'
import Pagination from 'react-js-pagination'
import { Typography, Slider } from '@material-ui/core'
import { useAlert } from 'react-alert'

const categories = [
    'Laptops',
    'Footwear',
    'Clothing',
    'Toys',
    'Bags',
    'Cameras',
    'Smartphones'
]

const Products = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 900000])
    const [category, setCategory] = useState('')
    const [ratings, setRatings] = useState(0)
    
    const dispatch = useDispatch()
    const { products, loading, error, productsCount, resultPerPage } = useSelector(state => state.products)

    const { keyword } = useParams()
    const alert = useAlert()

    const setCurrentPageNo = e => {
        setCurrentPage(e)
    }

    const priceHandler = (e, newPrice) => {
        setPrice(newPrice)
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        dispatch(getProduct(keyword, currentPage, price, category, ratings))
    }, [dispatch, keyword, currentPage, price, category, ratings, alert, error])

    // let count = filteredProductsCount

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title='PRODUCTS - ECOMMERCE' />
                    <h2 className="products-heading">Products</h2>
                    <div className="products">
                        {products && products.map(product => <ProductCard key={product._id} product={product} />)}
                    </div>

                    <div className='filter-box'>
                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay='auto'
                            aria-labelledby='range-slider'
                            min={0}
                            max={900000}
                        />

                        <Typography>Categories</Typography>
                        <ul className='category-box'>
                            {categories.map(category => (
                                <li
                                    className='category-link'
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>

                        <fieldset>
                            <Typography component='legend'>Ratings Above</Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRating) => {
                                    setRatings(newRating)
                                }}
                                aria-labelledby='continuous-slider'
                                min={0}
                                max={5}
                                valueLabelDisplay='auto'
                            />
                        </fieldset>
                    </div>

                    {resultPerPage < productsCount && (
                        <div className='pagination-box'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resultPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText='Next'
                                prevPageText='Prev'
                                firstPageText='1st'
                                lastPageText='Last'
                                itemClass='page-item'
                                linkClass='page-link'
                                activeClass='page-item-active'
                                activeLinkClass='page-link-active'
                            />
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}

export default Products
