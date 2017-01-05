var async = require('async');
var dataService = require('./dataService');
var utils = require('./utils');

var creepHandler = function(lobby){

  //Spawn creeps ##########

  if (lobby.secondsPlayed % 10 == 0 ) { //every 30th second

    var creepsToSpawn = {red:[], blue: []};

    for (var x = 0; x < 3; x++) {
      var blueCreep = {
        type: 'standard',
        id: utils.randomID('creep'),
        team: 'blue',
        x: 450-62.5+(x*40),
        y: 200,
        maxHealth: 300,
        health: 300
      };
      creepsToSpawn['blue'].push(blueCreep);
      lobby.mapData.creeps['blue'].push(blueCreep);
      var redCreep = {
        type: 'standard',
        id: utils.randomID('creep'),
        team: 'red',
        x: 450-62.5+(x*40),
        y: 1720,
        maxHealth: 300,
        health: 300
      };
      creepsToSpawn['red'].push(redCreep);
      lobby.mapData.creeps['red'].push(redCreep);
    }
    lobby.players.forEach(function (tempSocketID) {
      io.to(tempSocketID).emit('creepSpawn', creepsToSpawn);
    });
  }

  //Update creeps ##########
  (lobby.mapData.creeps).forEach(function(creep){

    if (pointDistance({
      x: creep.x,
      y: creep.y
    }, {
      x: lobby.mapData.towers[creep.team].x,
      y: lobby.mapData.towers[creep.team].x
    }) > 200) {

    }
  });
}

module.exports = creepHandler;
