const Order = require('../models/order')
const Product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

//Creating New Order
exports.newOrder = catchAsyncErrors(async (req,res,next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body

    const order =  await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id,
    })

    res.status(200).json({
        success: true,
        order
    })
})

//Getting Single Order
exports.getSingleOrder = catchAsyncErrors(async(req,res,next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(!order){
        return next(new ErrorHandler('No Orders Found!'),404)
    }

    res.status(200).json({
        success:true,
        order
    })
})

//Users Orders
exports.myOrders = catchAsyncErrors(async(req,res,next) => {
    const orders = await Order.find({user: req.user.id})

    res.status(200).json({
        success:true,
        orders
    })
})

//Getting All Orders
exports.allOrders = catchAsyncErrors(async(req,res,next) => {
    const orders = await Order.find()

    let totalAmount = 0
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

//Updating Process Orders
exports.updateOrder = catchAsyncErrors(async(req,res,next) => {
    const order = await Order.findById(req.params.id)
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler('Already Delivered'),400)
    }

    order.orderItems.forEach(async item =>{
        await updateStock(item.product,item.quantity)
    })

    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now()

    await order.save()
    res.status(200).json({
        success:true
    })
})
async function updateStock(id, quantity){
    const product = await Product.findById(id)
    product.stock -= quantity
    await product.save({validateBeforeSave: false})
}

//Delete Order
exports.deleteOrder = catchAsyncErrors(async(req,res,next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler('No Orders Found!'),404)
    }

    await order.remove()

    res.status(200).json({
        success:true
    })
})