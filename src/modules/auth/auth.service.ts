import { pool } from "../../config/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import config from "../../config";

const signinUser = async(email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    // console.log("Result from auth.srv:", result);

    if(result?.rows.length === 0){
        return null
    }

    const user = result?.rows[0];
    const matchedPass = await bcrypt.compare(password, user?.password);
    // console.log("Matched pass from auth.srv:", matchedPass);

    if(!matchedPass){
        return false;
    }

    const secret = config?.auth_secret;
    const token = jwt.sign({ name: user?.name, email: user?.email }, secret as string, { expiresIn: "7d" });

    return { token, user }
}

export const authServices = {
    signinUser
}