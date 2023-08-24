import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//USER RESGISTRATION
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const passwordHash = await bcrypt.hash(password, salt);

    //USE THE DATA
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//LOGIN 
export const login = async(req,res)=>{
  try{
    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({email:email});
    if(!user){
      return res.status(400).json({msg:"Username does not exist"});
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({msg:"Incorrect Password!"})
    }

    // const token = jwt.sign({email:email},process.env.SECRET);
    delete user.password;
    res.status(200).json({user})

  } catch(err){
    res.status(500).json({ error: err.message });
  }
}

