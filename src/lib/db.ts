import mysql from "mysql2";

export const db = mysql.createPool({
    host:       process.env.DB_HOST,
    user:       process.env.DB_USER,
    database:   process.env.DB_NAME,
    password:   process.env.DB_PASSWORD,
    port:       parseInt(process.env.DB_PORT || '3306')
});