import { createUserController, updateUserController, getAllUsersController, deactivateUserController } from "./user.controller";
import express from "express";
import bodyParser from "body-parser";


const app = express()
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

export const USER_ROUTER = express.Router()

USER_ROUTER.post('/new',bodyParser.urlencoded({ extended: true }), createUserController)
USER_ROUTER.patch('/update/:id',bodyParser.urlencoded({ extended: true }), updateUserController)
USER_ROUTER.get('/all/:pharmacyId', getAllUsersController)
USER_ROUTER.patch('/deactivate/:id', deactivateUserController)