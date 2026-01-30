import express, { Request, Response } from "express";
import { Pool } from "pg";
import path from "path";
import dotenv from "dotenv"

dotenv.config({ path: path.join(process.cwd(), ".env") });
const app = express();
const port = 5500;

// parser
app.use(express.json());

// Database
const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STRING}`
});

const initDB = async() => {
    try{
        await pool.query("BEGIN");

        await pool.query(`
                CREATE TABLE IF NOT EXISTS users(
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(150) UNIQUE NOT NULL,
                    age INT,
                    phone VARCHAR(15),
                    address TEXT,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);

        await pool.query("COMMIT");
    }catch(err){
        await pool.query("ROLLBACK");
        console.error("❌ Database not initialized!", err);
    }
};

initDB();

// API routes starts
app.get("/", (req: Request, res: Response) => {
    res.send("Express server with TypeScript, PostgreSQL, NeonDB!");
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})