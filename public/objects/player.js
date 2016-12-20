var obj_player = {},
    players = [],
    me;

obj_player.create = function(data) {

  var shadow = {parent: null, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'torso-test-ss')},
      feet = {parent: shadow, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'feet-test-ss')},
      legs = {parent: feet, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'legs-test-ss')},
      arms = {parent: legs, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'arms-test-ss')},
      torso = {parent: legs, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'torso-test-ss')},
      head = {parent: torso, object:game.add.image(data.playerinfo.x,data.playerinfo.y, 'head-test-ss')};

  shadow.object.depth = 0;
  feet.object.depth = 1;
  legs.object.depth = 3;
  arms.object.depth = 4;
  torso.object.depth = 5;
  head.object.depth = 6;

  var shadowAnim = shadow.object.animations.add('walk');
  var feetAnim = feet.object.animations.add('walk');
  var legsAnim = legs.object.animations.add('walk');
  var armsAnim = arms.object.animations.add('walk');
  var torsoAnim = torso.object.animations.add('walk');
  var armsThrowAnim = arms.object.animations.add('walk');
  var headAnim = head.object.animations.add('walk');

  shadowAnim.enableUpdate = true;
  feetAnim.enableUpdate = true;
  legsAnim.enableUpdate = true;
  armsAnim.enableUpdate = true;
  torsoAnim.enableUpdate = true;
  headAnim.enableUpdate = true;

  shadow.object.anchor.setTo(0.5, 0.5);
  feet.object.anchor.setTo(0.5, 0.5);
  legs.object.anchor.setTo(0.5, 0.5);
  arms.object.anchor.setTo(0.5, 0.5);
  torso.object.anchor.setTo(0.5, 0.5);
  head.object.anchor.setTo(0.5, 0.5);

  var tempplayer = {
    name: data.name,
    team: data.team,
    id: data.socket,
    alive: true,
    shadow: shadow,
    feet: feet,
    legs: legs,
    arms: arms,
    torso: torso,
    head: head,
    spears: 0,
    currentWeapon: 'axe',
    weapons: {
      spear: {
        canUse: true,
        amount: 5
      },
      axe: {
        canUse: true
      },
      torch: {
        canUse: true,
        amount: 80
      },
    },
    texts: [],
    playerinfo: data.playerinfo,
    lastTickData: {
      leanAngle: 0,
      reqLeanAngle: 0
    }
  };

  groups.allObjects.add(tempplayer.shadow.object);
  groups.allObjects.add(tempplayer.feet.object);
  groups.allObjects.add(tempplayer.legs.object);
  groups.allObjects.add(tempplayer.arms.object);
  groups.allObjects.add(tempplayer.torso.object);
  groups.allObjects.add(tempplayer.head.object);


  tempplayer.texts.nameplate = game.add.text(0, 0, tempplayer.name, healthStyle);
  tempplayer.texts.nameplate.anchor.set(0.5, -1);

  tempplayer.texts.healthtext = game.add.text(0, 0, "100", healthStyle);
  tempplayer.texts.healthtext.anchor.set(1, 1.5);


  players.push(tempplayer);

}

