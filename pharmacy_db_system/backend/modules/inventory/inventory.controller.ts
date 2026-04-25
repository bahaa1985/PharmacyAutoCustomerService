import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// const prisma = new PrismaClient();

interface DrugCardEntry {
  a_name?: string;
  e_name?: string;
  dosage_form: string;
}

export const inventoryController = {
  // Upload and process inventory file
  uploadInventory: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];

      // Validate required columns exist
      const firstRow = data[0];
      if (!firstRow) {
        return res.status(400).json({
          success: false,
          message: 'File is empty or invalid'
        });
      }

      const headers = Object.keys(firstRow).map(h => h.toLowerCase().trim());
      const requiredColumns = ['a_name' , 'price', 'unit', 'dosage_form'];

      for (const col of requiredColumns) {
        if (!headers.includes(col)) {
          return res.status(400).json({
            success: false,
            message: `Missing required column: ${col}`
          });
        }
      }

      // Validate data rows
      let importedCount = 0;
      for (const row of data) {
        try {
          // Validate row data (without saving since inventory model is commented in schema)
          if (row.a_name || row.e_name &&  row.dosage_form) {
            importedCount++;
          }
        } catch (error) {
          console.error('Error validating row:', error);
          // Continue with next row
        }
      }

      res.json({
        success: true,
        message: 'Inventory uploaded successfully',
        importedCount
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process inventory file'
      });
    }
  },

  // Get DrugCard data from local file
  getDrugCardData: async (req: Request, res: Response) => {
    try {
      // Path to DrugCard.xlsx in frontend/src directory
      const drugCardPath = path.join(__dirname, '../../../frontend/src/DrugCard.xlsx');

      if (!fs.existsSync(drugCardPath)) {
        return res.status(404).json({
          success: false,
          message: 'DrugCard.xlsx file not found. Please ensure the file exists in frontend/src/DrugCard.xlsx'
        });
      }

      const fileBuffer = fs.readFileSync(drugCardPath);
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet) as DrugCardEntry[];

      res.json(data);
    } catch (error) {
      console.error('Error loading DrugCard data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to load DrugCard data'
      });
    }
  }
};