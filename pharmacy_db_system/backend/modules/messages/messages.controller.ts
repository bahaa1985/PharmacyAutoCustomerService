import {
    createMessageService,
  deleteMessageService,
  getMessagesByPharmacyIdService,
  getMessagesByUserNumberService,
  updateMessageService,
  checkOrderMessageService,
  processWebhookMessageService,
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

    const { to_number, message, image_url, message_type } = req.body;
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
      message_type: message_type,
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

export const checkOrderMessageController = async (req: any, res: any) => {
  const { pharmacyId, fromNumber, message } = req.body;
  if (!pharmacyId || !fromNumber) {
    return res.status(400).json({ message: "pharmacyId and fromNumber are required" });
  }
  try {
    const result = await checkOrderMessageService({
      pharmacyId: BigInt(pharmacyId),
      fromNumber,
      message,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error checking order message", error });
  }
};

export const handleWebhookController = async (req: any, res: any) => {
  const { type, table, record } = req.body;
  if (type === 'INSERT' && table === 'messages' && record.message_type.toString()==='10') {
    try {
      await processWebhookMessageService(record);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error processing webhook", error });
    }
  } else {
    res.status(200).json({ message: "Ignored" });
  }
};