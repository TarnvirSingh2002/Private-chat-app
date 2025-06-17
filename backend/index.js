import express from "express"

import cors from "cors";

import { db } from "./db.js";

import { Server } from 'socket.io';
import { createServer } from "http"; //for http
import router from "./routers.js";
import { v2 as cloudinary } from 'cloudinary';
import  env  from "dotenv";
env.config();
const app = express();// for routes

app.use(express.json());

const server = createServer(app);//When u need both  HTTP routes and real-time communication
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors());

db();

cloudinary.config({
  cloud_name: "dsk094yoj",
  api_key: 787433182838936,
  api_secret: "yvC7YI-dCIMUMeDc4v2bTfGH8vw",
});
console.log(process.env.CLOUDINARY_CLOUD_NAME," ",process.env.CLOUDINARY_API_KEY," ",process.env.CLOUDINARY_API_SECRET);
export default cloudinary;

app.use('/api/use', router);


server.listen(4000, () => {//Express + Socket.IO
    console.log('Server running on port 4000');
});

// app.listen (4000, ()=>{// for express only
//     console.log(`Server listening at the port 4000`);
// })
