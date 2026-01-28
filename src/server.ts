import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = 5505;

app.use(express.json());

// Database
const pool = new Pool({ connectionString: `${process.env.CONNECTION_STRING}` });

const initDB = async() => {
    try{
        await pool.query("BEGIN");

        await pool.query(`
                CREATE TABLE IF NOT EXISTS users(
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(150) NOT NULL,
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
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);

        await pool.query("COMMIT");
    }catch(err){
        await pool.query("ROLLBACK");
        console.error(`❌ Database init failed.`, err);
    }
}

initDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World with Express, TypeScript, PostgreSQL & NeonDB");
});

app.listen(port, () => {
    console.log(`App is running with the port ${port}`);
});
