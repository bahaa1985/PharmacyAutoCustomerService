import express from 'express'
import { createPharamcyController, getAllPharmaciesController, getPharmacyByIdController, updatePharmacyController } from './pharmacy.controller'

const router = express.Router()

router.post('/new',createPharamcyController)
router.get('/all', getAllPharmaciesController)
router.get('/:id', getPharmacyByIdController)
router.put('/update/:id', updatePharmacyController)