
var socket = window.socket = io.connect();

  
  var groups = {},
      healthStyle,
      reticle;
      textureRegistry = {},
      canvasElement = document.getElementById('spetsad-canvas');

  function preload() {
    game.stage.disableVisibilityChange = true;
    game.load.crossOrigin = 'anonymous';
    game.load.image('background','sprites/bg-playground.png');
    game.load.spritesheet('legs-test-ss', 'sprites/legs-test-ss.png', 32, 32, 4);
    game.load.spritesheet('torso-test-ss', 'sprites/torso-test-ss.png', 32, 32, 4);
    game.load.spritesheet('head-test-ss', 'sprites/head-test-ss.png', 32, 32, 1);
    game.load.image('pinetree5','sprites/spr_pine_5.png');
    game.load.image('reticle','sprites/reticle.png');
    game.load.image('edgeTint','sprites/edge-tint-overlay.png');
  }

  function create() {

    game.time.advancedTiming = true;

    game.add.tileSprite(0, 0, 1920, 1920, 'background');
    game.stage.backgroundColor = '#787878';
    game.world.setBounds(0, 0, 1920, 1920);
    
    healthStyle = { font: "18px Arial", fill: "#fff", align: "left" };

    ['players', 'spears', 'obstacles'].forEach(function(group) {
      groups[group] = game.add.group();
      groups[group].setAll('checkWorldBounds', true);
      //groups[group].setAll('outOfBoundsKill', true);
    }, this);

    reticle = {}
    reticle.object = game.add.image(600,600, 'reticle');
    reticle.object.anchor.set(0, 0.5);
    reticle.xScale = 0;
    reticle.yScale = 1;


    socket.emit('spawn', randomSpawnLocation());
    socket.emit('getplayers');

    controls.create();

    obj_pinetree.create({
      x: 800,
      y: 870,
      diameter: 40,
      height: 5,
    })
    
    obj_pinetree.create({
      x: 950,
      y: 720,
      diameter: 40,
      height: 4,
    })

    obj_pinetree.create({
      x: 1200,
      y: 870,
      diameter: 40,
      height: 5,
    })
    
    obj_pinetree.create({
      x: 600,
      y: 100,
      diameter: 40,
      height: 4,
    })

    obj_pinetree.create({
      x: 500,
      y: 1200,
      diameter: 40,
      height: 3,
    })
    
    obj_pinetree.create({
      x: 1100,
      y: 800,
      diameter: 40,
      height: 2,
    })
    // obj_obstacle.create({
    //   x: 1200,
    //   y: 850,
    //   diameter: 40,
    //   height: 4,
    //   color: 'white'
    // })
    
    obj_camera.create();

  }

  function update() {

    controls.update();

    obstacles.forEach(function(obstacle) {
      obj_obstacle.update(obstacle);
    }, this);

    pinetrees.forEach(function(obstacle) {
      obj_pinetree.update(obstacle);
    }, this);

    spears.forEach(function(spear) {
      obj_spear.update(spear);
    }, this);

    players.forEach(function(player) {
       obj_player.update(player);
      // player.updateFunction();
    }, this);

    obj_camera.update();
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
  }



  /*jshint validthis:true */
  var game;
  game = new Phaser.Game(canvasElement.offsetWidth, canvasElement.offsetHeight, Phaser.AUTO, 'spetsad-canvas', {preload: preload, create: create, update: update});
