  var mySocketID;

  socket.on('welcome', function (socketid) {
    mySocketID = socketid;
  });

  socket.on('lobbies', function (lobbies) {
    printLobbies(lobbies);
  });

  socket.on('stageChange', function (stageName, stageData) {
    stageChange(stageName, stageData);
  });

  socket.on('createdLobbyJoin', function (lobbyID) {
    socket.emit('joinLobby', lobbyID);
  });
  


  socket.on('spawn', function (data) {
    obj_player.create(data);
  });

  socket.on('death', function (data) {
    var player = findPlayer(data.id);
    obj_player.dead(player);
  });
  
  socket.on('respawn', function (data) {
    var player = findPlayer(data.id);
    player.alive = true;
    player.playerinfo = data.playerinfo;
    player.shadow.object.x = data.playerinfo.x;
    player.shadow.object.y = data.playerinfo.y;
    player.shadow.object.alpha = 1;
    player.feet.object.alpha = 1;
    player.legs.object.alpha = 1;
    player.torso.object.alpha = 1;
    player.arms.object.alpha = 1;
    player.head.object.alpha = 1;
  });
  
  socket.on('keydown', function (data) {
    var player = findPlayer(data.socket);
    if (player.alive) {
      player.playerinfo = data.playerinfo;
    }
  });
  
  socket.on('keyup', function (data) {
    var player = findPlayer(data.socket);
    if (player.alive) {
      player.playerinfo = data.playerinfo;
      player.shadow.object.x = data.playerinfo.x;
      player.shadow.object.y = data.playerinfo.y;
    }
  });
  
  socket.on('players', function (data) {
    if (data.socket !== mySocketID) {
      if (!findPlayer(data.socket)) {
        obj_player.create(data);
      }
    }
  });
  
  socket.on('fire', function (data) {
    var player = findPlayer(data.id);
    if (player.alive) {
      var fromPos = {x: player.shadow.object.x, y: player.shadow.object.y};
      var toPos = data.toPos;
      var owner = data.id;
      obj_spear.create(owner, fromPos, toPos, data.spearId, data.distance);
    }
  });

  socket.on('spearHit', function (data) {
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

  socket.on('towerAttack', function (data) {
    obj_tower_spear.create(data)
  });
  
  socket.on('towerSpearHit', function (data) {
    findPlayer(data.targetID).playerinfo = data.targetinfo;
    obj_tower_spear.delete(data.spearID)
  });
  

  socket.on('mapUpdate', function (data) {
    if (!lobby) return;

    data.forEach(function(newItem){
      (lobby.mapData[newItem.type]).forEach(function(mapTreeObject){
        if (mapTreeObject.id == newItem.id) {
          mapTreeObject = newItem.item;
          // obj_pinetree.redraw(newItem.id, mapTreeObject);

          if (newItem.type == 'trees') {
            if (newItem.item.hitpoints > 0) {
              obj_pinetree.shake(newItem.id);
            }else {
              obj_pinetree.topple(newItem.id);
            }

          }
        }
      });
    });
    
  });

  socket.on('createLog', function(log) {
    obj_log.create(log);
  });

  socket.on('roster', function (players) {
    for (var i = 0; i < players.length; i++) {
      var player = findPlayer(players[i].socket);
      if (player) {
        player.name = players[i].name;
      }
    }
  });

  socket.on('player-dc', function (socket) {
    var tempplayer = findPlayer(socket);
    if (!tempplayer) return;

    for (var key in tempplayer.texts) {
      var text = tempplayer.texts[key];
      text.destroy();
    }
    tempplayer.shadow.object.destroy();
    tempplayer.feet.object.destroy();
    tempplayer.legs.object.destroy();
    tempplayer.torso.object.destroy();
    tempplayer.head.object.destroy();
  });

  socket.on('connection-lost', function (socket) {
    windows.location.reload();
    stageChange('gamesList');
  });