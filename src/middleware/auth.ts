// higher order function: takes a function as parameter & return a function but if it takes anything as parameter & return a function. still it's a higher order functionl.

import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express"
import config from "../config";

const auth = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req?.headers?.authorization;
        // console.log("Token from auth middleware:", { token });

        if(!token){
            return res.status(500).json({
                success: false,
                message: "You Are Not Allowed"
            })
        }

        const decoded = jwt.verify(token, config.auth_secret as string);
        console.log({ decoded })
        next();
    }
}

export default auth; 