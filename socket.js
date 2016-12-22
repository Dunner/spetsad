var async = require('async');
var update = require('./update');
var dataService = require('./dataService');
var utils = require('./utils');

//Socket
module.exports = function(io) {

  io.on('connection', function (socket) {
    
    //New player
    //give player his/her id
    console.log('connection ###############################', dataService.sockets.length+1);

    dataService.sockets.push(socket);
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
      io.to(socket.id).emit('lobbies', dataService.lobbies);
    });

    socket.on('createLobby', function () {
      var tempLobby = {
        id: socket.id,
        name: socket.name+'\'s lobby',
        players: [],
        hostid: null,
        playing: false,
        mapName: 'deep-forrest',
        mapData: {},
        teams:{
          red: {
            players:['empty', 'empty', 'empty'],
            kills: 0,
            deaths: 0,
            creeps: [],
            base: {
              health: 10000
            },
            tower: {
              health: 5000
            }
          },
          blue: {
            players: ['empty', 'empty', 'empty'],
            kills: 0,
            deaths: 0,
            creeps: [],
            base: {
              health: 10000
            },
            tower: {
              health: 5000
            }
          }
        },
        removeTimer: 5
      }
      dataService.lobbies.push(tempLobby);
      broadcast('lobbies', dataService.lobbies);
      io.to(socket.id).emit('createdLobbyJoin', tempLobby.id);
    });

    socket.on('joinLobby', function (lobbyID) {
      var lobby = findLobby(lobbyID);
      if (!lobby) {return;}
      if (lobby.players.length == 0) {
        //first lobby visitor takes a position automatically
        lobby.teams['blue'].players[0] = socket.id;
        socket.team = 'blue';
      }
      lobby.players.push(socket.id);
      socket.lobbyID = lobbyID;
      lobby.host = lobby.players[0];

      playerStageChange(socket.id, 'gameLobby', lobby);
      broadcast('lobbies', dataService.lobbies);
    });

    socket.on('lobbyTakeSpot', function (lobbyID, teamName, spot) {
      if (spot > 2) return;

      var lobby = findLobby(lobbyID);
      var teams = ['red', 'blue'];
      for (var team in teams) {
        team = teams[team];
        for(var i=0;i<3;i++) {
          if(lobby.teams[team].players[i] == socket.id) {
            lobby.teams[team].players[i] = 'empty';
          }
        }
      }
      if (lobby.teams[teamName].players[spot] == 'empty') {
        lobby.teams[teamName].players[spot] = socket.id;
        socket.team = teamName;
      }
      if (lobby.players.length == 0) {
        lobby.host == socket.id;
      }

      lobby.players.forEach(function (socketID) {
        playerStageChange(socketID, 'gameLobby', lobby);
      });
      //broadcast('lobbies', dataService.lobbies);
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
        //only lobby host can start game
        lobby.playing = true;
        lobby.players.forEach(function (tempSocketID) {
          if (!findTeamSlot(lobby, tempSocketID)) {
            //kick players without slots
            lobby.players.splice(lobby.players.indexOf(tempSocketID), 1);
            playerStageChange(tempSocketID, 'gamesList');
          }
        });
        lobby.players.forEach(function (tempSocketID) {
          //start game for players
          io.to(tempSocketID).emit('startGame');
          lobby.mapData = dataService.maps[lobby.mapName];
          playerStageChange(tempSocketID, 'game', lobby);
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
                name:socket.name,
                team:socket.team,
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
          name: socket.name,
          team: socket.team,
        });
    });
    

    
    socket.on('keydown', function (data) {
      if (!socket.lobbyID) return;
      socket.playerinfo.lastUpdate = Date.now();

      if(socket.playerinfo) {
        socket.playerinfo.lastUpdate = Date.now();
        setLocation(socket, data.location);
        switch(data.msg) {
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
      socket.playerinfo.lastUpdate = Date.now();
      setLocation(socket, data.location);

      if(socket.playerinfo) {
        switch(data.msg) {
          case 0: // up
            socket.playerinfo.up = false;
            break;
          case 1: // right
            socket.playerinfo.right = false;
            break;
          case 2: // down
            socket.playerinfo.down = false;
            break;
          case 3: // left
            socket.playerinfo.left = false;
            break;
          default:
            return;
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

    socket.on('axeChop', function (target) {
      if (!target) return;
      if (!socket.lobbyID) return;
      var lobby = findLobby(socket.lobbyID);
      if (!lobby) return;

      if (target.type == 'trees') {
        updateMapData(lobby, target.type, target.id, 'sections', 1);
      }
      
    });
    
    socket.on('spearHit', function (data) {
      if (!socket.lobbyID) return;

      if (socket.playerinfo) {
        socket.playerinfo.health -= data.distanceTraveled/4.5;
        
        broadcastLobby(socket.lobbyID,
          'spearHit', {
            id: socket.id,
            spearId: data.spearId,
            playerinfo: socket.playerinfo
          });
        
        if( JSON.parse(socket.playerinfo.health) <= 0) {

          broadcastLobby(socket.lobbyID,
            'death', {
              id: socket.id
            });

          async.map(dataService.sockets, function (tempSocket) {
            if (tempSocket.id == data.spearOwner){
              tempSocket.kills +=1;
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
  

    socket.on('towerSpearHit', function (data) {
      if (!socket.lobbyID) return;

      if (socket.playerinfo) {
        socket.playerinfo.health -= 20;
        
        broadcastLobby(socket.lobbyID,
          'towerSpearHit', {
            spearID: data.spearID,
            targetID: data.targetID,
            targetinfo: socket.playerinfo
          });
        
        if( JSON.parse(socket.playerinfo.health) <= 0) {

          broadcastLobby(socket.lobbyID,
            'death', {
              id: socket.id
            });

          socket.deaths +=1;

          broadcastLobby(socket.lobbyID,
            'kill', {
              by: 'tower',
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
      dataService.sockets.splice(dataService.sockets.indexOf(socket), 1);
      updateRoster();
    });




    // MESSAGES ############################################### MESSAGES
    dataService.messages.forEach(function (data) {
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
      dataService.messages.push(data);
    });

  });
  




  function updateRoster() {
    async.map(dataService.sockets, function (socket, callback) {
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

  function setLocation(socket, location) {
    socket.playerinfo.x = location.x;
    socket.playerinfo.y = location.y;
  }

  function playerStageChange(socketid, stageName, stageData) {
    //io.sockets.connected[socketid].currentState = stageName;
    io.to(socketid).emit('stageChange', stageName, stageData);
  }

  function broadcast(event, data) {
    dataService.sockets.forEach(function (socket) {
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
    for (var i = dataService.lobbies.length - 1; i >= 0; i--) {
      if (dataService.lobbies[i].id == lobbyID) {
        return dataService.lobbies[i];
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
        if(lobby.teams[team].players[i] == socketID) {
          lobby.teams[team].players[i] = 'empty';
        }
      }
    }
    lobby.players.splice(lobby.players.indexOf(socketID), 1);
    playerStageChange(socketID, 'gamesList');
    
    lobby.host = lobby.players[0];

    lobby.players.forEach(function (tempSocketID) {
      playerStageChange(tempSocketID, 'gameLobby', lobby);
    });

    if (io.sockets.connected[socketID]) {
      io.sockets.connected[socketID].lobbyID = null;
    }
  }

  function findTeamSlot(lobby, id) {
    for(var teamName in lobby.teams) {
      var team = lobby.teams[teamName];
      for (var i = 0; i < 3; i++) {
        var pid = team.players[i];
        if (pid == id) {
          return {team:teamName, slot: i};
        }
      }
    }
    return false;
  }

  function updateMapData(lobby, type, id, key, value) {
    if (!lobby) {return}
    var updatedData = [];
    (lobby.mapData[type]).forEach(function(item){
      if (item.id == id) {

        if (type == 'trees') {
          if (item[key] !== 0) {
            item[key]--;
          } else {
            item[key] = 0;
          }
        } else {
          item[key] = value;
        }
        
        updatedData.push({type:type,id:id,item:item});
      }
    });
    if (updatedData.length > 0) {
      broadcastLobby(lobby.id,
        'mapUpdate', updatedData);
    }

  }

};