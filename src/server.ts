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

// API routes starts
app.get("/", (req: Request, res: Response) => {
    res.send("Express server with TypeScript, PostgreSQL, NeonDB!");
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})