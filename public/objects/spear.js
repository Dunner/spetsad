var obj_spear = {},
    spears = [],
    fireRate = 300,
    nextFire = 0;

obj_spear.create = function(owner, fromPos, toPos, id, distance) {
  var spear = {};

  spear.shadow = game.add.image(fromPos.x,fromPos.y, createBlock(45, 3,'black'));
  spear.shadow.anchor.setTo(0.5, 1);
  spear.shadow.angle = pointDirection(fromPos, toPos);
  spear.shadow.alpha = 0.3
  groups.spears.add(spear.shadow);
  groups.allObjects.add(spear.shadow);

  spear.object = game.add.image(fromPos.x,fromPos.y, 'spear-ash');
  spear.object.anchor.setTo(0.5, 1);
  spear.object.angle = pointDirection(fromPos, toPos);
  groups.spears.add(spear.object);
  groups.allObjects.add(spear.object);

  spear.bounds = game.add.image(fromPos.x,fromPos.y, createBlock(25, 3,'red'));
  spear.bounds.alpha = 0.0;
  spear.bounds.anchor.setTo(0, 1);
  spear.bounds.angle = pointDirection(fromPos, toPos);

  spear.id = id;
  spear.object.depth = 8;
  spear.distanceTraveled = 0;
  spear.owner = owner;
  spear.distance = distance;
  spears.push(spear);
}

obj_spear.update = function(spear) {

  

  if(spear.distanceTraveled >= spear.distance) {
    obj_spear.delete(spear.id);
  } else {
    spear.distanceTraveled += 32 * delta;
    spear.shadow.x += ( 32 * Math.cos(spear.object.angle * Math.PI / 180) ) * delta;
    spear.shadow.y += ( 32 * Math.sin(spear.object.angle * Math.PI / 180) ) * delta;

    var pointDir = pointDirection(game.camera.center(), spear.object.position);
    if  (pointDir < 0) {pointDir += 360};
    
    var tempShaftOffCenter = spear.object.depth * (Math.abs(pointDistance(game.camera.center(), spear.object.position))/100);
    var tempShaftLengthdir = lengthDir(tempShaftOffCenter, pointDir / 57);

    spear.bounds.x = spear.object.x = spear.shadow.x + tempShaftLengthdir.x;
    spear.bounds.y = spear.object.y = spear.shadow.y + tempShaftLengthdir.y;

    if (checkOverlap(me.shadow.object, spear.bounds) && me.id !== spear.owner && me.playerinfo.health > 0) {
      socket.emit('spearHit', {spearId: spear.id, distanceTraveled: spear.distanceTraveled, spearOwner:spear.owner});
      // me.playerinfo.health -= spear.distanceTraveled;
    }

    if (spear.shadow && debug) {game.debug.spriteBounds(spear.bounds);}

  }

}

obj_spear.delete = function(spearID) {
  for(i=0;i<spears.length;i++) {
    var spear = spears[i];
    if (spear.id == spearID) {
      spear.object.destroy();
      spear.shadow.destroy();
      spear.bounds.destroy();
      spears.splice(i, 1);
      break;
    }
  }
}