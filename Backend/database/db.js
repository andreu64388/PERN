import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "Ghtyuioplm",
  host: "localhost",
  port: 5432,
  database: "shop",
});

export default pool;
