import mysql from "mysql2/promise";

// Create the connection to database
const connection = await mysql.createPool({
  host: "localhost",
  user: "root",
  database: "db_jwt_main",
});

export default connection;