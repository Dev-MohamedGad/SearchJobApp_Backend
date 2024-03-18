import userModel from "../../DB/models/user.model"; // Import User type or interface if available
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
        user?: userModel; // Adjust this according to the type of the user object
        }
    }
}

export const auth = (roles: string ) => {
    
    return async (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers;
        if (!authorization) {
            return next(new Error("No token was sent"));
        }
        if (!authorization.startsWith(process.env.BEARER_KEY as string)) {
            return next(new Error("Invalid Bearer Key"));
        }
        const token = authorization.split(process.env.BEARER_KEY as string)[1];
        
        const decoded: any = jwt.verify(token, process.env.TOKEN_SIGNATURE as string);
        if (!decoded?.id) {
            return next(new Error("Invalid payload"));
        }
        
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return next(new Error("User not found"));
        }
        
        if (!roles.includes(user.role)) {
            return next(new Error("This user is not authorized to use this endpoint"));
        }
        
        req.user = user;
        return next();
    };
};
