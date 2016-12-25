var obj_tower = {},
    towers = [];


obj_tower.create = function(data) {

  var tempTower = {};
  tempTower.id = data.id;
  tempTower.team = data.team;

  tempTower.foot1 = {object: game.add.image(data.x,data.y, 'tower-ss')};
  tempTower.foot1.object.depth = 0;
  tempTower.foot1.object.frame = 0;
  tempTower.foot1.object.anchor.setTo(0.5, 0.5);
  groups.allObjects.add(tempTower.foot1.object);

  tempTower.foot2 = {object: game.add.image(data.x,data.y, 'tower-ss')};
  tempTower.foot2.object.depth = 5;
  tempTower.foot2.object.frame = 0;
  tempTower.foot2.object.anchor.setTo(0.5, 0.5);
  groups.allObjects.add(tempTower.foot2.object);

  tempTower.foot3 = {object: game.add.image(data.x,data.y, 'tower-ss')};
  tempTower.foot3.object.depth = 10;
  tempTower.foot2.object.frame = 0;
  tempTower.foot3.object.anchor.setTo(0.5, 0.5);
  groups.allObjects.add(tempTower.foot3.object);

  tempTower.roof1 = {object: game.add.image(data.x,data.y, 'tower-ss')};
  tempTower.roof1.object.depth = 15;
  tempTower.roof1.object.frame = 1;
  tempTower.roof1.object.anchor.setTo(0.5, 0.5);
  groups.allObjects.add(tempTower.roof1.object);

  tempTower.roof2 = {object: game.add.image(data.x,data.y, 'tower-ss')};
  tempTower.roof2.object.depth = 20;
  tempTower.roof2.object.frame = 2;
  tempTower.roof2.object.anchor.setTo(0.5, 0.5);
  groups.allObjects.add(tempTower.roof2.object);

  towers.push(tempTower);
  collisionObjects.push({
    object: tempTower.foot1.object,
    id: data.id,
    type: 'towers',
    x: data.x,
    y: data.y,
    solid: true
  });
}

obj_tower.update = function(tower) {
  // ###### Towers 
  var pointDir = pointDirection(game.camera.center(), tower.foot1.object.position);
  if  (pointDir < 0) {pointDir += 360};
  
  ['foot2', 'foot3', 'roof1', 'roof2'].forEach(function(part){
    var tempPartOffCenter = tower[part].object.depth * (Math.abs(pointDistance(game.camera.center(), tower['foot1'].object.position))/100);
    var tempPartLengthdir = lengthDir(tempPartOffCenter, pointDir / 57);
    tower[part].object.x = tower['foot1'].object.x + tempPartLengthdir.x;
    tower[part].object.y = tower['foot1'].object.y + tempPartLengthdir.y;
  });


}

obj_tower.delete = function() {}