  var mySocket,
      me;

  socket.on('spawn', function (data) {
    obj_player.create(data);
  });

  
  socket.on('death', function (data) {
    var tPlayer = findPlayer(data.id);
    var deathobj = game.add.image(tPlayer.playerinfo.x,tPlayer.playerinfo.y, createBlock(20, 20,'red'));
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
        var tSpawn = randomSpawnLocation();
        socket.emit('respawn', tSpawn);
      }, 3000);
    }
    
  });
  
  socket.on('respawn', function (data) {
    var tPlayer = findPlayer(data.id);
    tPlayer.playerinfo = data.playerinfo;
    tPlayer.legs.object.x = data.playerinfo.x;
    tPlayer.legs.object.y = data.playerinfo.y;
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
        obj_player.create(data);
      }
    }
  });
  
  socket.on('fire', function (data) {
    var tempPlayer = findPlayer(data.id);
    var fromPos = {x: tempPlayer.legs.object.x, y: tempPlayer.legs.object.y};
    var toPos = data.toPos;
    var owner = data.id;
    obj_spear.create(owner, fromPos, toPos, data.spearId, data.distance);
  });
  
  socket.on('spearhit', function (data) {

    for (var i =0; i < spears.length; i++) {
      var spear = spears[i];
      if (spear.id === data.spearId) {
        spears.splice(i,1);
        findPlayer(data.id).playerinfo = data.playerinfo;
        spear.object.destroy();
        spear.shadow.destroy();
        break;
      }
    }


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