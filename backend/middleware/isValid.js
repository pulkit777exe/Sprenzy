import express from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;
const app = express();

app.use(express.json());

export default function isValid(req, res, next){
    const token = req.headers["Authetication"]

    if(!token){
        res.json({
            message: "Please give email and password",
            token: "token not recieved"
        })
    }
    try{
        const user = jwt.verify(token,JWT_SECRET)
        
        if(!user){
            res.status(403).json({
                error: "Invalid token for user"
            })
        }
        next();
    } catch (error){
        res.status(400).json({
            message: "Bad Gateway"
        })
    }

}