var ld = require('lodash');
var Player = function(name, colour, coins, path) {
  this._name = name;
  this._colour = colour;
  this._coins = coins;
  this._path = path;
  this._kills = 0;
};

var isReadyToGetInner = function(destinationIndex) {
  if(destinationIndex > 15 && this._kill > 0)
    return true;
  return false
}
Player.prototype = {
  move: function(coinId, diceValue) {
    var coinToMove = this.getCoinById(+coinId);
    var coinPosition = coinToMove.getPosition();
    var position = ld.findIndex(this._path, {
      _id: coinPosition
    });
    var destinationIndex = (position >= 0) ? position + diceValue : (diceValue == 6) ? 0 : null;
    if ((destinationIndex == null) || (destinationIndex>15 && !this._kills))
      return;
    var tile = this._path[destinationIndex];
    if (tile.canPlaceCoin(coinToMove)) {
      if(tile.placeCoin(coinToMove))
        this.incrementPlayersKill();
      coinToMove.updatePosition(tile._id);
    }
  },
  incrementPlayersKill: function(){
    this._kills++;
  },
  getCoinById: function(id) {
    return ld.find(this._coins, {
      _id: id
    });
  },
  hasAnyMoves: function(diceValue) {
    var paths = this._path;
    if (!diceValue)
      return false;
    return this._coins.some(function(coin) {
      var coinPosition = coin.getPosition();
      var position = ld.findIndex(paths, {
        _id: coinPosition
      });
      var destinationIndex = (position >= 0) ? position + diceValue : (diceValue == 6) ? 0 : null;
      if (destinationIndex == null)
        return;
      var tile = paths[destinationIndex];
      return tile.canPlaceCoin(coin);
    });
  }
};

module.exports = Player;
