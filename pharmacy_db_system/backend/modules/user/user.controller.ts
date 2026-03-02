import { createUserService, updateUserService, getAllUsersService, deactivateUserService } from "./user.service";

export const createUserController = async (req:any,res:any)=>{
    const {username, password, mobile, role_id, pharmacy_id} = req.body
    try{
        const newUser = await createUserService(username,password,mobile,role_id,pharmacy_id)
        res.status(201).json(newUser)
    }
    catch(error){
        res.status(500).json({message:"Error creating user", error})
    }
}

export const updaeUserController = async (req:any,res:any)=>{
    const {id} = req.params
     const {username, password, mobile, role_id, pharmacy_id} = req.body
     const updateData:any = {}
        if(username) updateData.username = username
        if(password) updateData.password = password
        if(mobile) updateData.mobile = mobile
        if(role_id) updateData.role_id = role_id
        if(pharmacy_id) updateData.pharmacy_id = pharmacy_id
        try{
            const updatedUser = await updateUserService(id,updateData)
            res.status(200).json(updatedUser)
        }
        catch(error){
            res.status(500).json({message:"Error updating user", error})
        }   
}

export const getAllUsersController = async (req:any,res:any)=>{
    const {pharmacyId} = req.params
    try{
        const users = await getAllUsersService(pharmacyId)
        res.status(200).json(users)
    }
    catch(error){
        res.status(500).json({message:"Error fetching users", error})
    }
}

export const deactivateUserController = async (req:any,res:any)=>{
    const {id} = req.params
    try{
        const deactivatedUser = await deactivateUserService(id)
        res.status(200).json(deactivatedUser)
    }
    catch(error){
        res.status(500).json({message:"Error deactivating user", error})
    }
}