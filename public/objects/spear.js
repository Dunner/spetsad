var obj_spear = {},
    spears = [],
    fireRate = 300,
    nextFire = 0;

obj_spear.create = function(owner, fromPos, toPos, id, distance) {
  var spear = {};

  spear.shadow = game.add.image(fromPos.x,fromPos.y, createBlock(28, 3,'black'));
  spear.shadow.anchor.setTo(0.5, 1);
  spear.shadow.angle = pointDirection(fromPos, toPos);
  spear.shadow.alpha = 0.3
  groups.spears.add(spear.shadow);

  spear.object = game.add.image(fromPos.x,fromPos.y, createBlock(28, 3,'peru'));
  spear.object.anchor.setTo(0.5, 1);
  spear.object.angle = pointDirection(fromPos, toPos);
  groups.spears.add(spear.object);

  spear.id = id;
  spear.z = 8;
  spear.distanceTraveled = 0;
  spear.owner = owner;
  spear.distance = distance;
  spears.push(spear);
}

obj_spear.update = function(spear) {

  if(spear.distanceTraveled >= spear.distance) {
    spear.object.destroy();
    spear.shadow.destroy();
  } else {
    spear.distanceTraveled += 25 * delta;
    spear.shadow.x += ( 25 * Math.cos(spear.object.angle * Math.PI / 180) ) * delta;
    spear.shadow.y += ( 25 * Math.sin(spear.object.angle * Math.PI / 180) ) * delta;


    var pointDir = pointDirection(screenCenter(), spear.object.position);
    if  (pointDir < 0) {pointDir += 360};
    
    var tempShaftOffCenter = spear.z * (Math.abs(pointDistance(screenCenter(), spear.object.position))/100);
    var tempShaftLengthdir = lengthDir(tempShaftOffCenter, pointDir / 57);

    spear.object.x = spear.shadow.x + tempShaftLengthdir.x;
    spear.object.y = spear.shadow.y + tempShaftLengthdir.y;

    if (checkOverlap(me.legs.object, spear.object) && me.id !== spear.owner && me.playerinfo.health > 0) {
      socket.emit('spearhit', {spearId: spear.id, distanceTraveled: spear.distanceTraveled});
      me.playerinfo.health -= spear.distanceTraveled;
    }
  }

}

obj_spear.delete = function() {}