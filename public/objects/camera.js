var obj_camera = {},
    cameraObject = {},
    mouse,
    cameraAnimation = 'none',
    overlayFilter = {},
    edgeTint = {},
    tintScaleX,
    tintScaleY,
    dynamicCameraScaleGameWidth600;

obj_camera.create = function() {
  game.camera.fade(0x000000,1);
  setTimeout(function(){
  game.camera.flash(0x000000,500);
    // game.camera.resetFX(300);
  },1500)

  game.camera.zoomTo = function(scale, duration, name) {
    cameraAnimation = name;

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
    return cameraObject.object.position;
    // return {
    //   x: (game.camera.view.width / 2 + game.camera.view.x) / game.camera.scale.scale,
    //   y: (game.camera.view.height / 2 + game.camera.view.y) / game.camera.scale.scale,
    // }
  }

  cameraObject.object = game.add.image(0,0, createBlock(10, 10,'#000'));
  cameraObject.object.anchor.setTo(0.5, 0.5);
  cameraObject.object.alpha = 0;
  cameraObject.object.x = 450;
  cameraObject.object.y = 960;


  mouse = game.add.image(0,0, createBlock(5, 5,'red'));

  //Edgetint overlay
  // edgeTint.object = game.add.sprite(600,600, 'edgeTint');
  // edgeTint.object.fixedToCamera = true;
  // edgeTint.object.cameraOffset.setTo(0, 0);
  // edgeTint.object.alpha = 0.5;

  // tintScaleX = game.camera.view.width / edgeTint.object.width;
  // tintScaleY = game.camera.view.height / edgeTint.object.height
  
  // edgeTint.object.scale.setTo(tintScaleX, tintScaleY);

  // overlayFilter = game.add.image(0,0, createBlock(game.camera.view.width, game.camera.view.height,'#fff'));
  // overlayFilter.fixedToCamera = true;
  // overlayFilter.cameraOffset.setTo(0, 0);
  // overlayFilter.alpha = 0.1;
  // overlayFilter.tint = RGBtoHEX(150,80,0);

  game.camera.zoomTo(0.7,500,'zoomOut')
  //game.camera.bounds = new Phaser.Rectangle(-game.camera.view.width, -game.camera.view.height, game.world.width+(game.camera.view.width*2), game.world.height+(game.camera.view.height*2));


}


obj_camera.update = function() {
  dynamicCameraScaleGameWidth600 = game.camera.view.width / 600;

  if (debug) {
    cameraObject.object.alpha = 0.3;
  }

  //game.camera.bounds = game.camera.view;


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
    game.camera.bounds = 1;
  }

}

obj_camera.delete = function() {}