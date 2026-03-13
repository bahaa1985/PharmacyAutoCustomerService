import { createPharmacyService, getAllPharmaciesService, getPharmacyByIdService, updatePharmacyService } from "./pharmacy.service";

const serializePharmacy = (pharmacy: any) => {
    return {
        ...pharmacy,
        id: pharmacy.id?.toString()
    }
}

export const createPharamcyController = async (req: any, res: any) => {
    const { pharmacy_name, pharmacy_address } = req.body
    try {
        const newPharmacy = await createPharmacyService(pharmacy_name, pharmacy_address)
        res.status(201).json(serializePharmacy(newPharmacy))
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create pharmacy' })
    }
}

export const getAllPharmaciesController = async (req: any, res: any) => {
    try {
        const pharmacies = await getAllPharmaciesService()
        res.status(201).json(pharmacies)
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch pharmacies' })
    }
}

export const getPharmacyByIdController = async (req: any, res: any) => {
    const { id } = req.params
    try {
        const pharmacy = await getPharmacyByIdService(id)
        res.status(201).json(serializePharmacy(pharmacy))
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch pharmacy' })
    }
}

export const updatePharmacyController = async (req: any, res: any) => {
    const { id } = req.params
    const { pharmacy_name, pharmacy_address } = req.body
    try {
        await updatePharmacyService(id, pharmacy_name, pharmacy_address)
        res.status(200).json({ message: 'Pharmacy updated successfully' })
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update pharmacy' })
    }
}