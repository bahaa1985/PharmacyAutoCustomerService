import { prismaClient } from "../../utils/prisma-adapter";

const getTextMessageType = async (): Promise<bigint> => {
  const messageType = await prismaClient.message_types.findFirst({
    where: { message_type: 'text' },
  });
  return messageType ? BigInt(messageType.id) : BigInt(1);
};

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
    const where: any = {
      OR: [
        { from_number: userNumber },
        { to_number: userNumber },
      ],
    };
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

export const createMessageService = async ({
  fromNumber,
  toNumber,
  message,
  imageUrl,
  pharmacyId,
  log,
}: {
  fromNumber: string;
  toNumber: string;
  message?: string;
  imageUrl?: string;
  pharmacyId: bigint;
  log: string;
}) => {
  try {
    const messageType = await getTextMessageType();
    const newMessage = await prismaClient.messages.create({
      data: {
        from_number: fromNumber,
        to_number: toNumber,
        message,
        image_url: imageUrl,
        message_type: messageType,
        pharmacy_id: pharmacyId,
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