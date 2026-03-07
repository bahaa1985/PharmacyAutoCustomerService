import { getMessagesByPharmacyIdService } from "./messages.service";

export const getMessagesByPharmacyIdController = async (req:any,res:any)=>{
    const {pharmacyId} = req.params
    try{
        const messages = await getMessagesByPharmacyIdService(pharmacyId)
        res.status(200).json(messages)
    }
    catch(error){
        res.status(500).json({message:"Error fetching messages", error})
    }
}