import mongoose from "mongoose";
import config from "./config.js";

const connectDatabase = async () => {
    try {
        const connection = await mongoose.connect(config.mongoUri);

        console.log("MongoDB connected successfully!");
        console.log(`Database Host: ${connection.connection.host}`);
        console.log(`Database Name: ${connection.connection.name}`);
    }

    catch (error) {
        console.error("MongoDB connection failed!");
        console.error(error.message);

        throw(error);
    }
}

export default connectDatabase;