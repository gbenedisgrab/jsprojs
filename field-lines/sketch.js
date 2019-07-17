class Particle {
  constructor(q,m,pos,vel) {
    this.q = q;
    this.pos = pos;
    this.vel = vel;
    this.mass = m
    this.force = createVector(0,0);
  }
  calcForce(){
    let force = createVector(0,0);
    for (let p of particles) {
      if (p != this) {
        force = force.add(eForce(this.q,this.pos,p.q,p.pos));
      }
    }
    return force;
  }
  drawVector(v,shade) {
    push();
    translate(this.pos.x,this.pos.y);
    stroke(shade);
    strokeWeight(5);
    line(0,0,v.x,v.y);
    translate(v.x,v.y)
    fill(shade);
    strokeWeight(0);
    rotate(v.heading()+PI/2);
    triangle(-10,0,10,0,0,-20);
    pop();
  }

  update(){
    this.force = this.calcForce();
    if (this.force.mag()>1000) pause=true;
    this.vel.add(this.force.div(this.mass));
    this.pos.add(this.vel.copy().div(100));
  }

  show() {
    fill(255,0,0);
    strokeWeight(0);
    circle(this.pos.x,this.pos.y,50);
    this.drawVector(this.force.copy().div(5),255);
    this.drawVector(this.vel.copy().div(50),0);
  }
}

function eForce(q1, pos1, q2, pos2){ //in C,C,m
  let K = 9*Math.pow(10,5); //K = 9*10**9 Nm**2/C**2
  let dist = pos1.dist(pos2)
  let v = p5.Vector.sub(pos1,pos2);
  return v.copy().normalize().mult((K*q1*q2) / (dist*dist));
}

let particles = [];
let pause=false;

function setup() {
  createCanvas(600, 600);
  particles[0] = new Particle(-1,.1,createVector(50,300),createVector(0,-1600));
  particles[1] = new Particle(1,180,createVector(300,300),createVector(0,0));
  setFrameRate(10);
}

function draw() {
  if (pause) return;
  background(200);
  for(let p of particles) {
    p.show();
    p.update();
  }
}
