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

  socket.on('creepSpawn', function (data) {
    for(var key in data) { //key is team e.x. 'red' && 'blue'
      data[key].forEach(function(creep){
        if (!findCreep(creep.id)) {
          obj_creep.create(creep);
        }
      });
    }
  });

  socket.on('creepAction', function (data) {
    var creep = findCreep(data.id);
    if (creep) {
      creep.x = data.x;
      creep.y = data.y;

      creep.shadow.x = creep.x;
      creep.shadow.y = creep.y;
    
      creep.action = data.action;
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
    findPlayer(data.id).playerinfo = data.playerinfo;
    obj_spear.delete(data.spearID);
  });

  socket.on('towerAttack', function (data) {
    obj_tower_spear.create(data)
  });
  
  socket.on('towerSpearHit', function (data) {
    findPlayer(data.targetID).playerinfo = data.targetinfo;
    obj_tower_spear.delete(data.spearID)
  });
  
  socket.on('towerDamage', function (data) {

    for (var i = 0; i < towers.length; i++) {
      if (towers[i].id == data.towerID) {
        towers[i].health = data.health;
        console.log(towers[i])
      }
    };
  });

  socket.on('baseUpdate', function (data) {
    if (!lobby) return;
    lobby.teams[data.team].base = data.baseInfo;
  });

  socket.on('resourceDestroy', function (data) {
    if (data.type == 'logs') {
      obj_log.delete(data.resourceID);
    }
    // for(var i = 0; i<window[data.type].length; i++) {
    //   var resource = window[data.type][i];
    //   if (resource.id == data.resourceID) {
    //     window[data.type][i].splice(i,1);

    //   }
    // }

  });

  socket.on('mapUpdate', function (data) {
    if (!lobby) return;

    data.forEach(function(newItem){
      for(var i = 0; i < lobby.mapData[newItem.type].length; i++) {
        var mapObject = lobby.mapData[newItem.type][i];
        if (mapObject.id == newItem.id) {
          lobby.mapData[newItem.type][i] = newItem.item; // set

          if (newItem.type == 'logs') {
            obj_log.changeStatus(newItem.id, newItem.item);
          }
          if (newItem.type == 'trees') {
            if (newItem.item.hitpoints > 0) {
              obj_pinetree.shake(newItem.id);
            }else {
              obj_pinetree.topple(newItem.id);
            }

          }
        }
      };
    });
    
  });

  socket.on('createLogs', function(logs) {
    if (!lobby) return;
    setTimeout(function(){
      logs.forEach(function(log){
        (lobby.mapData['logs']).push(log);
        obj_log.create(log);
      });
    },4000);
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