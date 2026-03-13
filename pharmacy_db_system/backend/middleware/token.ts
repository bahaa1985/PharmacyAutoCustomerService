import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token || null
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' })
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token.' })
    }
}


