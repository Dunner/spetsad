var controls = {},
    upKey,
    downKey,
    leftKey,
    rightKey,
    fireKey,
    fireKeyTouch,

    wKey,
    dKey,
    sKey,
    aKey,

    aiming = false;


controls.create = function() {
  upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

  downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);

  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);

  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

  fireKey = game.input.activePointer.leftButton;
  fireKeyTouch = game.input.pointer1;

  //up
  upKey.onDown.add(function() {
    socket.emit('keydown', 0);
  });
  upKey.onUp.add(function() {
    socket.emit('keyup', {msg:0, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  wKey.onDown.add(function() {
    socket.emit('keydown', 0);
  });
  wKey.onUp.add(function() {
    socket.emit('keyup', {msg:0, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });

  //right
  rightKey.onDown.add(function() {
    socket.emit('keydown', 1);
  });
  rightKey.onUp.add(function() {
    socket.emit('keyup', {msg:1, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  dKey.onDown.add(function() {
    socket.emit('keydown', 1);
  });
  dKey.onUp.add(function() {
    socket.emit('keyup', {msg:1, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });


  //down
  downKey.onDown.add(function() {
    socket.emit('keydown', 2);
  });
  downKey.onUp.add(function() {
    socket.emit('keyup', {msg:2, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  sKey.onDown.add(function() {
    socket.emit('keydown', 2);
  });
  sKey.onUp.add(function() {
    socket.emit('keyup', {msg:2, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });

  //left
  leftKey.onDown.add(function() {
    socket.emit('keydown', 3);
  });
  leftKey.onUp.add(function() {
    socket.emit('keyup', {msg:3, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  aKey.onDown.add(function() {
    socket.emit('keydown', 3);
  });
  aKey.onUp.add(function() {
    socket.emit('keyup', {msg:3, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });

}

controls.update = function() {
  //Fire
  if (fireKey.isDown) {
    aim('mouse');
  }
  if (fireKeyTouch.isDown) {
    aim('touch');
  }
  if ( fireKeyTouch.isUp && aiming && aiming.pointerType == 'touch' ) {
    throwSpear();
  }
  if ( fireKey.isUp && aiming && aiming.pointerType == 'mouse' ) {
    throwSpear();
  }
}

function aim(pointerType) {
  aiming = {
    pointerType: pointerType,
    target: {
      x: mouse.x,
      y: mouse.y
    }
  }
}

function throwSpear() {
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
}