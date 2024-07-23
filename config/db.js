import mongoose from "mongoose";
import 'dotenv/config';

// Create database connection
export const dbConnect = async () => {
try {
    await mongoose.connect(process.env.CONNECT_STRING);
    console.log('Connected to Portfolio Database')
} catch (error) {
    next(error)
}
}