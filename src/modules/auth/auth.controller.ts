import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signinUser = async(req: Request, res: Response) => {
    const { email, password } = req?.body;

    try{
        const result = await authServices?.signinUser(email, password);
        // console.log("Result from auth controller:", result);

        if(result === null){
            res.status(400).json({
                success: false,
                message: "Invalid Email Address.",
                data: result
            })
        }else if(result === false){
            res.status(400).json({
                success: false,
                message: "Invlaid Password.",
                data: result
            })
        }else{
            res.status(200).json({
                success: true,
                message: "Signin Successfully",
                data: result
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

export const authControllers = {
    signinUser
}