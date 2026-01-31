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

// get single user by id (get method)
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

// update user by id (put method)
const updateUser = async(req: Request, res: Response) => {
    const { id } = req?.params;
    const { name, email, age, phone, address } = req?.body;

    try{
        const result = await userServices?.updateUser(name, email, age, phone, address, id as string);

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
}

// delete user by id (delete method)
const deleteUser = async(req: Request, res: Response) => {
    const { id } = req?.params;

    try{
        const result = await userServices?.deleteUser(id as string);
        
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
}

export const userControllers = {
    getAllUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser
};