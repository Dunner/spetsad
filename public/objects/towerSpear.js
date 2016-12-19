var obj_tower_spear = {},
    towerSpears = [];

obj_tower_spear.create = function(data) {
  var spear = {};

  towers.forEach(function(tower){
    if (tower.team == data.tower) {
      spear.fromPos = {
        x: tower.foot.object.x,
        y: tower.foot.object.y
      }
    }
  });

  var target = findPlayer(data.targetID);
  spear.toPos = {
    x: target.shadow.object.x,
    y: target.shadow.object.y
  }

  spear.shadow = game.add.image(spear.fromPos.x,spear.fromPos.y, createBlock(45, 3,'black'));
  spear.shadow.anchor.setTo(0.5, 1);
  spear.shadow.angle = pointDirection(spear.fromPos, spear.toPos);
  spear.shadow.alpha = 0.3
  groups.spears.add(spear.shadow);
  groups.allObjects.add(spear.shadow);

  spear.object = game.add.image(spear.fromPos.x,spear.fromPos.y, 'spear-ash');
  spear.object.anchor.setTo(0.5, 1);
  spear.object.angle = pointDirection(spear.fromPos, spear.toPos);
  groups.spears.add(spear.object);
  groups.allObjects.add(spear.object);

  spear.id = data.spearID;
  spear.targetID = data.targetID;
  spear.object.depth = 8;
  spear.distanceTraveled = 0;
  towerSpears.push(spear);
}

obj_tower_spear.update = function(spear) {
  if (!spear) {return;}

  var target = findPlayer(spear.targetID);
  spear.toPos = {
    x: target.shadow.object.x,
    y: target.shadow.object.y
  }

  if(spear.distanceTraveled > 500) {
    obj_tower_spear.delete(spear.id);
  } else {
    spear.object.angle = spear.shadow.angle = pointDirection({x:spear.shadow.x,y:spear.shadow.y}, spear.toPos); 
    spear.distanceTraveled += 50 * delta;
    spear.shadow.x += ( 50 * Math.cos(spear.object.angle * Math.PI / 180) ) * delta;
    spear.shadow.y += ( 50 * Math.sin(spear.object.angle * Math.PI / 180) ) * delta;


    var pointDir = pointDirection(game.camera.center(), spear.object.position);
    if  (pointDir < 0) {pointDir += 360};
    
    var tempShaftOffCenter = spear.object.depth * (Math.abs(pointDistance(game.camera.center(), spear.object.position))/100);
    var tempShaftLengthdir = lengthDir(tempShaftOffCenter, pointDir / 57);

    spear.object.x = spear.shadow.x + tempShaftLengthdir.x;
    spear.object.y = spear.shadow.y + tempShaftLengthdir.y;

    if (checkOverlap(me.shadow.object, spear.object) && me.playerinfo.health > 0) {
      socket.emit('towerSpearHit', {spearID: spear.id, targetID: spear.targetID});
      me.playerinfo.health -= 20;
      obj_tower_spear.delete(spear.id);
    }
  }

}

obj_tower_spear.delete = function(spearID) {
  for (var i = 0; i <towerSpears.length; i++) {
    if (towerSpears[i].id = spearID) {
      towerSpears[i].object.destroy();
      towerSpears[i].shadow.destroy();
      towerSpears.splice(i, 1);
    }
  }

}