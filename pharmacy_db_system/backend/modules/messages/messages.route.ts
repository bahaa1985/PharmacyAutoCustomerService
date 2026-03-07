import { getMessagesByPharmacyIdController } from "./messages.controller";

import express from "express";

const router = express.Router()

router.get('/:pharmacyId', getMessagesByPharmacyIdController)