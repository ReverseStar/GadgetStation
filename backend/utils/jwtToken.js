//Create & Send Token and Save in the Cookie
const sentToken = (user,statusCode,res) => {
    //Creating JWT token
    const token = user.getJwtToken();

    //Options for Cookie
    const option = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    res.status(statusCode).cookie('token',token,option).json({ 
        success: true,
        token,
        user
    })
}

module.exports = sentToken