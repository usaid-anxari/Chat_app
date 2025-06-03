import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import http from 'http'
import { connectDB } from './db/db.js';
import userRouter from './routes/user.Routes.js';
import messageRoutes from './routes/message.Route.js';
import { Server } from 'socket.io';

// console.log(process.env.MONGODB_URI);

// Create Express and HTTP Server 
const app = express();
const server = http.createServer(app);

// Init Socket
export const io = new Server(server,{
    cors:{origin:"*"}
})

// Store Online User 
export const userSocketMap = {} // {userId :SocketId}

// Socket.io connection handler
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log(userId);
    if (userId) userSocketMap[userId] = socket.id;

    // Emit online user
    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("disconnect",()=>{
        console.log("Disconnect",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
    
})


// Mddileware Setup
app.use(express.json({limit : '10mb'}));
app.use(cors())

// Api Setup
app.use('/api/status',(req,res)=> res.send("Server is Live!"));
app.use('/api/auth',userRouter)
app.use('/api/message',messageRoutes)



// Conected to MongoDB
await connectDB()


const PORT = process.env.PORT || 8080
server.listen(PORT, () =>console.log(`http://localhost:${PORT}`))