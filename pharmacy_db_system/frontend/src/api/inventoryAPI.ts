import api from './axios';

export interface InventoryUploadResponse {
  success: boolean;
  message: string;
  importedCount?: number;
}

export const inventoryAPI = {
  /**
   * Upload inventory file (CSV or Excel)
   */
  uploadInventory: async (file: File): Promise<InventoryUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<InventoryUploadResponse>(
      '/api/inventory/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Get inventory list with pagination and filtering
   */
  getInventory: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await api.get('/api/inventory', { params });
    return response.data;
  },

  /**
   * Delete inventory item
   */
  deleteInventory: async (id: string) => {
    await api.delete(`/api/inventory/${id}`);
  },
};
