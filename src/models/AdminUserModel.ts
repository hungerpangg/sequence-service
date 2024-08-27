import { QueryResult } from "pg";
import sql from "sql-template-strings";
import Postgres from "../libs/Postgres";
import bcrypt from "bcrypt";

async function createAdminUser(
	upn: string,
	password: string,
	firstName: string,
	lastName: string
): Promise<QueryResult> {
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(password, salt);
	const statement = sql`INSERT INTO staff
    (upn, password, first_name, last_name)
    VALUES (${upn}, ${hashedPassword}, ${firstName}, ${lastName})`;

	return Postgres.query(statement);
}

async function getPrivateAdminUser(upn: string) {
	const statement = sql`SELECT upn, password, first_name, last_name 
    FROM
    staff
    WHERE
    upn = ${upn}`;

	const result = await Postgres.query(statement);
	return result.rows[0];
}

async function getPublicAdminUser(upn: string) {
	const statement = sql`SELECT upn, first_name, last_name 
    FROM
    staff
    WHERE
    upn = ${upn}`;

	const result = await Postgres.query(statement);
	return result.rows[0];
}

export default {
	createAdminUser,
	getPrivateAdminUser,
	getPublicAdminUser,
};
