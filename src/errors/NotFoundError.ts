import BaseError from "./BaseError";
import { StatusCodes } from "http-status-codes";

export default class NotFoundError extends BaseError {
	statusCode = StatusCodes.NOT_FOUND;

	constructor(message = "Resource not found", errorCode = "ERROR_NOT_FOUND") {
		super(message, errorCode);
	}
}
