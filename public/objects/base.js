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
  if (data.team == 'blue') {base.object.tint = RGBtoHEX(35,105,219);}
  if (data.team == 'red') {base.object.tint = RGBtoHEX(232,46,36);}
  groups.bases.add(base.object);
  groups.allObjects.add(base.object);

  base.texts.logs = game.add.text(0, 0, '0', { font: "22px Arial", fill: "#FFF", align: "left" });
  base.texts.logs.alpha = 0.5;
  base.texts.logs.anchor.set(0.5, -1);

  bases.push(base);

}

obj_base.update = function(base) {
  var textOffCenter = 22 * (Math.abs(pointDistance(game.camera.center(), base.object.position))/100);
  var textLengthdir = lengthDir(textOffCenter, (((pointDirection(game.camera.center(), base.object.position) % 360) + 360) % 360) / 57);
  base.texts.logs.x = base.object.x + textLengthdir.x;
  base.texts.logs.y = base.object.y + textLengthdir.y;
  base.texts.logs.setText(lobby.teams[base.team].base.logs);

}

obj_base.processLog = function(base, log) {
  socket.emit('baseResourceAdd', base.team, 'logs', log.id);
}

obj_base.delete = function(baseID) {
  for(i=0;i<bases.length;i++) {
    var base = bases[i];
    if (base.id == baseID) {
      base.object.destroy();
      base.shadow.destroy();
      bases.splice(i, 1);
      break;
    }
  }
}