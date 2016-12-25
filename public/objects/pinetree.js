var obj_pinetree = {},
    pinetrees = [];


obj_pinetree.create = function(data) {
  
  var tempPinetree = {};
  tempPinetree.id = data.id;
  tempPinetree.data = data;
  tempPinetree.shadow = {object: game.add.image(data.x,data.y, 'pinetree5')};
  tempPinetree.shadow.object.anchor.setTo(0.5, 0.5);
  tempPinetree.shadow.object.tint = RGBtoHEX(0,0,0);
  tempPinetree.shadow.object.alpha = '0.4';
  tempPinetree.shadow.object.depth = 0;
  groups.allObjects.add(tempPinetree.shadow.object);

  // var shadowBounds = Phaser.Rectangle.clone(tempPinetree.shadow.object.getBounds());
  // tempPinetree.bounds = {
  //   object: game.add.image(data.x,data.y, createBlock(shadowBounds.width/1.3, shadowBounds.height/1.3,'blue'))};
  // tempPinetree.bounds.object.anchor.setTo(0.5, 0.5);
  // tempPinetree.bounds.object.alpha = 0.2;
  // groups.allObjects.add(tempPinetree.bounds.object);

  tempPinetree.stumpBot = game.add.image(data.x,data.y,'stump-ss');
  tempPinetree.stumpBot.depth = 0;
  tempPinetree.stumpBot.anchor.setTo(0.5, 0.5);
  tempPinetree.stumpBot.scale.setTo(0.2, 0.2)
  groups.allObjects.add(tempPinetree.stumpBot);

  tempPinetree.stumpTop = game.add.image(data.x,data.y,'stump-ss');
  tempPinetree.stumpTop.depth = 1;
  tempPinetree.stumpTop.scale.setTo(tempPinetree.stumpBot.scale.x+0.1, tempPinetree.stumpBot.scale.y+0.1)
  tempPinetree.stumpTop.anchor.setTo(0.5, 0.5);
  tempPinetree.stumpTop.frame = 1;
  groups.allObjects.add(tempPinetree.stumpTop);

  tempPinetree.stumpBounds = game.add.image(data.x,data.y, createBlock(40, 40,'green'));
  tempPinetree.stumpBounds.alpha = 0.0;
  tempPinetree.stumpBounds.anchor.setTo(0.5, 0.5);

  collisionObjects.push({
    object: tempPinetree.stumpBounds,
    id: data.id,
    type: 'trees',
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
  if (tempPinetree.children.length > 0) {

    for (var i = tempPinetree.children.length-1; i >= 0 ; i--) {
      treeScale = Math.round(treeScale * 10) / 10;
      tempPinetree.children[i].object.scale.setTo(treeScale, treeScale);  // i/data.sections
      tempPinetree.children[i].object.angle = Math.floor(Math.random()*(360-0+1)+0);
      treeScale += 0.2;
      if (i == 0 && data.angle) {
        tempPinetree.children[i].object.angle = data.angle;
      }
      tempPinetree.stumpBot.scale.setTo(tempPinetree.stumpBot.scale.x+0.1, tempPinetree.stumpBot.scale.y+0.1);
      tempPinetree.stumpTop.scale.setTo(tempPinetree.stumpBot.scale.x+0.1, tempPinetree.stumpBot.scale.y+0.1);

    }

    tempPinetree.shadow.object.scale = tempPinetree.children[0].object.scale;  // i/data.sections
    tempPinetree.shadow.object.angle = tempPinetree.children[0].object.angle;
  } else {
    tempPinetree.shadow.object.scale = 0
  }


  
  if (debug) { //DEBUGGING ###############
    tempPinetree.stumpBounds.inputEnabled = true;
    tempPinetree.stumpBounds.input.pixelPerfectOver = true;
    tempPinetree.stumpBounds.events.onInputOver.add( function() {
      console.log(tempPinetree.data.id, 
                  'x:' + tempPinetree.stumpBounds.x, 
                  'y:' + tempPinetree.stumpBounds.y)
    }, this);
  } //####################################


  pinetrees.push(tempPinetree);

}

obj_pinetree.update = function(pinetree) {

  if (me && pinetree.shadow.object._bounds) {
    // game.debug.spriteBounds(pinetree.shadow.object);
    if (checkOverlap(me.head.object, pinetree.shadow.object)) {
      pinetree.children.forEach(function(section){
        game.add.tween(section.object).to({alpha: 0.1},300, "Linear", true);
      })
    } else {
      pinetree.children.forEach(function(section){
        game.add.tween(section.object).to({alpha: 1},300, "Linear", true);
      })
    }
  }

  // ###### pinetrees 
  if (pointDistance(game.camera.center(),pinetree.shadow.object.position) < 600) {

    var pointDir = pointDirection(game.camera.center(), pinetree.shadow.object.position);
    if  (pointDir < 0) {pointDir += 360};

    var stumpTopOff = pinetree.stumpTop.depth * (Math.abs(pointDistance(game.camera.center(), pinetree.stumpBot.position))/100);
    var stumpTopldirCenter = lengthDir(stumpTopOff, pointDir / 57);
    pinetree.stumpTop.x = pinetree.stumpBot.x + stumpTopldirCenter.x;
    pinetree.stumpTop.y = pinetree.stumpBot.y + stumpTopldirCenter.y;

    if (pinetree.topple) {
      //Fall animation
      if (pinetree.topple == 0.1) {
        pinetree.childVars = [];
      }
      for (var i = 0; i < pinetree.children.length; i++) {
        var child = pinetree.children[i];

        if (pinetree.topple == 0.1) {
          var offCenter = child.object.depth * (Math.abs(pointDistance(game.camera.center(), pinetree.shadow.object.position))/100);
          var ldirCenter = lengthDir(offCenter, pointDir / 57);
          pinetree.childVars[i] = {
            offCenter: offCenter,
            ldirCenter: ldirCenter
          }
        }
        if (pinetree.shadow.object.x > 450) {
          child.object.x = pinetree.shadow.object.x + pinetree.childVars[i].ldirCenter.x - ((pinetree.topple*1.2)*child.object.depth/2.8);
        } else {
          child.object.x = pinetree.shadow.object.x + pinetree.childVars[i].ldirCenter.x + ((pinetree.topple*1.2)*child.object.depth/2.8);
        }
        child.object.y = pinetree.shadow.object.y + pinetree.childVars[i].ldirCenter.y;
      }
      if (pinetree.shadow.object.x > 450) {
        pinetree.shadow.object.x -= 0.5*delta;
      } else {
        pinetree.shadow.object.x += 0.5*delta;
      }
      pinetree.topple += 0.5*delta;
      if (pinetree.topple > 20) {
        pinetree.shadow.object.destroy();
        pinetree.children.forEach(function(child){
          child.object.destroy();
        })
      }


    } else {

      if (pinetree.shake){
        //shake
        if (pinetree.shake < 1) {
          //offset
          pinetree.children.forEach(function(child){
            child.object.angle += (0.2*child.object.depth)*delta;
            if (!child.object.shakeangle) {
              child.object.shakeangle = Math.floor(Math.random() * 360) + 1/ 57;
            }
            child.object.shakeldir = lengthDir(child.object.depth/5 * pinetree.shake, child.object.shakeangle / 57);;
          })
        } else {
          //return
          pinetree.children.forEach(function(child){
            child.object.angle -= (0.2*child.object.depth)*delta;
            child.object.shakeldir = lengthDir((child.object.depth/5) / pinetree.shake, child.object.shakeangle / 57);;
          })
        }
        pinetree.shake += 0.5*delta;
        if (pinetree.shake > 2) {
          pinetree.shake = false;
        }
      }


      for (var i = 0; i < pinetree.children.length; i++) {
        var child = pinetree.children[i];

        var offCenter = child.object.depth * (Math.abs(pointDistance(game.camera.center(), pinetree.shadow.object.position))/100);
        var ldirCenter = lengthDir(offCenter, pointDir / 57);

        if (!child.object.shakeldir) {child.object.shakeldir = {x:0,y:0};}

        child.object.x = pinetree.shadow.object.x + ldirCenter.x + child.object.shakeldir.x;
        child.object.y = pinetree.shadow.object.y + ldirCenter.y + child.object.shakeldir.y;
      }
    }
  }

}

obj_pinetree.topple = function(pinetreeID) {
  for (var i = 0; i < pinetrees.length; i++) {
    if (pinetrees[i].id == pinetreeID) {
      if (pinetrees[i].topple) break;
      pinetrees[i].topple = 0.1;
    }
  }
}

obj_pinetree.shake = function(pinetreeID) {
  for (var i = 0; i < pinetrees.length; i++) {
    if (pinetrees[i].id == pinetreeID) {
      if (pinetrees[i].topple) break;
      pinetrees[i].shake = 0.1;
    }
  }
}

obj_pinetree.redraw = function(pinetreeID, mapTreeData) {
  obj_pinetree.delete(pinetreeID);
  obj_pinetree.create(mapTreeData);
}

obj_pinetree.delete = function(pinetreeID) {
  var gameTreeData, gameTreeIndex;

  for (var i = 0; i < pinetrees.length; i++) {
    if (pinetrees[i].id == pinetreeID) {
      gameTreeData = pinetrees[i];
      gameTreeIndex = i;
    }
  }
  for (var i = 0; i < collisionObjects.length; i++) {
    if (collisionObjects[i].id == pinetreeID) {
      collisionObjects.splice(i,1);
    }
  }

  if (gameTreeData) {
    gameTreeData.bounds.destroy();
    gameTreeData.stumpBot.destroy();
    gameTreeData.stumpTop.destroy();
    gameTreeData.shadow.object.destroy();
    gameTreeData.shadow = {};
    gameTreeData.children.forEach(function(section){
      section.object.destroy();
    })
    gameTreeData = {};
    pinetrees.splice(gameTreeIndex,1);
  }
}