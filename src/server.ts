import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";

dotenv.config({ path: path.join(process.cwd(), "env") });

const app = express();
const port = 5000;

const pool = new Pool({ connectionString: process.env.CONNECTION_STRING });

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World with Express, TypeScript, PostgreSQL & NeonDB");
});

app.listen(port, () => {
    console.log(`App is running with the port ${port}`);
});
