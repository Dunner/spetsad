var obj_pinetree = {},
    pinetrees = [];


obj_pinetree.create = function(data) {

  var tempPinetree = {};
  tempPinetree.data = data;

  tempPinetree.base = {z: 0, object: game.add.sprite(data.x,data.y, 'pinetree5')};
  tempPinetree.base.object.anchor.setTo(0.5, 0.5);

  tempPinetree.children = [];
  for (var i = 1; i < data.height; i++) {
    var child = {
      z: i*5,
      object: game.add.sprite(data.x,data.y, 'pinetree5')
    };
    child.object.anchor.setTo(0.5, 0.5);
    child.object.scale.setTo(1/i, 1/i);

    child.object.angle = Math.floor(Math.random()*(360-0+1)+0);

    tempPinetree.children.push(child);

  }

  pinetrees.push(tempPinetree);

}

obj_pinetree.update = function(pinetree) {
  // ###### Obstacles 
  var pointDir = pointDirection(screenCenter(), pinetree.base.object.position);
  if  (pointDir < 0) {pointDir += 360};

  for (var i = 0; i < pinetree.children.length; i++) {
    var child = pinetree.children[i];

    var offCenter = child.z * (Math.abs(pointDistance(screenCenter(), pinetree.base.object.position))/100);
    var ldirCenter = lengthDir(offCenter, pointDir / 57);

    child.object.x = pinetree.base.object.x + ldirCenter.x;
    child.object.y = pinetree.base.object.y + ldirCenter.y;

  }


}

obj_pinetree.delete = function() {}