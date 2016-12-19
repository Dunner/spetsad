  
  function canFire(){
    if (game.time.now > nextFire) {
      nextFire = game.time.now + fireRate;
      return true;
    } else {
      return false;
    }
  }
  
  function randomId(prepend) {
    return prepend + Math.random().toString(36).substr(2, 9);
  }

  function randomSpawnLocation(x,y, radius) {
    return {
      x: (x - radius) + (Math.floor(Math.random() * (radius*2)) + 1),
      y: (y - radius) + (Math.floor(Math.random() * (radius*2)) + 1)
    };
  }

  function findSocket(id) {
    for (var i = 0; i < sockets.length; i++) {
      if (sockets[i].id == id) {
        return sockets[i];
      }
    }
    return false;
  }

  function findPlayer(id) {
    for (var i = 0; i < players.length; i++) {
      if (players[i].id == id) {
        return players[i];
      }
    }
    return false;
  }
  
  function createBlock(x, y, color) {
    var name = x + '_' + color;
    if(textureRegistry[name]) {
      return textureRegistry[name];
    }

    var bmd = game.add.bitmapData(x, y);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fillRect(0,0, x, y);
    textureRegistry[name] = bmd;
    return bmd;
  }
  
  function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
  }

  function pointDirection(object1, object2) {
    // Returns angle between two vectors
    return Math.atan2(object2.y - object1.y, object2.x - object1.x) * 180 / Math.PI;
  }
  
  function pointDistance(pointA, pointB) {
    //Returns Distance between two points
    //pythagoras squareRoot(a*a + b*b = c*c) = c
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)); 
  }
  
  function lengthDir(length, direction) { //vector, magnitude
    if (direction < 0) direction += 360;

    return {
      x: length*Math.cos(direction),
      y: length*Math.sin(direction)
    }
  }

  function RGBtoHEX(r, g, b) {
    return r << 16 | g << 8 | b;
  }

  function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}