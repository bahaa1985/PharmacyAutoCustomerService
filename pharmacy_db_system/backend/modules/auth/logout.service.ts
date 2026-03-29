import {prismaClient} from "../../utils/prisma-adapter.ts"

export const userLogoutService  = async(user_id:number)=>{
    try{
        const loggedout_user = await prismaClient.users.update({
            where:{id:user_id},
            data:{
                is_logging_in:false
            }
        })
        return loggedout_user
    }
    catch(error){
        console.error("Error during user logout: check logout data", error)
        throw error
    }
}