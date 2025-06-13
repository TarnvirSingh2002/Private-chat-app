import express from "express"

import cors from "cors";

import { db } from "./db.js";

import { Server } from 'socket.io';
import { createServer } from "http"; //for http
import router from "./routers.js";

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

app.use('/api/use', router);


server.listen(4000, () => {//Express + Socket.IO
    console.log('Server running on port 4000');
});

// app.listen (4000, ()=>{// for express only
//     console.log(`Server listening at the port 4000`);
// })
