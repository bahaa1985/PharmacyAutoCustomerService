import { authenticateToken } from "../../middleware/authenticateToken";
import {
  createMessageController,
  deleteMessageController,
  getMessagesByPharmacyIdController,
  getMessagesByUserNumberController,
  updateMessageController,
} from "./messages.controller";
import express from "express";

export const MESSAGES_ROUTER = express.Router();

MESSAGES_ROUTER.use(authenticateToken);

MESSAGES_ROUTER.get('/user/:userNumber', getMessagesByUserNumberController);
MESSAGES_ROUTER.get('/pharmacy/:pharmacyId', getMessagesByPharmacyIdController);
MESSAGES_ROUTER.post('/new', createMessageController);
MESSAGES_ROUTER.patch('/:id', updateMessageController);
MESSAGES_ROUTER.delete('/:id', deleteMessageController);