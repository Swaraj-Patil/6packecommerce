import React, { useEffect, useState, Fragment } from 'react'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createNewProduct, clearErrors } from '../../redux/actions/productActions'
import { CREATE_PRODUCT_RESET } from '../../redux/constants/productConstants'
import './CreateProduct.css'
import { MetaData } from '../layout'
import { Button } from '@material-ui/core'
import { AccountTree, Description, Storage, Spellcheck, AttachMoney } from '@material-ui/icons'
import Sidebar from './Sidebar'

const CreateProduct = () => {

    const navigate = useNavigate()
    const alert = useAlert()
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.user)
    const { loading, error, success } = useSelector(state => state.createProduct)

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [stock, setStock] = useState(0)
    const [images, setImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([])


    const categories = [
        'Laptops',
        'Footwear',
        'Clothing',
        'Toys',
        'Bags',
        'Cameras',
        'Smartphones'
    ]

    const createProductSubmitHandler = e => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set('name', name)
        myForm.set('price', price)
        myForm.set('desc', description)
        myForm.set('category', category)
        myForm.set('stock', stock)
        images.forEach(image => {
            myForm.append('images', image)
        })

        dispatch(createNewProduct(myForm))
    }

    const createProductImagesChange = e => {
        const files = Array.from(e.target.files)

        setImages([])
        setImagesPreview([])

        files.forEach(file => {
            const reader = new FileReader()

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(prevImages => [...prevImages, reader.result])
                    setImages(prevImages => [...prevImages, reader.result])
                }
            }

            reader.readAsDataURL(file)
        })
    }

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/login')
            alert.error('You are not authorized to access this resource.')
        }

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (success) {
            alert.success('Product created successfully.')
            navigate('/admin/dashboard')
            dispatch({ type: CREATE_PRODUCT_RESET })
        }
    }, [user, navigate, alert, error, dispatch, success])

    return (
        <Fragment>
            <MetaData title='Create new Product' />

            <div className='dashboard'>
                <Sidebar />

                <div className='create-product-container'>
                    <form
                        className='createProductForm'
                        encType='multipart/form-data'
                        onSubmit={createProductSubmitHandler}
                    >
                        <h1>Create a new Product</h1>

                        <div>
                            <Spellcheck />
                            <input
                                type='text'
                                placeholder='Product Name'
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <AttachMoney />
                            <input
                                type='number'
                                placeholder='Price'
                                required
                                // value={price}
                                onChange={e => setPrice(e.target.value)}
                            />
                        </div>

                        <div>
                            <Description />
                            <textarea
                                placeholder='Product Description'
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                cols='10'
                                rows='1'
                            ></textarea>
                        </div>

                        <div>
                            <AccountTree />
                            <select onChange={e => setCategory(e.target.value)}>
                                <option value=''>Choose Category</option>
                                {categories.map(item => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Storage />
                            <input
                                type='number'
                                placeholder='Stock'
                                required
                                // value={description}
                                onChange={e => setStock(e.target.value)}
                            />
                        </div>

                        <div id='createProductFormFile'>
                            <input
                                type='file'
                                name='avatar'
                                accept='image/*'
                                onChange={createProductImagesChange}
                                multiple
                            />
                        </div>

                        <div id='createProductFormImage'>
                            {imagesPreview.map((image, index) => (
                                <img key={index} src={image} alt='Create Preview' />
                            ))}
                        </div>

                        <Button
                            id='createProductButton'
                            type='submit'
                            disabled={loading}
                        >
                            Create
                        </Button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default CreateProduct
