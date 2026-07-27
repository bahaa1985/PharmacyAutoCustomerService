import { Prisma } from "@prisma/client";
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

export const getBlockedContactsService = async () => {
  try {
    return await prismaClient.blocked_contacts.findMany();
  } catch (error) {
    console.error('Error fetching blocked contacts:', error);
    throw error;
  }
};

export const toggleBlockContactService = async (phone: string, block: boolean) => {
  try {
    if (block) {
      return await prismaClient.blocked_contacts.upsert({
        where: { contact_number: phone },
        update: {
          blocked: true,
          blocked_until: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
        },
        create: {
          contact_number: phone,
          ten_minutes_messages: 0,
          daily_messages: 0,
          blocked: true,
          blocked_until: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
        },
      });
    } else {
      return await prismaClient.blocked_contacts.upsert({
        where: { contact_number: phone },
        update: {
          blocked: false,
          blocked_until:null,
          alerted:false
        },
        create: {
          contact_number: phone,
          ten_minutes_messages: 0,
          daily_messages: 0,
          blocked: false,
          blocked_until: null,
          alerted:false
        },
      });
    }
  } catch (error) {
    console.error('Error toggling block status:', error);
    throw error;
  }
};

