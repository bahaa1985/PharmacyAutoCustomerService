import { getMessagesByPharmacyIdService } from "./messages.service";

const serializeMessage = (message: any) => {
    return {
        ...message,
        id: message.id?.toString(),
        pharmacy_id: message.pharmacy_id?.toString(),
        message_type: message.message_type?.toString()
    }
}
export const getMessagesByPharmacyIdController = async (req: any, res: any) => {
    const { pharmacyId } = req.params
    try {
        const messages = await getMessagesByPharmacyIdService(pharmacyId)
        res.status(200).json(messages)
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching messages", error })
    }
}