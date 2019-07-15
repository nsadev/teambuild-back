const jwt = require("jsonwebtoken")

// Middleware function to check whether client has a valid JWT.
exports.checkToken = (req, res, next) => {
    const publicToken = req.cookies.teambuildPublic
    const privateToken = req.cookies.teambuildPrivate
    const token = publicToken + "." + privateToken

    try {
        // Check if token is valid or not.
        if (token) {
            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: "Token is not valid",
                    })
                    // Use next() to enter main route logic if token is valid.
                } else {
                    req.decoded = decoded
                    next()
                }
            })
        }
    } catch (e) {
        res.status(401).json({
            success: false,
            message: "Auth token is not supplied",
        })
    }
}
