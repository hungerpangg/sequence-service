import { ErrorResponse } from "../types/ErrorResponse.type";
import { StatusCodes } from "http-status-codes";

export default class BaseError extends Error {
	statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
	errorCode: string;

	constructor(message = "Some error occured", errorCode = "ERROR") {
		super(message);
		this.name = this.constructor.name;
		this.errorCode = errorCode;
		Error.captureStackTrace(this, this.constructor);
	}

	get errorResponse(): ErrorResponse {
		return {
			error: {
				code: this.errorCode,
				message: this.message,
			},
		};
	}
}
