var obj_player = {},
    players = [];

obj_player.create = function(data) {

  var shadow = {z: 0, parent: null, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'torso-test-ss')},
      feet = {z: 1, parent: shadow, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'feet-test-ss')},
      legs = {z: 3, parent: feet, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'legs-test-ss')},
      torso = {z: 5, parent: legs, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'torso-test-ss')},
      head = {z: 6, parent: torso, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'head-test-ss')};
      
  var shadowAnim = shadow.object.animations.add('walk');
  var feetAnim = feet.object.animations.add('walk');
  var legsAnim = legs.object.animations.add('walk');
  var torsoAnim = torso.object.animations.add('walk');
  var torsoThrowAnim = torso.object.animations.add('walk');
  var headAnim = head.object.animations.add('walk');

  shadowAnim.enableUpdate = true;
  feetAnim.enableUpdate = true;
  legsAnim.enableUpdate = true;
  torsoAnim.enableUpdate = true;
  headAnim.enableUpdate = true;

  shadow.object.anchor.setTo(0.5, 0.5);
  feet.object.anchor.setTo(0.5, 0.5);
  legs.object.anchor.setTo(0.5, 0.5);
  torso.object.anchor.setTo(0.5, 0.5);
  head.object.anchor.setTo(0.5, 0.5);
  var tempplayer = {
    name: data.name,
    id: data.socket,
    shadow: shadow,
    feet: feet,
    legs: legs,
    torso: torso,
    head: head,
    texts: [],
    playerinfo: data.playerinfo,
    lastTickData: {
      leanAngle: 0,
      reqLeanAngle: 0
    }
  };

  tempplayer.texts.nameplate = game.add.text(0, 0, tempplayer.name, healthStyle);
  tempplayer.texts.nameplate.anchor.set(0.5, -1);

  tempplayer.texts.healthtext = game.add.text(0, 0, "100", healthStyle);
  tempplayer.texts.healthtext.anchor.set(1, 1.5);


  players.push(tempplayer);

}

