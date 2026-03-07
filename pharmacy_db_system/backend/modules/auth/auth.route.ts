import express from "express";
import { userLoginController } from "./auth.controller";

const authRoute = express.Router()

authRoute.post('/login', userLoginController)