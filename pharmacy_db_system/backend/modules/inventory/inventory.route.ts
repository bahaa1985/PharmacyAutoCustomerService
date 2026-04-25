import { Router } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { inventoryController } from './inventory.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload inventory file
router.post('/upload', upload.single('file'), inventoryController.uploadInventory);

// Get DrugCard data
router.get('/drugcard', inventoryController.getDrugCardData);

export default router;