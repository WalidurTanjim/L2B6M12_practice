import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";

const app = express();
const port = config?.port;

// parser
app.use(express.json());

// Initialize database
initDB();


// API routes starts
app.get("/", logger, (req: Request, res: Response) => {
    res.send("Express server with TypeScript, PostgreSQL, NeonDB!");
})

// users table API routes
app.use("/users", userRoutes);



// todos table API route 
app.get("/todos", async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`SELECT * FROM todos`);
        
        if(result?.rows.length === 0){
            res.status(400).json({
                success: false,
                message: "There Are Now Todos Available",
                data: result?.rows
            });
        }else{
            res.status(200).json({
            success: true,
            message: "All Todos Fetched Succssfully",
            data: result?.rows
        });
        }
    }catch(err: any){
        console.error(err?.message);

        res.status(500).json({
            success: false,
            message: err?.message,
            details: err
        });
    }
})

app.get("/todos/:id", async(req: Request, res: Response) => {
    const { id } = req?.params;

    try{
        const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);

        // console.log("Single todo:", result.rows);

        if(result?.rows.length === 0){
            res.status(400).json({
                success: false,
                message: "There Are Now Todos Available",
                data: result?.rows
            });
        }else{
            res.status(200).json({
                success: true,
                message: "Single Todos Fetched Succssfully",
                data: result?.rows
            });
        }
    }catch(err: any){
        console.error(err?.message);

        res.status(500).json({
            success: false,
            message: err?.message,
            details: err
        })
    }
})

app.post("/todos", async(req: Request, res: Response) => {
    const { user_id, title, description } = req?.body;

    try{
        const result = await pool.query(`INSERT INTO todos(user_id, title, description) VALUES($1, $2, $3) RETURNING *`, [user_id, title, description]);

        // console.log("Insert todo:", result?.rows[0]);

        if(result?.rows.length === 0){
            res.status(400).json({
                success: false,
                message: "Insert Failed"
            })
        }else{
            res.status(201).json({
                success: true,
                message: "Todo Inserted Successfully",
                data: result?.rows[0]
            })
        }
    }catch(err: any){
        console.error(err?.message);

        res.status(500).json({
            success: false, 
            message: err?.message,
            details: err
        });
    }
})

app.put("/todos/:id", async(req: Request, res: Response) => {
    const { id } = req?.params;
    const { user_id, title, description } = req?.body;

    try{
        const result = await pool.query(`UPDATE todos SET user_id=$1, title=$2, description=$3 WHERE id = $4 RETURNING *`, [user_id, title, description, id]);

        // console.log("Updated todo:", result?.rows);

        if(result?.rows.length === 0){
            res.status(400).json({
                success: false,
                message: "There Are No Todo Available",
                data: result?.rows
            })
        }else{
            res.status(200).json({
                success: true,
                message: "Todo Updated Successfully",
                data: result?.rows
            })
        }
    }catch(err: any){
        console.error(err?.message);

        res.status(500).json({
            success: false,
            message: err?.message,
            details: err
        })
    }
})

app.delete("/todos/:id", async(req: Request, res: Response) => {
    const { id } = req?.params;

    try{
        const result = await pool.query(`DELETE FROM todos WHERE id = $1`, [id]);

        // console.log("Delete todo:", result?.rowCount);

        if(result?.rowCount === 0){
            res.status(400).json({
                success: false,
                message: "Todo Not Found!",
                data: result?.rowCount
            })
        }else{
            res.status(200).json({
                success: true,
                message: "Todo Deleted Successfully",
                data: result?.rowCount
            })
        }
    }catch(err: any){
        console.error(err?.message);

        res.status(500).json({
            success: false,
            message: err?.message,
            details: err
        })
    }
})



app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})