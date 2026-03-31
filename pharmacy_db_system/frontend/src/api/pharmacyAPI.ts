import api from "./axios";
import type{ Pharmacy } from "../types/pharmacy";

export const pharmacyAPI = {
    /**
     * Fetch all pharmacies     */
    getPharmacies: async ():Promise<Pharmacy[]> =>{
        const response = await api.get('/pharmacy/all')
        return response.data
    }
}