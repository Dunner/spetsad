var async = require('async');
var dataService = require('./dataService');
var utils = require('./utils');

var towerHandler = function(io, lobby, tower){

  tower.targets = [];
  tower.target = {distance:999};
  var enemyTeam = 'blue'
  if (tower.team == 'blue') {
    enemyTeam = 'red';
  }

  if (tower.health > 0) {
    lobby.teams[enemyTeam].players.forEach(function (socketID) {
      dataService.sockets.forEach(function (tempSocket) {
        if (tempSocket.id == socketID) {
          if (!tempSocket.playerinfo) {return;}
          var distToTarget = Math.abs(tempSocket.playerinfo.y - tower.y);
          if (distToTarget < 200 && tempSocket.playerinfo.health > 0){
            tower.targets.push({type:'player', id: socketID, distance: distToTarget});
          }
        }
      });
    });

    (lobby.mapData.creeps[enemyTeam]).forEach(function(creep){
      var distToTarget = Math.abs(creep.y - tower.y);
      if (distToTarget < 200 && creep.health > 0){
        tower.targets.push({type:'creep', id: creep.id, distance: distToTarget});
      }
    });


    tower.targets.forEach(function (target) {
      if (target.distance < tower.target.distance) {
        tower.target = target;
      }
    });

    if (tower.target.type) {
      lobby.players.forEach(function (tempSocketID) {
        io.to(tempSocketID).emit('towerAttack', {
          spearID: utils.randomID('spear'),
          tower: tower.team,
          targetID: tower.target.id,
          targetType: tower.target.type
        });
      });
    }

  }
  
  if (tower.health !== tower.lastHealth) {
    lobby.players.forEach(function (tempSocketID) {
      io.to(tempSocketID).emit('towerDamage', {
        towerID: tower.id,
        health: tower.health
      });
    });
    tower.lastHealth = tower.health;
  } 


}

module.exports = towerHandler;