obj_player.update = function(player) {
  me = findPlayer(mySocketID);
  UIWeapons(me);

  if (!player.alive) return;
  if (player.shadow.object) {
    if (player.playerinfo) {

      player.texts.nameplate.position = player.shadow.object.position;
      player.texts.nameplate.setText(player.name);
      player.texts.healthtext.position = player.shadow.object.position;
      player.texts.healthtext.setText(Math.round(player.playerinfo.health));

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

    if (player == me && cameraAnimation !== 'zoomIn') {game.camera.zoomTo(1.2,500,'zoomIn')}
    

    player.lastTickData.reqLeanAngle = pointDirection(player.shadow.object.position, player.lastTickData);
    if  (player.lastTickData.reqLeanAngle < 0) {player.lastTickData.reqLeanAngle += 360};
    
    player.shadow.object.animations.play('walk', 7, true);
    player.feet.object.animations.play('walk', 7, true);
    player.legs.object.animations.play('walk', 7, true);
    player.torso.object.animations.play('walk', 7, true);
    if (player.arms.object.key == 'arms-test-ss') {
      player.arms.object.animations.play('walk', 7, true);
    }
    player.head.object.animations.play('walk', 7, true);
  
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

    if (player == me && cameraAnimation !== 'zoomOut') {game.camera.zoomTo(1.0,500,'zoomOut')}

    player.shadow.object.animations.stop('walk');
    player.feet.object.animations.stop('walk');
    player.legs.object.animations.stop('walk');
    if (player.arms.object.key == 'arms-test-ss') {
      player.arms.object.animations.stop('walk');
    }
    player.torso.object.animations.stop('walk');
    player.head.object.animations.stop('walk');
  }

  
  currentLeanAngle = ((currentLeanAngle % 360) + 360) % 360;

  player.shadow.object.tint = 'black';
  player.shadow.object.alpha = 0.4;

  function atMost(number, value) {
    //limits range between -number and +number
    if (value > number) value = number;
    if (value < -number) value = -number;
    return value;
  }

  var tempFeetOffCenter = player.feet.object.depth * (Math.abs(pointDistance(game.camera.center(), player.feet.parent.object.position))/100);
  var tempFeetLengthdir = lengthDir(tempFeetOffCenter, (((pointDirection(game.camera.center(), player.feet.object.position) % 360) + 360) % 360) / 57);
  player.feet.object.x = player.shadow.object.x + atMost(8, tempFeetLengthdir.x);
  player.feet.object.y = player.shadow.object.y + atMost(8, tempFeetLengthdir.y);
  
  var tempLegsOffCenter = player.legs.object.depth * (Math.abs(pointDistance(game.camera.center(), player.legs.parent.object.position))/100);
  var tempLegsLengthdir = lengthDir(tempLegsOffCenter, (((pointDirection(game.camera.center(), player.legs.object.position) % 360) + 360) % 360) / 57);
  player.legs.object.x = player.feet.object.x + atMost(8, tempLegsLengthdir.x);
  player.legs.object.y = player.feet.object.y + atMost(8, tempLegsLengthdir.y);
  

  var tempBodyOffCenter = player.torso.object.depth * (Math.abs(pointDistance(game.camera.center(), player.torso.parent.object.position))/100);
  var tempBodyLengthdir = lengthDir(tempBodyOffCenter, (((pointDirection(game.camera.center(), player.torso.object.position) % 360) + 360) % 360) / 57);
  player.torso.object.x = player.legs.object.x + atMost(8, tempBodyLengthdir.x);
  player.torso.object.y = player.legs.object.y + atMost(8, tempBodyLengthdir.y);
  
  // player.arms.object.position = player.torso.object.position;

  var tempArmsOffCenter = player.arms.object.depth * (Math.abs(pointDistance(game.camera.center(), player.arms.parent.object.position))/100);
  var tempArmsLengthdir = lengthDir(tempArmsOffCenter, (((pointDirection(game.camera.center(), player.arms.object.position) % 360) + 360) % 360) / 57);
  player.arms.object.x = player.legs.object.x + atMost(8, tempArmsLengthdir.x);
  player.arms.object.y = player.legs.object.y + atMost(8, tempArmsLengthdir.y);

  var tempHeadOffCenter = player.head.object.depth * (Math.abs(pointDistance(game.camera.center(), player.head.parent.object.position))/100);
  var tempHeadLengthdir = lengthDir(tempHeadOffCenter, (((pointDirection(game.camera.center(), player.head.object.position) % 360) + 360) % 360) / 57);
  player.head.object.x = player.torso.object.x + atMost(8, tempHeadLengthdir.x); 
  player.head.object.y = player.torso.object.y + atMost(8, tempHeadLengthdir.y);

  player.feet.object.angle = currentLeanAngle; // TODO OWL 360 -> 180 forwards
  player.legs.object.angle = currentLeanAngle; 
  player.head.object.angle = currentLeanAngle; 
  
  player.lastTickData = {
    x: player.shadow.object.x,
    y: player.shadow.object.y,
    reqLeanAngle: player.lastTickData.reqLeanAngle,
    leanAngle: currentLeanAngle
  };

  if (player == me) {
    if (holdClick) {
      if (player.arms.object.key !== 'arms-throw-ss') {
        player.arms.object.loadTexture('arms-throw-ss', 0, true);
        var throwAnim = player.arms.object.animations.add('throw');
        throwAnim.enableUpdate = true;
        player.arms.object.animations.play('throw', 12, false);
      }
      var pointDir = pointDirection(mouse.position, player.torso.object.position);
      if  (pointDir < 0) {pointDir += 360};
      player.arms.object.angle = pointDir;
      player.torso.object.angle = pointDir;
      player.shadow.object.angle = pointDir;
      player.head.object.angle = pointDirection(player.shadow.object.position, mouse.position)+180; // TODO OWL 360 -> 180 forwards
      reticle.object.angle = me.head.object.angle-180;

      if (reticle.xScale < 3) {
        reticle.xScale += 0.5 * delta;
        reticle.yScale += 0.25 * delta;
      }
    } else {
      walk();
      reticle.xScale = 0;
      reticle.yScale = 0;
    }
    reticle.object.x = me.shadow.object.x;
    reticle.object.y = me.shadow.object.y;
  } else { //not me
    walk();

  }

  function walk() {
    if (player.arms.object.key !== 'arms-test-ss') {
      player.arms.object.loadTexture('arms-test-ss', 0, false);
    }
    player.arms.object.angle = currentLeanAngle;
    player.torso.object.angle = currentLeanAngle;
    player.shadow.object.angle = currentLeanAngle;

  }

  reticle.object.scale.setTo(reticle.xScale, reticle.yScale);


}

obj_player.delete = function() {

}

obj_player.dead = function(player) {
  player.alive = false;

  player.texts.nameplate.setText('');
  player.texts.healthtext.setText('');

  player.shadow.object.alpha = 0;
  player.feet.object.alpha = 0;
  player.legs.object.alpha = 0;
  player.arms.object.alpha = 0;
  player.torso.object.alpha = 0;
  player.head.object.alpha = 0;

  var deathobj = game.add.image(player.playerinfo.x,player.playerinfo.y, createBlock(20, 20,'red'));
  deathobj.anchor.setTo(0.5, 0.5);
  
  var deathtime = game.add.text(0, 0, "3", healthStyle);
  deathtime.anchor.set(0.5, 0.5);
  deathtime.x = deathobj.x;
  deathtime.y = deathobj.y;
  setTimeout(function(){
    deathtime.setText('2');
  }, 1000);
  setTimeout(function(){
    deathtime.setText('1');
  }, 2000);
  setTimeout(function(){
    deathtime.destroy();
    deathobj.destroy();
  }, 3000);

  if (player.id === me.id) {
    //move cameraObj to deathobj  
    setTimeout(function(){
      var tSpawn = randomSpawnLocation(
        spawns[me.team].x,
        spawns[me.team].y,
        80 //randomradius
      );
      socket.emit('respawn', tSpawn);
    }, 3000);
  }
}

obj_player.changeWeapon = function(weaponName) {
  if (me.weapons[weaponName].canUse) {
    me.currentWeapon = weaponName;
  }
  console.log(me.currentWeapon);
}