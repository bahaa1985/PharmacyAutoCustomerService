import api from "./axios";
import type{ Pharmacy } from "../types/pharmacy";

export const pharmacyAPI = {
    /**
     * Fetch all pharmacies     */
    getPharmacies: async ():Promise<Pharmacy[]> =>{
        const response = await api.get('/pharmacy/all')
        return response.data
    },
    /**
     * Fetch a pharmacy by its ID
     * */
    getPharmacyById: async (id: number):Promise<Pharmacy> =>{
        const response = await api.get(`/pharmacy/${id}`)
        return response.data
    },
    /**
     * Create a new pharmacy
     * */
    createPharmacy: async (pharmacy_name: string, pharmacy_address: string):Promise<Pharmacy> =>{
        const response = await api.post('/pharmacy/create',{pharmacy_name, pharmacy_address})
        return response.data
    },

    /**
     * Update an existing pharmacy
     * */
    updatePharmacy: async (id: bigint, data:Partial<Pharmacy>):Promise<Pharmacy> =>{
        const response = await api.put(`/pharmacy/update/${id}`,data)
        return response.data
    },
}