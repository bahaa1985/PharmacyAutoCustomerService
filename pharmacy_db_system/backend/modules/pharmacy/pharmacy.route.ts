import express from 'express'
import { createPharamcyController, getAllPharmaciesController, getPharmacyByIdController, updatePharmacyController } from './pharmacy.controller'

const PHARMACY_ROUTER = express.Router()

PHARMACY_ROUTER.post('/new',createPharamcyController)
PHARMACY_ROUTER.get('/all', getAllPharmaciesController)
PHARMACY_ROUTER.get('/:id', getPharmacyByIdController)
PHARMACY_ROUTER.put('/update/:id', updatePharmacyController)