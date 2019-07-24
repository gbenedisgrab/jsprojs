function drawForce() {
    force = calcForce(q1.value(),pos1,q2.value(),pos2).div(2);
    if (force == null) {
      inf = true;
      return;
    }
    inf = false;
    push();
    translate(pos2.x,pos2.y);
    stroke(255);
    strokeWeight(5);
    line(0,0,force.x,force.y);
    translate(force.x,force.y)
    fill(255);
    strokeWeight(0);
    rotate(force.heading()-PI/2);
    triangle(-10,0,10,0,0,force.mag()>20 ? 20 : force.mag()); // figure this out
    pop();
}

function calcForce(q1, pos1, q2, pos2){ //in C,C,m
  let K = 9*Math.pow(10,5); //K = 9*10**9 Nm**2/C**2
  distance = pos1.dist(pos2);
  if (distance == 0) return null;
  let fmag = K*q1*q2 / (distance*distance); // scalar magnitude of force
  return p5.Vector.sub(pos1,pos2).normalize().mult(fmag);
}

function drawParticle(pos) {
  if (dragging) {
    fill (150,0,0);
  } else if (rollover) {
    fill(255,0,0);
  } else {
    fill(200, 0,0);
  }
  strokeWeight(0);
  circle(pos.x,pos.y,50);
}

var dragging = false; // Is particle 2  being dragged?
var rollover = false; // Is the mouse over particle 2?
var offset;    // Mouseclick offset
let q1,q2,pos1,pos2,distance,force,inf;

function setup() {
  createCanvas(600, 600);
  pos1 = createVector(width/2,height/2);
  pos2 = createVector(width/2+100,height/2 + 100);
  q1 = createSlider(-3,3,1);
  q1.position(450,25);
  q2 = createSlider(-3,3,1);
  q2.position(450,65);
  textSize(20);
}

function draw() {
  background(200);
  // Is mouse over object
  if (dist(mouseX,mouseY,pos2.x,pos2.y)<50) {
    rollover = true;
  }
  else {
    rollover = false;
  }
  // Adjust location if being dragged
  if (dragging) {
    pos2 = createVector(mouseX,mouseY).add(offset);
  }
  strokeWeight(0);
  fill(255,0,0);
  circle(pos1.x,pos1.y,50);
  textAlign(CENTER,CENTER);
  fill(255);
  text("p1",pos1.x,pos1.y);
  drawParticle(pos2);
  drawForce();
  let distDisplay = "dist = "+round(distance).toString() + " cm";
  let forceDisplay;
  if (inf) forceDisplay = "force is infinate";
  else forceDisplay = "force = "+round(force.mag()).toString() + " N";
  fill(0);
  textAlign(LEFT);
  text("q1 ="+q1.value().toString() + " C",450,20);
  text("q2 ="+q2.value().toString() + " C",450,60);
  text(distDisplay,450,105);
  text(forceDisplay,450,130);
}

function mousePressed() {
  // Did I click on the rectangle?
  if (dist(mouseX,mouseY,pos2.x,pos2.y)<50) {
    dragging = true;
    // If so, keep track of relative location of click to corner of rectangle
    offset = createVector(pos2.x - mouseX, pos2.y-mouseY);
  }
}

function mouseReleased() {
  dragging = false; // Quit dragging
}
