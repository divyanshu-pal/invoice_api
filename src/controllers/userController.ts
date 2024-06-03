import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';
dotenv.config(); 

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1000h' });
};

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      // return res.json({ msg: 'User already exists',status:"false" });
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const token = generateToken(user.id);
    user.token = token;
    
    await user.save();
    
    res.json({ token });
    

    // const payload = { user: { id: user.id } };
    // jwt.sign(payload, 'secret', { expiresIn: '1000h' }, (err, token) => {
    //   if (err) throw err;
    //   // return res.json({ token ,status:true});
    //   res.json({ token });
      
    // });
  } catch (err) {
    res.status(500).send('Server error');
    // return res.json({message:"server error",status:false});
  }
};

 const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'Invalid credentials',status:false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials',status:false });
    }

    const token = generateToken(user.id);
    user.token = token;
    
    await user.save();
    
    res.json({ token });

    // const payload = { user: { id: user.id } };
    // jwt.sign(payload, 'secret', { expiresIn: '1000h' }, (err, token) => {
    //   if (err) throw err;
    //   return res.json({ token,status:true });
    // });
  } catch (err) {
    return res.json({message:'Server error',status:false});
  }
};

module.exports = { register,login};
