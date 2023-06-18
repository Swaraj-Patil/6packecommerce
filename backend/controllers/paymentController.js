const catchAsyncErrors = require('../middleware/catchAsyncErrors')
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const stripe = require('stripe')('sk_test_51N4fFHSHuAv8V6rClQ7ZQIG9cFLdvPUwEi9MiEmvKoyCMKVerBne9dp2oKdFF12gsC1vvNKGMFkQM2tEhAv6VVdu00Q2e0mTUq')

exports.processPayment = catchAsyncErrors(async (req,res,next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
        metadata: {
            company: 'Ecommerce'
        }
    })

    res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret
    })
})

exports.sendStripeApiKey = catchAsyncErrors(async (req,res,next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })
})