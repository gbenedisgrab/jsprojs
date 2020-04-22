class BigSphere {
  constructor(star,conname) {
    this.star = star
    this.conname = conname
    this.initStars(this.star)
    this.constellations = true;
    this.resetTime();
  }

  shiftTime(s){
    this.sJ2000 += s;
  }

  resetTime(){
    this.sJ2000 = (new Date().getTime() - 946728000000)/1000;
  }

  initStars (star) {
    for (let s of star) {
      if (s.mag<3.5) {
        s.color = this.bv_to_rgb(s.bv);
        s.radius = 6 - 1 * s.mag;
      } else {
        let gray = 210 - Math.round(( s.mag - 3.5) * 80.0);
        s.color = "#" + ( 1 << 24 | gray << 16 | gray << 8 | gray ).toString( 16 ).slice( 1 );
        s.radius = 1;
      }
    }
  }

  getFormattedDate() {
    let d = new Date( this.sJ2000 * 1000 + 946728000000);
    var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
  ("00" + d.getHours()).slice (-2) + ":00";
    return datestring;
  }

  stereographicProjection(pos)
  {
    // rotate the Earth according to current time.
     let size = width-60;
     let ra = pos.ra - 7.292115090e-5 * this.sJ2000;
     //ra += 7.292115090e-5 * 60*60*7.7; // I have no idea why off by 8.5 hours of rotation approximately
     let phi = pos.dec;  // star position
     let lam = ra;
     let phi1 = lat.value()*1.74532925199433e-2;
     let lam0 = (long.value()-90)*1.74532925199433e-2;
     let k = (size/2) /(1+Math.sin(phi1)*Math.sin(phi)+Math.cos(phi1)*Math.cos(phi)*Math.cos(lam-lam0));
     let x = -1*k*Math.cos(phi)*Math.sin(lam-lam0);
     let y = -1*k*(Math.cos(phi1)*Math.sin(phi)-Math.sin(phi1)*Math.cos(phi)*Math.cos(lam-lam0));
     if (Math.pow(x,2)+Math.pow(y,2)<size*size/4) pos.visible = true;
     else pos.visible = false;
     pos.x = x;
     pos.y = y;
  }

  setupSky() {  // graphics for the sky background and sliders
    background(40);
    noStroke();
    fill(185);
    circle(width/2,height/2,width-10);
    fill(6,9,22);
    circle(width/2,height/2,width-60); // the sky
    // text elements
    fill(20,125,30);
    textSize(28);
    textAlign(CENTER,CENTER);
    text( "N", width / 2, 18 );
    text( "S", width / 2, height-17);
    text( "E", 17, height / 2 );
    text( "W", width - 18, height / 2);
    fill(180);
    textSize(24);
    text(this.getFormattedDate(),width-100,height-20);
  // text labels for sliders
    fill(215);
    textAlign(LEFT);
    textSize(24);
    text("lat = "+lat.value(),28,40);
    text("speed (h/f) = "+speed.value(),8,height-33);
    text("long = "+long.value(),570,40);
  }

  project(){
     this.setupSky();
     translate(width/2,height/2);
     if (this.constellations) { // constellation lines
       stroke("#404040");
       strokeWeight(1);
       for (let l of conline) {
         let s1 = this.star[l[0]];
         let s2 = this.star[l[1]];
         if ( s1.pos.visible && s2.pos.visible ) {
            line(s1.pos.x,s1.pos.y,s2.pos.x,s2.pos.y);
         }
       }
     }
     for ( let s of this.star) { // stars
       this.stereographicProjection(s.pos);
       stroke(s.color);
       strokeWeight(s.radius);
       point(s.pos.x,s.pos.y);
     }
     if (this.constellations) { // constellation labels
       textAlign(CENTER);
       fill(120,150,252,160);
       textSize(9);
       for (let c of conname) {
         this.stereographicProjection(c.pos);
         if (c.pos.visible) {
           text(c.name.toUpperCase(),c.pos.x,c.pos.y );
         }
       }
      }
  }

  bv_to_rgb(bv) { // This creates the coloration of the stars
    let t = 4600 * ((1 / ((0.92 * bv) + 1.7)) +(1 / ((0.92 * bv) + 0.62)) )
    // t to xyY
    let x, y = 0
    if (t >= 1667 & t <= 4000) {
      x = ((-0.2661239 * Math.pow(10,9)) / Math.pow(t,3)) + ((-0.2343580 * Math.pow(10,6)) / Math.pow(t,2)) + ((0.8776956 * Math.pow(10,3)) / t) + 0.179910
    } else if (t > 4000) {
      x = ((-3.0258469 * Math.pow(10,9)) / Math.pow(t,3)) + ((2.1070379 * Math.pow(10,6)) / Math.pow(t,2)) + ((0.2226347 * Math.pow(10,3)) / t) + 0.240390
    }
    if (t >= 1667 & t <= 2222) {
      y = -1.1063814 * Math.pow(x,3) - 1.34811020 * Math.pow(x,2) + 2.18555832 * x - 0.20219683
    } else if (t > 2222 & t <= 4000) {
      y = -0.9549476 * Math.pow(x,3) - 1.37418593 * Math.pow(x,2) + 2.09137015 * x - 0.16748867
    } else if (t > 4000) {
      y = 3.0817580 * Math.pow(x,3) - 5.87338670 * Math.pow(x,2) + 3.75112997 * x - 0.37001483
    }
    // xyY to XYZ, Y = 1
    var Y = 1.0
    var X = (y == 0)? 0 : (x * Y) / y
    var Z = (y == 0)? 0 : ((1 - x - y) * Y) / y
    //XYZ to rgb
    var r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z
    var g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z
    var b = 0.0557 * X - 0.2040 * Y + 1.0570 * Z
    //linear RGB to sRGB
    var R = (r <= 0.0031308)? 12.92*r : 1.055*Math.pow(r,1/0.5)-0.055
    var G = (g <= 0.0031308)? 12.92*g : 1.055*Math.pow(g,1/0.5)-0.055
    var B = (b <= 0.0031308)? 12.92*b : 1.055*Math.pow(b,1/0.5)-0.055
    return [Math.round(R*255),Math.round(G*255),Math.round(B*255)];
  }

}
