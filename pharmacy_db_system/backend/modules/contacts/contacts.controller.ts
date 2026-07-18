import { createContactService, getContactsByUserService } from './contacts.service';

const serializeContact = (contact: any) => ({
  ...contact,
  id: contact.id?.toString(),
  user_id: contact.user_id?.toString(),
});

export const getContactsController = async (req: any, res: any) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const contacts = await getContactsByUserService(BigInt(user.id));
    res.status(200).json(contacts.map(serializeContact));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
};

export const createContactController = async (req: any, res: any) => {
  const user = req.user;
  console.log("Creating contact for user:", user);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: 'Contact name and phone are required' });
  }

  try {
    const contact = await createContactService(name, phone, Number(user.id));
    res.status(201).json(serializeContact(contact));
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact', error });
  }
};
