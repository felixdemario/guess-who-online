// src/SocketManager.js
import { io } from "socket.io-client";

const socket = io("https://guess-who-online.onrender.com", {
  transports: ["websocket"],
});

export default socket;
