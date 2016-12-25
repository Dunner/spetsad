var controls = {},
    upKey,
    downKey,
    leftKey,
    rightKey,

    clickKey,
    touchKey,

    holdClick = false,
    click = false,

    pointerType,

    wKey,
    dKey,
    sKey,
    aKey,

    aimSpear = false;


controls.create = function() {
  upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

  downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);

  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);

  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

  clickKey = game.input.activePointer.leftButton;
  touchKey = game.input.pointer1;

  //up
  upKey.onDown.add(function() {
    socket.emit('keydown', {msg:0, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  upKey.onUp.add(function() {
    socket.emit('keyup', {msg:0, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  wKey.onDown.add(function() {
    socket.emit('keydown', {msg:0, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  wKey.onUp.add(function() {
    socket.emit('keyup', {msg:0, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });

  //right
  rightKey.onDown.add(function() {
    socket.emit('keydown', {msg:1, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  rightKey.onUp.add(function() {
    socket.emit('keyup', {msg:1, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  dKey.onDown.add(function() {
    socket.emit('keydown', {msg:1, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  dKey.onUp.add(function() {
    socket.emit('keyup', {msg:1, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });


  //down
  downKey.onDown.add(function() {
    socket.emit('keydown', {msg:2, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  downKey.onUp.add(function() {
    socket.emit('keyup', {msg:2, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  sKey.onDown.add(function() {
    socket.emit('keydown', {msg:2, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  sKey.onUp.add(function() {
    socket.emit('keyup', {msg:2, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });

  //left
  leftKey.onDown.add(function() {
    socket.emit('keydown', {msg:3, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  leftKey.onUp.add(function() {
    socket.emit('keyup', {msg:3, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  aKey.onDown.add(function() {
    socket.emit('keydown', {msg:3, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });
  aKey.onUp.add(function() {
    socket.emit('keyup', {msg:3, location:{x:me.shadow.object.x,y:me.shadow.object.y}});
  });

}

controls.update = function() {
  //Fire
  if (clickKey.isDown) {
    pointerType = 'mouse';
    clickDown();
  }
  if (touchKey.isDown) {
    pointerType = 'touch';
    clickDown();
  }
  if ( touchKey.isUp && pointerType == 'touch' ) {
    clickUp();
  }
  if ( clickKey.isUp && pointerType == 'mouse' ) {
    clickUp();
  }
}

function clickDown() {
  if (!holdClick) {
    clickOnce();
    holdClick = true;
  }
}

function clickUp() {
  if (holdClick) {
    holdClick = false;
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
}

function clickOnce() {
  click = true;
  setTimeout(function(){
    click = false;
  },1) 
}