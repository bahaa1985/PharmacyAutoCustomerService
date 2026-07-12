import { userLoginService } from "./login.service";
import { generateToken } from "../../utils/jwt";

const serializeUser = (user: any) => {
    return {
        ...user,
        id: Number(user.id),
        role_id: Number(user.role_id),
        pharmacy_id: Number(user.pharmacy_id),
    }
}



export const userLoginController = async (req: any, res: any) =>  {
    try {
        const { mobile, password } = req.body
        console.log("Received login request:", { mobile, password });
        const user = await userLoginService(mobile, password)
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }
        const serializedUser = serializeUser(user)
        const token = generateToken(serializedUser)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 5 * 60 * 1000,
        })
        return res.status(200).json({ success: true, user: serializedUser })
    }
    catch (error) {
        return res.status(401).json({ success: false, message: "Invalid credentials" })
    }
}

export const getCurrentUserController = async (req:any, res:any) => {
    try {
        const user = req.user
        console.log("Current user from token:", user);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }
        res.status(200).json(serializeUser(user))
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user data' })
    }
}