// middleware/authenticateToken.ts

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User'; // Adjust the path as needed
import dotenv from 'dotenv';
dotenv.config(); 
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
 console.log('Auth Header:', authHeader); // Log the authorization header
  console.log('Token:', token); // Log the token
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string); // Replace with your secret
    const user: IUser | null = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.sendStatus(404);
    }
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token expired:', error);
      return res.sendStatus(401); // Unauthorized due to token expiration
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('JWT error:', error);
      return res.sendStatus(403); // Forbidden due to JWT format issue
    } else {
      console.error('Other error verifying token:', error);
      return res.sendStatus(500); // Internal server error for other issues
    }
  }
  
};

export default authenticateToken;
