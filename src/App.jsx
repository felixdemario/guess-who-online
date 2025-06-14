import { useEffect, useState } from 'react'
import socket from './SocketManager'
import characters from './characters'

function App() {
  const [roomId, setRoomId] = useState('')
  const [connected, setConnected] = useState(false)
  const [eliminated, setEliminated] = useState([])
  const [myCharacter, setMyCharacter] = useState(null)
  const [guessResult, setGuessResult] = useState('')
  const [guessedId, setGuessedId] = useState(null)

  const toggleCharacter = (id) => {
    if (!myCharacter) {
      const chosen = characters.find((c) => c.id === id)
      setMyCharacter(chosen)
      socket.emit('set-character', roomId, id)
      return
    }
    setEliminated((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    )
  }

  const handleJoinRoom = () => {
    if (roomId.trim() !== '') {
      socket.emit('join-room', roomId)
      setConnected(true)
    }
  }

  useEffect(() => {
    socket.on('user-joined', (userId) => {
      console.log(`👤 Odaya biri katıldı: ${userId}`)
    })

    socket.on('guess-result', (isCorrect) => {
      setGuessResult(isCorrect ? '✅ Doğru tahmin! 🎉 Kazandın!' : '❌ Yanlış tahmin, tekrar dene!')
    })
  }, [])

  const handleGuess = (charId) => {
    setGuessedId(charId)
    socket.emit('guess', roomId, charId)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Guess Who? 🎭</h1>
      {!connected ? (
        <div>
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Oda adı gir (örn: room123)"
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <button onClick={handleJoinRoom}>Odaya Katıl</button>
        </div>
      ) : (
        <>
          <h3>Oda: {roomId}</h3>
          {myCharacter && (
            <h4>🎭 Seçtiğin karakter: {myCharacter.name}</h4>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '10px',
              marginTop: '20px'
            }}
          >
            {characters.map((char) => (
              <div
                key={char.id}
                onClick={() => toggleCharacter(char.id)}
                style={{
                  position: 'relative',
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  background: eliminated.includes(char.id) ? '#ddd' : '#fff',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={char.image}
                  alt={char.name}
                  width="100"
                  style={{
                    opacity: eliminated.includes(char.id) ? 0.3 : 1,
                    transition: 'opacity 0.3s'
                  }}
                />
                <p>{char.name}</p>

                {myCharacter && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGuess(char.id)
                    }}
                    style={{
                      marginTop: '5px',
                      fontSize: '0.8em',
                      background: '#eee',
                      border: '1px solid #999',
                      padding: '4px 8px',
                      cursor: 'pointer'
                    }}
                  >
                    Tahmin Et
                  </button>
                )}

                {guessedId === char.id && guessResult && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      color: guessResult.includes('✅') ? 'green' : 'red',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1em',
                      borderRadius: '8px'
                    }}
                  >
                    {guessResult}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App
