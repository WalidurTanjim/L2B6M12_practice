// import { Router } from "express";
// const router = Router();

import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";
const router = express.Router();

// app.use("/users", userRoutes);

// routes => controller => service

// get all users
router.get("/", userControllers?.getAllUsers);

// get single users by id
router.get("/:id", userControllers?.getSingleUser);

// post single user
router.post("/", userControllers?.createUser);

// update user by id
router.put("/:id", userControllers?.updateUser);

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