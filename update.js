var async = require('async');
var dataService = require('./dataService');
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

        if (lobby.secondsPlayed % 30 == 0 ) { //every 30th second

          var creepsToSpawn = {red:[], blue: []};

          for (var x = 0; x < 3; x++) {
            var redCreep = {
              type: 'standard',
              id: utils.randomID('creep'),
              team: 'blue',
              x: 450-62.5+i*25,
              y: 1720
            };
            creepsToSpawn['red'].push(redCreep);
            lobby.mapData.creeps['red'].push(redCreep);
            var blueCreep = {
              type: 'standard',
              id: utils.randomID('creep'),
              team: 'blue',
              x: 450-62.5+i*25,
              y: 200
            };
            creepsToSpawn['blue'].push(blueCreep);
            lobby.mapData.creeps['blue'].push(blueCreep);
          }
          lobby.players.forEach(function (tempSocketID) {
            io.to(tempSocketID).emit('creepSpawn', creepsToSpawn);
          });
        }

        //towers #######################################

        
        var teams = ['red', 'blue'];
        lobby.mapData.towers.forEach(function (tower) {
          tower.targets = [];
          tower.target = {distance:999};
          var targetsTeamName = 'blue'
          if (tower.team == 'blue') {
            targetsTeamName = 'red';
          }

          lobby.teams[targetsTeamName].players.forEach(function (socketID) {
            dataService.sockets.forEach(function (tempSocket) {
              if (tempSocket.id == socketID) {
                if (!tempSocket.playerinfo) {return;}
                var distToTarget = Math.abs(tempSocket.playerinfo.y - tower.y);
                if (distToTarget < 200 && tempSocket.playerinfo.health > 0){
                  tower.targets.push({type:'player', id: socketID, distance: distToTarget});
                }
              }
            });
          });

          tower.targets.forEach(function (target) {
            if (target.distance < tower.target.distance) {
              tower.target = target;
            }
          });

          if (tower.target.type == 'player') {
            lobby.players.forEach(function (tempSocketID) {
              io.to(tempSocketID).emit('towerAttack', {
                spearID: utils.randomID('spear'),
                tower: tower.team,
                targetID: tower.target.id
              });
            });
          }

        });
      }
    }

    setTimeout(update, 1000);
  }
  update();

};
