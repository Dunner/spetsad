
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
    textureRegistry = {};

  var spears,
      fireRate = 1000,
      nextFire = 0,
      canvasElement = document.getElementById('spetsad-canvas');

  function preload() {
    game.stage.disableVisibilityChange = true;
    game.load.crossOrigin = 'anonymous';
    game.load.image('background','https://cdn.hyperdev.com/us-east-1%3A64100b6e-2389-4701-a46c-baf94d554863%2Fladda%20ned.png');
  }

  function create() {
    
    game.add.tileSprite(0, 0, 1920, 1920, 'background');
    game.stage.backgroundColor = '#787878';
    game.world.setBounds(0, 0, 2000, 1000);
    
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
      socket.emit('keyup', {msg:0, location:{x:me.object.x,y:me.object.y}});
    });
    //right
    rightKey.onDown.add(function() {
      socket.emit('keydown', 1);
    });
    rightKey.onUp.add(function() {
      socket.emit('keyup', {msg:1, location:{x:me.object.x,y:me.object.y}});
    });
    //down
    downKey.onDown.add(function() {
      socket.emit('keydown', 2);
    });
    downKey.onUp.add(function() {
      socket.emit('keyup', {msg:2, location:{x:me.object.x,y:me.object.y}});
    });
    //left
    leftKey.onDown.add(function() {
      socket.emit('keydown', 3);
    });
    leftKey.onUp.add(function() {
      socket.emit('keyup', {msg:3, location:{x:me.object.x,y:me.object.y}});
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
    
  }

  function update() {
  
    mouse.x = game.input.mousePointer.worldX;
    mouse.y = game.input.mousePointer.worldY;

    
    if (me) {
      me.object.angle = pointDirection(me.object, mouse);
    }
    
    for (var i = 0; i < players.length; i++) {
      var player = players[i],
          playerinfo = player.playerinfo;
      if (playerinfo) {
        player.texts.healthtext.x = player.object.x;
        player.texts.healthtext.y = player.object.y;
        player.texts.healthtext.setText(playerinfo.health);
        
        if (playerinfo.up) {
          player.object.y -= 2;
        }
        if (playerinfo.right) {
          player.object.x += 2;
        }
        if (playerinfo.down) {
          player.object.y += 2;
        }
        if (playerinfo.left) {
          player.object.x -= 2;
        }
      }
    }
    
    spears.forEach(function(item) {
      if(item.flytime > 50) {
        item.destroy();
      } else {
        item.flytime++;
        item.x += 5 * Math.cos(item.angle * Math.PI / 180);
        item.y += 5 * Math.sin(item.angle * Math.PI / 180);
        if (checkOverlap(me.object, item) &&
          me.id !== item.owner) {
          meHit(item);
          item.destroy();
        }
      }
    }, this);
    


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
      game.camera.follow(deathobj);
      setTimeout(function(){
        var tSpawn = randomSpawn();
        socket.emit('respawn', tSpawn);
      }, 3000);
    }
    
    tPlayer.object.x = 0;
    tPlayer.object.y = 0;
    
  });
  
  socket.on('respawn', function (data) {
    var tPlayer = findPlayer(data.id);
    tPlayer.playerinfo = data.playerinfo;
    tPlayer.object.x = data.playerinfo.x;
    tPlayer.object.y = data.playerinfo.y;
    if(tPlayer.id === me.id) {
      game.camera.follow(tPlayer.object);
    }
  });
  
  socket.on('mysocket', function (data) {
    mySocket = data;
    me = findPlayer(data);
    me.object.tint = RGBtoHEX(0,255,0);
    game.camera.follow(me.object);
  });
  
  socket.on('keydown', function (data) {
    var tempplayer = findPlayer(data.socket);
    tempplayer.playerinfo = data.playerinfo;
  });
  
  socket.on('keyup', function (data) {
    var tempplayer = findPlayer(data.socket);
    tempplayer.playerinfo = data.playerinfo;
    tempplayer.object.x = data.playerinfo.x;
    tempplayer.object.y = data.playerinfo.y;
  });
  
  socket.on('players', function (data) {
    if (data.socket !== mySocket) {
      if (!findPlayer(data.socket)) {
        spawnPlayer(data);
      }
    }
  });
  
  socket.on('fire', function (data) {
    var tempPlayer = findPlayer(data.id).object;
    var fromPos = {x: tempPlayer.x, y: tempPlayer.y};
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
    tempplayer.object.destroy();
  });

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
    var tempobj = game.add.sprite(data.playerinfo.x,data.playerinfo.y, createBlock(20, 20,'gray'));
    tempobj.anchor.setTo(0.5, 0.5);
    var tempplayer = {
      id: data.socket,
      object: tempobj,
      texts: [],
      playerinfo: data.playerinfo
    };
    tempplayer.texts.healthtext = game.add.text(0, 0, "100", healthStyle);
    tempplayer.texts.healthtext.anchor.set(0.5, 1);
    players.push(tempplayer);
  }

  function randomId(prepend) {
    return prepend + Math.random().toString(36).substr(2, 9);
  }

  function randomSpawn() {
    return {
      x: 960 + (Math.floor(Math.random() * 300) + 1),
      y: 320 + (Math.floor(Math.random() * 320) + 1)
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
  
  function pointDirection(object1, object2) {
    // Returns angle between two vectors
    return Math.atan2(object2.y - object1.y, object2.x - object1.x) * 180 / Math.PI;
  }

  function RGBtoHEX(r, g, b) {
  	return r << 16 | g << 8 | b;
  }

  /*jshint validthis:true */
  var game;
  game = new Phaser.Game(canvasElement.offsetWidth, canvasElement.offsetHeight, Phaser.AUTO, 'spetsad-canvas', {preload: preload, create: create, update: update});
  
},500);