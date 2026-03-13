import { Prisma, PrismaClient } from "@prisma/client";
import { prismaClient } from "../../utils/prisma-adapter"

// export const createMessageService = async (fromNumber: string, toNumber: string, message: string, messageType: bigint, pharmacyId: bigint, statusCode: number, log: string,) => {
//     try {
//         const newMessage = await prismaClient.messages.create({
//             data: {
//                 from_number: fromNumber, to_number: toNumber, message, message_type: messageType, pharmacy_id: pharmacyId, status_code: statusCode, log
//             }
//         })
//         return newMessage
//     }
//     catch (error) {
//         console.error("Error creating message:", error)
//         throw error
//     }
// }

export const getMessagesByPharmacyIdService = async (pharmacyId: bigint) => {
    try {
        const messages = await prismaClient.messages.findMany({
            where: { pharmacy_id: pharmacyId },
            orderBy: { created_at: 'desc' }
        })
        return messages
    }
    catch (error) {
        console.error("Error fetching messages:", error)
        throw error
    }
}