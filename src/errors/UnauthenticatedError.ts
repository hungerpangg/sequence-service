import BaseError from "./BaseError";
import { StatusCodes } from "http-status-codes";

export default class UnauthorizedError extends BaseError {
	statusCode = StatusCodes.UNAUTHORIZED;

	constructor(message = "Unauthorized", errorCode = "ERROR_UNAUTHORIZED") {
		super(message, errorCode);
	}
}
