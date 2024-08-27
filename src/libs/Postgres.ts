import pgMigrate from "node-pg-migrate";
import { Pool, Client } from "pg";
import { DatabaseError } from "pg-protocol";
import { SQLStatement } from "sql-template-strings";

import BaseError from "../errors/BaseError";

let pool: Pool | null = null;

async function query(statement: SQLStatement) {
	const client = await getClient();

	try {
		return await client.query(statement);
	} catch (error) {
		console.log(error);
		throw new BaseError();
	} finally {
		client.release();
	}
}

async function migrate() {
	const connectionString = process.env.DATABASE_URL;
	const client = new Client({
		connectionString,
		ssl: { rejectUnauthorized: false },
	});
	try {
		await client.connect();
		await pgMigrate({
			count: Number.POSITIVE_INFINITY,
			dbClient: client,
			dir: "src/migrations",
			direction: "up",
			migrationsTable: "pgmigrations",
			log: (message: string) => console.log(message),
		});
	} catch (error) {
		console.log(error, "Error occured migrating database");
		throw error;
	} finally {
		await client.end();
	}
}

function close() {
	if (pool !== null) {
		return pool.end();
	}
}

async function getClient() {
	let client;
	const connectionString = process.env.DATABASE_URL;

	if (pool === null) {
		pool = getConnectionPool(connectionString!);
	}

	try {
		client = await pool.connect();
	} catch (e) {
		const error = e as DatabaseError;
		console.log(
			`Error occured when connecting to Postgres - errorName: "${error.name}"; errorRoutine: "${error.routine}"`
		);
		if (error.routine !== "auth_failed") {
			throw new BaseError();
		}
		pool = getConnectionPool(connectionString!);
		client = await pool.connect();
	}

	return client;
}

function getConnectionPool(connectionString: string): Pool {
	return new Pool({
		max: 10,
		connectionString,
		ssl: { rejectUnauthorized: false },
	});
}

export default {
	migrate,
	query,
	close,
};
