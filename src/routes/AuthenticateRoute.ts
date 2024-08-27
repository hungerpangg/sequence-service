import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

function init(req: Request, res: Response, next: NextFunction) {
	if (req.session.isAuthenticated) {
		const { upn, firstName, lastName } = req.session;
		req.user = {
			upn: upn ?? "",
			firstName: firstName ?? "",
			lastName: lastName ?? "",
		};
	}

	next();
}

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (!req.session.isAuthenticated) {
		res.set("Content-Type", "text/plain; charset=utf-8");
		res.status(StatusCodes.UNAUTHORIZED).send("Unauthenticated");
	} else {
		next();
	}
}

export default {
	init,
	ensureAuthenticated,
};
