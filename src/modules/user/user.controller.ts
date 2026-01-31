import { Request, Response } from "express";
import { userServices } from "./user.service";

// get all users (get method)
const getAllUsers = async(req: Request, res: Response) => {
    // const { name, email, age, phone, address } = req?.body;
    try{
        const result = await userServices?.getAllUsers();
        // console.log("Get all users:", result?.rows);
        
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
}

// get single user (get method)
const getSingleUser = async(req: Request, res: Response) => {
    const { id } = req?.params;
    // console.log("Single user id:", id, typeof id)
    
    try{
        const result = await userServices?.getSingleUser(id as string);
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
}

// create user (post method)
const createUser = async(req: Request, res: Response) => {
    const { name, email, age, phone, address } = req?.body;

    try{
        const result = await userServices?.createUser(name, email, age, phone, address);
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
    getAllUsers,
    getSingleUser,
    createUser
};