let immoons;
let lat, long, speed; // latitutude slider
let bigSphere;
let timeForward = 1;


function createButtons() {
  lat = createSlider(-90,90,40).position(10,10);
  long = createSlider(-180,180,-75).position(560,10);
  speed = createSlider(1,60,5).position(10,height-20);
  createButton("toggle constellations").mousePressed(()=>bigSphere.constellations = !bigSphere.constellations).position(10,60);
  createButton("now").mousePressed(()=>bigSphere.resetTime()).position(10,120);
  createButton("switch direction").mousePressed(()=>timeForward = -1*timeForward).position(10,90);
}

function preload(){
  immoons = loadImage('https://cdn.glitch.com/4e2a7495-b9af-44fb-aa1e-23fbb9e076e6%2Fmoons.png?v=1566937176360');
  //print(immoons);
}
function setup() {
  createCanvas(700, 700); // consider doing the full width
  createButtons();
  bigSphere = new BigSphere(starData);
}

function draw() {
  frameRate(speed.value());
  bigSphere.shiftTime(timeForward*.99729); // change clock by ...
  bigSphere.project(); // adding in the lat and long for this

}
