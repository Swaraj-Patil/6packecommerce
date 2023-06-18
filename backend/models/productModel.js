const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name for this product.'],
        trim: true
    },
    desc: {
        type: String,
        required: [true, 'Please enter a description for this product.']
    },
    price: {
        type: Number,
        required: [true, 'Please enter a price for this product.'],
        maxLength: [8, 'Price cannot exceed 8 digits.']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select the product category.']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter the stock for this product.'],
        maxLength: [4, 'Stock cannot exceed 4 digits'],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Product", productSchema)