var obj_tower_spear = {},
    towerSpears = [];

obj_tower_spear.create = function(data) {
  var spear = {},
      target = {};

  towers.forEach(function(tower){
    if (tower.team == data.tower) {
      spear.fromPos = {
        x: tower.foot1.object.x,
        y: tower.foot1.object.y
      }
    }
  });

  if (data.targetType == 'player') {
    target = findPlayer(data.targetID);
    spear.toPos = {
      x: target.shadow.object.x,
      y: target.shadow.object.y
    }
  }
  if (data.targetType == 'creep') {
    target = findCreep(data.targetID);
    spear.toPos = {
      x: target.shadow.x,
      y: target.shadow.y
    }
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

  spear.bounds = game.add.image(spear.fromPos.x,spear.fromPos.y, createBlock(25, 3,'red'));
  spear.bounds.alpha = 0.0;
  spear.bounds.anchor.setTo(0, 1);
  spear.bounds.angle = pointDirection(spear.fromPos, spear.toPos);

  spear.id = data.spearID;
  spear.targetID = data.targetID;
  spear.targetType = data.targetType;
  spear.object.depth = 8;
  spear.distanceTraveled = 0;
  towerSpears.push(spear);
}

obj_tower_spear.update = function(spear) {
  if (!spear) {return;}

  if (spear.targetType == 'player') {target = findPlayer(spear.targetID);}
  if (spear.targetType == 'creep') {target = findCreep(spear.targetID);}
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

    spear.bounds.x = spear.object.x = spear.shadow.x + tempShaftLengthdir.x;
    spear.bounds.y = spear.object.y = spear.shadow.y + tempShaftLengthdir.y;


    if (checkOverlap(target.shadow.object, spear.bounds)) {
      obj_tower_spear.delete(spear.id);
      if (target == me) {
        console.log('me');
        socket.emit('towerSpearHit', {spearID: spear.id, targetID: spear.targetID, targetType: spear.targetType});
      }
    }
    
    if (spear.shadow && debug) {game.debug.spriteBounds(spear.bounds);}
  }

}

obj_tower_spear.delete = function(spearID) {
  for (var i = 0; i <towerSpears.length; i++) {
    if (towerSpears[i].id == spearID) {
      towerSpears[i].object.destroy();
      towerSpears[i].shadow.destroy();
      towerSpears[i].bounds.destroy();
      towerSpears.splice(i, 1);
      break;
    }
  }

}