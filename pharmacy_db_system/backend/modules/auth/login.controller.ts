import { userLoginService } from "./login.service";
import { generateToken } from "../../utils/jwt";

const serializeUser = (user: any) => {
    return {
        ...user,
        id: user.id?.toString(),
        role_id: user.role_id?.toString(),
        pharmacy_id: user.pharmacy_id?.toString()
    }
}

export const userLoginController = async (req: any, res: any) =>  {
    try {
        const { mobile, password } = req.body
        const user = await userLoginService(mobile, password)
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