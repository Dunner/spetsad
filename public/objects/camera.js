var obj_camera = {},
    objScreenCenter = {},
    cameraObject = {},
    mouse,
    cameraAnimation = 'none';

obj_camera.create = function() {

  game.camera.zoomTo = function(scale, duration, name) {
    cameraAnimation = name;

    var bounds       = Phaser.Rectangle.clone(game.world.bounds);
    var cameraBounds = game.camera.bounds;
    if (!duration) {
      cameraBounds.x      = bounds.width  * (1 - scale) / 2;
      cameraBounds.y      = bounds.height * (1 - scale) / 2;
      cameraBounds.width  = bounds.width  * scale;
      cameraBounds.height = bounds.height * scale;
      cameraBounds.scale  = scale;
    } else {
      game.add.tween(cameraBounds).to({
          x      : bounds.width  * (1 - scale) / 2,
          y      : bounds.height * (1 - scale) / 2,
          width  : bounds.width  * scale,
          height : bounds.height * scale,
          scale  : scale
      }, duration).start();
      return game.add.tween(this.scale).to({
          x: scale, y: scale, scale:scale
      }, duration).start();
    }
  }

  game.camera.pos = function() {
    return {
      x: game.camera.x,
      y: game.camera.y,
    }
  }

  game.camera.center = function() {
    return {
      x: game.camera.width / 2 + game.camera.x + game.camera.bounds.x,
      y: game.camera.height / 2 + game.camera.y + game.camera.bounds.y,
    }
  }


  cameraObject.object = game.add.image(0,0, createBlock(0, 0,'#000'));
  cameraObject.object.anchor.setTo(0.5, 0.5);

  objScreenCenter = game.add.image(0,0, createBlock(5, 5,'green'));

  mouse = game.add.image(0,0, createBlock(5, 5,'red'));

  //Edgetint overlay
  var edgeTint = {}, tintScaleX, tintScaleY;
  edgeTint.object = game.add.sprite(600,600, 'edgeTint');
  edgeTint.object.fixedToCamera = true;
  edgeTint.object.cameraOffset.setTo(0, 0);
  edgeTint.object.alpha = 0.5;


  tintScaleX = canvasElement.offsetWidth / edgeTint.object.width;
  tintScaleY = canvasElement.offsetHeight / edgeTint.object.height
  
  edgeTint.object.scale.setTo(tintScaleX, tintScaleY);

  var overlayFilter = game.add.image(0,0, createBlock(canvasElement.offsetWidth, canvasElement.offsetHeight,'#fff'));
  overlayFilter.fixedToCamera = true;
  overlayFilter.cameraOffset.setTo(0, 0);
  overlayFilter.alpha = 0.1;
  overlayFilter.tint = RGBtoHEX(150,80,0);

}

obj_camera.update = function() {

  //objScreenCenter.position = game.camera.center();


  mouse.x = (game.input.mousePointer.x + game.camera.x)/game.camera.bounds.scale;
  mouse.y = (game.input.mousePointer.y + game.camera.y)/game.camera.bounds.scale;

  // ###### Camera 
  if (me && me.shadow) {
    
    if (cameraObject.object.x < me.shadow.object.x) {
      cameraObject.object.x += ( Math.abs(cameraObject.object.x - me.shadow.object.x)/10 ) * delta
    }
    if (cameraObject.object.x > me.shadow.object.x) {
      cameraObject.object.x -= ( Math.abs(cameraObject.object.x - me.shadow.object.x)/10 ) * delta
    }
    
    if (cameraObject.object.y < me.shadow.object.y) {
      cameraObject.object.y += ( Math.abs(cameraObject.object.y - me.shadow.object.y)/10 ) * delta
    }
    if (cameraObject.object.y > me.shadow.object.y) {
      cameraObject.object.y -= ( Math.abs(cameraObject.object.y - me.shadow.object.y)/10 ) * delta
    }

    game.camera.follow(cameraObject.object);
  }

}

obj_camera.delete = function() {}