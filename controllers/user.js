import { UserModel } from "../models/user.js";
import { user_schema } from "../schema/user_schema.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

// Check if username or email exists
export const getUsers = async (req, res, next) => {
  try {
    const email = req.query.email?.toLowerCase()
    const userName = req.query.userName?.toLowerCase();
  
    const filter = {};
    if (email) {
      filter.email = email;
    }
    if (userName) {
      filter.userName = userName;
    }
  
    const users = await UserModel.find(filter);
  
    return res.status(200).json({ users });
  } catch (error) {
   next(error)
  }
 };

// Sign up with validation & error handling
export const signUp = async (req, res, next) => {
   try {
      const { error, value } = user_schema.validate(req.body);
      if (error) {
         return res.status(400).send(error.details[0].message);
      }
      const { email, userName } = value;
      //  check if email exist in the database
      const findExistingEmail = await UserModel.findOne({ email })
      if (findExistingEmail) {
         return res.status(401).send('Email already exist')
      }
      //  check if username exist in the database
      const findExistingUsername = await UserModel.findOne({ userName })
      if (findExistingUsername) {
         return res.status(401).send('Username already exist')
      }
      // Hash password before saving
      value.password = await bcrypt.hash(value.password, 12);
      // Create user
      await UserModel.create(value);
      // Return success response
      return res.status(201).json('User registration successful');
   } catch (error) {
      next(error);
   }
};


// Login user
export const login = async (req, res, next) => {
   try {
      const { userName, email, password } = req.body;
      //  Find a user using their email or username
      const user = await UserModel.findOne(
         { $or: [{ email: email }, { userName: userName }] }
      );
      if (!user) {
         return res.status(401).json('User does not exist')
      }
      // Verify user password
      const correctPass = bcrypt.compareSync(password, user.password)
      if (!correctPass) {
         return res.status(401).json('Invalid login details')
      }
      // Generate a session for the user
      req.session.user = { id: user.id }
      // Return response
      res.status(201).json('Login successful')
   } catch (error) {
      next(error)
   }
}

export const logout = async (req, res, next) => {
   try {
      // Destroy user session
      await req.session.destroy();
      // Return response
      res.status(200).json('User logged out')
   } catch (error) {
      next(error)
   }
}

// Login with token
export const token = async (req, res, next) => {
   try {
      const { userName, email, password } = req.body;
      //  Find a user using their email or username
      const user = await UserModel.findOne(
         { $or: [{ email: email }, { userName: userName }] }
      );
      if (!user) {
         return res.status(401).json('User does not exist')
      }
      // Verify user password
      const correctPass = bcrypt.compareSync(password, user.password)
      if (!correctPass) {
         return res.status(401).json('Invalid login details')
      }
      // Create a token 
      const token = jwt.sign({id: user.id}, process.env.JWT_PRIVATE_KEY, {expiresIn: '72h'});
      // Return response
      res.status(201).json({
         mesage: 'User logged in',
         accessToken: token,
      })
   } catch (error) {
      next(error)
   }
}

// get user portfolio
export const portfolio = async (req, res, next) => {
   try {
      const userName = req.params.userName.toLowerCase();
      const user = await UserModel
         .findOne({ userName })
         // Exclude password field from the user document
         .select('-password -createdAt -updatedAt') 

         // Populate user profile, projects, skills, and volunteering details
         .populate({
            path: 'userProfile',
            select: '-user -_id -__v -createdAt -updatedAt',
            // Return Mongoose documents as plain JavaScript objects
            options: { lean: true } 
         })
         .populate({
            path: 'projects',
            select: '-user -_id -__v -createdAt -updatedAt', 
            options: { lean: true, sort: { startDate: -1 } }
         })
         .populate({
            path: 'achievements',
            select: '-user -_id -__v -createdAt -updatedAt', 
            options: { lean: true, sort: { startDate: -1 } }
         })
         .populate({
            path: 'education',
            select: '-user -_id -__v -createdAt -updatedAt', 
            options: { lean: true, sort: { startDate: -1 } }
         })
         .populate({
            path: 'experiences',
            select: '-user -_id -__v -createdAt -updatedAt', 
            options: { lean: true, sort: { startDate: -1 } }
         })
         .populate({
            path: 'licenseCertifications',
            select: '-user -_id -__v -createdAt -updatedAt', 
            options: { lean: true, sort: { startDate: -1 } }
         })
         .populate({
            path: 'skills',
            select: '-user -_id -__v -createdAt -updatedAt',
            options: { lean: true }
         })
         .populate({
            path: 'volunteering',
            select: '-user -_id -__v -createdAt -updatedAt', // Exclude 'user' field from volunteering population
            options: { lean: true, sort: { startDate: -1 } }
         });

      if (!user) {
         return res.status(404).json('User not found');
      }
      // Return the complete user portfolio
      res.status(200).json({ user });
   } catch (error) {
      next(error);
   }
};

