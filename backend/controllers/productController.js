const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorhandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ApiFeatures = require('../utils/apifeatuers')
const cloudinary = require('cloudinary')

// Create Product --> Admin
exports.createProduct = catchAsyncErrors(async (req,res,next) => {

    let images = []

    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    const imagesLink = []
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        })

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLink
    req.body.user = req.user.id

    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})


// Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 8
    const productsCount = await Product.countDocuments()

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)
        
    const products = await apiFeature.query 

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
    })
})

// Get all products --> Admin
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find()

    if (!products) {
        return next(new ErrorHandler('No Products found.', 404))
    }

    res.status(200).json({
        success: true,
        products
    })
})

// Get Product details (Basically, get single product)
exports.getProductDetails = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.params.id)

    // if(!product) {
    //     return res.status(500).json({
    //         success: false,
    //         message: 'Product not found.'
    //     })
    // }
    if (!product) {
        return next(new ErrorHandler('Product not found.', 404))
    }

    res.status(200).json({
        success: true,
        product,
    })
})

// Update Product --> Admin
exports.updateProduct = catchAsyncErrors(async (req,res,next) => {
    let product = await Product.findById(req.params.id)

    // if(!product) {
    //     return res.status(500).json({
    //         success: false,
    //         message: 'Product not found.'
    //     })
    // }
    if(!product) {
        return next(new ErrorHandler('Product not found', 404))
    }

    // Images start here
    let images = []

    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {
        // Deleting images from cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        const imagesLink = []
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            })

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLink
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})

// Delete a Product --> Admin
exports.deleteProduct = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.params.id)

    // if(!product) {
    //     return res.status(500).json({
    //         success: false,
    //         message: 'Product not found.'
    //     })
    // }
    if(!product) {
        return next(new ErrorHandler('Product not found', 404))
    }

    // Deleting product images from cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    // await product.remove()
    await Product.deleteOne({ _id: product })  // I've added this while removing the above line

    res.status(200).json({
        success: true,
        message: `Product deleted successfully. ${product}`
    })
})

// Create new review or update the review
exports.createProductReview = catchAsyncErrors(async(req,res,next) => {
    const { rating, comment, productId } = req.body
    const newReview = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)

    const isReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString())

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.rating = rating,
                review.comment = comment
            }
        })
    } else {
        product.reviews.push(newReview)
        product.numOfReviews = product.reviews.length
    }

    let totalRating = 0
    product.reviews.forEach(review => {
        totalRating += review.rating
    })
    product.ratings = totalRating/product.reviews.length

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    })
})

// Get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.query.id)

    if (!product) {
        return next(new ErrorHandler(`Product not found`, 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete review
exports.deleteReview = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.query.productId)

    if (!product) {
        return next(new ErrorHandler(`Product not found`, 404))
    }

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())

    let totalRating = 0
    reviews.forEach(review => {
        totalRating += review.rating
    })

    let ratings = 0

    if (reviews.length === 0) {
        ratings = 0
    } else {
        ratings = totalRating/reviews.length
    }

    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})