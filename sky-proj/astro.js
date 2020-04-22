/*
======================================================================
astro.js

Ernie Wright  2 June 2013
====================================================================== */

var Astro =
{
   JD_J2000: 2451545.0,
   JD_1970: 2440587.5,
   YEARDAYS: 365.2422,
   EQtoECL: 1,
   ECLtoEQ: -1,

   range: function( v, r ) {
      return v - r * Math.floor( v / r );
   },
   //
   degrad: function( x ) {
      return x * 1.74532925199433e-2;
   },
   //
   raddeg: function( x ) {
      return x * 5.729577951308232e1;
   },
   //
   hrrad: function( x ) {
      return x * 2.617993877991494e-1;
   },
  
  // this seems to put the lattitude in there
   aa_hadec: function( lat, from, to )
   {
      var slat = Math.sin( lat );
      var clat = Math.cos( lat );
      var sx   = Math.sin( from[ 0 ] );
      var cx   = Math.cos( from[ 0 ] );
      var sy   = Math.sin( from[ 1 ] );
      var cy   = Math.cos( from[ 1 ] );

      to[ 0 ] = Math.atan2( -cy * sx, -cy * cx * slat + sy * clat );
      to[ 1 ] = Math.asin( sy * slat + cy * clat * cx );
   },


};
