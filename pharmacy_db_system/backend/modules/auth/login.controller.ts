import { userLoginService } from "./login.service";
import { generateToken } from "../../utils/jwt";
import { log } from "console";

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
        const user = await userLoginService('+'+mobile, password)
        if (user) {
            //if the credentials are valid, generate a token and set it in the cookie:
            const token = generateToken(serializeUser(user))
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
            res.status(200).json({ success: true, user: serializeUser(user) })
        }
        //if the credentails are invalid:
        return res.status(401).json({ success: false, message: "Invalid credentials" })
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Invalid credentials" })
    }
}

export const getCurrentUserController = async (req:any, res:any) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }
        res.status(200).json(serializeUser(user))
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user data' })
    }
}