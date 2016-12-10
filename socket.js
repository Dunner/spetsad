var async = require('async');

//Socket
module.exports = function(app, io) {
  
  var messages = [];
  var sockets = [];
  
  io.on('connection', function (socket) {
    console.log('connection ###############################', sockets.length+1);

    messages.forEach(function (data) {
      socket.emit('message', data);
    });
    
    socket.on('spawn', function (location) {
      socket.playerinfo = location;
      socket.playerinfo.up = false;
      socket.playerinfo.right = false;
      socket.playerinfo.down = false;
      socket.playerinfo.left = false;
      socket.playerinfo.health = 100;
      broadcast('spawn', {socket: socket.id, playerinfo: socket.playerinfo});
      socket.emit('mysocket', socket.id);
    });
    
    socket.on('getplayers', function () {
      sockets.forEach(function (data) {
        socket.emit('players', {socket: data.id, playerinfo: data.playerinfo});
      });
    });
  
    sockets.push(socket);
    
    socket.on('keydown', function (msg) {
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
      broadcast('keydown', {socket: socket.id, playerinfo: socket.playerinfo});
    });
    
    socket.on('keyup', function (data) {
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
      broadcast('keyup', {socket: socket.id, playerinfo: socket.playerinfo});
    });
  
    socket.on('fire', function (data) {
      broadcast('fire', {
        id: socket.id,
        toPos: data,
        spearId: data.spearId,
        distance: data.distance
      });
    });
    
    socket.on('spearhit', function (data) {
      socket.playerinfo.health -= data.distanceTraveled;
      
      broadcast('spearhit', {
        id: socket.id,
        spearId: data.spearId,
        playerinfo: socket.playerinfo
      });
      
      if( JSON.parse(socket.playerinfo.health) <= 0) {
        broadcast('death', {
          id: socket.id
        });
      }
    });
  
    socket.on('respawn', function (data) {
      socket.playerinfo.health = 100;
      socket.playerinfo.x = data.x;
      socket.playerinfo.y = data.y;
      broadcast('respawn', {
        id: socket.id,
        playerinfo: socket.playerinfo});
    });
  
    socket.on('disconnect', function () {
      broadcast('player-dc', socket.id);
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
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
  
    socket.on('identify', function (name) {
      socket.name = String(name || 'Anonymous');
      updateRoster();
    });
  });
  
  function updateRoster() {
    async.map(sockets, function (socket, callback) {
        if (socket){
          callback(null,socket.name);
        }
      },
      function (err, names) {
        broadcast('roster', names);
      }
    );
  }
  
  function broadcast(event, data) {
    sockets.forEach(function (socket) {
      socket.emit(event, data);
    });
  }

};