var obj_camera = {},
    cameraObject = {},
    mouse;


obj_camera.create = function() {

  cameraObject.object = game.add.image(0,0, createBlock(0, 0,'#000'));
  cameraObject.object.anchor.setTo(0.5, 0.5);

  mouse = game.add.image(game.input.mousePointer.x,game.input.mousePointer.y, createBlock(1, 1,'red'));
  mouse.anchor.setTo(0.5, 0.5);

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

  mouse.x = game.input.mousePointer.worldX;
  mouse.y = game.input.mousePointer.worldY;

  // ###### Camera 
  if (me && me.legs) {
    
    if (cameraObject.object.x < me.legs.object.x) {
      cameraObject.object.x += ( Math.abs(cameraObject.object.x - me.legs.object.x)/10 ) * delta
    }
    if (cameraObject.object.x > me.legs.object.x) {
      cameraObject.object.x -= ( Math.abs(cameraObject.object.x - me.legs.object.x)/10 ) * delta
    }
    
    if (cameraObject.object.y < me.legs.object.y) {
      cameraObject.object.y += ( Math.abs(cameraObject.object.y - me.legs.object.y)/10 ) * delta
    }
    if (cameraObject.object.y > me.legs.object.y) {
      cameraObject.object.y -= ( Math.abs(cameraObject.object.y - me.legs.object.y)/10 ) * delta
    }

    game.camera.follow(cameraObject.object);

  }

}

obj_camera.delete = function() {}