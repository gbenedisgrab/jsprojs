
let spacing = 20;
let repeats;

class FieldLine {
  constructor(startPos,sign,index,p) { // ppos is parent position
    this.particle = p // parent particle
    this.line =[startPos];
    this.sign = sign;
    this.index = index;
    this.done = false;
    this.frame = 0; // creates animation effects
  }
  calcForce(q, vec){ //in C,C,m
    // technically K=9*10^9 Nm^2/C^2 but constants don't matter for sim.
    return vec.copy().normalize().mult(q/(vec.mag()*vec.mag()));
  }

  update() {
    this.frame++;
    for (let i=0;i<repeats;i++){
      let last = this.line[this.line.length-1];
      let pos = last.copy().add(this.particle.pos);
      if (pos.x < -buffer || pos.x > width+buffer || pos.y < -buffer || pos.y > height + buffer){
        this.done = true;
        return;
      }
      if (this.done == true || last.mag()>1100 || this.line.length>3000) {
        let allDone = true;
        this.done = true;
        for(let l of this.particle.fields){
          if (l.done == false) allDone=false;
        }
        this.particle.linesDone = allDone;
        return;
      }
      for(let p of particles){
        if (p.q<0) {
          if (p.pos.dist(last.copy().add(this.particle.pos)) < 2) {
            p.fields.push(this);
            this.done = true;
            let allDone = true;
            for(let l of this.particle.fields){
              if (l.done == false) allDone=false;
            }
            this.particle.linesDone = allDone;
            return;
          }
        }
      }
      // compute force and normalize at x
      let force = createVector(0,0);
      let force2 = createVector(0,0);
      for (let p of particles) {
        let vec = p5.Vector.add(this.particle.pos,last).sub(p.pos);
        force.add(this.calcForce(p.q,vec));
      }
      force.normalize().mult(this.sign);
      //compute force and normalize at x'
      for (let p of particles) {
        let vec = p5.Vector.add(this.particle.pos,last).sub(p.pos);
        force2.add(this.calcForce(p.q,vec.add(force)));
        //force.add(calcForce(p.q,vec.add(force)));
      }
      force2.normalize().mult(this.sign);
      force.add(force2).normalize(); // average
      this.line.push(force.add(last));
    }
  }

  show(rollover){

    //optimize for screen viewing only
    if (this.line.length==0) return;

    let step = 12;
    stroke(0,40,230,30);
    if (rollover) stroke(205,100,0,120);
    noFill();
    strokeWeight(1);
    beginShape();
    vertex(this.line[0].x,this.line[0].y);
    for (let i=step;i<this.line.length;i+=step){
      vertex(this.line[i].x,this.line[i].y);
    }
    vertex(this.line[this.line.length-1].x,this.line[this.line.length-1].y);
    endShape();
    if (this.sign == -1) {
      let dotStep = dotSpacing;
      let offset = this.index*10;
      strokeWeight(12);
      let curPos = (frameCount+offset)%dotStep;
      for (let i=dotStep-curPos;i<this.line.length;i+=dotStep){
          if (i>this.frame) break;
          stroke(lerpColor(c1,c2,map(i,1,this.line.length,0,1)));
          point(this.line[i].x,this.line[i].y);
      }

      return;
    }

    let dotStep = 120;
    let offset = this.index*10
    strokeWeight(12);
    for (let i=((frameCount+offset)%dotStep);i<this.line.length;i+=dotStep){
        if (i>this.frame) break;
        stroke(lerpColor(c2,c1,map(i,1,this.line.length,0,1)));
        point(this.line[i].x,this.line[i].y);
    }

  }
}
