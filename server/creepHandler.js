var async = require('async');
var dataService = require('./dataService');
var utils = require('./utils');

var creepHandler = function(io, lobby, creep){

  var enemyTeam = 'blue'
  if (creep.team == 'blue') {
    enemyTeam = 'red';
  }
  var creepAction;
  var moveDirection;
  var attackTarget;
  var distanceToTarget;
  var directionToTarget;

  var distanceToEnemyTower = utils.pointDistance(
   {x: creep.x,y: creep.y },
   {x: lobby.mapData.towers[enemyTeam][0].x,y: lobby.mapData.towers[enemyTeam][0].y});

  var directionToEnemyTower = utils.pointDirection(
    {x: creep.x, y: creep.y}, 
    {x: lobby.mapData.towers[enemyTeam][0].x,y: lobby.mapData.towers[enemyTeam][0].y});
  directionToEnemyTower = ((directionToEnemyTower % 360) + 360) % 360;

  if (distanceToEnemyTower < 200 && lobby.mapData.towers[enemyTeam][0].health > 0) {
    if (distanceToEnemyTower > 100) {
      distanceToTarget = distanceToEnemyTower;
      directionToTarget = directionToEnemyTower;
    } else {
      attackTarget = lobby.mapData.towers[enemyTeam][0];
    }
  } else {
    var distanceToEnemyBase = utils.pointDistance(
     {x: creep.x,y: creep.y },
     {x: lobby.mapData.bases[enemyTeam].x,y: lobby.mapData.bases[enemyTeam].y});
    if (distanceToEnemyBase > 50) {
      var directionToEnemyBase = utils.pointDirection(
        {x: creep.x, y: creep.y}, 
        {x: lobby.mapData.bases[enemyTeam].x,y: lobby.mapData.bases[enemyTeam].y});
      directionToEnemyBase = ((directionToEnemyBase % 360) + 360) % 360;
      distanceToTarget = distanceToEnemyBase;
      directionToTarget = directionToEnemyBase;
    } else {
      attackTarget = lobby.mapData.bases[enemyTeam];
    }

  }



  if ((directionToTarget >= 0 && directionToTarget < 22.5) 
    || (directionToTarget <= 337.5) && directionToTarget < 0) { creepAction = 'moveRight'}
  if (directionToTarget >= 22.5 && directionToTarget < 67.5) { creepAction = 'moveDownRight'}
  if (directionToTarget >= 67.5 && directionToTarget < 112.5) { creepAction = 'moveDown'}
  if (directionToTarget >= 112.5 && directionToTarget < 157.5) { creepAction = 'moveDownLeft'}
  if (directionToTarget >= 157.5 && directionToTarget < 202.5) { creepAction = 'moveLeft'}
  if (directionToTarget >= 202.5 && directionToTarget < 247.5) { creepAction = 'moveUpLeft'}
  if (directionToTarget >= 247.5 && directionToTarget < 292.5) { creepAction = 'moveUp'}
  if (directionToTarget >= 292.5 && directionToTarget < 337.5) { creepAction = 'moveUpRight'}

  if (creep.nextX) {creep.x = creep.nextX}
  if (creep.nextY) {creep.y = creep.nextY}

  if (creepAction) {
    if (!attackTarget) {
      if (creepAction == 'moveDown') {
        creep.nextY = creep.y+35;
      }
      if (creepAction == 'moveDownLeft') {
        creep.nextY = creep.y+35;
        creep.nextX = creep.x-35;
      }

      if (creepAction == 'moveLeft') {
        creep.nextX = creep.x-35;
      }
      if (creepAction == 'moveUpLeft') {
        creep.nextX = creep.x-35;
        creep.nextY = creep.y-35;
      }

      if (creepAction == 'moveUp') {
        creep.nextY = creep.y-35;
      }
      if (creepAction == 'moveUpRight') {
        creep.nextY = creep.y-35;
        creep.nextX = creep.x+35;
      }

      if (creepAction == 'moveRight') {
        creep.nextX = creep.x+35;
      }
      if (creepAction == 'moveDownRight') {
        creep.nextX = creep.x+35;
        creep.nextY = creep.y+35;
      }
    }
  }

  if (attackTarget) {
    attackTarget.health -= 10;
  }

  lobby.players.forEach(function (tempSocketID) {
    io.to(tempSocketID).emit('creepAction', {
      id:creep.id,
      x:creep.x,
      y:creep.y,
      action: creepAction
    });
  });


  creep.lastAction = creepAction;

}

module.exports = creepHandler;
