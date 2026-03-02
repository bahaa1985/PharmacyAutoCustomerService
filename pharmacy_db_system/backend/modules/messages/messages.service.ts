import { Prisma , PrismaClient} from "@prisma/client";

const prismaClient = new PrismaClient()

export const createMessageService = async (from_number:string, to_number:string,message:string,)=>{
    const messageData: Prisma.messagesCreateInput = {
        ...data
    }
    try{
        const newMessage = await prismaClient.messages.create({
            data:messageData
        })
        return newMessage
    }
    catch(error){

    }
}