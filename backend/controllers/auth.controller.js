
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendWelcomeEmail } from './../emails/emailHandler.js';

// signup
export const signup= async(req , res)=>{
    try{
        const{name, username , email , password} = req.body;

        // checks
        if(!name || !username || !email || !password){
            return res.status(400).json({
                msg :  "All fields are required"
            });
        }

        // username exists check
        const exisitingUsername =  await User.findOne({
            username
        })

        if(exisitingUsername){
            return res.status(400).json({
                msg : "Username already exists"
            })
        }

        // email exists check
        const exisitingEmail =  await User.findOne({
            email
        })

        if(exisitingEmail){
            return res.status(400).json({
                msg : "Email already exists"
            })
        }

        //password check
        if(password.length <  6 ){
            return res.status(400).json({
                msg : "Password must be at least 6 characters"
            })
        }

        // hashing and salting 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =  await bcrypt.hash(password , salt);


        // creating new user 
        const user =  new User({
            name,
            email,
            password : hashedPassword,
            username
        })

        // save that user 
        await user.save();
        
        // token generation 
        const token = jwt.sign(
            {userId : user._id} , 
            process.env.JWT_SECRET_KEY , 
            { expiresIn :  "3d"}   
        );


        // setting the cookie 
        res.cookie("jwt-linkedin" , token , {
            httpOnly : true,
            maxAge : 3 * 24 * 60 * 60 * 1000,
            sameSite : "strict",
            secure : process.env.NODE_ENV === "production",
        })
        // console.log(user);
        res.status(201).json({ message: "User registered successfully" });

        // todo : send welcome email

        const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

		try {
			await sendWelcomeEmail(user.email, user.name, profileUrl);
		} catch (emailError) {
			console.error("Error sending welcome Email", emailError);
		}

    }catch(error){
        console.log(error.message);
        res.status(500).json({
            msg : "Internal server error"
        })
    }
}

//login
export const login= async(req , res)=>{
    try{
        const {username , password} = req.body;
        
        // check it user exists
        // chekc the username 
        const user =  await User.findOne({
            username
        });

        if(!user){
            return res.status(400).json({
                msg : "Invalid credentials"
            });
        }
        
        // if user exist we will check the password
        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch){
            return res.status(400).json({
                msg : "Invalid credentials"
            });
        }

        // create and send token
        const token = jwt.sign(
            {userId  : user._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn : "3d"}
        )

        // after creating token
        // we need to set the cookie 
        await res.cookie("jwt-linkedin", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
		});

        res.json({
            msg : "Logged in successfully"
        });

    }catch(err){
        console.error("Error in login controller:", error);
		res.status(500).json({ message: "Server error" });
    }
}

// logout 
export const logout= (req , res)=>{
    res.clearCookie("jwt-linkedin");
    res.status(200).json({
        msg: "Logged out successfully!!"
    });
}