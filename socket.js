var async = require('async');

//Socket
module.exports = function(app, io) {
  
  var messages = [];
  var sockets = [];
  var lobbies = [];
  
  io.on('connection', function (socket) {

    //New player
    //give player his/her id
    console.log('connection ###############################', sockets.length+1);

    sockets.push(socket);
    socket.kills = 0;
    socket.deaths = 0;

    io.to(socket.id).emit('welcome', socket.id);
    playerStageChange(socket.id, 'nameEntry');

    // INTRO & LOBBIES ############################################### LOBBIES


    socket.on('setName', function (name) {
      socket.name = String(name || 'Anonymous');
      updateRoster();
      playerStageChange(socket.id, 'gamesList');
    });

    socket.on('getLobbies', function () {
      io.to(socket.id).emit('lobbies', lobbies);
    });

    socket.on('createLobby', function () {
      var tempLobby = {
        id: socket.id,
        name: socket.name+'\'s lobby',
        players: [],
        hostid: null,
        playing: false,
        teams:{
          red: ['empty', 'empty', 'empty'],
          blue: ['empty', 'empty', 'empty']
        }
      }
      lobbies.push(tempLobby);
      broadcast('lobbies', lobbies);
      io.to(socket.id).emit('createdLobbyJoin', tempLobby.id);
    });

    socket.on('joinLobby', function (lobbyID) {
      var lobby = findLobby(lobbyID);
      lobby.players.push(socket.id);
      socket.lobbyID = lobbyID;
      lobby.host = lobby.players[0];

      playerStageChange(socket.id, 'gameLobby', lobby);
      broadcast('lobbies', lobbies);
    });

    socket.on('lobbyTakeSpot', function (lobbyID, teamName, spot) {
      if (spot > 2) return;

      var lobby = findLobby(lobbyID);
      var teams = ['red', 'blue'];
      for (var team in teams) {
        team = teams[team];
        for(var i=0;i<3;i++) {
          if(lobby.teams[team][i] == socket.id) {
            lobby.teams[team][i] = 'empty';
          }
        }
      }
      if (lobby.teams[teamName][spot] == 'empty') {
        lobby.teams[teamName][spot] = socket.id;
      }

      lobby.players.forEach(function (socketID) {
        playerStageChange(socketID, 'gameLobby', lobby);
      });
      //broadcast('lobbies', lobbies);
    });

    socket.on('lobbyLeave', function () {
      if (!socket.lobbyID) return;

      lobbyPlayerLeave(socket.id, socket.lobbyID)

    });

    socket.on('startGame', function () {
      if (!socket.lobbyID) return;

      var lobby = findLobby(socket.lobbyID);
      if (!lobby) return;

      if (socket.id == lobby.host) {
        lobby.players.forEach(function (tempSocketID) {
          io.to(tempSocketID).emit('startGame');
          playerStageChange(tempSocketID, 'game');
        });
      }

    });

    

    // GAME ############################################### GAME
    socket.on('getplayers', function () {
      if (!socket.lobbyID) return;
      if (socket.id == socket.lobbyID) {

        var lobby = findLobby(socket.lobbyID);
        if (!lobby) return;
        lobby.players.forEach(function (tempSocketID) {
          if (io.sockets.connected[tempSocketID]) {
            var data = io.sockets.connected[tempSocketID];
            io.to(tempSocketID).emit(
              'players', {
                socket: data.id,
                playerinfo: data.playerinfo,
                name:socket.name
            });
          }
        });
      }
    });

    socket.on('spawn', function (location) {
      if (!socket.lobbyID) return;

      socket.playerinfo = location;
      socket.playerinfo.up = false;
      socket.playerinfo.right = false;
      socket.playerinfo.down = false;
      socket.playerinfo.left = false;
      socket.playerinfo.health = 100;
      broadcastLobby(socket.lobbyID,
        'spawn', {
          socket: socket.id,
          playerinfo: socket.playerinfo,
          name: socket.name
        });
    });
    

    
    socket.on('keydown', function (msg) {
      if (!socket.lobbyID) return;

      if(socket.playerinfo) {
        switch(msg) {
          case 0: // up
            socket.playerinfo.up = true;
            break;
          case 1: // right
            socket.playerinfo.right = true;
            break;
          case 2: // down
            socket.playerinfo.down = true;
            break;
          case 3: // left
            socket.playerinfo.left = true;
            break;
          default:
            return;
        }
        broadcastLobby(socket.lobbyID,
          'keydown', {
            socket: socket.id,
            playerinfo: socket.playerinfo
          });
      } else {
        broadcastLobby(socket.lobbyID,
          'connection-lost', {
            socket: socket.id
          });
      }
    });
    
    socket.on('keyup', function (data) {
      if (!socket.lobbyID) return;

      if(socket.playerinfo) {
        switch(data.msg) {
          case 0: // up
            socket.playerinfo.up = false;
            setLocation(data.location);
            break;
          case 1: // right
            socket.playerinfo.right = false;
            setLocation(data.location);
            break;
          case 2: // down
            socket.playerinfo.down = false;
            setLocation(data.location);
            break;
          case 3: // left
            socket.playerinfo.left = false;
            setLocation(data.location);
            break;
          default:
            return;
        }
        function setLocation(location) {
          socket.playerinfo.x = location.x;
          socket.playerinfo.y = location.y;
        }
        broadcastLobby(socket.lobbyID,
          'keyup', {
            socket: socket.id,
            playerinfo: socket.playerinfo
          });
      } else {
        broadcastLobby(socket.lobbyID,
          'connection-lost', {
            socket: socket.id
          });
      }
    });
  
    socket.on('fire', function (data) {
      if (!socket.lobbyID) return;

      broadcastLobby(socket.lobbyID,
        'fire', {
          id: socket.id,
          toPos: data,
          spearId: data.spearId,
          distance: data.distance
        });
    });
    
    socket.on('spearhit', function (data) {
      if (!socket.lobbyID) return;

      if (socket.playerinfo) {
        socket.playerinfo.health -= data.distanceTraveled;
        
        broadcastLobby(socket.lobbyID,
          'spearhit', {
            id: socket.id,
            spearId: data.spearId,
            playerinfo: socket.playerinfo
          });
        
        if( JSON.parse(socket.playerinfo.health) <= 0) {

          broadcastLobby(socket.lobbyID,
            'death', {
              id: socket.id
            });

          async.map(sockets, function (socket) {
            if (socket.id == data.spearOwner){
              socket.kills +=1;
            }
          });
          socket.deaths +=1;

          broadcastLobby(socket.lobbyID,
            'kill', {
              by: data.spearOwner,
              victim: socket.id,
              with: 'spear'
            });

          updateRoster();

        }
      }
    });
  
    socket.on('respawn', function (data) {
      if (!socket.lobbyID) return;

      socket.playerinfo.health = 100;
      socket.playerinfo.x = data.x;
      socket.playerinfo.y = data.y;
      broadcast('respawn', {
        id: socket.id,
        playerinfo: socket.playerinfo});
    });
  
    socket.on('disconnect', function () {
      broadcast('player-dc', socket.id);
      lobbyPlayerLeave(socket.id, socket.lobbyID);
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });




    // MESSAGES ############################################### MESSAGES
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');
  
      if (!text)
        return;
      var name = socket.name;
      var data = {
        name: name,
        text: text
      };
      broadcast('message', data);
      messages.push(data);
    });

  });
  




  function updateRoster() {
    async.map(sockets, function (socket, callback) {
        if (socket){
          callback(null, {
            id: socket.id,
            name: socket.name,
            kills: socket.kills,
            deaths: socket.deaths
          });
        }
      },
      function (err, players) {
        broadcast('roster', players);
      }
    );
  }
  
  function playerStageChange(socketid, stageName, stageData) {
    //io.sockets.connected[socketid].currentState = stageName;
    io.to(socketid).emit('stageChange', stageName, stageData);
  }

  function broadcast(event, data) {
    sockets.forEach(function (socket) {
      socket.emit(event, data);
    });
  }

  function broadcastLobby(lobbyID, event, data) {
    var lobby = findLobby(lobbyID);
    if (!lobby) return;

    lobby.players.forEach(function (tempSocketID) {
      io.to(tempSocketID).emit(event, data);
    });
  }

  function findLobby(lobbyID) {
    for (var i = lobbies.length - 1; i >= 0; i--) {
      if (lobbies[i].id == lobbyID) {
        return lobbies[i];
      }
    }
  }

  function lobbyPlayerLeave(socketID, lobbyID) {
    var lobby = findLobby(lobbyID);
    if (!lobby) return;

    var teams = ['red', 'blue'];
    for (var team in teams) {
      team = teams[team];
      for(var i=0;i<3;i++) {
        if(lobby.teams[team][i] == socketID) {
          lobby.teams[team][i] = 'empty';
        }
      }
    }
    lobby.players.splice(lobby.players.indexOf(socketID), 1);
    playerStageChange(socketID, 'gamesList', lobby);
    
    lobby.players.forEach(function (tempSocketID) {
      playerStageChange(tempSocketID, 'gameLobby', lobby);
    });

    if (io.sockets.connected[socketID]) {
      io.sockets.connected[socketID].lobbyID = null;
    }
  }

};