var async = require('async');
var dataService = require('./dataService');
var creepHandler = require('./creepHandler');
var towerHandler = require('./towerHandler');
var utils = require('./utils');


module.exports = function(io){

  function update() {

    //lobbies #######################################
    var lobbies = dataService.lobbies;
    for (var i = lobbies.length - 1; i >= 0; i--) {
      var lobby = lobbies[i];
      lobby.removeTimer --;

      if (lobby.removeTimer <= 0) {
        if (lobby.players.length == 0) {
          lobbies.splice(lobbies.indexOf(lobby), 1);
          console.log('removed lobby', lobby.name);
        } else {
          lobby.removeTimer = 50;
        }
      }

      if(lobby.playing) {

        lobby.secondsPlayed++;

        //players ######################################
        lobby.players.forEach(function (socketID) {
          dataService.sockets.forEach(function (tempSocket) {
            if (!tempSocket.playerinfo) {return;}

            if (tempSocket.id == socketID) {
              var now = Date.now(),
                  maxDistance = 100,
                  dt = now - tempSocket.playerinfo.lastUpdate,
                  distance = dt < 1000 ? dt/10 : maxDistance;

              if(tempSocket.playerinfo.up) {
                tempSocket.playerinfo.y -= distance;
              }
              if(tempSocket.playerinfo.right) {
                tempSocket.playerinfo.x += distance
              }
              if(tempSocket.playerinfo.down) {
                tempSocket.playerinfo.y += distance;
              }
              if(tempSocket.playerinfo.left) {
                tempSocket.playerinfo.x -= distance
              }

              lobby.players.forEach(function (tempSocketID) {
                io.to(tempSocketID).emit('keyup', {
                  socket: tempSocket.id,
                  playerinfo: tempSocket.playerinfo
                });
              });

            };
          });

        });


        //Creeps #######################################

          //Update creeps ##########

          for(var team in lobby.mapData.creeps) {

            if (lobby.mapData.creeps[team].length) {
              (lobby.mapData.creeps[team]).forEach(function(creep){
                creepHandler(io, lobby, creep);
              });
            }
          }

          //Spawn creeps ################################

        if (lobby.secondsPlayed % 10 == 0 ) { //every 30th second

          var creepsToSpawn = {red:[], blue: []};

          for (var x = 0; x < 3; x++) {
            var blueCreep = {
              type: 'standard',
              id: utils.randomID('creep'),
              team: 'blue',
              x: 450-62.5+(x*40),
              y: 200,
              maxHealth: 300,
              health: 300
            };
            creepsToSpawn['blue'].push(blueCreep);
            lobby.mapData.creeps['blue'].push(blueCreep);
            var redCreep = {
              type: 'standard',
              id: utils.randomID('creep'),
              team: 'red',
              x: 450-62.5+(x*40),
              y: 1720,
              maxHealth: 300,
              health: 300
            };
            creepsToSpawn['red'].push(redCreep);
            lobby.mapData.creeps['red'].push(redCreep);
          }
          lobby.players.forEach(function (tempSocketID) {
            io.to(tempSocketID).emit('creepSpawn', creepsToSpawn);
          });
        }
        

        //towers #######################################
        
        for(var team in lobby.mapData.creeps) {
          lobby.mapData.towers[team].forEach(function (tower) {

            towerHandler(io, lobby, tower);

          });
        };

      }
    }

    setTimeout(update, 1000);
  }
  update();

};
