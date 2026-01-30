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

// users table API routes
app.get("/users", async(req: Request, res: Response) => {
    // const { name, email, age, phone, address } = req?.body;
    try{
        const result = await pool.query(`SELECT * FROM users`);
        
        res.status(200).json({
            success: true,
            message: "Users Fetched Successfully",
            data: result?.rows
        });
    }catch(err: any){
        console.error(err);

        res.status(500).json({
            success: false,
            message: err?.message,
            details: err
        });
    }
})

app.get("/users/:id", async(req: Request, res: Response) => {
    const { id } = req?.params;
    
    try{
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`,[id]);
        // console.log("Single user by id:", result.rows[0]);

        if(result?.rows.length === 0){
            res.status(400).json({
                success: false,
                message: "User Not Found!"
            });
        }else{
            res.status(200).json({
                success: true,
                message: "User Fetched Successfully",
                data: result?.rows[0]
            });
        }
    }catch(err: any){
        console.error(err);

        res.status(500).json({
            success: false,
            message: err?.message,
            details: err
        });
    }
})

app.post("/users", async(req: Request, res: Response) => {
    const { name, email, age, phone, address } = req?.body;

    try{
        const result = await pool.query(`INSERT INTO users(name, email, age, phone, address) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, email, age, phone, address]);
        // console.log("Inserted user:", result?.rows[0]);

        res.status(201).json({
            success: true,
            message: "User Inserted Successfully",
            data: result?.rows[0]
        });
    }catch(err: any){
        console.error(err);

        res.status(500).json({
            success: false, 
            message: err?.message,
            details: err
        });
    }
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})