import { log } from "console";
import { prismaClient } from "../../utils/prisma-adapter";
import {sendTextMessage} from "./evolutionSendTextMessage"
// const getTextMessageType = async (): Promise<bigint> => {
//   const messageType = await prismaClient.message_types.findFirst({
//     where: { message_type: 'text' },
//   });
//   return messageType ? BigInt(messageType.id) : BigInt(1);
// };

export const getMessagesByPharmacyIdService = async (
  pharmacyId: bigint,
  contactPhone?: string,
) => {
  try {
    const where: any = { pharmacy_id: pharmacyId };
    if (contactPhone) {
      where.AND = [
        {
          OR: [
            { from_number: contactPhone },
            { to_number: contactPhone },
          ],
        },
      ];
    }
    const messages = await prismaClient.messages.findMany({
      where,
      orderBy: { created_at: 'asc' },
    });
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const getMessagesByUserNumberService = async (
  userNumber: string,
  contactPhone?: string,
) => {
  try {
    if (!contactPhone) return [];
    const messages = await prismaClient.messages.findMany({
      where:{
        AND:{
          OR: [
            { from_number: contactPhone.trim() ,to_number: userNumber.trim() },
            {from_number:userNumber.trim(),to_number:contactPhone.trim()}
          ],
        }
      },
      orderBy: { created_at: 'asc' },
    });
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const createMessageService = async ({
  fromNumber,
  toNumber,
  instance_name,
  message,
  message_type,
  imageUrl,
  pharmacyId,
  original_id,
  confidence,
  log,
}: {
  fromNumber: string;
  toNumber: string;
  instance_name: string;
  message?: string;
  message_type?: number|bigint;
  imageUrl?: string;
  pharmacyId: number|bigint;
  original_id?: string;
  confidence?:number;
  log: string;
}) => {
  try {
    // const messageType = await getTextMessageType();
    const evolution_message = await sendTextMessage(toNumber,message||"",instance_name)
    // if(!evolution_message || evolution_message.status !== "success"){
    //   throw new Error("Failed to send message via Evolution API");
    // }
    // console.log("evo object",evolution_message)
    original_id = evolution_message.key.id.toString();
    log = evolution_message.status;
    const newMessage = await prismaClient.messages.create({
      data: {
        from_number: fromNumber,
        to_number: toNumber,
        message,
        image_url: imageUrl,
        message_type: 5,
        pharmacy_id: pharmacyId,
        original_id,
        confidence:1.0,
        log,
      },
    });
    return newMessage;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

export const updateMessageService = async (
  id: bigint,
  updateData: Partial<{
    message: string | null;
    image_url: string | null;
  }>,
) => {
  try {
    const updatedMessage = await prismaClient.messages.update({
      where: { id },
      data: updateData,
    });
    return updatedMessage;
  } catch (error) {
    console.error("Error updating message:", error);
    throw error;
  }
};

export const deleteMessageService = async (id: bigint) => {
  try {
    return prismaClient.messages.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};