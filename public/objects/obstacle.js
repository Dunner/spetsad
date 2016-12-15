var obj_obstacle = {},
    obstacles = [];


obj_obstacle.create = function(data) {

  var tempObstacle = {};
  tempObstacle.foot = {z: 0, object: game.add.image(data.x,data.y, createBlock(data.diameter, data.diameter,'#000'))};
  tempObstacle.roof = {z: 5, object: game.add.image(data.x,data.y, createBlock(data.diameter, data.diameter,data.color))};
  tempObstacle.data = data;
  tempObstacle.foot.object.anchor.setTo(0.5, 0.5);
  tempObstacle.roof.object.anchor.setTo(0.5, 0.5);
  obstacles.push(tempObstacle);

}

obj_obstacle.update = function(obstacle) {
  // ###### Obstacles 
  var pointDir = pointDirection(game.camera.center(), obstacle.foot.object.position);
  if  (pointDir < 0) {pointDir += 360};
  
  var tempRoofOffCenter = obstacle.roof.z * (Math.abs(pointDistance(game.camera.center(), obstacle.foot.object.position))/100);
  var tempRoofLengthdir = lengthDir(tempRoofOffCenter, pointDir / 57);
  obstacle.roof.object.x = obstacle.foot.object.x + tempRoofLengthdir.x;
  obstacle.roof.object.y = obstacle.foot.object.y + tempRoofLengthdir.y;

}

obj_obstacle.delete = function() {}