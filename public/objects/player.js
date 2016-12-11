var obj_player = {},
    players = [];

obj_player.create = function(data) {
  var legs = {z: 0, parent: null, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'legs-test-ss')},
      torso = {z: 5, parent: legs, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'torso-test-ss')},
      head = {z: 5, parent: torso, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'head-test-ss')};
      var legsAnim = legs.object.animations.add('walk');
      var torsoAnim = torso.object.animations.add('walk');
      var headAnim = head.object.animations.add('walk');
      legsAnim.enableUpdate = true;
      torsoAnim.enableUpdate = true;
      headAnim.enableUpdate = true;

  legs.object.anchor.setTo(0.5, 0.5);
  torso.object.anchor.setTo(0.5, 0.5);
  head.object.anchor.setTo(0.5, 0.5);
  var tempplayer = {
    id: data.socket,
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

  tempplayer.texts.healthtext = game.add.text(0, 0, "100", healthStyle);
  tempplayer.texts.healthtext.anchor.set(-0.5, 1.5);

  players.push(tempplayer);

}

obj_player.update = function(player) {
  if (player.legs.object) {
    if (player.playerinfo) {
      player.texts.healthtext.x = player.legs.object.x;
      player.texts.healthtext.y = player.legs.object.y;
      player.texts.healthtext.setText(player.playerinfo.health);
      
      if (player.playerinfo.up) {
        player.legs.object.y -= 2;
      }
      if (player.playerinfo.right) {
        player.legs.object.x += 2;
      }
      if (player.playerinfo.down) {
        player.legs.object.y += 2;
      }
      if (player.playerinfo.left) {
        player.legs.object.x -= 2;
      }
    }
  }
  
  var currentLeanAngle = player.lastTickData.leanAngle;

  if (player.legs.object.x !== player.lastTickData.x || player.legs.object.y !== player.lastTickData.y) {
    player.lastTickData.reqLeanAngle = pointDirection(player.legs.object.position, player.lastTickData);
    if  (player.lastTickData.reqLeanAngle < 0) {player.lastTickData.reqLeanAngle += 360};
    player.legs.object.animations.play('walk', 5, true);
    player.torso.object.animations.play('walk', 5, true);
    player.head.object.animations.play('walk', 5, true);
  
    var currentLeanAngle = player.lastTickData.leanAngle;
    if  (currentLeanAngle < 0) {currentLeanAngle += 360};
    
    if (currentLeanAngle - player.lastTickData.reqLeanAngle != 0) {
      if (Math.abs(currentLeanAngle - player.lastTickData.reqLeanAngle) < 180) {
          // Rotate current directly towards target.
          if (currentLeanAngle < player.lastTickData.reqLeanAngle) {currentLeanAngle +=5;}
          else {currentLeanAngle -= 5;}
      } else {
          // Rotate the other direction towards target.
          if (currentLeanAngle < player.lastTickData.reqLeanAngle) {currentLeanAngle -=5;}
          else {currentLeanAngle += 5;}
      }
    }
  } else {
    player.legs.object.animations.stop('walk');
    player.torso.object.animations.stop('walk');
    player.head.object.animations.stop('walk');
  }

  
  currentLeanAngle = ((currentLeanAngle % 360) + 360) % 360;

  player.legs.object.angle = currentLeanAngle;
  
  var tempBodyOffCenter = player.torso.z * (Math.abs(pointDistance(screenCenter(), player.torso.parent.object.position))/100);
  var tempBodyLengthdir = lengthDir(tempBodyOffCenter, (((pointDirection(screenCenter(), player.torso.object.position) % 360) + 360) % 360) / 57);
  player.torso.object.x = player.legs.object.x + tempBodyLengthdir.x;
  player.torso.object.y = player.legs.object.y + tempBodyLengthdir.y;
  
  var tempHeadOffCenter = player.head.z * (Math.abs(pointDistance(screenCenter(), player.head.parent.object.position))/100);
  var tempHeadLengthdir = lengthDir(tempHeadOffCenter, (((pointDirection(screenCenter(), player.head.object.position) % 360) + 360) % 360) / 57);
  player.head.object.x = player.torso.object.x + tempHeadLengthdir.x; 
  player.head.object.y = player.torso.object.y + tempHeadLengthdir.y;
  player.head.object.angle = currentLeanAngle; // TODO OWL 360 -> 180 forwards
  
  if (!aiming) {
    player.torso.object.angle = currentLeanAngle;
  } else if(player == me){
    var pointDir = pointDirection(aiming.target, player.torso.object.position);
    if  (pointDir < 0) {pointDir += 360};
    player.torso.object.angle = pointDir;
  }
  player.lastTickData = {
    x: player.legs.object.x,
    y: player.legs.object.y,
    reqLeanAngle: player.lastTickData.reqLeanAngle,
    leanAngle: currentLeanAngle
  };

  if (player == me) {
    me.head.object.angle = pointDirection(me.legs.object.position, mouse.position); // TODO OWL 360 -> 180 forwards
    
    reticle.object.x = me.legs.object.x;
    reticle.object.y = me.legs.object.y;

    if (aiming) {
      reticle.object.angle = me.head.object.angle;
      if (reticle.xScale < 3) {
        reticle.xScale += 0.1;
        reticle.yScale += 0.05;
      }
    } else {
      reticle.xScale = 0;
      reticle.yScale = 0;
    }
    reticle.object.scale.setTo(reticle.xScale, reticle.yScale);
  }



}

obj_player.delete = function() {}