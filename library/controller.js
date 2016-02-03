var Game = require('./game');
var Croupier = require('./croupier');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var croupier = new Croupier(Game);

var express = require('express');
var app = express();

app.get('/', function(req, res, next) {
  req.url = '/chooseGame.html';
  next();
})

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(function(req, res, next) {
  if (req.cookies.name)
    req.user = req.cookies.name;
  next();
})

// terminal logging .......
// app.use(function(req, res, next) {
//   console.log('URL:', req.url);
//   next();
// })

var getGameFields = function(game) {
  return {
    id: game._id,
    no_of_players: game._size,
    joined: game._size - game._players.length
  }
};

app.get('/getGames', function(req, res) {
  var games = croupier.getAvailableGames(getGameFields);
  res.set('Content-Type', 'application/json')
  res.end(JSON.stringify(games));
});

app.post('/addGame', function(req, res) {
  var gameId = croupier.addGame(req.body.gameSize, req.user);
  res.cookie('gameId', gameId);
  res.end(JSON.stringify({
    success: true
  }));
});

app.post('/joinGame', function(req, res) {
  var game = croupier.getGameById(req.body.gameId);
  game.addPlayer(req.user);
  res.cookie('gameId', req.body.gameId);
  res.end(JSON.stringify({
    success: true
  }));
});

app.post('/isGameReady', function(req, res) {
  var game = croupier.getGameById(req.body.gameId);
  res.end(JSON.stringify({
    ready: game.isReady(),
    players: game.getNamesOfPlayers()
  }));
});

app.controller = function(games) {
  app.games = games || [];
};

module.exports = app;
