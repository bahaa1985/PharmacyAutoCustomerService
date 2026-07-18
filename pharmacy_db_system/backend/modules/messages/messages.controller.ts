import {
  createMessageService,
  deleteMessageService,
  getMessagesByPharmacyIdService,
  getMessagesByUserNumberService,
  updateMessageService,
} from "./messages.service";

const serializeMessage = (message: any) => {
  return {
    ...message,
    id: message.id?.toString(),
    pharmacy_id: message.pharmacy_id?.toString(),
    message_type: message.message_type?.toString(),
    created_at: message.created_at?.toISOString?.() || message.created_at,
  };
};

export const getMessagesByPharmacyIdController = async (req: any, res: any) => {
  const { pharmacyId } = req.params;
  const contactPhone = req.query.contactPhone as string | undefined;
  try {
    const messages = await getMessagesByPharmacyIdService(BigInt(pharmacyId), contactPhone);
    res.status(200).json(messages.map(serializeMessage));
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};

export const getMessagesByUserNumberController = async (req: any, res: any) => {
  const { userNumber } = req.params;
  const contactPhone = req.query.contactPhone as string | undefined;
  try {
    const messages = await getMessagesByUserNumberService(userNumber, contactPhone);
    res.status(200).json(messages.map(serializeMessage));
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};

export const createMessageController = async (req: any, res: any) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { to_number, message, image_url } = req.body;
  if (!to_number) {
    return res.status(400).json({ message: "Recipient number is required" });
  }

  try {
    const newMessage = await createMessageService({
      fromNumber: user.mobile,
      toNumber: to_number,
      instance_name: user.instance_name,
      message,
      imageUrl: image_url,
      pharmacyId: BigInt(user.pharmacy_id),
      log: `Created by ${user.username}`,
    });
    res.status(201).json(serializeMessage(newMessage));
  } catch (error) {
    res.status(500).json({ message: "Error creating message", error });
  }
};

export const updateMessageController = async (req: any, res: any) => {
  const { id } = req.params;
  const { message, image_url } = req.body;
  const updateData: any = {};
  if (message !== undefined) updateData.message = message;
  if (image_url !== undefined) updateData.image_url = image_url;
  try {
    const updatedMessage = await updateMessageService(BigInt(id), updateData);
    res.status(200).json(serializeMessage(updatedMessage));
  } catch (error) {
    res.status(500).json({ message: "Error updating message", error });
  }
};

export const deleteMessageController = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    await deleteMessageService(BigInt(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error });
  }
};