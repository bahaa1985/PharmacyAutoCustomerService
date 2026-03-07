import { userLoginService } from "./auth.service";
import { generateToken } from "../../middleware/token";


export const userLoginController = async (req: any, res: any, next: any) => {
    try {
        const { mobile, password } = req.body
        const user = await userLoginService(mobile, password)
        if (user) {
            //if the credentials are valid, generate a token and set it in the cookie:
            const token = generateToken(user)
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
            res.status(200).json({ success: true, user })
        }
        //if the credentails are invalid:
        return res.status(401).json({ success: false, message: "Invalid credentials" })
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Invalid credentials" })
    }
}