import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const JWT_SECRET = process.env.JWT_SECRET

export const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1]
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

export const generateToken = (user: any) => {
    const token = jwt.sign({ id: user.id, mobile: user.mobile }, JWT_SECRET as string, { expiresIn: '5m' })
    return token    
}
