const characters = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Character ${i + 1}`,
  image: `https://i.imgur.com/1YcF7kX.png` // Hepsi aynı görsel, sonra değiştiririz
}))

export default characters
