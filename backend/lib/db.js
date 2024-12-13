// connecting db 

import mongoose from "mongoose";
export const connectDB = async() =>{
    try{
        const conn = await mongoose.connect("mongodb+srv://chiragnsut04:UxHUqJHGBWowAg35@cluster0.ee3ft.mongodb.net/linkedin_db?retryWrites=true&w=majority&appName=Cluster0");
        console.log(`MongoDB connected : ${conn.connection.host}`)
    }catch(error){
        console.log(`Error connecting to MonogoDB : ${error.message}`);
        process.exit(1);
    }
}