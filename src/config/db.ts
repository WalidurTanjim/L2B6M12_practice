import { Pool } from "pg";
import config from ".";

// Database
export const pool = new Pool({
    connectionString: `${config?.connection_string}`
});

const initDB = async() => {
    try{
        await pool.query("BEGIN");

        await pool.query(`
                CREATE TABLE IF NOT EXISTS users(
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(150) UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    age INT,
                    phone VARCHAR(15),
                    address TEXT,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);

        await pool.query(`
                CREATE TABLE IF NOT EXISTS todos(
                    id SERIAL PRIMARY KEY,
                    user_id INT REFERENCES users(id) ON DELETE CASCADE,
                    title VARCHAR(200) NOT NULL,
                    description TEXT,
                    completed BOOLEAN DEFAULT FALSE,
                    due_date DATE,
                    created_on TIMESTAMP DEFAULT NOW(),
                    updated_on TIMESTAMP DEFAULT NOW()
                )
            `);

        await pool.query("COMMIT");
    }catch(err){
        await pool.query("ROLLBACK");
        console.error("❌ Database not initialized!", err);
    }
};

export default initDB;