import { getMessagesByPharmacyIdController } from "./messages.controller";

import express from "express";

export const router = express.Router()

router.get('/:pharmacyId', getMessagesByPharmacyIdController)