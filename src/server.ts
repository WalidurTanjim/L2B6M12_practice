import express, { Request, Response } from "express";
import { Pool } from "pg";
import config from "./config";

const app = express();
const port = config?.port;

// parser
app.use(express.json());

// Database
const pool = new Pool({
    connectionString: `${config?.connection_string}`
});

const initDB = async() => {
    try{
        await pool.query("BEGIN");

        await pool.query(`
                CREATE TABLE IF NOT EXISTS users(
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(150) UNIQUE NOT NULL,
                    age INT,
                    phone VARCHAR(15),
                    address TEXT,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);

        await pool.query(`
                CREATE TABLE IF NOT EXISTS todos(
                    id SERIAL PRIMARY KEY,
                    user_id INT REFERENCES users(id) ON DELETE CASCADE,
                    title VARCHAR(200) NOT NULL,
                    description TEXT,
                    completed BOOLEAN DEFAULT FALSE,
                    due_date DATE,
                    created_on TIMESTAMP DEFAULT NOW(),
                    updated_on TIMESTAMP DEFAULT NOW()
                )
            `);

        await pool.query("COMMIT");
    }catch(err){
        await pool.query("ROLLBACK");
        console.error("❌ Database not initialized!", err);
    }
};

initDB();

// API routes starts
app.get("/", (req: Request, res: Response) => {
    res.send("Express server with TypeScript, PostgreSQL, NeonDB!");
})

// users table API routes
app.get("/users", async(req: Request, res: Response) => {
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
})

app.get("/users/:id", async(req: Request, res: Response) => {
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
})

app.post("/users", async(req: Request, res: Response) => {
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
})

app.put("/users/:id", async(req: Request, res: Response) => {
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
})

app.delete("/users/:id", async(req: Request, res: Response) => {
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
})



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