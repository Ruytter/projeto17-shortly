import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const connection = new Pool({
    host: process.env.HOST,
    port: process.env.PORTDB,
    user: process.env.USERDB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

export default connection;
