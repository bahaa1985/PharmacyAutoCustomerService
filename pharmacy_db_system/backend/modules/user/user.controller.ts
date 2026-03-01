import { createUserService, updateUserService, getAllusersService, deactivateUserService } from "./user.service";

export const createUserController = async (req:any,res:any)=>{
    const {username, password, mobile, role_id, pharmacy_id} = req.body
    try{
        const newUser = await createUserService(username,password,mobile,role_id,pharmacy_id)
        res.status(201).json(newUser)
    }
    catch(error){

    }
}