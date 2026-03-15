import express from "express";
import { userLoginController, userLogoutController } from "./login.controller";
import { authenticateToken } from "../../middleware/authenticateToken";
import bodyParser from "body-parser";

export const AUTH_LOGIN_ROUTER = express.Router()

AUTH_LOGIN_ROUTER.post('/',bodyParser.urlencoded({extended:true}), userLoginController)