// get the client
import { createPool } from "mysql2";

// Create the connection pool. The pool-specific settings are the defaults
export const db = createPool({
  host: "localhost",
  user: "root",
  password: "ddxsfcch",
  database: "ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
}).promise();
