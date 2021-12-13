const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		method: ["post", "get"],
	},
});

// Middleware
app.use(cors());

app.get("/", (req, res) => {
	res.send("Welcome to homepage");
});

io.on("connection", (socket) => {
	console.log(`A user connected with ID: ${socket.id}`);

	socket.on("join_room", (room) => {
		console.log(`Join room with the name room: ${room}`);
		socket.join(room);
	});
	socket.on("send_message", (data) => {
		// Send the message to the room
		socket.to(data.room).emit("receive_message", data);
	});

	io.on("disconnect", () => {
		console.log("A user disconnected");
	});
});

server.listen(3001, () => {
	console.log("Server running on the port: 3001");
});
