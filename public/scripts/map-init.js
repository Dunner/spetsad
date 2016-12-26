

var mapInit = function(mapData) {
  
  //Bases create
  for (var i = 0; i < mapData.bases.length; i++) {
    var base = mapData.bases[i];
    obj_base.create({
      id: base.id,
      team: base.team,
      x: base.x,
      y: base.y,
    });
  }
  //Trees create
  for (var i = 0; i < mapData.trees.length; i++) {
    var tree = mapData.trees[i];
    obj_pinetree.create({
      id: tree.id,
      x: tree.x,
      y: tree.y,
      sections: tree.sections,
    });
  }
  //Towers create
  for (var i = 0; i < mapData.towers.length; i++) {
    var tower = mapData.towers[i];
    obj_tower.create({
      id: tower.id,
      team: tower.team,
      x: tower.x,
      y: tower.y,
    });
  }


}