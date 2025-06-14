// backend/index.js
const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // frontend adresi
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log(`🔌 Yeni bağlantı: ${socket.id}`)

  socket.on('join-room', (roomId) => {
    socket.join(roomId)
    console.log(`🧍 Kullanıcı ${socket.id}, oda ${roomId}’a katıldı`)
    socket.to(roomId).emit('user-joined', socket.id)
  })

  socket.on('disconnect', () => {
    console.log(`❌ Bağlantı kesildi: ${socket.id}`)
  })
})

server.listen(3001, () => {
  console.log('🚀 Socket sunucusu http://localhost:3001 adresinde çalışıyor')
})
