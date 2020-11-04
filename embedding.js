const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/mongo-games-emb', {
  useNewUrlParser: true, useUnifiedTopology: true
})
  .then(() => console.log('Now connected to MongoDB!'))
  .catch(err => console.error('Something went wrong', err))

// Publisher Schema
const publisherSchema = new mongoose.Schema({
  companyName: String,
  firstParty: Boolean,
  website: String
})

// Publisher Model
const Publisher = mongoose.model('Publisher', publisherSchema)

// Embed a sub document like so:
/*
const gameSchema = new mongoose.Schema({
  publisher: {
    type: new mongoose.Schema({
      companyName: String,
    })
  }
})
*/

// Game Schema
const gameSchema = new mongoose.Schema({
  title: String,
  publisher: publisherSchema
})

// Game Model
const Game = mongoose.model('Game', gameSchema)

// Embedded documents don’t have a save method. They can only be saved via their parent.
/*
const game = await Game.findById(gameId)
game.publisher.companyName = 'New Company Name'
game.save()
*/

// Create a new game and embed a publisher in one shot.
async function createGame (title, publisher) {
  const game = new Game({
    title,
    publisher
  })
  const result = await game.save()
  console.log(result)
}
createGame('Rayman', new Publisher({ companyName: 'Ubisoft', firstParty: false, website: 'https://www.ubisoft.com/' }))

// Update the publisher (1. Find game first 2. Update the publisher within the game 3. Save the game)
async function updatePublisher (gameId) {
  const game = await Game.findById(gameId)
  game.publisher.companyName = 'Epic Games'
  game.publisher.website = 'https://epicgames.com/'
  game.save()
}
updatePublisher('5fa234cbd3a200845c905327')

// Update a sub document directly
async function updatePublisher (gameId) {
  const game = await Game.update({ _id: gameId }, {
    $set: {
      'publisher.companyName': 'Bethesda Softworks',
      'publisher.website': 'https://bethesda.net/'
    }
  })
}
updatePublisher('5fa234d9feb1c9845d7dae70')

// Remove a sub document with unset
async function updatePublisher (gameId) {
  const game = await Game.update({ _id: gameId }, {
    $unset: {
      'publisher': ''
    }
  })
}
updatePublisher('5fa234dd00e94f845e9f97af')

// Find all games & Select their title and publisher
async function listGames () {
  const games = await Game
    .find()
    .select('title publisher')
  console.log('BEGIN ---------- Listing Games:')
  console.log(games)
  console.log('END ---------- Listing Games:')
}
listGames()
