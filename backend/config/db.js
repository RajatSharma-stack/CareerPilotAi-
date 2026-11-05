import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rajatsharma@123", // Using your password
  database: "careerpilot_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
db.getConnection()
  .then(() => console.log("MySQL Connected..."))
  .catch((err) => console.log("DB Connection Failed", err));

export default db;
