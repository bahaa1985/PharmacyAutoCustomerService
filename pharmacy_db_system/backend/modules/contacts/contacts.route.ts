import express from 'express';
import bodyParser from 'body-parser';
import { authenticateToken } from '../../middleware/authenticateToken';
import { createContactController, getContactsController } from './contacts.controller';

export const CONTACTS_ROUTER = express.Router();

CONTACTS_ROUTER.use(authenticateToken);
CONTACTS_ROUTER.get('/', getContactsController);
CONTACTS_ROUTER.post('/new', bodyParser.urlencoded({ extended: true }), createContactController);
