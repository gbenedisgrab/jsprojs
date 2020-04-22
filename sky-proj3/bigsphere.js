

class BigSphere {
  constructor(star,conname) {
    this.resetTime();
    this.star = star
    this.conname = conname
    this.initStars(this.star)
    this.initPlanets(planet);
    this.constellations = true;
    //this.initLST();
  }

  shiftTime(s) {
    this.jd += s;
  }

  resetTime() {
    let d = new Date();
    this.jd = Astro.JD_1970 + d.getTime() / 86400000.0;
  }

  initLST() {
    this.lst = Astro.range( this.gst() + Astro.degrad(long.value()), 2 * Math.PI );
  }

  gst() {
     var t = ( this.jd_day() - Astro.JD_J2000 ) / 36525;
     var theta = 1.753368559146 + t * ( 628.331970688835
        + t * ( 6.770708e-6 + t * -1.48e-6 ));
     return Astro.range( theta + Astro.hrrad( this.jd_hour() ), 2 * Math.PI );
  }
  jd_day() {
    return Math.floor( this.jd - 0.5 ) + 0.5;
  }

  jd_hour() {
    return ( this.jd - this.jd_day() ) * 24.0;
  }

  // shiftTime(s){
  //   this.sJ2000 += s;
  // }

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

  initPlanets( planet )
{
   var seps = 0.397777156;
   var ceps = 0.917482062;

   var so, co, si, ci, sw, cw, f1, f2;

   for ( let i = 0; i < 9; i++ ) {
      so = Math.sin( planet[ i ].o );
      co = Math.cos( planet[ i ].o );
      si = Math.sin( planet[ i ].i );
      ci = Math.cos( planet[ i ].i );
      sw = Math.sin( planet[ i ].wb - planet[ i ].o );
      cw = Math.cos( planet[ i ].wb - planet[ i ].o );

      f1 = cw * so + sw * co * ci;
      f2 = cw * co * ci - sw * so;

      planet[ i ].P = [];
      planet[ i ].Q = [];
      planet[ i ].P[ 0 ] = cw * co - sw * so * ci;
      planet[ i ].P[ 1 ] = ceps * f1 - seps * sw * si;
      planet[ i ].P[ 2 ] = seps * f1 + ceps * sw * si;
      planet[ i ].Q[ 0 ] = -sw * co - cw * so * ci;
      planet[ i ].Q[ 1 ] = ceps * f2 - seps * cw * si;
      planet[ i ].Q[ 2 ] = seps * f2 + ceps * cw * si;

      switch ( i ) {
         case 2:  planet[ i ].radius = 16;  break;
         case 8:  planet[ i ].radius = 5;  break;
         default: planet[ i ].radius = 8;  break;
      }
      planet[ i ].bright = true;
   }
}

  getDate() {
   return new Date( Math.round(( this.jd - Astro.JD_1970 ) * 86400000.0 ));
  }

  getFormattedDate() {
    let d = this.getDate()
    var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
  ("00" + d.getHours()).slice (-2) + ":00";
    return datestring;
  }

  skypos_transform(pos) {
     var coord = [ pos.ra, pos.dec ];
     Astro.precess( Astro.JD_J2000, this.jd, coord );
     coord[ 0 ] = this.lst - coord[ 0 ];
     Astro.aa_hadec( Astro.degrad(lat.value()), coord, coord );
     if ( coord[ 1 ] < 0 )
        pos.visible = false;
     else {
        pos.visible = true;
        var tmp = 0.5 - coord[ 1 ] / Math.PI;
        pos.x = width * ( 0.5 - tmp * Math.sin( coord[ 0 ] ));
        pos.y = height * ( 0.5 - tmp * Math.cos( coord[ 0 ] ));
     }
     return coord;
   }

   draw_planet( p )
   {
       this.skypos_transform(p.pos);
       if (p.pos.visible) {
         stroke(p.color);
         strokeWeight(p.radius);
         point(p.pos.x,p.pos.y);
       }
      fill(p.color);
      strokeWeight(0);
      let name = p.name == "Earth" ? "Sun" : p.name;
      textSize(13);
      text(name, p.pos.x + 7, p.pos.y);
   }
   draw_moon() {
     var i = Math.floor(( Astro.raddeg( moon.phase ) + 180 ) / 12 );
     //image(immoons,200,200,16,16,i*16,0);
     // something is wrong here.
     imageMode(CORNER);
     //print(Astro.raddeg(moon.phase),i);
     image( immoons, moon.pos.x - 8, moon.pos.y - 8, 16,16, i*16, 0 ,16,16);
     fill("#FFF0E0");
     text( "Moon", moon.pos.x + 8, moon.pos.y );
   }

