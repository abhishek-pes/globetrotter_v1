const express = require("express");
const { body } = require("express-validator");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const app = express();
const socketio = require('socket.io')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./helperFunctions/chatHelper.js')

app.use(cors());
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log("server started on port " + PORT));
const io = socketio(server, {
    cors: {
        origin: '*',
    }
})

// this is for connecting to the database
connectDB();
//middle ware
app.use(express.json());



//routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/login", require("./routes/api/login"));
app.use("/api/posts", require("./routes/api/posts"));

io.on('connection', (socket) => {
    console.log('new user connected')

    socket.on('join', ({ name, room, callback }) => {
        const { error, user } = addUser({ id: socket.id, name, room })
        // if (error) callback(error)
        socket.join(user.room)
        socket.emit('message', { user: 'admin', text: `Welcome to the chatroom, ${user.name}` })
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined the chat` })
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        // callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', { user: user.name, text: message })
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    })
})



