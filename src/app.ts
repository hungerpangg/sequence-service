import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";

import BaseError from "./errors/BaseError";
import NotFoundError from "./errors/NotFoundError";
import { ErrorResponse } from "./types/ErrorResponse.type";
import router from "./routes";

import session from "express-session";
import genFunc from "connect-pg-simple";

const app = express();

app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: true }));
app.use(
	helmet({
		hsts: {
			maxAge: 86400,
		},
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
			},
		},
	})
);

const PostgresqlStore = genFunc(session);
const sessionStore = new PostgresqlStore({
	conString: process.env.DATABASE_URL,
});

app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: false,
			// secure: false,
			sameSite: "none",
			maxAge: 30 * 60 * 1000, // 30 minutes
		},
		store: sessionStore,
	})
);

app.use("/api", router);

app.use((req, res, next) => {
	next(new NotFoundError());
});
app.use(handleError);

function handleError(
	err: Error,
	req: Request,
	res: Response,
	_next: NextFunction
) {
	let statusCode = 500;

	let errorResponse: ErrorResponse = {
		error: {
			code: "ERROR",
			message: err.message || "Some error occured",
		},
	};

	if (req.user) {
		console.log({
			err,
			"user-email": req.user?.upn,
			"request-id": req.headers["request-id"],
		});
	}

	if (err instanceof BaseError) {
		statusCode = err.statusCode;
		errorResponse = err.errorResponse;
	}

	res.status(statusCode).send(errorResponse);
}

export default app;
