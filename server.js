const crypto = require("crypto");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let msgHistory = [];
let onlineCounter = 0;

app.use(cookieParser());
app.use((req, res, next) => {
    if (!req.cookies.clientId) {
        const id = crypto.randomUUID();
        res.cookie("clientId", id);
    }
    next();
});
app.use(express.static("static"));

// connection
io.on("connection", (socket) => {
    const cookies = socket.handshake.headers.cookie || "";
    const match = cookies.match(/clientId=([^;]+)/);
    const clientId = match ? match[1] : socket.id;

    console.log("User connected: ", clientId);
    socket.emit("clientId", clientId);
    socket.emit("load messages", msgHistory);
    onlineCounter++;
    io.emit("onlineCounter", onlineCounter);

    socket.on("new message", (msg) => {
        console.log("Message received: (", msgHistory.length+1, ") ", msg, " {", clientId, "}");
        const data = {
            text: msg,
            senderId: clientId
        };
        msgHistory.push(data);
        io.emit("new message", data);
    });

    socket.on("log", (text) => {
        console.log("Server says: ", text);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected: ", clientId);
        onlineCounter--;
        io.emit("onlineCounter", onlineCounter);
    });

    socket.on("reconnect", () => {
        console.log("Reconnected");
        location.reload();
    });
});

const PORT = process.env.port || 8080;
server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});

app.get("/health", (req, res) => {
    res.send("ok");
});
