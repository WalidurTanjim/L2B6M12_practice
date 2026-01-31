import express from "express";
import { todoControllers } from "./todo.controller";
const router = express.Router();

// get all todos 
router.get("/", todoControllers?.getAllTodos);

// get single todo by id 
router.get("/:id", todoControllers?.getSingleTodo);

// create todo 
router.post("/", todoControllers?.createTodo);

// update todo by id 
router.put("/:id", todoControllers?.updateTodo);

// delete todo by id 
router.delete("/:id", todoControllers?.deleteTodo);

export const todoRouters = router;