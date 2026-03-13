const JWT_SECRET = process.env.JWT_SECRET
import jwt from 'jsonwebtoken'

export const generateToken = (user: any) => {
    const token = jwt.sign({ id: user.id, mobile: user.mobile }, JWT_SECRET as string, { expiresIn: '5m' })
    return token    
}