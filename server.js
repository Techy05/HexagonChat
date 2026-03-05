const crypto = require("crypto");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let msgHistory = [];
let onlineConnections = [];

app.use(cookieParser());
app.use((req, res, next) => {
    if (!req.cookies.clientId) {
        const id = crypto.randomUUID();
        res.cookie("clientId", id, {
            maxAge: 1000 * 60 * 60 * 24 * 365,
            sameSite: "lax"
        });
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
    if (!onlineConnections.includes(clientId)) {
        onlineConnections.push(clientId);
    }
    io.emit("online counter", onlineConnections.length);

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
        onlineConnections.splice(onlineConnections.indexOf(clientId), 1);
        io.emit("online counter", onlineConnections.length);
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
