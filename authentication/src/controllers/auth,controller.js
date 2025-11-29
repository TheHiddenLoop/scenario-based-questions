import bcrypt from "bcrypt"
import { User } from "../model/User.js";
import { generateToken } from "../libs/utils.js";

const SALT_ROUNDS = 10;

export const signup = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({success:false, message:"All fields are required"});
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(409).json({success:false, message:"User is already registered."});
        }
        
        const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = await User.create({
            email,
            name,
            password: hashedPass
        });

        res.status(200).json({success:true, message:"User registered", newUser});
    } catch (error) {
        console.log("Error in signup:", error);
        res.status(500).json({success:false, message: "Internal server error."});
    }
}

export const signin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({success:false, message:"All fields are required"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({success:false, message:"User not found."});
        }
        
        const hashedPass = await bcrypt.compare(password, user.password);

        if(!hashedPass){
            return res.status(401).json({success:false, message:"Incorrect password."});
        }

        generateToken(user._id, res);

        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log("Error in signin:", error);
        res.status(500).json({success:false, message: "Internal server error."});
    }
}

export const me = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({success:true, message: `Welcome ${user.name}`, user});
    } catch (error) {
        console.log("Error in me:", error);
        res.status(500).json({success:false, message: "Internal server error."});
    }
}