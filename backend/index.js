const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

const rooms = {}

io.on('connection', (socket) => {
  console.log(`🔌 Bağlandı: ${socket.id}`)

  socket.on('join-room', (roomId) => {
    socket.join(roomId)
    if (!rooms[roomId]) {
      rooms[roomId] = {}
    }
    rooms[roomId][socket.id] = { characterId: null }
    console.log(`🧍 ${socket.id} odaya katıldı: ${roomId}`)
  })

  socket.on('set-character', (roomId, characterId) => {
    if (rooms[roomId] && rooms[roomId][socket.id]) {
      rooms[roomId][socket.id].characterId = characterId
      console.log(`🎭 ${socket.id} karakterini seçti: ${characterId}`)
    }
  })

  socket.on('guess', (roomId, guessedId) => {
    const opponents = Object.keys(rooms[roomId] || {}).filter(id => id !== socket.id)
    if (opponents.length === 0) return

    const opponent = rooms[roomId][opponents[0]]
    const isCorrect = opponent.characterId === guessedId

    socket.emit('guess-result', isCorrect)
  })

  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) {
        delete rooms[roomId][socket.id]
        console.log(`❌ ${socket.id} ayrıldı: ${roomId}`)
      }
    }
  })
})

server.listen(3001, () => {
  console.log('🚀 Socket sunucusu çalışıyor: http://localhost:3001')
})
