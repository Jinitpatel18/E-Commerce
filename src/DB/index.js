import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB connected successfully:', conn.connection.host);
    } catch (error) {
        console.error("Error message while Connecting to DB: ", error.message);
    }
}

export default connectDB;