import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRouters } from "./modules/todo/todo.routes";

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
app.use("/todos", todoRouters)



app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})