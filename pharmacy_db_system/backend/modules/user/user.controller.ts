import { createUserService, updateUserService, getAllUsersService, deactivateUserService } from "./user.service";

// Helper function to convert bigint to string for JSON serialization
const serializeUser = (user: any) => {
    return {
        ...user,
        id: user.id?.toString(),
        role_id: user.role_id?.toString(),
        pharmacy_id: user.pharmacy_id?.toString()
    }
}

export const createUserController = async (req: any, res: any) => {
    const { username, password, mobile, role_id, pharmacy_id,instance_name,picture } = req.body
    try {
        const newUser = await createUserService(username, password, mobile, BigInt(role_id), BigInt(pharmacy_id),instance_name,"/public/avatar.png")
        res.status(201).json(serializeUser(newUser))
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user", error })
    }
}

export const updateUserController = async (req: any, res: any) => {
    const { id } = req.params
    const { username, password, mobile, role_id, pharmacy_id, is_active, ai_mode,avatar } = req.body
    const updateData: any = {}
    if (username) updateData.username = username
    if (password) updateData.password = password
    if (mobile) updateData.mobile = mobile
    if (role_id) updateData.role_id = BigInt(role_id)
    if (pharmacy_id) updateData.pharmacy_id = BigInt(pharmacy_id)
    if (ai_mode !== undefined && ai_mode !==null) {
        updateData.ai_mode = String(ai_mode).toLowerCase() === 'true';
    }
    if (is_active !== undefined && is_active !== null) {
        updateData.is_active = String(is_active).toLowerCase() === 'true';
    }
    if(avatar!==null){
        updateData.avatar=avatar
    }
    try {
        const updatedUser = await updateUserService(BigInt(id), updateData)
        res.status(200).json(serializeUser(updatedUser))
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user", error })
    }
}

export const getAllUsersController = async (req: any, res: any) => {
    const { pharmacyId } = req.params
    try {
        const users = await getAllUsersService(BigInt(pharmacyId))
        res.status(200).json(users.map(serializeUser))
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users", error })
    }
}

export const deactivateUserController = async (req: any, res: any) => {
    const { id } = req.params
    try {
        const deactivatedUser = await deactivateUserService(BigInt(id))
        res.status(200).json(serializeUser(deactivatedUser))
    }
    catch (error) {
        res.status(500).json({ message: "Error deactivating user", error })
    }
}