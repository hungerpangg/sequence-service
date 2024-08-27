import BaseError from "./BaseError";
import { StatusCodes } from "http-status-codes";

export default class BadRequestError extends BaseError {
	statusCode = StatusCodes.BAD_REQUEST;

	constructor(message = "Bad request", errorCode = "ERROR_BAD_REQUEST") {
		super(message, errorCode);
	}
}