obj_player.update = function(player) {
  if (player.shadow.object) {
    if (player.playerinfo) {

      player.texts.nameplate.position = player.shadow.object.position;
      player.texts.nameplate.setText(player.name);
      player.texts.healthtext.position = player.shadow.object.position;
      player.texts.healthtext.setText(player.playerinfo.health);

      if (player.playerinfo.up) {
        player.shadow.object.y -= 10 * delta;
      }
      if (player.playerinfo.right) {
        player.shadow.object.x += 10 * delta;
      }
      if (player.playerinfo.down) {
        player.shadow.object.y += 10 * delta;
      }
      if (player.playerinfo.left) {
        player.shadow.object.x -= 10 * delta;
      }
    }
  }
  
  var currentLeanAngle = player.lastTickData.leanAngle;

  if (player.shadow.object.x !== player.lastTickData.x || player.shadow.object.y !== player.lastTickData.y) {
    player.lastTickData.reqLeanAngle = pointDirection(player.shadow.object.position, player.lastTickData);
    if  (player.lastTickData.reqLeanAngle < 0) {player.lastTickData.reqLeanAngle += 360};
    
    player.shadow.object.animations.play('walk', 5, true);
    player.feet.object.animations.play('walk', 5, true);
    player.legs.object.animations.play('walk', 5, true);
    if (player.torso.object.key == 'torso-test-ss') {
      player.torso.object.animations.play('walk', 5, true);
    }
    player.head.object.animations.play('walk', 5, true);
  
    var currentLeanAngle = player.lastTickData.leanAngle;
    if  (currentLeanAngle < 0) {currentLeanAngle += 360};
    
    if (currentLeanAngle - player.lastTickData.reqLeanAngle != 0) {
      if (Math.abs(currentLeanAngle - player.lastTickData.reqLeanAngle) < 180) {
          // Rotate current directly towards target.
          if (currentLeanAngle < player.lastTickData.reqLeanAngle) {currentLeanAngle +=25 * delta;}
          else {currentLeanAngle -= 25 * delta;}
      } else {
          // Rotate the other direction towards target.
          if (currentLeanAngle < player.lastTickData.reqLeanAngle) {currentLeanAngle -=25 * delta;}
          else {currentLeanAngle += 25 * delta;}
      }
    }
  } else {
    player.shadow.object.animations.stop('walk');
    player.feet.object.animations.stop('walk');
    player.legs.object.animations.stop('walk');
    if (player.torso.object.key == 'torso-test-ss') {
      player.torso.object.animations.stop('walk');
    }
    player.head.object.animations.stop('walk');
  }

  
  currentLeanAngle = ((currentLeanAngle % 360) + 360) % 360;

  player.shadow.object.tint = 'black';
  player.shadow.object.alpha = 0.4;


  var tempFeetOffCenter = player.feet.z * (Math.abs(pointDistance(screenCenter(), player.feet.parent.object.position))/100);
  var tempFeetLengthdir = lengthDir(tempFeetOffCenter, (((pointDirection(screenCenter(), player.feet.object.position) % 360) + 360) % 360) / 57);
  player.feet.object.x = player.shadow.object.x + tempFeetLengthdir.x;
  player.feet.object.y = player.shadow.object.y + tempFeetLengthdir.y;
  
  var tempLegsOffCenter = player.legs.z * (Math.abs(pointDistance(screenCenter(), player.legs.parent.object.position))/100);
  var tempLegsLengthdir = lengthDir(tempLegsOffCenter, (((pointDirection(screenCenter(), player.legs.object.position) % 360) + 360) % 360) / 57);
  player.legs.object.x = player.feet.object.x + tempLegsLengthdir.x;
  player.legs.object.y = player.feet.object.y + tempLegsLengthdir.y;

  var tempBodyOffCenter = player.torso.z * (Math.abs(pointDistance(screenCenter(), player.torso.parent.object.position))/100);
  var tempBodyLengthdir = lengthDir(tempBodyOffCenter, (((pointDirection(screenCenter(), player.torso.object.position) % 360) + 360) % 360) / 57);
  player.torso.object.x = player.legs.object.x + tempBodyLengthdir.x;
  player.torso.object.y = player.legs.object.y + tempBodyLengthdir.y;
  
  var tempHeadOffCenter = player.head.z * (Math.abs(pointDistance(screenCenter(), player.head.parent.object.position))/100);
  var tempHeadLengthdir = lengthDir(tempHeadOffCenter, (((pointDirection(screenCenter(), player.head.object.position) % 360) + 360) % 360) / 57);
  player.head.object.x = player.torso.object.x + tempHeadLengthdir.x; 
  player.head.object.y = player.torso.object.y + tempHeadLengthdir.y;

  player.feet.object.angle = currentLeanAngle; // TODO OWL 360 -> 180 forwards
  player.legs.object.angle = currentLeanAngle; 
  player.head.object.angle = currentLeanAngle; 
  
  if (!aiming) {
    if (player.torso.object.key !== 'torso-test-ss') {
      player.torso.object.loadTexture('torso-test-ss', 0, false);
    }
    player.torso.object.angle = currentLeanAngle;
    player.shadow.object.angle = currentLeanAngle;

  } else if(player == me){
    if (player.torso.object.key !== 'torso-throw-ss') {
      player.torso.object.loadTexture('torso-throw-ss', 0, true);
      var throwAnim = player.torso.object.animations.add('throw');
      throwAnim.enableUpdate = true;
      player.torso.object.animations.play('throw', 10, false);
    }
    var pointDir = pointDirection(aiming.target, player.torso.object.position);
    if  (pointDir < 0) {pointDir += 360};
    player.torso.object.angle = pointDir;
    player.shadow.object.angle = pointDir;
  }
  player.lastTickData = {
    x: player.shadow.object.x,
    y: player.shadow.object.y,
    reqLeanAngle: player.lastTickData.reqLeanAngle,
    leanAngle: currentLeanAngle
  };

  if (player == me) {
    me.head.object.angle = pointDirection(me.shadow.object.position, mouse.position); // TODO OWL 360 -> 180 forwards
    
    reticle.object.x = me.shadow.object.x;
    reticle.object.y = me.shadow.object.y;

    if (aiming) {
      reticle.object.angle = me.head.object.angle;
      if (reticle.xScale < 3) {
        reticle.xScale += 0.5 * delta;
        reticle.yScale += 0.25 * delta;
      }
    } else {
      reticle.xScale = 0;
      reticle.yScale = 0;
    }
    reticle.object.scale.setTo(reticle.xScale, reticle.yScale);
  }



}

obj_player.delete = function() {}