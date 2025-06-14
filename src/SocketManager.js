// src/SocketManager.js
import { io } from 'socket.io-client'

// Backend sunucusuna bağlanıyoruz (localhost:3001)
const socket = io('http://localhost:3001')

export default socket
