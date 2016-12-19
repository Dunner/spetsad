var obj_tower = {},
    towers = [];


obj_tower.create = function(data) {

  var tempTower = {};
  tempTower.foot = {object: game.add.image(data.x,data.y, createBlock(50, 50,'#000'))};
  tempTower.roof = {object: game.add.image(data.x,data.y, createBlock(50, 50, 'brown'))};
  tempTower.data = data;
  tempTower.foot.object.depth = 0;
  tempTower.roof.object.depth = 25;
  tempTower.foot.object.anchor.setTo(0.5, 0.5);
  tempTower.roof.object.anchor.setTo(0.5, 0.5);
  tempTower.team = data.team;
  towers.push(tempTower);
  groups.allObjects.add(tempTower.foot.object);
  groups.allObjects.add(tempTower.roof.object);
}

obj_tower.update = function(tower) {
  // ###### Towers 
  var pointDir = pointDirection(game.camera.center(), tower.foot.object.position);
  if  (pointDir < 0) {pointDir += 360};
  
  var tempRoofOffCenter = tower.roof.object.depth * (Math.abs(pointDistance(game.camera.center(), tower.foot.object.position))/100);
  var tempRoofLengthdir = lengthDir(tempRoofOffCenter, pointDir / 57);
  tower.roof.object.x = tower.foot.object.x + tempRoofLengthdir.x;
  tower.roof.object.y = tower.foot.object.y + tempRoofLengthdir.y;

}

obj_tower.delete = function() {}