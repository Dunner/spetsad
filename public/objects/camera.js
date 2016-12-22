var obj_camera = {},
    objScreenCenter = {},
    cameraObject = {},
    mouse,
    cameraAnimation = 'none';

obj_camera.create = function() {

  game.camera.zoomTo = function(scale, duration, name) {
    cameraAnimation = name;

    var bounds       = Phaser.Rectangle.clone(game.camera.view);
    var cameraBounds = game.camera.view;
    console.log(scale)
    return game.add.tween(game.camera.scale).to({
        x: scale, y: scale, scale:scale
    }, duration).start();
  }

  game.camera.pos = function() {
    return {
      x: game.camera.x,
      y: game.camera.y,
    }
  }

  game.camera.center = function() {
    return {
      x: (game.camera.view.width / 2 + game.camera.view.x) / game.camera.scale.scale,
      y: (game.camera.view.height / 2 + game.camera.view.y) / game.camera.scale.scale,
    }
  }

  cameraObject.object = game.add.image(0,0, createBlock(10, 10,'#000'));
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

  game.camera.zoomTo(1.0,500,'zoomOut')

  
}


obj_camera.update = function() {

  game.camera.bounds = new Phaser.Rectangle(-canvasElement.offsetWidth, -canvasElement.offsetHeight, game.world.width+(canvasElement.offsetWidth*2), game.world.height+(canvasElement.offsetHeight*2));
  console.log(game.camera.bounds)
  game.camera.view.width = canvasElement.offsetWidth;
  game.camera.view.height = canvasElement.offsetHeight;

  objScreenCenter.position = game.camera.center();
  cameraObject.object.alpha = objScreenCenter.alpha = 0.3;

  mouse.x = (game.input.activePointer.x + game.camera.view.x) / game.camera.scale.scale;
  mouse.y = (game.input.activePointer.y + game.camera.view.y) / game.camera.scale.scale;

  var me = findPlayer(mySocketID);
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