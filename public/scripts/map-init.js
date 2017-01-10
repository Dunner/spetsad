

var mapInit = function(mapData) {
  
  //Bases create
  for(var team in mapData.bases) {
    var base = mapData.bases[team];
    obj_base.create({
      id: base.id,
      team: base.team,
      x: base.x,
      y: base.y
    });
  }
  //Trees create
  for (var i = 0; i < mapData.trees.length; i++) {
    var tree = mapData.trees[i];
    obj_pinetree.create({
      id: tree.id,
      x: tree.x,
      y: tree.y,
      sections: tree.sections
    });
  }
  //Towers create
  for(var team in mapData.towers) {
    mapData.towers[team].forEach(function(tower){
      obj_tower.create({
        id: tower.id,
        team: tower.team,
        healthMax: tower.healthMax,
        health: tower.health,
        x: tower.x,
        y: tower.y
      });
    });
  }


}