
function stretchWrapper() {
  var stretchWrapperEl = document.getElementById('stretchWrapper'),
      parent = stretchWrapperEl.offsetParent,
      wh = parent.offsetHeight,
      ww = parent.offsetWidth,
      dh = wh,
      dw = wh/2;

  if (ww < dh/2) {
    dh = ww*2;
    dw = ww;
  } else {
    dh = (wh/10 * 8);
    dw = dh/1.3333;
  }

  var css ={
    'height': (dh/wh * 100) + '%',
    'width': (dw/ww) * 100 + '%',
    'background': 'black',
    'position': 'absolute',
    'top': ((100 - (dh/wh * 100))/2) +'%',
    'left': ((100 - (dw/ww * 100))/2) +'%',
    'border-width': (dw/150) + 'px'
  };
  for (var key in css){
    stretchWrapperEl.style[key] = css[key];
  }
}

(function(){
  stretchWrapper();
})();

window.onresize = function(event) {
  stretchWrapper();
};

