import BaseError from "./BaseError";
import { StatusCodes } from "http-status-codes";

export default class BadGatewayError extends BaseError {
	statusCode = StatusCodes.BAD_GATEWAY;

	constructor(message = "Bad gateway", errorCode = "ERROR_BAD_GATEWAY") {
		super(message, errorCode);
	}
}
