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
    
  }

  var moveDirection;

  if (directionToTarget > 0 && directionToTarget < 90) { moveDirection = 'down'}
  if (directionToTarget > 90 && directionToTarget < 180) { moveDirection = 'left'}
  if (directionToTarget > 180 && directionToTarget < 270) { moveDirection = 'up'}
  if (directionToTarget > 270 && directionToTarget < 360) { moveDirection = 'right'}

  console.log(creep.id, creep.team, moveDirection);

}

module.exports = creepHandler;
