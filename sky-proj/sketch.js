let observer; // object for the observer
let lat,long; // latitutude slider
let speed; // speed of simulation
let reset; // reset button

function setupSky() {  // graphics for the sky background and sliders
  background(220);
  noStroke();
  fill(0);
  circle(width/2,height/2,width-60); // the sky
  // text elements
  fill(0,255,0);
  textAlign(CENTER,CENTER);
  text( "N", ( width - 12 ) / 2, 12 );
  text( "S", ( width - 12 ) / 2, height-12);
  text( "E", 12, height / 2 );
  text( "W", width - 12, height / 2);
  fill(180);

  text(observer.getFormattedDate(),width/2,height/2);
// text labels for sliders
  fill(0);
  textAlign(LEFT);
  textSize(24);
  text("lat = "+lat.value(),8,40);
  text("t step = "+speed.value(),8,height-33);
  text("long = "+long.value(),470,40);
}

function init_stars( star )
// I need to fix this color thing
// this is going to be work but it is okay
{
   var clut = [  // coloration of the stars based on the bv value from Yale
      "#AEC1FF",  /* bv = -0.4 */
      "#C5D3FF",
      "#EAEDFF",
      "#FFF6F3",
      "#FFEAD3",
      "#FFE1B4",
      "#FFD7A6",
      "#FFC682",
      "#FF4500"   /* bv =  2.0 */
   ];

   for ( var i = 0; i < star.length; i++ ) {
      if ( star[ i ].mag < 3.5 ) {
        let cindex = Math.round( 8 * ( star[ i ].bv + 0.4 ) / 2.4 );
        cindex = Math.max( 0, Math.min( 8, cindex ));
        star[ i ].color = clut[ cindex ];
        star[ i ].radius = 3.1 - 0.6 * star[ i ].mag;   // 1.0 to 4.0
      }
      else {
         var gray = 160 - Math.round(( star[ i ].mag - 3.5 ) * 80.0 );
         star[ i ].color = "#" + ( 1 << 24 | gray << 16 | gray << 8 | gray ).toString( 16 ).slice( 1 );
         star[ i ].radius = 1;
      }
   }
}

function azimuthal(pos,lat,lon){

     var slat = Math.sin( lat );
     var clat = Math.cos( lat );
     var sx   = Math.sin( from[ 0 ] );
     var cx   = Math.cos( from[ 0 ] );
     var sy   = Math.sin( from[ 1 ] );
     var cy   = Math.cos( from[ 1 ] );

     to[ 0 ] = Math.atan2( -cy * sx, -cy * cx * slat + sy * clat );
     to[ 1 ] = Math.asin( sy * slat + cy * clat * cx );
}

function skypos_transform( starPos, observer, w, h )
{
   let coord = [ starPos.ra, starPos.dec ];

    // I took out the precession for now - it is not the bottleN
   //Astro.precess( Astro.JD_J2000, now.jd, coord );

   coord[ 0 ] = observer.lst - coord[ 0 ]; // this is doing the spin and longitude

   //print(coord[0]);
   Astro.aa_hadec( observer.latitude, coord, coord ); // this is doing the azimuthal
   if ( coord[ 1 ] < 0 ) {
      starPos.visible = false;
      var tmp = 0.5 - coord[ 1 ] / Math.PI; // what is this

   }
   else {
      starPos.visible = true;
      var tmp = 0.5 - coord[ 1 ] / Math.PI; // what is this

      starPos.x = (w) * ( 0.5 - tmp * Math.sin( coord[ 0 ] ));
      starPos.y = (h) * ( 0.5 - tmp * Math.cos( coord[ 0 ] ));
   }
   //print(starPos.x,starPos.y);
   return [starPos.x,starPos.y];
}

function drawSky(){
   // draw stars
   for ( let i = 0; i < star.length; i++ ) {
      let plot = skypos_transform( star[ i ].pos, observer, width-60, height-60 );
      if ( star[ i ].pos.visible ) {
        fill(star[i].color);
        circle(plot[0],plot[1],star[i].radius);
      }
   }
}

function setup() {
  createCanvas(700, 700);
  frameRate(20);
  lat = createSlider(-90,90,40);
  lat.position(10,10);
  long = createSlider(-180,180,-75);
  long.position(460,10);
  speed = createSlider(-20,20,0);
  speed.position(10,height-20);
  reset = createButton("now");
  reset.mousePressed(()=>observer.setDate(new Date()));
  observer = new Observer(); // create observer for sky
  init_stars(star);
}

function draw() {
  observer.incMinutes(speed.value()); // animate by changing time.
  if (observer.getLatDegrees() != lat.value()) {
    observer.setLatDegrees( lat.value() );
  }

  setupSky();
  drawSky();
}
