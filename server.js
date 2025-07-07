import http from "http";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import "./src/cron/releaseStockJob.js";

dotenv.config();

// connect to the database
connectDB(process.env.MONGO_URL);

const port = process.env.PORT || 3002;

// create the server
const server = http.createServer(app);

// start the server

// server.listen(port, '0.0.0.0', () => {
// console.log(`Backend running on port ${port}`);
// });

server.listen(port);
