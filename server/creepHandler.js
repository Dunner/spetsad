var async = require('async');
var dataService = require('./dataService');
var utils = require('./utils');

var creepHandler = function(io, lobby, creep){

  var enemyTeam = 'blue'
  if (creep.team == 'blue') {
    enemyTeam = 'red';
  }

  var distanceToTarget,
      directionToTarget;

  var distanceToEnemyTower = utils.pointDistance(
   {x: creep.x,y: creep.y },
   {x: lobby.mapData.towers[enemyTeam][0].x,y: lobby.mapData.towers[enemyTeam][0].y});

  var directionToEnemyTower = utils.pointDirection(
    {x: creep.x, y: creep.y}, 
    {x: lobby.mapData.towers[enemyTeam][0].x,y: lobby.mapData.towers[enemyTeam][0].y});
  directionToEnemyTower = ((directionToEnemyTower % 360) + 360) % 360;

  if (distanceToEnemyTower < 200) {
    distanceToTarget = distanceToEnemyTower;
    directionToTarget = directionToEnemyTower;
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
    }

  }

  var creepAction;
  var moveDirection;

  if (directionToTarget > 0 && directionToTarget < 90) { creepAction = 'moveDown'}
  if (directionToTarget > 90 && directionToTarget < 180) { creepAction = 'moveLeft'}
  if (directionToTarget > 180 && directionToTarget < 270) { creepAction = 'moveUp'}
  if (directionToTarget > 270 && directionToTarget < 360) { creepAction = 'moveRight'}

  if (creep.nextX) {creep.x = creep.nextX}
  if (creep.nextY) {creep.y = creep.nextY}

  if (creepAction) {
    if (creepAction == 'moveDown') {
      creep.nextY = creep.y+50;
    }
    if (creepAction == 'moveLeft') {
      creep.nextX = creep.x-50;
    }
    if (creepAction == 'moveUp') {
      creep.nextY = creep.y-50;
    }
    if (creepAction == 'moveRight') {
      creep.nextX = creep.x+50;
    }
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
