
var socket = window.socket = io.connect();

var game,
    lobby;
var groups = {},
    enableMovement = false,
    debug = false,
    delta,
    healthStyle,
    reticle,
    collisionObjects = [],

    spawns = {
      'blue': {x: 450, y:500},
      'red': {x: 450, y:1420}
    }

    textureRegistry = {},
    canvasElement = document.getElementById('spetsad-canvas');
    
function startGame(data) {
  lobby = data;
  function preload() {
    game.stage.disableVisibilityChange = true;
    game.load.crossOrigin = 'anonymous';
    game.load.image('background','sprites/lane-bg.png');
    game.load.spritesheet('stump-ss', 'sprites/stump-ss.png', 32, 32, 2);
    game.load.spritesheet('logs-ss', 'sprites/logs-ss.png', 32, 32, 1);
    game.load.spritesheet('tower-ss', 'sprites/tower-ss.png', 120, 120, 3);
    game.load.spritesheet('base-ss', 'sprites/base-ss.png', 120, 120, 1);
    game.load.spritesheet('feet-test-ss', 'sprites/feet-test-ss.png', 32, 32, 4);
    game.load.spritesheet('legs-test-ss', 'sprites/legs-test-ss.png', 32, 32, 4);
    game.load.spritesheet('torso-test-ss', 'sprites/torso-test-ss.png', 32, 32, 4);
    game.load.spritesheet('arms-test-ss', 'sprites/arms-test-ss.png', 32, 32, 4);
    game.load.spritesheet('arms-throw-ss', 'sprites/arms-throw-ss.png', 32, 32, 4);
    game.load.spritesheet('arms-chop-ss', 'sprites/arms-chop-ss.png', 32, 32, 4);
    game.load.spritesheet('head-test-ss', 'sprites/head-test-ss.png', 32, 32, 1);
    game.load.image('pinetree5','sprites/spr_pine_5.png');
    game.load.image('reticle','sprites/reticle.png');
    game.load.image('spear-ash','sprites/spear.png');
    game.load.image('edgeTint','sprites/edge-tint-overlay.png');

  }

  function create() {

    game.time.advancedTiming = true;

    game.add.tileSprite(0, 0, 900, 1920, 'background');
    game.stage.backgroundColor = '#192504';
    game.world.setBounds(0, 0, 900, 1920);
    
    ['allObjects', 'players', 'creeps', 'spears', 'obstacles', 'logs', 'bases'].forEach(function(group) {
      groups[group] = game.add.group();
      groups[group].setAll('checkWorldBounds', true);
      //groups[group].setAll('outOfBoundsKill', true);
    }, this);

    reticle = {};
    reticle.object = game.add.image(600,600, 'reticle');
    reticle.object.anchor.set(0, 0.5);
    reticle.object.scale.setTo(0,0);
    reticle.xScale = 0;
    reticle.yScale = 0;

    var myTeamInfo = findTeamSlot(lobby, mySocketID);

    setTimeout(function(){
      socket.emit('spawn', 
        randomSpawnLocation(
          spawns[myTeamInfo.team].x,
          spawns[myTeamInfo.team].y,
          80 //randomradius
        ));
      controls.create();
      enableMovement = true;
    }, 1000)

    socket.emit('getplayers');

    obj_camera.create();
    // ambient.create();

    mapInit(lobby.mapData);
  }

  function update() {


    delta = game.time.elapsedMS/100 ; //Turn this into a ratio

    if (enableMovement) {
      controls.update();
    }

    obstacles.forEach(function(obstacle) {
      obj_obstacle.update(obstacle);
    }, this);

    logs.forEach(function(log) {
      obj_log.update(log);
    }, this);

    pinetrees.forEach(function(pinetree) {
      obj_pinetree.update(pinetree);
    }, this);

    towers.forEach(function(tower) {
      obj_tower.update(tower);
    }, this);

    bases.forEach(function(base) {
      obj_base.update(base);
    }, this);

    spears.forEach(function(spear) {
      obj_spear.update(spear);
    }, this);

    towerSpears.forEach(function(spear) {
      obj_tower_spear.update(spear);
    }, this);

    players.forEach(function(player) {
       obj_player.update(player);
    }, this);

    creeps.forEach(function(creep) {
       obj_creep.update(creep);
    }, this);

    obj_camera.update();
    // ambient.update();

    game.debug.text(game.time.fps, 2, 14, "#00ff00");

    groups.allObjects.sort('depth', Phaser.Group.SORT_ASCENDING);

  }

  /*jshint validthis:true */
  game = new Phaser.Game(canvasElement.offsetWidth, canvasElement.offsetHeight, Phaser.AUTO, 'spetsad-canvas', {preload: preload, create: create, update: update});

}