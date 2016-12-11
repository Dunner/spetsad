var obj_pinetree = {},
    pinetrees = [];


obj_pinetree.create = function(data) {

  var tempPinetree = {};
  tempPinetree.data = data;

  tempPinetree.shadow = {z: 0, object: game.add.image(data.x,data.y, 'pinetree5')};
  tempPinetree.shadow.object.anchor.setTo(0.5, 0.5);
  tempPinetree.shadow.object.tint = RGBtoHEX(0,0,0)
  tempPinetree.shadow.object.alpha = '0.4'

  //add children
  tempPinetree.children = [];
  for (var i = 1; i < data.height+1 ; i++) {
    var child = {
      z: i*5,
      object: game.add.image(data.x,data.y, 'pinetree5')
    };
    child.object.anchor.setTo(0.5, 0.5);
    tempPinetree.children.push(child);
  }

  //manipulate children
  var treeScale = 0.2;
  for (var i = tempPinetree.children.length-1; i >= 0 ; i--) {
    treeScale = Math.round(treeScale * 10) / 10;
    tempPinetree.children[i].object.scale.setTo(treeScale, treeScale);  // i/data.height
    tempPinetree.children[i].object.angle = Math.floor(Math.random()*(360-0+1)+0);
    treeScale += 0.2;
  }
  tempPinetree.shadow.object.scale = tempPinetree.children[0].object.scale;  // i/data.height
  tempPinetree.shadow.object.angle = tempPinetree.children[0].object.angle;
  pinetrees.push(tempPinetree);


}

obj_pinetree.update = function(pinetree) {
  // ###### pinetrees 
  var pointDir = pointDirection(screenCenter(), pinetree.shadow.object.position);
  if  (pointDir < 0) {pointDir += 360};

  for (var i = 0; i < pinetree.children.length; i++) {
    var child = pinetree.children[i];

    var offCenter = child.z * (Math.abs(pointDistance(screenCenter(), pinetree.shadow.object.position))/100);
    var ldirCenter = lengthDir(offCenter, pointDir / 57);

    child.object.x = pinetree.shadow.object.x + ldirCenter.x;
    child.object.y = pinetree.shadow.object.y + ldirCenter.y;

  }


}

obj_pinetree.delete = function() {}