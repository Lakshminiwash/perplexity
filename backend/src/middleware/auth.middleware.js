import jwt from "jsonwebtoken"

export async function authUser(req, res, next) {
    const tokenFromCookie = req.cookies?.token
    const tokenFromHeader = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.replace("Bearer ", "")
        : null
    const token = tokenFromCookie || tokenFromHeader

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "No token provided"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        })
    }
}