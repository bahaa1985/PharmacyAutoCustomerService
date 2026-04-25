import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { inventoryAPI } from '../../api/inventoryAPI';
import { uploadExcelFile } from './UploadToN8NGoogleDrive';
// import { googleDriveAPI } from '../../api/googleDriveAPI';
import { Button } from '../../components/ui/Button';
// import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import type { DrugCardEntry } from './uploadInventoryHandler';
import {
  groupDrugCardByFirstChar,
  normalizeDrugCardData
} from './uploadInventoryHandler';
import { usePharmacy } from '../../context/PharamcyContext';

export const UploadInventory: React.FC = () => {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  const [chunksCount, setChunksCount] = useState(0);
  const [progressStep, setProgressStep] = useState(0);
  const [disabledUploadingButton, setDisabledUploadingButton] = useState(true);
  const [processedRows, setProcessedRows] = useState<(string | number | boolean | null)[][]>([]);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const { showToast } = useToast();
  const { pharmacy } = usePharmacy();

  console.log("pharmacy",pharmacy);
  
  // Load DrugCard data from local file
  type ExcelRow = (string | number | boolean | null)[];

  const loadDrugCardData = async (): Promise<DrugCardEntry[]> => {
    try {
      return await inventoryAPI.getDrugCardData();
    } catch (error) {
      console.warn('Failed to load DrugCard data:', error);
      showToast('Failed to load DrugCard data from local file', 'error');
      return [];
    }
  };

  const processRowsWithWorkers = async (
    rows: ExcelRow[],
    a_nameIndex: number,
    e_nameIndex: number,
    dosageFormIndex: number,
    unitsIndex: number,
    drugCardByFirstChar: Record<string, DrugCardEntry[]>
  ): Promise<ExcelRow[]> => {
    if (rows.length === 0) {
      return rows;
    }

    const cpuCount = navigator.hardwareConcurrency || 4;
    const workerCount = Math.min(cpuCount, rows.length);
    const chunkSize = Math.ceil(rows.length / workerCount);
    setChunksCount(workerCount);
    const workerUrl = new URL('./uploadInventoryWorker.ts', import.meta.url);

    const chunkPromises: Promise<{ chunkIndex: number; rows: ExcelRow[] }>[] = [];

    for (let chunkIndex = 0; chunkIndex < workerCount; chunkIndex += 1) {
      const start = chunkIndex * chunkSize;
      if (start >= rows.length) break;

      const chunkRows = rows.slice(start, Math.min(start + chunkSize, rows.length));
      const worker = new Worker(workerUrl, { type: 'module' });

      const promise = new Promise<{ chunkIndex: number; rows: ExcelRow[] }>((resolve, reject) => {
        const cleanup = () => {
          worker.removeEventListener('message', handleMessage);
          worker.removeEventListener('error', handleError);
          worker.terminate();
        };

        const handleMessage = (event: MessageEvent<{ chunkIndex: number; rows: ExcelRow[] }>) => {
          cleanup();
          // update progress when a chunk is finished
          setProgressStep(prev => prev + 1);
          resolve(event.data);
        };

        const handleError = (event: ErrorEvent) => {
          cleanup();
          reject(event.error || new Error(event.message));
        };

        worker.addEventListener('message', handleMessage);
        worker.addEventListener('error', handleError);

        worker.postMessage({
          chunkIndex,
          rows: chunkRows,
          a_nameIndex,
          e_nameIndex,
          dosageFormIndex,
          unitsIndex,
          drugCardByFirstChar
        });
      });
      chunkPromises.push(promise);
    }

    const chunkResults = await Promise.all(chunkPromises);
    const orderedRows = chunkResults
      .sort((a, b) => a.chunkIndex - b.chunkIndex)
      .flatMap(result => result.rows);

    rows.splice(0, rows.length, ...orderedRows);
    return rows;
  };

  const validateAndProcessExcelFile = async (file: File): Promise<{ headers: string[], rows: (string | number | boolean | null)[][] }> => {
    try {
      // 1. Check if file is Excel
      const allowedExtensions = ['.xlsx', '.xls'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error('Please select a valid Excel file (.xlsx or .xls)');
      }

      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number | boolean | null)[][];

      if (jsonData.length < 2) {
        throw new Error('Excel file must contain at least a header row and one data row');
      }

      // Get headers from first row
      const headers = jsonData[0].map(h =>
        h !== null && h !== undefined
          ? String(h).toLowerCase().trim()
          : ''
      );
      const dataRows = jsonData.slice(1);

      // 2. Check required columns
      const requiredColumns = ['a_name', 'price', 'unit'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));

      if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
      }

      // Get column indices
      const a_nameIndex = headers.indexOf('a_name');
      const e_nameIndex = headers.indexOf('e_name');

      // 3. Add form_dosage column
      const extendedHeaders = [...headers, 'dosage_form', 'units'];
      const dosageFormIndex = headers.length;
      const unitsIndex = headers.length + 1;

      // Load DrugCard data for comparison
      const drugCardData = await loadDrugCardData();

      if (drugCardData.length === 0) {
        showToast('Warning: DrugCard data not available for dosage matching', 'warning');
      }

      // Normalize DrugCard data and group by first character for faster search
      const normalizedDrugCardData = normalizeDrugCardData(drugCardData);

      // Group drugs by first character for faster lookup
      const drugCardByFirstChar = groupDrugCardByFirstChar(normalizedDrugCardData);
      
      // reset progress UI and run workers
      setProgressStep(0);
      setChunksCount(0);
      
      await processRowsWithWorkers(
        dataRows,
        a_nameIndex,
        e_nameIndex,
        dosageFormIndex,
        unitsIndex,
        drugCardByFirstChar
      );
      
      // ensure progress bar shows complete
      setProgressStep(prev => Math.max(prev, 0));

      // Store processed data
      setProcessedRows([extendedHeaders, ...dataRows]);
      
      // Show success toast
      showToast('File validated and processed successfully! Ready to upload.', 'success');
      // Enable the upload button after successful validation
      setDisabledUploadingButton(false);

      return { headers: extendedHeaders, rows: dataRows };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'File validation failed';
      showToast(message, 'error');
      throw error;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatus('');

    try {
      // Validate and process the file first
      await validateAndProcessExcelFile(file);
      setOriginalFile(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setStatus(`✗ Processing failed: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createProcessedExcelFile = (fileName: string): File => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(processedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new File([new Blob([wbout])], fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  const handleUploadButtonClick = async () => {
    if (!originalFile || processedRows.length === 0) {
      showToast('No file to upload. Please select and process a file first.', 'error');
      return;
    }

    setIsLoading(true);
    setStatus('');

    try {
      // Create the processed Excel file
      // const timestamp = new Date().toISOString().split('T')[0];
      // const processedFileName = `processed-inventory-${timestamp}.xlsx`;
      const processedFileName = `${pharmacy?.pharmacy_name}.xlsx`;
      const excelFile = createProcessedExcelFile(processedFileName);

      // Upload to Google Drive
      const uploadResult = await uploadExcelFile(excelFile);
      // setStatus('Uploading to Google Drive...');
      // const googleDriveResult = await googleDriveAPI.uploadProcessedExcelFile(excelFile);
      showToast(`✓ File uploaded to Google Drive: ${uploadResult}`, 'success');

      // Upload to backend
      // setStatus('Uploading to backend...');
      // const response = await inventoryAPI.uploadInventory(originalFile);
      // setStatus(
      //   `✓ ${response.message} (${response.importedCount || 0} items imported)`
      // );

      // Reset state
      setDisabledUploadingButton(true);
      setOriginalFile(null);
      setProcessedRows([]);

      showToast('Successfully uploaded to both Google Drive and backend!', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setStatus(`✗ Upload failed: ${message}`);
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      

      {/* <Modal
        isOpen={showModal}
        title="Upload Inventory"
        onClose={() => {
          setShowModal(false);
          setStatus('');
        }}
      > */}
        <div className="space-y-4">
          <p className="text-gray-600">
            Upload a CSV or Excel file with your inventory data.
          </p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="block w-full"
          />
          {isLoading && chunksCount > 0 && (
            <div className="w-full">
              <progress
                className="w-full rounded-full"
                value={progressStep}
                max={chunksCount}
                style={{
                  display: 'block',
                  color: 'white',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  height: '8px',
                }}
              ></progress>
              <p className="text-xs text-gray-500 mt-2">
                Processing: {Math.round((progressStep / chunksCount) * 100)}%
              </p>
            </div>
          )}
          {/* {status && (
            <p
              className={`text-sm ${
                status.startsWith('✓') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status}
            </p>
          )} */}
        </div>
      {/* </Modal> */}
      {/* {status && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            status.startsWith('✓')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {status}
        </div>
      )} */}

      <Button onClick={handleUploadButtonClick} variant="primary" style={{marginTop:'16px'}} disabled={disabledUploadingButton || isLoading}>
        Upload Inventory File
      </Button>
    </div>
  );
};
