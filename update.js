var async = require('async');
var dataService = require('./dataService');


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

        //players ######################################

        
        
        //towers #######################################

        var towers = [{"x": 350,"y": 700, "team": 'blue'}, {"x": 550,"y": 1220, "team": 'red'}];
        var teams = ['red', 'blue'];
        towers.forEach(function (tower) {
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
                tower: tower.team,
                targetID: tempSocketID
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
