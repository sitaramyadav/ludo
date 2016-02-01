var Player = require('./player');
var Path = require('./paths');
var Coin = require('./coin');
var colours = require('./colours');
var ld = require('lodash');

var Game = function(noOfPlayers){
	this._players = [];
	this._totalPlayers = noOfPlayers;
	this._colours = Object.keys(colours);
	this._paths = Path.generate();
	this._diceValue = [];
}

var generateCoins = function(count,numOfPlayers,colour){
	var coins = [];
	var start = (numOfPlayers * count) + 1;
	var end = start + count;
	for (var i = start; i < end; i++)
		coins.push(new Coin(i,colour));
	return coins;
}

Game.prototype = {
	addPlayer:function(name){
		var playerPosition = this._players.length;
		if(playerPosition>=this._totalPlayers) return;
		var colour = this._colours.pop();
		var coins = generateCoins(4,playerPosition,colour);
		var player = new Player(name,colour,coins,this._paths[playerPosition]);
		this._players.push(player);
	},
	moveCoin: function(coin){
		var player = ld.find(this._players,{_colour:coin.colour});
		var diceValue =	this.getDiceValue();
		player.move(coin.id,diceValue);
	}

}

module.exports = Game;