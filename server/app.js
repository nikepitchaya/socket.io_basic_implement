const app = require('express')();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    console.log('Client connected ' + socket.id)
    socket.on('join_room', (res) => {
        socket.join(res.room)
        console.log(`Clinet ${res.name} joined as room ${res.room}`)
        io.to(res.room).emit('receive_access', { room: res.room, name: res.name })
    })
    socket.on('send_message', (res) => {
        console.log(res.room)
        io.to(res.room).emit('receive_message', res)
    })
    socket.on("disconnect", () => {
        console.log('Clinet disconnected');
    });
})

server.listen(3001, (() => {
    console.log('Start server at port 3001')
}))