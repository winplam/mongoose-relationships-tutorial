const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/mongo-games-ref', {
  useNewUrlParser: true, useUnifiedTopology: true
})
  .then(() => console.log('Now connected to MongoDB!'))
  .catch(err => console.error('Something went wrong', err))

const Publisher = mongoose.model('Publisher', new mongoose.Schema({
  companyName: String,
  firstParty: Boolean,
  website: String
}))

// To reference a document in Mongoose, you can use mongoose.Schema.Types.ObjectId like this:
/*
const gameSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publisher'
  }
})
*/

const Game = mongoose.model('Game', new mongoose.Schema({
  title: String,
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' }
}))

async function createPublisher (companyName, firstParty, website) {
  const publisher = new Publisher({
    companyName,
    firstParty,
    website
  })
  const result = await publisher.save()
  console.log(result)
}

async function createGame (title, publisher) {
  const game = new Game({
    title,
    publisher
  })
  const result = await game.save()
  console.log(result)
}

async function listGames () {
  const games = await Game
    .find()
    .populate('publisher', '-_id companyName')
    .select('title publisher')
  console.log('BEGIN ---------- Listing Games:')
  console.log(games)
  console.log('END ---------- Listing Games:')
}

createPublisher('Nintendo', true, 'https://www.nintendo.com/')
createGame('Super Smash Bros', '5fa220e0e47c36830649c9ad')
listGames()