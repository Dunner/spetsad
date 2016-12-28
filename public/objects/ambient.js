var ambient = {};

ambient.create = function() {
  ambient.shadowTexture = game.add.bitmapData(game.width, game.height);
  // Create an object that will use the bitmap as a texture    
  ambient.lightSprite = game.add.image(game.camera.x, game.camera.y, ambient.shadowTexture);
  // Set the blend mode to MULTIPLY. This will darken the colors of
  // everything below sprite.
  ambient.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
}

ambient.update = function() {
  ambient.lightSprite.reset(game.camera.x/ game.camera.scale.scale, game.camera.y/ game.camera.scale.scale);
  ambient.updateShadowTexture();
}

ambient.updateShadowTexture = function() {
  if (me) {
    // Draw shadow    
    console.log(game.width, game.height)
    ambient.shadowTexture.context.fillStyle = 'rgb(10, 10, 10)';
    ambient.shadowTexture.context.fillRect(0, 0, game.width, game.height);
    var radius = 100 + game.rnd.integerInRange(1, 10),
        heroX = me.shadow.object.x - (game.camera.x/ game.camera.scale.scale),
        heroY = me.shadow.object.y - (game.camera.y/ game.camera.scale.scale); // Draw circle of light with a soft edge    
    var gradient = ambient.shadowTexture.context.createRadialGradient(heroX, heroY, 100 * 0.75, heroX, heroY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ambient.shadowTexture.context.beginPath();
    ambient.shadowTexture.context.fillStyle = gradient;
    ambient.shadowTexture.context.arc(heroX, heroY, radius, 0, Math.PI * 2, false);
    ambient.shadowTexture.context.fill(); // This just tells the engine it should update the texture cache    
    ambient.shadowTexture.dirty = true;
  }
}




// var ambient = {};

// ambient.create = function() {

//   ambient.darknessOverlay.fill(0,0,0,1)
//   ambient.darknessOverlay.addToWorld(game.world.centerX, game.world.centerY,0.5, 0.5);

//   // ambient.darknessOverlay.anchor.set(0.5, 0.5);
//   // ambient.darknessOverlay.position = cameraObject.object.position;

//   // ambient.darknessMask = game.add.graphics(0,0);
//   // ambient.darknessMask.position = cameraObject.object.position;

//   // ambient.darknessMask.clear();
//   // ambient.darknessMask.beginFill(0xFFFFFF);
//   // ambient.darknessMask.drawCircle(100,100,100);
//   circle = new Phaser.Circle(200, 200, 100,0xFFFFFF);
//   text = game.make.text(0, 0, "phaser", { font: "bold 32px Arial", fill: "#ff0044" });

//   // ambient.darknessOverlay.mask = ambient.darknessMask;
// }

// ambient.update = function() {
//   ambient.darknessOverlay.addToWorld(game.world.centerX, game.world.centerY,0.5, 0.5);

//   console.log(ambient.darknessOverlay)
//   ambient.darknessOverlay.resize(game.camera.width, game.camera.height)
//   ambient.darknessOverlay.cls();
//   ambient.darknessOverlay.fill(0, 0, 0, 0.5);
//   ambient.darknessOverlay.blendSoftLight().circle(cameraObject.object.x, cameraObject.object.y, 16, 'rgba(0, 0, 0, 255').blendReset().update()
//   // ambient.darknessMask.position = cameraObject.object.position
// }
