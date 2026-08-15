import { prismaClient } from "../../utils/prisma-adapter";
import bcrypt from 'bcrypt';
import axios from 'axios'; 
const EVOLUTION_URL=process.env.EVOLUTION_URL || "http://localhost:3000"
const EVOLUTION_API_KEY=process.env.EVOLUTION_API_KEY || "default_api_key"

export const createUserService = async (username: string, password:string, mobile:string,
    role_id: bigint, pharmacy_id: bigint,avatar:string) => {
        try{
            const saltRounds=10
            const hashedPassword:string = await bcrypt.hash(password,saltRounds)
            const newUser = await prismaClient.users.create({
                data:{
                    username, password:hashedPassword, mobile, role_id, pharmacy_id,avatar
                }
            })
            return newUser
        }
        catch(error){ 
            console.error("Error creating user:", error)
            throw error
        }
    }

export const updateUserService = async (userId: bigint, updateData: any) => {
    try {
        if (updateData.password?.length >=8) {
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

export const getAllUsersService = async (pharmacyId:bigint)=>{
    // console.log("get all users")
    try{
        const users = await prismaClient.users.findMany({
            where:{pharmacy_id:pharmacyId}
        })
        return users
    }
    catch(error){
        console.error("Error fetching users:", error)
        throw error
    }
}

export const deactivateUserService = async (userId: bigint) => {
    try{
        const user = await prismaClient.users.update({
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
