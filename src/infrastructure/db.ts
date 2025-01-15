import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connectionString = process.env.MONGODB;
        if (!connectionString) {
            throw new Error("No connection string found");
          }
        await mongoose.connect(connectionString);
        console.log("Connect to the DB");
    } catch (error) {
        console.log(error);
        console.log("Error connecting to the DB");
    }
};