import http from "http";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../.env") });

import app from "./app";
import Postgres from "./libs/Postgres";

const defaultPort = 3001;
const port = process.env.PORT || defaultPort;
const server = http.createServer(app);

server.listen(port, init);

process.on("uncaughtException", handleUncaughtException);
process.on("unhandledRejection", handleUnhandledRejection);
process.on("SIGINT", handleSignal);

async function init() {
	console.log("Initializing server");

	console.log("Migrating database");
	await Postgres.migrate();

	console.log("Server ready");
}

function handleUncaughtException(error: Error) {
	console.log(error, "Uncaught Exception");
	gracefullyExitProcess();
}

function handleUnhandledRejection(reason?: {} | null) {
	const error = reason || {};
	console.log(error, "Unhandled Rejection");
	gracefullyExitProcess();
}

function handleSignal(signal: string) {
	console.log(`Received Signal ${signal}`);
	gracefullyExitProcess();
}

async function gracefullyExitProcess() {
	console.log("Exiting Process");
	await Postgres.close();
	server.close(() => process.exit());
}
