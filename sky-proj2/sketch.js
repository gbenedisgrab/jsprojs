let lat, long, speed; // latitutude slider
let bigSphere;
let secondsJ2000; // I think this should be part of the big sphere

function createButtons() {
  lat = createSlider(-90,90,40).position(10,10);
  long = createSlider(-180,180,-75).position(560,10);
  speed = createSlider(-40,40,0).position(10,height-20);
  createButton("toggle constellations").mousePressed(()=>bigSphere.constellations = !bigSphere.constellations).position(10,60);
  createButton("now").mousePressed(()=>bigSphere.resetTime()).position(10,120);
  createButton("stop").mousePressed(()=>speed.value(0)).position(10,90);
}

function setup() {
  frameRate(20);
  createCanvas(700, 700); // consider doing the full width
  createButtons();
  bigSphere = new BigSphere(starData);
}

function draw() {
  bigSphere.shiftTime(speed.value()*60); // change clock by ...
  bigSphere.project(); // adding in the lat and long for this
}
