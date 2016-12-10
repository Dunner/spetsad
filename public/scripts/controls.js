var controls = {},
    upKey,
    downKey,
    leftKey,
    rightKey,
    fireKey,

    aiming = false;


controls.create = function() {
  upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  fireKey = game.input.activePointer.leftButton;

  //up
  upKey.onDown.add(function() {
    socket.emit('keydown', 0);
  });
  upKey.onUp.add(function() {
    socket.emit('keyup', {msg:0, location:{x:me.legs.object.x,y:me.legs.object.y}});
  });
  //right
  rightKey.onDown.add(function() {
    socket.emit('keydown', 1);
  });
  rightKey.onUp.add(function() {
    socket.emit('keyup', {msg:1, location:{x:me.legs.object.x,y:me.legs.object.y}});
  });
  //down
  downKey.onDown.add(function() {
    socket.emit('keydown', 2);
  });
  downKey.onUp.add(function() {
    socket.emit('keyup', {msg:2, location:{x:me.legs.object.x,y:me.legs.object.y}});
  });
  //left
  leftKey.onDown.add(function() {
    socket.emit('keydown', 3);
  });
  leftKey.onUp.add(function() {
    socket.emit('keyup', {msg:3, location:{x:me.legs.object.x,y:me.legs.object.y}});
  });

  //Fire
  fireKey.onUp.add(function() {
    aiming = false;
    if (canFire()) {
      var spearId = randomId('spear');
      socket.emit('fire', {
        x: mouse.x,
        y: mouse.y,
        spearId: spearId,
        distance: 96 * reticle.xScale
      });
    }
  });

}

controls.update = function() {
  //Fire
  if (fireKey.isDown) {
    aiming = {
      target: {
        x: mouse.x,
        y: mouse.y
      }
    }
  }
  
}