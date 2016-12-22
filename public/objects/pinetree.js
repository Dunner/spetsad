var obj_pinetree = {},
    pinetrees = [];


obj_pinetree.create = function(data) {
  
  var tempPinetree = {};
  tempPinetree.data = data;

  tempPinetree.shadow = {object: game.add.image(data.x,data.y, 'pinetree5')};
  tempPinetree.shadow.object.anchor.setTo(0.5, 0.5);
  tempPinetree.shadow.object.tint = RGBtoHEX(0,0,0);
  tempPinetree.shadow.object.alpha = '0.4';
  tempPinetree.id = data.id;
  groups.allObjects.add(tempPinetree.shadow.object);

  tempPinetree.bounds = game.add.image(data.x,data.y, createBlock(40, 40,'green'));
  tempPinetree.bounds.alpha = 1;
  tempPinetree.bounds.anchor.setTo(0.5, 0.5);

  collisionObjects.push({
    object: tempPinetree.bounds,
    id: data.id,
    type: 'tree',
    x: data.x,
    y: data.y,
    solid: true
  });
  //add children
  tempPinetree.children = [];
  for (var i = 1; i < data.sections+1 ; i++) {
    var child = {object: game.add.image(data.x,data.y, 'pinetree5')};
    child.object.depth = i*5;
    child.object.anchor.setTo(0.5, 0.5);
    tempPinetree.children.push(child);
    groups.allObjects.add(child.object);
  }

  //manipulate children
  var treeScale = 0.2;
  for (var i = tempPinetree.children.length-1; i >= 0 ; i--) {
    treeScale = Math.round(treeScale * 10) / 10;
    tempPinetree.children[i].object.scale.setTo(treeScale, treeScale);  // i/data.sections
    tempPinetree.children[i].object.angle = Math.floor(Math.random()*(360-0+1)+0);
    treeScale += 0.2;
    if (i == 0 && data.angle) {
      tempPinetree.children[i].object.angle = data.angle;
    }
  }
  tempPinetree.shadow.object.scale = tempPinetree.children[0].object.scale;  // i/data.sections
  tempPinetree.shadow.object.angle = tempPinetree.children[0].object.angle;

  
  if (debug) { //DEBUGGING ###############
    tempPinetree.bounds.inputEnabled = true;
    tempPinetree.bounds.input.pixelPerfectOver = true;
    tempPinetree.bounds.events.onInputOver.add( function() {
      console.log(tempPinetree.data.id, 
                  'x:' + tempPinetree.bounds.x, 
                  'y:' + tempPinetree.bounds.y)
    }, this);
  } //####################################


  pinetrees.push(tempPinetree);

}

obj_pinetree.update = function(pinetree) {
  // ###### pinetrees 
  if (pointDistance(game.camera.center(),pinetree.shadow.object.position) < 600) {


    var pointDir = pointDirection(game.camera.center(), pinetree.shadow.object.position);
    if  (pointDir < 0) {pointDir += 360};

    for (var i = 0; i < pinetree.children.length; i++) {
      var child = pinetree.children[i];

      var offCenter = child.object.depth * (Math.abs(pointDistance(game.camera.center(), pinetree.shadow.object.position))/100);
      var ldirCenter = lengthDir(offCenter, pointDir / 57);

      child.object.x = pinetree.shadow.object.x + ldirCenter.x;
      child.object.y = pinetree.shadow.object.y + ldirCenter.y;

    }

  }

}

obj_pinetree.delete = function() {}