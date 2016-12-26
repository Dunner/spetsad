var obj_log = {},
    logs = [];

obj_log.create = function(data) {
  var log = {};

  log.object = game.add.image(data.x,data.y, 'logs-ss');
  log.object.anchor.setTo(0.5, 0.5);
  groups.logs.add(log.object);
  groups.allObjects.add(log.object);

  log.object.scale.setTo(1, 0.7+(0.1*data.section));

  log.id = data.id;
  log.object.depth = 1;
  logs.push(log);

}

obj_log.update = function(log) {
  if (checkOverlap(mouse, log.object)) {
    log.object.tint = 0x750000;
    if (click && !me.carryingLog && !log.carriedBy ) {
      if (pointDistance(me.shadow.object.position, log.object.position) < 40) {
        click = false;
        socket.emit('logChangeStatus', 'pickup', log.id, mySocketID);
      }
    }
  } else {
    log.object.tint = 0xFFFFFF;
  }
  if (log.carriedBy) {
    log.object.x = log.carriedBy.x;
    log.object.y = log.carriedBy.y;
  }
}

obj_log.changeStatus = function(logID, logMapItem) {
  logs.forEach(function(log){
    if (log.id == logID) {
      if (logMapItem.carriedBy) {
        //Pickup
        var player = findPlayer(logMapItem.carriedBy)
        log.carriedBy = player.shadow.object;
        player.carryingLog = log.id;
      } else {
        //Drop
        players.forEach(function(player){
          if (player.carryingLog == log.id) {
            player.carryingLog = false;
          }
        })
        log.carriedBy = false;
        log.object.x = logMapItem.x;
        log.object.y = logMapItem.y;
        bases.forEach(function(base){
          var distanceToBase = pointDistance(log.object.position,base.object.position);
          if (distanceToBase < 120) {
            obj_base.processLog(base, log);
          }
        })
      }
    }
  })
}
obj_log.delete = function(logID) {
  for(i=0;i<lobby.mapData['logs'].length;i++) {
    var log = logs[i];
    if (log.id == logID) {
      log.object.destroy();
      logs.splice(i, 1);
      break;
    }
  }
}