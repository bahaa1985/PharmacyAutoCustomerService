import React, { useState } from 'react';
import { inventoryAPI } from '../../api/inventoryAPI';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const UploadInventory: React.FC = () => {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatus('');

    try {
      const response = await inventoryAPI.uploadInventory(file);
      setStatus(
        `✓ ${response.message} (${response.importedCount || 0} items imported)`
      );
      setShowModal(false);
      // Reset file input
      if (e.target) e.target.value = '';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setStatus(`✗ Upload failed: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)} variant="primary">
        Upload Inventory File
      </Button>

      <Modal
        isOpen={showModal}
        title="Upload Inventory"
        onClose={() => {
          setShowModal(false);
          setStatus('');
        }}
      >
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
          {status && (
            <p
              className={`text-sm ${
                status.startsWith('✓') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </Modal>

      {status && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            status.startsWith('✓')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
};