  setupSky(c) {  // graphics for the sky background and sliders
    background(40);
    noStroke();
    // fill(185);
    // circle(width/2,height/2,width-10);
    fill(c);
    circle(width/2,height/2,width); // the sky
    // text elements
    fill(20,125,30);
    textSize(12);
    textAlign(CENTER,CENTER);
    text( "N", width / 2, 18 );
    text( "S", width / 2, height-17);
    text( "E", 17, height / 2 );
    text( "W", width - 18, height / 2);
    fill(180);
    textSize(20);
    text(this.getFormattedDate(),width-100,height-20);
  // text labels for sliders
    fill(215);
    textAlign(LEFT);
    textSize(24);
    text("lat = "+lat.value(),28,40);
    text("frame rate = "+speed.value(),8,height-33);
    text("long = "+long.value(),570,40);
  }

  project(){
     find_planet( planet[ 2 ], null, this.jd );

     var azalt = this.skypos_transform( planet[ 2 ].pos);
     var bgcolor;
     if ( azalt[ 1 ] > 0 ) bgcolor = "#182448";              // 24, 36, 72
     else if ( azalt[ 1 ] > -0.10472 ) bgcolor = "#121B36";  // 18, 27, 54
     else if ( azalt[ 1 ] > -0.20944 ) bgcolor = "#0C1224";  // 12, 18, 36
     else if ( azalt[ 1 ] > -0.31416 ) bgcolor = "#060912";  //  6,  9, 18
     else bgcolor = "#000000";

     this.initLST();
     this.setupSky(bgcolor);
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
       this.skypos_transform(s.pos);
       if (s.pos.visible) {
         stroke(s.color);
         strokeWeight(s.radius);
         point(s.pos.x,s.pos.y);
       }
     }
     if (this.constellations) { // constellation labels
       fill(120,150,252,160);
       strokeWeight(0);
       textSize(9);
       for (let c of conname) {
         this.skypos_transform(c.pos);
         if (c.pos.visible) {
           text(c.name.toUpperCase(),c.pos.x,c.pos.y );
         }
       }
      }

      for ( let i = 0; i < 9; i++ ) { // planets
         if ( i != 2 ) {
            find_planet( planet[ i ], planet[ 2 ], this.jd );
            this.skypos_transform( planet[ i ].pos);
         }
         if ( planet[ i ].pos.visible )
            this.draw_planet( planet[ i ] );
      }

