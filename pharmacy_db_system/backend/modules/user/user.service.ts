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
