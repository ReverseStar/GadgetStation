const catchAsyncErrors = require('../middleware/catchAsyncErrors')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
//console.log('KEY : ',process.env.STRIPE_SECRET_KEY);

// Processing stripe payment
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    // let amount = req.body.amount 
    // amount = parseInt(amount)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'bdt',

        metadata: { integration_check: 'accept_a_payment' }
    });

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })

})

//Sending Stripe API Keys 
exports.sendStripeApi = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })

})

