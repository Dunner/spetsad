var obj_obstacle = {},
    obstacles = [];


obj_obstacle.create = function(data) {

  var tempObstacle = {};
  tempObstacle.foot = {object: game.add.image(data.x,data.y, createBlock(data.diameter, data.diameter,'#000'))};
  tempObstacle.roof = {object: game.add.image(data.x,data.y, createBlock(data.diameter, data.diameter,data.color))};
  tempObstacle.data = data;
  tempObstacle.foot.object.depth = 0;
  tempObstacle.roof.object.depth = 5;
  tempObstacle.foot.object.anchor.setTo(0.5, 0.5);
  tempObstacle.roof.object.anchor.setTo(0.5, 0.5);
  obstacles.push(tempObstacle);
  groups.allObjects.add(tempObstacle.foot.object);
  groups.allObjects.add(tempObstacle.roof.object);

}

obj_obstacle.update = function(obstacle) {
  // ###### Obstacles 
  var pointDir = pointDirection(game.camera.center(), obstacle.foot.object.position);
  if  (pointDir < 0) {pointDir += 360};
  
  var tempRoofOffCenter = obstacle.roof.object.depth * (Math.abs(pointDistance(game.camera.center(), obstacle.foot.object.position))/100);
  var tempRoofLengthdir = lengthDir(tempRoofOffCenter, pointDir / 57);
  obstacle.roof.object.x = obstacle.foot.object.x + tempRoofLengthdir.x;
  obstacle.roof.object.y = obstacle.foot.object.y + tempRoofLengthdir.y;

}

obj_obstacle.delete = function() {}