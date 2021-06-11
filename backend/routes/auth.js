const express = require('express')
const router = express.Router()

const {
    registerUser, 
    loginUser,
    forgotPassword, 
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser,
    logout,
    deleteUser
} = require('../controllers/authController')

const {isAuthenticatedUser,authorizeRoles} = require('../middleware/auth')

//POST
router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/password/forgot').post(forgotPassword)

//PUT
router.route('/password/reset/:token').put(resetPassword)

router.route('/password/update').put(isAuthenticatedUser,updatePassword)

router.route('/me/update').put(isAuthenticatedUser,updateProfile)

router.route('/admin/user/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateUser)

//GET
router.route('/me').get(isAuthenticatedUser,getUserProfile)

router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),allUsers)

router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'),getUserDetails)

router.route('/logout').get(logout)

//Delete
router.route('/admin/user/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser)

module.exports = router
