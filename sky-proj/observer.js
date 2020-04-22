class Observer {
  constructor() {

    let d = new Date();
    print(d.getFullYear());
    var jan = new Date( d.getFullYear(), 0, 1 );
    print(jan);
    this.jd = Astro.JD_1970 + d.getTime() / 86400000.0; // div to get decimal days
    //this.longitude = Astro.degrad( -0.25 * jan.getTimezoneOffset());
    // I could use this to set the original longitude in the program.  That might
    // be fun.
    this.longitude = long.value()*1.74532925199433e-2;
    this.lattitude = lat.value()*1.74532925199433e-2;

    // why am I setting this here???? 
    this.initLST();
  }

  setDate(date) {
   this.jd = Astro.JD_1970 + date.getTime() / 86400000.0; // this is milis per day
   this.initLST();
  }

  initLST() {
   this.lst = Astro.range( this.gst() + this.longitude, 2 * Math.PI );
  }

  gst() {  // this seems to get the hour spin on the earth in there
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
  incMinutes(count) {
    this.jd += count / (24.0*60.0);
    this.initLST();
  }

  getLatDegrees() {
     return Math.round( Astro.raddeg( this.latitude ));
  }

  setLatDegrees(lat) {
    this.latitude = Astro.degrad( lat );
  }

  getFormattedDate() {
    let d = new Date( Math.round(( this.jd - Astro.JD_1970 ) * 86400000.0 ));
    var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
("00" + d.getHours()).slice (-2) + ":00";
    return datestring;
  }
}
