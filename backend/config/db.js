const mongoose = require('mongoose');

let isConnected;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log(`MongoDB Connected: ${db.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Avoid process.exit(1) in serverless environments
        throw new Error('Database connection failed');
    }
};

module.exports = connectDB;
