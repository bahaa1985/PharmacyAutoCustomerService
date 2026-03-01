import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prismaClient = new PrismaClient()

export const createUserService = async (username: string, password:string, mobile:string,
    role_id: bigint, pharmacy_id: bigint) => {
        try{
            const saltRounds=10
            const hashedPassword = await bcrypt.hash(password,saltRounds)
            const newUser = await prismaClient.users.create({
                data:{
                    username, password:hashedPassword, mobile, role_id, pharmacy_id
                }
            })
            return newUser
        }
        catch(error){
            console.error("Error creating user:", error)
            throw error
        }
    }

export const updateUserService = async (userId: bigint, updateData: Prisma.usersUpdateInput) => {
    try {
        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password as string, saltRounds);
        }
        const updatedUser = await prismaClient.users.update({
            where: { id: userId },
            data: updateData,
        });
        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

export const getAllusersService = async ()=>{
    try{
        const users = prismaClient.users.findMany()
        return users
    }
    catch(error){
        console.error("Error fetching users:", error)
        throw error
    }
}

export const deactivateUserService = async (userId: bigint) => {
    try{
        const user = prismaClient.users.update({
            where :{id :userId},
            data:{is_active:false}
        })
        return user
    }
    catch(error){
        console.error("Error fetching users:", error)
        throw error
    }
}
