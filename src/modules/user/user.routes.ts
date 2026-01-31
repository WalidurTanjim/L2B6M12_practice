// import { Router } from "express";
// const router = Router();

import express, { Request, Response } from "express";
import { pool } from "../../config/db";
const router = express.Router();

// app.use("/users", userRoutes);

// routes => controller => service

// get all users
router.get("/", async(req: Request, res: Response) => {
    // const { name, email, age, phone, address } = req?.body;
    try{
        const result = await pool.query(`SELECT * FROM users`);
        
        if(result?.rows.length === 0){
            res.status(400).json({
                success: false, 
                message: "There Are No User Found!",
                data: result?.rows
            })
        }else{
            res.status(200).json({
                success: true,
                message: "Users Fetched Successfully",
                data: result?.rows
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
});

// get single users by id
router.get("/:id", async(req: Request, res: Response) => {
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
});

// post single user
router.post("/", async(req: Request, res: Response) => {
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
});

// update user by id
router.put("/:id", async(req: Request, res: Response) => {
    const { id } = req?.params;
    const { name, email, age, phone, address } = req?.body;

    try{
        const result = await pool.query(`UPDATE users SET name=$1, email=$2, age=$3, phone=$4, address=$5 WHERE id = $6 RETURNING *`, [name, email, age, phone, address, id]);

        // console.log("Updated user:", result?.rows);

        if(result?.rows.length === 0){
            res.status(400).json({
                success: false, 
                message: "User Not Found"
            });
        }else{
            res.status(200).json({
                success: true,
                message: "User Updated Successfully",
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
});

// delete single user by id
router.delete("/:id", async(req: Request, res: Response) => {
    const { id } = req?.params;

    try{
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
        
        // console.log("✔ User Deleted Successfully!", result?.rowCount);

        if(result?.rowCount === 0){
            res.status(400).json({
                success: false, 
                message: "User Now Found!"
            });
        }else{
            res.status(200).json({
                success: true, 
                message: "✔ User Deleted Successfully.",
                data: result?.rowCount
            });
        }
    }catch(err: any){
        console.error(err?.message);

        res.status(500).json({
            success: false,
            message: "User Not Found!",
            details: err
        });
    }
});

export const userRoutes = router;