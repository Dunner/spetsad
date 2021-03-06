var obj_creep = {},
    creeps = [];

obj_creep.create = function(creepData) {
  var creep = creepData;

  creep.shadow = {object: game.add.image(creepData.x,creepData.y, createBlock(28, 28,'black'))};
  creep.shadow.object.anchor.setTo(0.5, 0.5);
  creep.shadow.object.alpha = 0.3;
  groups.creeps.add(creep.shadow.object);
  groups.allObjects.add(creep.shadow.object);

  creep.object = game.add.image(creepData.x,creepData.y, createBlock(30, 30,creep.team));
  creep.object.anchor.setTo(0.5, 0.5);
  creep.object.angle = creep.shadow.object.angle
  groups.creeps.add(creep.object);
  groups.allObjects.add(creep.object);

  creep.object.depth = 4;
  creeps.push(creep);

  creep.hpbar = {};
  creep.hpbar.background = game.add.image(creepData.x, creepData.y, createBlock(30, 3,'black'));
  creep.hpbar.health = game.add.image(creepData.x, creepData.y, createBlock(10, 3,'green'));
  creep.hpbar.background.alpha = 0.3;
  creep.hpbar.background.anchor.set(0.5, 8);
  creep.hpbar.health.anchor.set(0.5, 8);
  creep.hpbar.health.alpha = 0.3;
}

obj_creep.update = function(creep) {

  var pointDir = pointDirection(game.camera.center(), creep.object.position);
  if  (pointDir < 0) {pointDir += 360};
  
  var creepOffCenter = creep.object.depth * (Math.abs(pointDistance(game.camera.center(), creep.object.position))/100);
  var creepLengthdir = lengthDir(creepOffCenter, pointDir / 57);

  creep.object.x = creep.shadow.object.x + creepLengthdir.x;
  creep.object.y = creep.shadow.object.y + creepLengthdir.y;

  creep.hpbar.health.position = creep.hpbar.background.position = creep.shadow.object.position;

  if (creep.action == 'moveDown') {
    creep.shadow.object.y += 3.5 * delta;
  }
  if (creep.action == 'moveDownLeft') {
    creep.shadow.object.y += 3.5 * delta;
    creep.shadow.object.x -= 3.5 * delta;
  }

  if (creep.action == 'moveLeft') {
    creep.shadow.object.x -= 3.5 * delta;
  }
  if (creep.action == 'moveUpLeft') {
    creep.shadow.object.x -= 3.5 * delta;
    creep.shadow.object.y -= 3.5 * delta;
  }

  if (creep.action == 'moveUp') {
    creep.shadow.object.y -= 3.5 * delta;
  }
  if (creep.action == 'moveUpRight') {
    creep.shadow.object.y -= 3.5 * delta;
    creep.shadow.object.x += 3.5 * delta;
  }

  if (creep.action == 'moveRight') {
    creep.shadow.object.x += 3.5 * delta;
  }
  if (creep.action == 'moveDownRight') {
    creep.shadow.object.x += 3.5 * delta;
    creep.shadow.object.y += 3.5 * delta;
  }

}

obj_creep.delete = function(creepID) {
  for(i=0;i<creep.length;i++) {
    var creep = creeps[i];
    if (creep.id == creepID) {
      creep.object.destroy();
      creep.shadow.object.destroy();
      creeps.splice(i, 1);
      break;
    }
  }
}