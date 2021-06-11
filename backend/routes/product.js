const express = require('express')
const router = express.Router()

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview
} = require('../controllers/productController')
const {isAuthenticatedUser,authorizeRoles} = require('../middleware/auth')

//GET 
router.route('/products').get(getProducts)
router.route('/product/:id').get(getSingleProduct)
router.route('/reviews').get(isAuthenticatedUser, getProductReviews)

//POST
router.route('/admin/products/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct)

//PUT
router.route('/admin/product/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct)

router.route('/review').put(isAuthenticatedUser,createProductReview)

//DELETE
router.route('/admin/product/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct)

router.route('/reviews').delete(isAuthenticatedUser,deleteReview)



module.exports = router