
var socket = window.socket = io.connect();

setTimeout(function(){
  
  var players = [],
    me,
    mouse,
    upKey,
    downKey,
    leftKey,
    rightKey,
    fireKey,
    mySocket,
    healthStyle,
    textureRegistry = {},
    obstacles = [],
    cameraObject = {};

  var spears,
      fireRate = 1000,
      nextFire = 0,
      canvasElement = document.getElementById('spetsad-canvas');

  function preload() {
    game.stage.disableVisibilityChange = true;
    game.load.crossOrigin = 'anonymous';
    game.load.image('background','https://cdn.hyperdev.com/us-east-1%3A64100b6e-2389-4701-a46c-baf94d554863%2Fladda%20ned.png');
    game.load.spritesheet('legs-test-ss', 'assets/sprites/legs-test-ss.png', 32, 32, 4);
    game.load.spritesheet('torso-test-ss', 'assets/sprites/torso-test-ss.png', 32, 32, 4);
    game.load.spritesheet('head-test-ss', 'assets/sprites/head-test-ss.png', 32, 32, 1);
  }

  function create() {

    game.add.tileSprite(0, 0, 1920, 1920, 'background');
    game.stage.backgroundColor = '#787878';
    game.world.setBounds(0, 0, 1920, 1920);
    
    healthStyle = { font: "18px Arial", fill: "#fff", align: "left" };
    
    spears = game.add.group();
    spears.setAll('checkWorldBounds', true);
    spears.setAll('outOfBoundsKill', true);
  
    socket.emit('spawn', randomSpawn());
    socket.emit('getplayers');
    
    mouse = game.add.sprite(game.input.mousePointer.x,game.input.mousePointer.y, createBlock(1, 1,'red'));
    mouse.anchor.setTo(0.5, 0.5);
    
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    fireKey = game.input.activePointer.leftButton;
    
    //up
    upKey.onDown.add(function() {
      socket.emit('keydown', 0);
    });
    upKey.onUp.add(function() {
      socket.emit('keyup', {msg:0, location:{x:me.legs.object.x,y:me.legs.object.y}});
    });
    //right
    rightKey.onDown.add(function() {
      socket.emit('keydown', 1);
    });
    rightKey.onUp.add(function() {
      socket.emit('keyup', {msg:1, location:{x:me.legs.object.x,y:me.legs.object.y}});
    });
    //down
    downKey.onDown.add(function() {
      socket.emit('keydown', 2);
    });
    downKey.onUp.add(function() {
      socket.emit('keyup', {msg:2, location:{x:me.legs.object.x,y:me.legs.object.y}});
    });
    //left
    leftKey.onDown.add(function() {
      socket.emit('keydown', 3);
    });
    leftKey.onUp.add(function() {
      socket.emit('keyup', {msg:3, location:{x:me.legs.object.x,y:me.legs.object.y}});
    });
    
    //Fire
    fireKey.onDown.add(function() {
      if (canFire()) {
        var spearId = randomId('spear');
        socket.emit('fire', {
          x: mouse.x,
          y: mouse.y,
          spearId: spearId
        });
      }
    });

    createObstacle({
      x: 800,
      y: 800,
      diameter: 40,
      color: 'white'
    })
    
    createObstacle({
      x: 840,
      y: 800,
      diameter: 40,
      color: 'white'
    })
    
    createCamera();
    
  }

  function update() {
  
    mouse.x = game.input.mousePointer.worldX;
    mouse.y = game.input.mousePointer.worldY;
    
    for (var i = 0; i < players.length; i++) {
      var player = players[i],
          playerinfo = player.playerinfo;

      if (player.legs.object) {
        if (playerinfo) {
          player.texts.healthtext.x = player.legs.object.x;
          player.texts.healthtext.y = player.legs.object.y;
          player.texts.healthtext.setText(playerinfo.health);
          
          if (playerinfo.up) {
            player.legs.object.y -= 2;
          }
          if (playerinfo.right) {
            player.legs.object.x += 2;
          }
          if (playerinfo.down) {
            player.legs.object.y += 2;
          }
          if (playerinfo.left) {
            player.legs.object.x -= 2;
          }
        }
      }
      

      if (player.legs.object.x !== player.lastTickData.x || player.legs.object.y !== player.lastTickData.y) {
        player.lastTickData.reqLeanAngle = pointDirection(player.legs.object.position, player.lastTickData);
        if  (player.lastTickData.reqLeanAngle < 0) {player.lastTickData.reqLeanAngle += 360};
        player.legs.object.animations.play('walk', 5, true);
        player.torso.object.animations.play('walk', 5, true);
        player.head.object.animations.play('walk', 5, true);
      } else {
        player.legs.object.animations.stop('walk');
        player.torso.object.animations.stop('walk');
        player.head.object.animations.stop('walk');
      }
      
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
      
      currentLeanAngle = ((currentLeanAngle % 360) + 360) % 360;
      
      var tempBodyOffCenter = player.torso.z * (Math.abs(pointDistance(screenCenter(), player.torso.parent.object.position))/100);
      var tempBodyLengthdir = lengthDir(tempBodyOffCenter, (((pointDirection(screenCenter(), player.torso.object.position) % 360) + 360) % 360) / 57);
      player.torso.object.x = player.legs.object.x + tempBodyLengthdir.x;
      player.torso.object.y = player.legs.object.y + tempBodyLengthdir.y;
      player.torso.object.angle = currentLeanAngle;
      
      var tempHeadOffCenter = player.head.z * (Math.abs(pointDistance(screenCenter(), player.head.parent.object.position))/100);
      var tempHeadLengthdir = lengthDir(tempHeadOffCenter, (((pointDirection(screenCenter(), player.head.object.position) % 360) + 360) % 360) / 57);
      player.head.object.x = player.torso.object.x + tempHeadLengthdir.x; 
      player.head.object.y = player.torso.object.y + tempHeadLengthdir.y;
      player.head.object.angle = currentLeanAngle; // TODO OWL 360 -> 180 forwards
      
      player.legs.object.angle = currentLeanAngle;
      
      
      player.lastTickData = {
        x: player.legs.object.x,
        y: player.legs.object.y,
        reqLeanAngle: player.lastTickData.reqLeanAngle,
        leanAngle: currentLeanAngle
      };
      
      // ###### Obstacles 
      for(var obstacle in obstacles) {
        obstacle = obstacles[obstacle];
        var pointDir = pointDirection(screenCenter(), obstacle.foot.object.position);
        if  (pointDir < 0) {pointDir += 360};
        
        var tempRoofOffCenter = obstacle.roof.z * (Math.abs(pointDistance(screenCenter(), obstacle.foot.object.position))/100);
        var tempRoofLengthdir = lengthDir(tempRoofOffCenter, pointDir / 57);
        obstacle.roof.object.x = obstacle.foot.object.x + tempRoofLengthdir.x;
        obstacle.roof.object.y = obstacle.foot.object.y + tempRoofLengthdir.y;
      }

      if (player == me) {
      
        // ###### Camera 
        if (cameraObject.object.x < player.legs.object.x) {
          cameraObject.object.x += Math.abs(cameraObject.object.x - player.legs.object.x)/50
        }
        if (cameraObject.object.x > player.legs.object.x) {
          cameraObject.object.x -= Math.abs(cameraObject.object.x - player.legs.object.x)/50
        }
        
        if (cameraObject.object.y < player.legs.object.y) {
          cameraObject.object.y += Math.abs(cameraObject.object.y - player.legs.object.y)/50
        }
        if (cameraObject.object.y > player.legs.object.y) {
          cameraObject.object.y -= Math.abs(cameraObject.object.y - player.legs.object.y)/50
        }

        player.head.object.angle = pointDirection(player.legs.object.position, mouse.position); // TODO OWL 360 -> 180 forwards
        game.camera.follow(cameraObject.object);

      }


      spears.forEach(function(item) {
        if(item.flytime > 50) {
          item.destroy();
        } else {
          item.flytime++;
          item.x += 5 * Math.cos(item.angle * Math.PI / 180);
          item.y += 5 * Math.sin(item.angle * Math.PI / 180);
          if (checkOverlap(me.legs.object, item) &&
            me.id !== item.owner) {
            meHit(item);
            item.destroy();
          }
        }
      }, this);

    }

  }

  socket.on('spawn', function (data) {
    spawnPlayer(data);
  });

  
  socket.on('death', function (data) {
    var tPlayer = findPlayer(data.id);
    var deathobj = game.add.sprite(tPlayer.playerinfo.x,tPlayer.playerinfo.y, createBlock(20, 20,'red'));
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
  
    if (tPlayer.id === me.id) {
      //move cameraObj to deathobj
      setTimeout(function(){
        var tSpawn = randomSpawn();
        socket.emit('respawn', tSpawn);
      }, 3000);
    }
    
    tPlayer.legs.object.x = 0;
    tPlayer.legs.object.y = 0;
    
  });
  
  socket.on('respawn', function (data) {
    var tPlayer = findPlayer(data.id);
    tPlayer.playerinfo = data.playerinfo;
    tPlayer.legs.object.x = data.playerinfo.x;
    tPlayer.legs.object.y = data.playerinfo.y;
    if(tPlayer.id === me.id) {
      game.camera.follow(tPlayer.legs.object);
    }
  });
  
  socket.on('mysocket', function (data) {
    mySocket = data;
    me = findPlayer(data);
    //me.torso.object.tint = RGBtoHEX(0,255,0);
  });
  
  socket.on('keydown', function (data) {
    var tempplayer = findPlayer(data.socket);
    tempplayer.playerinfo = data.playerinfo;
  });
  
  socket.on('keyup', function (data) {
    var tempplayer = findPlayer(data.socket);
    tempplayer.playerinfo = data.playerinfo;
    tempplayer.legs.object.x = data.playerinfo.x;
    tempplayer.legs.object.y = data.playerinfo.y;
  });
  
  socket.on('players', function (data) {
    if (data.socket !== mySocket) {
      if (!findPlayer(data.socket)) {
        spawnPlayer(data);
      }
    }
  });
  
  socket.on('fire', function (data) {
    var tempPlayer = findPlayer(data.id);
    var fromPos = {x: tempPlayer.legs.object.x, y: tempPlayer.legs.object.y};
    var toPos = data.toPos;
    var owner = data.id;
    fire(owner, fromPos, toPos, data.spearId);
  });
  
  socket.on('spearhit', function (data) {
    spears.forEach(function(item) {
      if(item.id === data.spearId) {
        item.flytime=50;
        findPlayer(data.id).playerinfo = data.playerinfo;
      }
    }, this);
  });
  
  socket.on('player-dc', function (socket) {
    var tempplayer = findPlayer(socket);
    for (var key in tempplayer.texts) {
      var text = tempplayer.texts[key];
      text.destroy();
    }
    tempplayer.legs.object.destroy();
    tempplayer.torso.object.destroy();
    tempplayer.head.object.destroy();
  });

  function createCamera() {
    cameraObject.object = game.add.sprite(0,0, createBlock(0, 0,'#000'));
    cameraObject.object.anchor.setTo(0.5, 0.5);
  }
  
  function createObstacle(data) {
    var tempObstacle = {};
    tempObstacle.foot = {z: 0, object: game.add.sprite(data.x,data.y, createBlock(data.diameter, data.diameter,'#000'))};
    tempObstacle.roof = {z: 5, object: game.add.sprite(data.x,data.y, createBlock(data.diameter, data.diameter,data.color))};
    tempObstacle.data = data;
    tempObstacle.foot.object.anchor.setTo(0.5, 0.5);
    tempObstacle.roof.object.anchor.setTo(0.5, 0.5);
    obstacles.push(tempObstacle);
  }

  function canFire(){
    if (game.time.now > nextFire) {
      nextFire = game.time.now + fireRate;
      return true;
    } else {
      return false;
    }
  }
  
  function fire(owner, fromPos, toPos, id) {
    var spear = game.add.sprite(fromPos.x,fromPos.y, createBlock(28, 4,'brown'));
    spear.id = id;
    spear.angle = pointDirection(fromPos, toPos);
    spear.flytime = 0;
    spear.owner = owner;
    spears.add(spear);
  }
  
  function meHit(spear) {
    socket.emit('spearhit', {spearId: spear.id, flytime: spear.flytime});
    me.playerinfo.health -= spear.flytime;
  }
  
  function spawnPlayer(data) {
    var legs = {z: 0, parent: null, object:game.add.sprite(data.playerinfo.x,data.playerinfo.y, 'legs-test-ss')},
        torso = {z: 5, parent: legs, object:game.add.sprite(data.playerinfo.x,data.playerinfo.y, 'torso-test-ss')},
        head = {z: 5, parent: torso, object:game.add.sprite(data.playerinfo.x,data.playerinfo.y, 'head-test-ss')};
    
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

  function randomId(prepend) {
    return prepend + Math.random().toString(36).substr(2, 9);
  }

  function randomSpawn() {
    return {
      x: 350 + (Math.floor(Math.random() * 300) + 1),
      y: 550 + (Math.floor(Math.random() * 320) + 1)
    };
  }

  function findPlayer(id) {
    for (var i = 0; i < players.length; i++) {
      if (players[i].id === id) {
        return players[i];
      }
    }
    return false;
  }
  
  function createBlock(x, y, color) {
    var name = x + '_' + color;
    if(textureRegistry[name]) {
      return textureRegistry[name];
    }

    var bmd = game.add.bitmapData(x, y);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fillRect(0,0, x, y);
    textureRegistry[name] = bmd;
    return bmd;
  }
  
  function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
  }

  function screenCenter() {
    return {
      x: game.camera.width / 2 + game.camera.x,
      y: game.camera.height / 2 + game.camera.y,
    }
  }
  
  function pointDirection(object1, object2) {
    // Returns angle between two vectors
    return Math.atan2(object2.y - object1.y, object2.x - object1.x) * 180 / Math.PI;
  }
  
  function pointDistance(pointA, pointB) {
    //Returns Distance between two points
    //pythagoras squareRoot(a*a + b*b = c*c) = c
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)); 
  }
  
  function lengthDir(length, direction) { //vector, magnitude
    if (direction < 0) direction += 360;

    return {
      x: length*Math.cos(direction),
      y: length*Math.sin(direction)
    }
  }

  function RGBtoHEX(r, g, b) {
  	return r << 16 | g << 8 | b;
  }

  /*jshint validthis:true */
  var game;
  game = new Phaser.Game(canvasElement.offsetWidth, canvasElement.offsetHeight, Phaser.AUTO, 'spetsad-canvas', {preload: preload, create: create, update: update});
  
},500);