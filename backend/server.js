import express from "express";
import mongoose from "mongoose";

const app = express();

mongoose.connect(process.env.MONGODB_CONNECTION_URL);

app.get("/",(req,res) => {
    res.send("Server is running");
});


const port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log(`Server running on Port http://localhost:${port}`);
})