import app from "./app.js";
import config from "./configs/config.js";
import connectDatabase from "./configs/database.js";

const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        })
    }

    catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();