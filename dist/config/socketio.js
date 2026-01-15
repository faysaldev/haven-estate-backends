"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const setUpSocketIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("A New user Connected To Socket");
        // Listen for messages
        socket.on("message", (data) => {
            console.log("Message from client:", data);
            io.emit("message", { text: "Hello from the server!" }); // Broadcast to all clients
        });
        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
        // Custom event example
        socket.on("joinRoom", (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });
        // Example: send a message to a specific room
        socket.on("sendToRoom", (room, message) => {
            socket.to(room).emit("message", { text: message });
        });
    });
    return io;
};
exports.default = setUpSocketIO;
