import express from "express";
import UserModel from "../models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const saltRounds = 10;
const app = express();

app.use(express.json());

app.post("/api/signup",async (req, res) => {
    const {username, password, email} = req.body;
    if(!username || !password || !email){
        res.status(401).json({
            message: "Give username, password and email"
        })
    }
    
    try{
        const existingAdmin = await UserModel.findOne({email});
        if(existingAdmin){
            return res.status(400).json({
                message: "User already exists with that email"
            })
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password,salt)

        const user = UserModel.create({
            username: username,
            password: hashedPassword,
            email: email
        })

        if(!user){
            res.status(500).json({
                error: "Error while creating user"
            })
        }

        res.status(201).json({
            message: "User created successfully"
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "An error occured during signup"})
    }
})

app.post("/api/signin",async (req,res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400).json({
            message: "Give email and password"
        })
    }

    try{
        const user = UserModel.findOne({
            email,
            password
        })
        
        if(!user){
            res.status(403).json({
                error: "User not found"
            })
        }

        const comparePassword = await bcrypt.compare(password,user.password);

        if(!comparePassword){
            res.status(403).json({
                error: "Invalid credentials"
            })
        }

        const token = jwt.sign({
            userId:user._id,
            username: user.username,
            email: user.email
        },JWT_SECRET,{
            expiresIn: "24h"
        })
        
    } catch (error){
        throw new Error(error);
    }
})