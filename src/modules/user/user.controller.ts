import { Request, Response } from "express";
import { pool } from "../../config/db";

const createUser = async(req: Request, res: Response) => {
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
}

export const userControllers = {
    createUser
};