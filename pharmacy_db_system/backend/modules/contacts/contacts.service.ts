import { prismaClient } from "../../utils/prisma-adapter";

export const getContactsByUserService = async (userId: bigint) => {
  try {
    return await prismaClient.contacts.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

export const createContactService = async (
  name: string,
  phone: string,
  userId: number | bigint,
) => {
  try {
    return await prismaClient.contacts.create({
      data: {
        name,
        phone,
        user_id: userId,
      },
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};
