var increment = 0;

window.generateJSON = function() {
  increment = 0;

  var trees = createTreesInArea(0, 0, 350, 1920, 100, 6, 3)
      .concat(createTreesInArea(650, 0, 900, 1920, 100, 6, 3));

  console.log(trees);

}


function createTreesInArea(x0,y0,x1,y1,density,maxHeight,minHeight) {

  var i = increment++,
      trees = [],

      areaWidth = (x1 - x0),
      areaHeight = (y1 - y0),

      xAmount = areaWidth / density,
      yAmount = areaHeight / density;

  for (var w = 0; w < xAmount; w++) {
    for (var h = 0; h < yAmount; h++) {
      trees.push({
        id: i,
        angle: Math.floor(Math.random()*(360-0+1)+0),
        x: x0 + ((areaWidth / xAmount) * w) - ( (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * density - density/5) + density/5 ),
        y: y0 + ((areaHeight / yAmount) * h) - ( (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * density - density/5) + density/5 ),
        sections: Math.floor(Math.random() * maxHeight) + minHeight,
      });
      i++;
    }
  }
  return trees;

}