const express = require('express')
const router = express.Router()

const {
    newOrder,
    getSingleOrder,
    myOrders,
    allOrders,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')


//POST
router.route('/order/new').post(isAuthenticatedUser, newOrder)

//GET
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder)

router.route('/orders/me').get(isAuthenticatedUser, myOrders)

router.route('/admin/orders/').get(isAuthenticatedUser, authorizeRoles('admin'), allOrders)

//PUT
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)

//DELETE
router.route('/admin/order/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder)

module.exports = router