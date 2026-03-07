import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prismaClient = new PrismaClient()

export const userLoginService = async (mobile: string, password: string) => {
    try {
        const user = await prismaClient.users.findUnique({
            where: { mobile:mobile }
        })
        if (!user) {
            throw new Error("User not found")
        }        

        const isMatch = bcrypt.compareSync(password, user.password)

        if(isMatch) return user
    }
    catch (error) {
        console.error("Error during user login: check login data", error)
        throw error
    }
}