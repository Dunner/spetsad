var forrest = {};

forrest.init = function() {

  var room = {};
  room.width = 1920;
  room.height = 1920;


  createTreesInArea(150, 150, 800, 1920, 150, 6, 3)

  createTreesInArea(1300, 150, 1920, 1920, 150, 6, 3)

  function createTreesInArea(x0,y0,x1,y1,density,maxHeight,minHeight) {

    var areaWidth = (x1 - x0),
        areaHeight = (y1 - y0),

        xAmount = areaWidth / density,
        yAmount = areaHeight / density;

    for (var w = 0; w < xAmount; w++) {
      for (var h = 0; h < yAmount; h++) {
        obj_pinetree.create({
          x: x0 + ((areaWidth / xAmount) * w) - ( (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * density - density/5) + density/5 ),
          y: y0 + ((areaHeight / yAmount) * h) - ( (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * density - density/5) + density/5 ),
          diameter: 40,
          height: Math.floor(Math.random() * maxHeight) + minHeight,
        });
      }
    }

  }

}