import { Request, Response } from "express";
import { todosServices } from "./todo.service";

// get all todos (get method)
const getAllTodos = async(req: Request, res: Response) => {
    try{
        const result = await todosServices?.getAllTodos();
        
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
}

// get single todo by id (get method)
const getSingleTodo = async(req: Request, res: Response) => {
    const { id } = req?.params;

    try{
        const result = await todosServices?.getSingleTodo(id as string);

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
                data: result.rows[0]
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
}

// create todo (post method)
const createTodo = async(req: Request, res: Response) => {
    // const { user_id, title, description } = req?.body;

    try{
        const result = await todosServices?.createTodo(req?.body);

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
}

// update todo by id (put method)
const updateTodo = async(req: Request, res: Response) => {
    const { id } = req?.params;
    const { user_id, title, description, completed } = req?.body;

    try{
        const result = await todosServices?.updateTodo(user_id, title, description, completed, id as string);

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
}

// delete todo by id (delete method)
const deleteTodo = async(req: Request, res: Response) => {
    const { id } = req?.params;

    try{
        const result = await todosServices?.deleteTodo(id as string);

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
}

export const todoControllers = {
    getAllTodos,
    getSingleTodo,
    createTodo,
    updateTodo,
    deleteTodo
}