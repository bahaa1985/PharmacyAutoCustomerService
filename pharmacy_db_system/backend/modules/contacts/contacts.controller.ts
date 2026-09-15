import { createContactService, getContactsByUserService, getBlockedContactsService, toggleBlockContactService } from './contacts.service';
import { prismaClient } from '../../utils/prisma-adapter';


const serializeContact = (contact: any) => ({
  ...contact,
  id: contact.id?.toString(),
  user_id: Number(contact.user_id?.toString()),
});

export const getContactsController = async (req: any, res: any) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const requestedUserId = Number(req.query.userId || user.id);
    const requestedUser = await prismaClient.users.findFirst({
      where: { id: requestedUserId, pharmacy_id: user.pharmacy_id },
    });
    if (!requestedUser) {
      return res.status(404).json({ message: 'Pharmacy user not found' });
    }
    const contacts = await getContactsByUserService(requestedUserId);
    res.status(200).json(contacts.map(serializeContact));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
};

export const getBlockedContactsController = async (req: any, res: any) => {
  try {
    const blockedContacts = await getBlockedContactsService();
    res.status(200).json(blockedContacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blocked contacts', error });
  }
};

export const toggleBlockContactController = async (req: any, res: any) => {
  const { phone, block } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const result = await toggleBlockContactService(phone, block);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling block status', error });
  }
};


export const createContactController = async (req: any, res: any) => {
  const user = req.user;
  console.log("Creating contact for user:", user);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { name, phone, userId } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: 'Contact name and phone are required' });
  }

  try {
    const requestedUserId = Number(userId || user.id);
    const requestedUser = await prismaClient.users.findFirst({
      where: { id: requestedUserId, pharmacy_id: user.pharmacy_id },
    });
    if (!requestedUser) {
      return res.status(404).json({ message: 'Pharmacy user not found' });
    }
    const contact = await createContactService(name, phone, requestedUserId);
    res.status(201).json(serializeContact(contact));
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact', error });
  }
};
