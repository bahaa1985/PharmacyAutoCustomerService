import express from "express";
import { userLoginController } from "./login.controller";
import { authenticateToken } from "../../middleware/token";
import bodyParser from "body-parser";

export const AUTH_ROUTER = express.Router()

AUTH_ROUTER.post('/',bodyParser.urlencoded({extended:true}), userLoginController)