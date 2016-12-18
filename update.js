var dataService = require('./dataService');

function update() {

  //lobbies
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
  }

  setTimeout(update, 1000);
}

module.exports = update;
