class Particle {
  constructor(q,pos) {
    this.q = q;
    this.pos = pos;
    this.fields = [];
    this.rollover=false;
    this.linesDone = false;
  }

  displayValue() {
    textAlign(CENTER,CENTER);
    fill(0,240,50);
    if (dragging==this) fill(0,200,70);
    strokeWeight(0);
    circle(0,0,40);
    fill(255);
    textSize(20);
    let chargeDisplay = (this.q>0 ? "+" : "") + this.q.toString();
    text(chargeDisplay,0,0);
    // fill(0);
    // text(this.fields.length,30,-30);
  }

  createSourceLine(i) {
    let angle = i*2*PI/(this.q*lineRatio);
    let l = createVector(sin(angle),cos(angle));
    this.fields.push(new FieldLine(l,this.q/abs(this.q),i,this));
  }
  createSinkLines() {
    if (this.angles == null){
      let headings =[];
      for (let l of this.fields) {
        let vec = new p5.Vector.sub(this.pos,l.particle.pos);
        let cur = l.line[l.line.length-1];
        headings.push([vec.sub(cur).mult(-1).heading(),l]);
      }
      headings.sort((a,b) => a[0] - b[0]);
      headings.push([headings[0][0]+2*PI,headings[0][1]])

      this.angles=[];

      let maxGap=0;
      let chosen=[];
      for(let i=1;i<headings.length;i++){
        if (headings[i][0] - headings[i-1][0] > maxGap) {
          maxGap = headings[i][0] - headings[i-1][0];
          chosen = [headings[i-1][0], headings[i][0]];
        }
      }
      this.angles.push[chosen];

      // would like to add more features here such as
      // finding the spaces not to the same particle.

      let index = this.fields.length;
      let numLines = abs(this.q)*lineRatio;
      let interval = (chosen[1]-chosen[0]) / (numLines-index+1);

      for (let angle = chosen[0]+interval;angle<chosen[1];angle+=interval) {
        let pos = createVector(4*cos(angle),4*sin(angle));
        this.fields.push(new FieldLine(pos,-1,this.fields.length,this));
      }


    }
  }

    update(sourceLinesDone) {
      if (!sourceLinesDone) this.angles=null;
      let mouse=createVector(mouseX,mouseY);
      if (mouse.dist(this.pos) < clickZone) {
        this.rollover= true;
      } else {
        this.rollover=false;
      }
      if (dragging==this){
        this.pos = mouse.add(this.offset);
      }
      for(let l of this.fields){
        l.update();
      }
      let index = this.fields.length;
      let numLines = abs(this.q)*lineRatio;
      if (/* frameCount%8 == 0 && */ index < numLines){
        if (this.q > 0) this.createSourceLine(index);
        else if(sourceLinesDone) this.createSinkLines();
      }
    }


  show() {
    push();
    translate(this.pos.x,this.pos.y);
    //show the field lines
    for (let l of this.fields){
      if (l.particle.pos == this.pos) l.show(this.rollover==true);
    }
    if (this.fields.length == 0 || this.rollover || dragging != null){
      this.displayValue();
    }

    pop();
  }
}
