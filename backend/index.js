import express, { application } from "express"
import authRoute from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";



// declare
const app =  express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
// routes
dotenv.config();
// 1. test
app.get('/' , (req , res)=>{
    res.json({
        msg : "Testing!!"
    })
});

// 2. auth route
app.use('/api/v1/auth' , authRoute);

// listen
app.listen(PORT , ()=>{
    console.log(`Server is running at port : ${PORT}`);
    connectDB();
})