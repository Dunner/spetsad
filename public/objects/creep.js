var obj_creep = {},
    creeps = [];

obj_creep.create = function(creepData) {
  var creep = {};

  creep.shadow = game.add.image(creepData.x,creepData.y, createBlock(30, 30,'black'));
  creep.shadow.anchor.setTo(0.5, 0.5);
  creep.shadow.angle = pointDirection({x:creepData.x, y:creepData.y}, {x:creepData.x,y:creepData.y});
  creep.shadow.alpha = 0.3
  groups.creeps.add(creep.shadow);
  groups.allObjects.add(creep.shadow);

  creep.object = game.add.image(creepData.x,creepData.y, createBlock(30, 30,'green'));
  creep.object.anchor.setTo(0.5, 0.5);
  creep.object.angle = creep.shadow.angle
  groups.creeps.add(creep.object);
  groups.allObjects.add(creep.object);

  creep.id = creepData.id;
  creep.team = creepData.team
  creep.object.depth = 2;
  creeps.push(creep);
}

obj_creep.update = function(creep) {

  var pointDir = pointDirection(game.camera.center(), creep.object.position);
  if  (pointDir < 0) {pointDir += 360};
  
  var creepOffCenter = creep.object.depth * (Math.abs(pointDistance(game.camera.center(), creep.object.position))/100);
  var creepLengthdir = lengthDir(creepOffCenter, pointDir / 57);

  creep.object.x = creep.shadow.x + creepLengthdir.x;
  creep.object.y = creep.shadow.y + creepLengthdir.y;


}

obj_creep.delete = function(creepID) {
  for(i=0;i<creep.length;i++) {
    var creep = creeps[i];
    if (creep.id == creepID) {
      creep.object.destroy();
      creep.shadow.destroy();
      creep.bounds.destroy();
      creeps.splice(i, 1);
      break;
    }
  }
}