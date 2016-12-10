var obj_camera = {},
    cameraObject = {},
    mouse;


obj_camera.create = function() {

  cameraObject.object = game.add.sprite(0,0, createBlock(0, 0,'#000'));
  cameraObject.object.anchor.setTo(0.5, 0.5);

  mouse = game.add.sprite(game.input.mousePointer.x,game.input.mousePointer.y, createBlock(1, 1,'red'));
  mouse.anchor.setTo(0.5, 0.5);

  //Edgetint overlay
  var edgeTint = {}, tintScaleX, tintScaleY;
  edgeTint.object = game.add.sprite(600,600, 'edgeTint');
  edgeTint.object.fixedToCamera = true;
  edgeTint.object.cameraOffset.setTo(0, 0);
  edgeTint.object.alpha = 1;


  tintScaleX = canvasElement.offsetWidth / edgeTint.object.width;
  tintScaleY = canvasElement.offsetHeight / edgeTint.object.height
  
  console.log(tintScaleX, tintScaleY)
  edgeTint.object.scale.setTo(tintScaleX, tintScaleY);
}

obj_camera.update = function() {

  mouse.x = game.input.mousePointer.worldX;
  mouse.y = game.input.mousePointer.worldY;

  // ###### Camera 
  if (me && me.legs) {
    
    if (cameraObject.object.x < me.legs.object.x) {
      cameraObject.object.x += Math.abs(cameraObject.object.x - me.legs.object.x)/50
    }
    if (cameraObject.object.x > me.legs.object.x) {
      cameraObject.object.x -= Math.abs(cameraObject.object.x - me.legs.object.x)/50
    }
    
    if (cameraObject.object.y < me.legs.object.y) {
      cameraObject.object.y += Math.abs(cameraObject.object.y - me.legs.object.y)/50
    }
    if (cameraObject.object.y > me.legs.object.y) {
      cameraObject.object.y -= Math.abs(cameraObject.object.y - me.legs.object.y)/50
    }

    game.camera.follow(cameraObject.object);

  }

}

obj_camera.delete = function() {}