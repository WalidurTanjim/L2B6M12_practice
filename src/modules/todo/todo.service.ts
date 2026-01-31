import { pool } from "../../config/db"

// get all todos (get method)
const getAllTodos = async() => {
    const result = await pool.query(`SELECT * FROM todos`);

    return result;
}

// get single todo by id (get method)
const getSingleTodo = async(id: string) => {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);

    return result;
}

// create todo (post method)
const createTodo = async(payload: Record<string, unknown>) => {
    const { user_id, title, description, completed } = payload;

    const result = await pool.query(`INSERT INTO todos(user_id, title, description, completed) VALUES($1, $2, $3, $4) RETURNING *`, [user_id, title, description, completed]);

    return result;
}

// update todo by id (put method)
const updateTodo = async(user_id: string, title: string, description: string, completed: boolean, id: string) => {
    const result = await pool.query(`UPDATE todos SET user_id=$1, title=$2, description=$3, completed=$4 WHERE id=$5 RETURNING *`, [user_id, title, description, completed, id]);

    return result;
}

// delete todo by id (delete method)
const deleteTodo = async(id: string) => {
    const result = await pool.query(`DELETE FROM todos WHERE id = $1`, [id]);

    return result;
}

export const todosServices = {
    getAllTodos,
    getSingleTodo,
    createTodo,
    updateTodo,
    deleteTodo
};