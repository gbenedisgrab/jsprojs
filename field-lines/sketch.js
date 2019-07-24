let lineRatio=36;
let lineRatioSlider;
let particles=[];
let lastDraggedPos; // this is for draging but could probably put in particle object
let dragging = null;
let buffer = 25;
let dotSpacing = 160;
let c1;
let c2;
let clickZone = 20;
let fr;

function updateFieldLines() {
  for (let p of particles){
    p.linesDone=false;
    p.fields = [];
  }
}

function setup() {
  c1 = color(235,60,0,90);
  c2 = color(50,230,6,90);
  createCanvas(600, 600);
  repeats=6;
  // lineRatioSlider = createSlider(2,48,24);
  // lineRatioSlider.position(5,15);
  // fr = createSlider(10,60,45);
  // fr.position(5,49);
  //debugging
  // particles[0] = new Particle(2,createVector(180,300));
  // particles[1] = new Particle(-1,createVector(420,300));
  //set up the board with 6 charges
  for (let q=-2;q<3;q+=1) {
    if (q == 0.0) continue;
    let p = new Particle(q,createVector(random(buffer,width-buffer),
      random(buffer,height-buffer)));
    particles.push(p);
  }
}

function draw() {
//  frameRate(fr.value());
  background(248);
  // if (lineRatioSlider.value() != lineRatio) {
  //   lineRatio = lineRatioSlider.value();
  //   updateFieldLines();
  // }
  // fill(0);
  // text('line density  '+lineRatio.toString(),10,11);
  // text('framerate  '+fr.value().toString(),10,45);
  let sourceLinesDone=true;
  for (let p of particles) {
    if (p.q>0 && !p.linesDone) sourceLinesDone=false;
  }

  let allowedCharges = int(frameCount/20)+1;
  for(let p of particles){
    p.show();

    p.update(sourceLinesDone);
    if (p.q>0) allowedCharges--;
    if (allowedCharges==0) return;
  }
  if(dragging && dragging.pos.dist(lastDraggedPos)>.1) {
    updateFieldLines();
    lastDraggedPos=dragging.pos;
  }
}

function mousePressed() {
  linesDone=false;
  for (let p of particles){
    if (p.pos.dist(createVector(mouseX,mouseY))<20) {
      dragging = p;
      lastDraggedPos = p.pos;
      p.offset = createVector(mouseX,mouseY).sub(p.pos).mult(-1);
    }
  }
}

function mouseReleased() {
  if(dragging.pos.dist(lastDraggedPos)>.1) updateFieldLines();
  dragging = null;
}
