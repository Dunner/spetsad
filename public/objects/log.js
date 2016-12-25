var obj_log = {},
    logs = [];

obj_log.create = function(data) {
  var log = {};

  log.object = game.add.image(data.x,data.y, 'logs-ss');
  log.object.anchor.setTo(0.5, 0.5);
  groups.logs.add(log.object);
  groups.allObjects.add(log.object);

  log.id = data.id;
  log.object.depth = 1;
  logs.push(log);
}

obj_log.update = function(log) {


}

obj_log.delete = function(logID) {
  for(i=0;i<logs.length;i++) {
    var log = logs[i];
    if (log.id == logID) {
      log.object.destroy();
      log.shadow.destroy();
      logs.splice(i, 1);
      break;
    }
  }
}