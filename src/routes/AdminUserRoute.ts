import { NextFunction, Request, Response } from "express";
import AdminUserModel from "../models/AdminUserModel";
import { StatusCodes } from "http-status-codes";
import BaseError from "../errors/BaseError";
import { HttpStatusCode } from "axios";
import bcrypt from "bcrypt";

async function createAdminUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		console.log("/private/create-admin");
		const { email, password, firstName, lastName } = req.body;
		const user = await AdminUserModel.getPrivateAdminUser(email);

		if (user) {
			console.log(`Staff with upn "${email}" already exists`);
			throw new BaseError();
		}

		const result = await AdminUserModel.createAdminUser(
			email,
			password,
			firstName,
			lastName
		);

		if (result.rowCount && result.rowCount > 0) {
			return res.sendStatus(StatusCodes.OK);
		} else {
			console.log(`Error while creating staff for upn ""`);
			throw new BaseError();
		}
	} catch (error) {
		next(error);
	}
}

async function adminLogin(req: Request, res: Response, next: NextFunction) {
	try {
		console.log("/private/login");
		const { email, password } = req.body;
		const user = await AdminUserModel.getPrivateAdminUser(email);
		if (!user) {
			res.status(HttpStatusCode.Ok).send({
				success: false,
				message: `Invalid username or password`,
			});
			console.log(`User with email ${email} does not exist`);
			return;
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			res.status(HttpStatusCode.Ok).send({
				success: false,
				message: "Invalid username or password",
			});
			console.log(`Password for user ${email} is wrong`);
			return;
		}

		req.session.isAuthenticated = true;
		req.session.upn = user.upn;
		req.session.firstName = user.first_name;
		req.session.lastName = user.last_name;

		req.session.save((error) => {
			if (error) {
				return next(error);
			}

			res.status(HttpStatusCode.Ok).send({ success: true });
		});
	} catch (error) {
		next(error);
	}
}

async function getAdminProfile(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		console.log("/private/profile/me");
		const email = req.user!.upn;
		const user = await AdminUserModel.getPublicAdminUser(email ?? "");
		return res.status(StatusCodes.OK).send(user);
	} catch (error) {
		next(error);
	}
}

export default { createAdminUser, adminLogin, getAdminProfile };
