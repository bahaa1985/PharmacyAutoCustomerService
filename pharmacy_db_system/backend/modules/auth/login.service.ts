import bcrypt from "bcrypt";
import {prismaClient} from "../../utils/prisma-adapter"


export const userLoginService = async (mobile: string, password: string) => {
    debugger
    try {
        const user_data = await prismaClient.users.findUnique({ 
            
            where: { mobile:mobile }
        })
        // console.log("Fetched user data:", user_data);
        if (!user_data) {
            throw new Error("User not found")
        }        

        if(user_data.is_active !== false){
            const isMatch = bcrypt.compareSync(password, user_data.password)

        if(isMatch) {
            const logged_user = await prismaClient.users.update({
                where:{id:user_data.id},
                data:{
                    is_logging_in:true,
                    last_login_at: new Date()
                }
            })
            return logged_user
        }
        // Password did not match
        throw new Error("Invalid credentials")
        }
        else{
            throw new Error("User is not active")
        }
    }
    catch (error) {
        console.error("Error during user login: check login data", error)
        throw error
    }
}