var obj_base = {},
    bases = [];

obj_base.create = function(data) {
  var base = {};
  base.id = data.id;
  base.team = data.team;
  base.texts = {};

  base.object = game.add.image(data.x,data.y, 'base-ss');
  base.object.anchor.setTo(0.5, 0.5);
  base.object.alpha = 0.5;
  base.object.depth = 0;
  var scaleTo200 = 300/base.object.width;
  base.object.scale.setTo(scaleTo200,scaleTo200)
  if (data.team == 'blue') {
    base.object.tint = RGBtoHEX(35,105,219);
    base.creepSpawner = game.add.image(base.object.x+30,base.object.y-50, createBlock(30, 30,'#ff0000'));
    base.spearHolder = game.add.image(base.object.x-70,base.object.y-80, createBlock(100, 60,'#00ff00'));
  }
  if (data.team == 'red') {
    base.object.tint = RGBtoHEX(232,46,36);
    base.creepSpawner = game.add.image(base.object.x+30,base.object.y+20, createBlock(30, 30,'#ff0000'));
    base.spearHolder = game.add.image(base.object.x-70,base.object.y+20, createBlock(100, 60,'#00ff00'));
  }

  if (true) {}


  groups.bases.add(base.object);
  groups.allObjects.add(base.object);

  base.texts.creepProgress = game.add.text(0, 0, '0', { font: "22px Arial", fill: "#FFF", align: "left" });
  base.texts.creepProgress.alpha = 0.5;
  base.texts.creepProgress.anchor.set(0.5, -1);

  base.texts.spearsAvailable = game.add.text(0, 0, '0', { font: "22px Arial", fill: "#FFF", align: "left" });
  base.texts.spearsAvailable.alpha = 0.5;
  base.texts.spearsAvailable.anchor.set(0.5, -1);


  bases.push(base);


}

obj_base.update = function(base) {
  var textCreepProgressOffCenter = 22 * (Math.abs(pointDistance(game.camera.center(), base.creepSpawner.position))/100);
  var textCreepProgressLengthdir = lengthDir(textCreepProgressOffCenter, (((pointDirection(game.camera.center(), base.creepSpawner.position) % 360) + 360) % 360) / 57);
  base.texts.creepProgress.x = base.creepSpawner.x + textCreepProgressLengthdir.x;
  base.texts.creepProgress.y = base.creepSpawner.y + textCreepProgressLengthdir.y;
  base.texts.creepProgress.setText(lobby.teams[base.team].base.creepProgress);

  var textSpearsAvailableOffCenter = 22 * (Math.abs(pointDistance(game.camera.center(), base.spearHolder.position))/100);
  var textSpearsAvailableLengthdir = lengthDir(textSpearsAvailableOffCenter, (((pointDirection(game.camera.center(), base.spearHolder.position) % 360) + 360) % 360) / 57);
  base.texts.spearsAvailable.x = base.spearHolder.x + textSpearsAvailableLengthdir.x;
  base.texts.spearsAvailable.y = base.spearHolder.y + textSpearsAvailableLengthdir.y;
  base.texts.spearsAvailable.setText(lobby.teams[base.team].base.spearsAvailable);
}

obj_base.processLog = function(base, log) {
  socket.emit('baseResourceAdd', base.team, 'logs', log.id);
}

obj_base.delete = function(baseID) {
  for(i=0;i<bases.length;i++) {
    var base = bases[i];
    if (base.id == baseID) {
      base.object.destroy();
      base.spearHolder.destroy();
      base.creepSpawner.destroy();
      bases.splice(i, 1);
      break;
    }
  }
}