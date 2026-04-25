import api from './axios';

export interface InventoryUploadResponse {
  success: boolean;
  message: string;
  importedCount?: number;
}

export interface DrugCardEntry {
  a_name?: string;
  e_name?: string;
  dosage_form: string;
  normalizedDosageForm:string
}

export const inventoryAPI = {
  /**
   * Upload inventory file (CSV or Excel)
   */
  uploadInventory: async (file: File): Promise<InventoryUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<InventoryUploadResponse>(
      '/inventory/upload',
      formData
    );
    return response.data;
  },

  /**
   * Get DrugCard data from local file
   */
  getDrugCardData: async (): Promise<DrugCardEntry[]> => {
    const response = await api.get<DrugCardEntry[]>('/inventory/drugcard');
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
    const response = await api.get('/inventory', { params });
    return response.data;
  },

  /**
   * Delete inventory item
   */
  deleteInventory: async (id: string) => {
    await api.delete(`/api/inventory/${id}`);
  },
};
