import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.models.js";

export const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from headers

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    jwt.verify(token, process.env.VITE_JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        req.user = decoded; // Attach user info to request
        next();
    });
}; 