      find_moon( moon, planet[ 2 ], this.jd ); // moon
      //console.log( "phase: " + Astro.raddeg( moon.phase ));
      this.skypos_transform( moon.pos );
      if ( moon.pos.visible )
         this.draw_moon( );

  }

  bv_to_rgb(bv) { // I should clean this one up.
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

function find_planet( planet, earth, jd )
{
   function kepler( m, e )
   {
      var EPSILON = 1.0e-6;
      var d, ae = m;

      while ( true ) {
         d = ae - ( e * Math.sin( ae )) - m;
         if ( Math.abs( d ) < EPSILON ) break;
         d /= 1.0 - ( e * Math.cos( ae ));
         ae -= d;
      }
      return 2.0 *
         Math.atan( Math.sqrt(( 1.0 + e ) / ( 1.0 - e )) * Math.tan( ae / 2.0 ));
   }

   var t = ( jd - Astro.JD_J2000 ) / 36525.0;
   var m = planet.L - planet.wb + planet.dL * t;  /* mean anomaly */
   m = Astro.range( m, Math.PI * 2.0 );

   var v = kepler( m, planet.e );
   var cv = Math.cos( v );
   var sv = Math.sin( v );
   var r = ( planet.a * ( 1.0 - planet.e * planet.e )) / ( 1 + planet.e * cv );

   planet.hx = r * ( planet.P[ 0 ] * cv + planet.Q[ 0 ] * sv );
   planet.hy = r * ( planet.P[ 1 ] * cv + planet.Q[ 1 ] * sv );
   planet.hz = r * ( planet.P[ 2 ] * cv + planet.Q[ 2 ] * sv );

   var dx, dy, dz;
   if ( planet.name != "Earth" ) {
      dx = planet.hx - earth.hx;
      dy = planet.hy - earth.hy;
      dz = planet.hz - earth.hz;
   } else {
      dx = -planet.hx;
      dy = -planet.hy;
      dz = -planet.hz;
   }

   planet.pos.ra = Math.atan2( dy, dx );
   planet.pos.dec = Math.atan2( dz, Math.sqrt( dx * dx + dy * dy ));
}

function find_moon( moon, earth, jd )
{
   var P2 = Math.PI * 2.0;
   var ARC = 206264.8062;
   var T, L0, L, LS, D, F, DL, S, H, N, M, C;
   var mlon, mlat;

   /* calculate the Moon's ecliptic longitude and latitude */
   T  = ( jd - 2451545.0 ) / 36525.0;

   L0 =      Astro.range( 0.606433 + 1336.855225 * T, 1.0 );
   L  = P2 * Astro.range( 0.374897 + 1325.552410 * T, 1.0 );
   LS = P2 * Astro.range( 0.993133 +   99.997361 * T, 1.0 );
   D  = P2 * Astro.range( 0.827361 + 1236.853086 * T, 1.0 );
   F  = P2 * Astro.range( 0.259086 + 1342.227825 * T, 1.0 );

   DL = 22640 * Math.sin( L ) +
        -4586 * Math.sin( L - 2 * D ) +
         2370 * Math.sin( 2 * D ) +
          769 * Math.sin( 2 * L ) +
         -668 * Math.sin( LS ) +
         -412 * Math.sin( 2 * F ) +
         -212 * Math.sin( 2 * L - 2 * D ) +
         -206 * Math.sin( L + LS - 2 * D ) +
          192 * Math.sin( L + 2 * D ) +
         -165 * Math.sin( LS - 2 * D ) +
         -125 * Math.sin( D ) +
         -110 * Math.sin( L + LS ) +
          148 * Math.sin( L - LS ) +
          -55 * Math.sin( 2 * F - 2 * D );

   S  = F + ( DL + 412 * Math.sin( 2 * F ) + 541 * Math.sin( LS )) / ARC;
   H  = F - 2 * D;
   N  = -526 * Math.sin( H ) +
          44 * Math.sin( L + H ) +
         -31 * Math.sin( -L + H ) +
         -23 * Math.sin( LS + H ) +
          11 * Math.sin( -LS + H ) +
         -25 * Math.sin( -2 * L + F ) +
          21 * Math.sin( -L + F );

   /* epoch of date! */
   mlon = P2 * Astro.range( L0 + DL / 1296000.0, 1.0 );
   mlat = ( 18520.0 * Math.sin( S ) + N ) / ARC;

   /* convert Sun equatorial J2000 to ecliptic coordinates at epoch jd */
   /* "Earth" ra and dec are really geocentric Sun coordinates */
   var coord = [ earth.pos.ra, earth.pos.dec ];
   Astro.ecl_eq( Astro.EQtoECL, coord, coord );
   Astro.precess( Astro.JD_J2000, jd, coord );

   /* calculate Moon phase */
   D = mlon - coord[ 0 ];
   moon.phase = Math.acos( Math.cos( D ) * Math.cos( mlat ));
   if ( Math.sin( D ) < 0.0 )
      moon.phase = P2 - moon.phase;
   moon.phase -= Math.PI;

   /* convert Moon ecliptic to equatorial coordinates */
   coord[ 0 ] = mlon;
   coord[ 1 ] = mlat;
   Astro.ecl_eq( Astro.ECLtoEQ, coord, coord );
   Astro.precess( jd, Astro.JD_J2000, coord );
   moon.pos.ra = coord[ 0 ];
   moon.pos.dec = coord[ 1 ];

   /* calculate position angle of the bright limb */
   var sa  = Math.sin( earth.pos.ra - moon.pos.ra );
   var ca  = Math.cos( earth.pos.ra - moon.pos.ra );
   var sd0 = Math.sin( earth.pos.dec );
   var cd0 = Math.cos( earth.pos.dec );
   var sd  = Math.sin( moon.pos.dec );
   var cd  = Math.cos( moon.pos.dec );

   moon.posAngle = Math.atan2( cd0 * sa, sd0 * cd - cd0 * sd * ca );
}
