import express from "express";
import AdminUserModel from "../models/AdminUserModel";
import AuthenticateRoute from "./AuthenticateRoute";
import { StatusCodes } from "http-status-codes";
import BaseError from "../errors/BaseError";
import { HttpStatusCode } from "axios";
import bcrypt from "bcrypt";
import AdminUserRoute from "./AdminUserRoute";

declare module "express-session" {
	interface SessionData {
		isAuthenticated: boolean;
		upn: string;
		firstName: string;
		lastName: string;
	}
}

declare global {
	namespace Express {
		interface Request {
			user?: {
				upn: string;
				firstName: string;
				lastName: string;
			};
		}
	}
}

const router = express.Router();

router.use(AuthenticateRoute.init);

router.post("/private/create-admin", AdminUserRoute.createAdminUser);

router.post("/private/login", AdminUserRoute.adminLogin);

router.use(AuthenticateRoute.ensureAuthenticated);

router.get("/private/profile/me", AdminUserRoute.getAdminProfile);

export default router;
