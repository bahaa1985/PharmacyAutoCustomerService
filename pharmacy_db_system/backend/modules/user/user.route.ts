import { createUserController,updaeUserController,getAllUsersController, deactivateUserController } from "./user.controller";

import express from "express";
const USER_ROUTER = express.Router()

USER_ROUTER.post('/new', createUserController)
USER_ROUTER.put('/update/:id', updaeUserController)
USER_ROUTER.get('/all/:pharmacyId', getAllUsersController)
USER_ROUTER.put('/deactivate/:id', deactivateUserController)