import { pool } from "../../config/db";

// get all users (get method)
const getAllUsers = async() => {
    const result = await pool.query(`SELECT * FROM users`);

    return result;
}

// get single user (get method)
const getSingleUser = async(id: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`,[id]);
    return result;
}

// create user (post method)
const createUser = async(name: string, email: string, age: number, phone: string, address: string) => {
    const result = await pool.query(`INSERT INTO users(name, email, age, phone, address) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, email, age, phone, address]);
    
    return result;
}

export const userServices = {
    getAllUsers,
    getSingleUser,
    createUser
};