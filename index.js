window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
})();
var w, h, minW;
var show = document.querySelector("#show");
function showi(str){
  show.innerHTML = str;
}
var oClock = document.querySelector("#clock");
var tStyle = true;

function getTime(){
  var t = new Date();
  if(tStyle){
    oClock.innerHTML = add0(t.getHours())+" : "+add0(t.getMinutes())+" <span class='sec'>"+add0(t.getSeconds())+"</span>";
  }else{
    var h = t.getHours();
    var str = h<12 ? "AM" : "PM";
    h = h<=12 ? h : h-12;
    oClock.innerHTML = "<span id='time'>"+add0(h)+" : "+add0(t.getMinutes())+" <span class='sec'>"+add0(t.getSeconds())+"</span><span class='st'>"+str+"</span></span>";
  }
};
function autoTime(){
  getTime();
  setTimeout(autoTime, 1000);
}
function add0(n){
  return n<10 ? '0'+n : ''+n;
}
autoTime();
var can = document.querySelector("#can");
function resize(){
  can.width = w = window.innerWidth;
  can.height = h = window.innerHeight;
  minW = Math.min(w, h);
  oClock.style.width = w+'px';
  oClock.style.height = oClock.style.lineHeight = h+'px';
};
resize();
oClock.style.fontSize = Math.floor(h/300*20) + 'px';
window.onresize = resize;

var param = {
  style : 1,
  r : 0.5,
  color : "rgba(255,0,0,0.8)",
  blurColor : "red",
  arr1 : [],
  arr2 : [],
  isRotate : true,
  offsetAngle : 0,
  arr : [],
  waveArr : new Array(120),
  cX : 0.5,
  cY : 0.5,
  tX : 50,
  tY : 50,
  range : 1
};
var ctx = can.getContext("2d");
ctx.strokeStyle = param.color;
ctx.lineWidth = 3;
ctx.shadowBlur = 15;
ctx.shadowColor = param.blurColor;
window.wallpaperPropertyListener={
        applyUserProperties: function(properties){

    document.body.style.backgroundImage = "url('002_1.png')";
    document.body.style.backgroundSize = '100% 100%';

    if(properties.style){
      param.style = properties.style.value;
    };
    if(properties.radius){
      param.r = properties.radius.value/100;
    };
    if(properties.range){
      param.range = properties.range.value/5;
    };
    if(properties.color){
      var c = properties.color.value.split(' ').map(function(c){return Math.ceil(c*255)});
      ctx.strokeStyle = param.color = 'rgba('+ c +',0.8)';
      oClock.style.color = 'rgb('+c+')';
    };
    if(properties.blurColor){
      var c = properties.blurColor.value.split(' ').map(function(c){return Math.ceil(c*255)});
      ctx.shadowColor = param.blurColor = 'rgb('+ c +')';
      oClock.style.textShadow = '0 0 20px rgb('+c+')';
    };
    if(properties.showTime){
      oClock.style.display = properties.showTime.value ? 'block' : 'none';
    };
    if(properties.cX){
      param.cX = properties.cX.value*0.01;
    };
    if(properties.cY){
      param.cY = properties.cY.value*0.01;
    };
    if(properties.tX){
      param.tX = properties.tX.value;
      oClock.style.left = param.tX-50+'%';
    };
    if(properties.tY){
      param.tY = properties.tY.value;
      oClock.style.top = param.tY-50+'%';
    };
    if(properties.tSize){
      var s = properties.tSize.value;
      oClock.style.fontSize = Math.floor(h/300*s) + 'px';
    };
    if(properties.tStyle){
      tStyle = properties.tStyle.value;
      getTime();
    };
    if(properties.isRotate){
      param.isRotate = properties.isRotate.value;
    };
    if (properties.snow) {
      if (properties.snow.value) {
        snowStorm.start();
      }
    }
  }
}
function createPoint(arr){
  param.arr1 = [];
  param.arr2 = [];
  for(var i=0; i<120; i++){
    var deg = Math.PI/180*(i+param.offsetAngle)*3;
    var w1 = arr[i] ? arr[i] : 0;
    var w2;
    if(param.waveArr[i]){
      w2 = param.waveArr[i] - 0.1;
    }else{
      w2 = 0;
    };
    w1 = Math.max(w1, w2);
    param.waveArr[i] = w1 = Math.min(w1, 1.2);
    var w = w1*param.range*100;
    var offset1 = param.r*minW/2+w+1;
    var offset2 = param.r*minW/2-w-1;
    var p1 = getXY(offset1, deg);
    var p2 = getXY(offset2, deg);
    param.arr1.push({'x':p1.x, 'y':p1.y});
    param.arr2.push({'x':p2.x, 'y':p2.y});
  };
  if(param.isRotate){
    param.offsetAngle += 1/5;
    if(param.offsetAngle>=360) param.offsetAngle = 0;
  };
};
function getXY(offset, deg){
  return {'x':Math.cos(deg)*offset+param.cX*w, 'y':Math.sin(deg)*offset+param.cY*h};
};
createPoint([]);
function style1(){
  ctx.beginPath();
  ctx.moveTo(param.arr1[0].x, param.arr1[0].y);
  for(var i=0; i<120; i++){
    ctx.lineTo(param.arr1[i].x, param.arr1[i].y);
  };
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(param.arr2[0].x, param.arr2[0].y);
  for(var i=0; i<120; i++){
    ctx.lineTo(param.arr2[i].x, param.arr2[i].y);
  };
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  for(var i=0; i<120; i++){
    ctx.moveTo(param.arr1[i].x, param.arr1[i].y);
    ctx.lineTo(param.arr2[i].x, param.arr2[i].y);
  };
  ctx.closePath();
  ctx.stroke();
};
function style2(){
  ctx.beginPath();
  for(var i=0; i<120; i++){
    ctx.moveTo(param.arr1[i].x, param.arr1[i].y);
    ctx.lineTo(param.arr2[i].x, param.arr2[i].y);
  };
  ctx.closePath();
  ctx.stroke();
};
style1();
window.wallpaperRegisterAudioListener && window.wallpaperRegisterAudioListener(wallpaperAudioListener);
function wallpaperAudioListener(arr){
  ctx.clearRect(0,0,w,h);
  createPoint(arr);
  switch (param.style) {
    case 1:
    style1();
    break;
    case 2:
    style2();
    break;
  }
}
