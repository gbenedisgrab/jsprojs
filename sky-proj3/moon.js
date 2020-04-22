/*
======================================================================
moon.js
Ernie Wright  20 Nov 2012

Display a Moon image showing the current phase.
====================================================================== */


function frac( x )
{
   return x - Math.floor( x );
}


function julian()
{
   var JD1970 = 2440587.5;
   var d = new Date();
   return JD1970 + d.getTime() / 86400000.0;
}


/*
======================================================================
moonphase()

Return the phase of the Moon as a number of degrees between 0 and 360.

The value returned is related to the phase angle, but it distinguishes
between waxing and waning phases.  It's 0 at New Moon, 90 at First
Quarter, 180 at Full Moon, and 270 at Third Quarter.

The angle is derived from the ecliptic latitude and longitude of the
Moon and the longitude of the Sun, so we need to find the positions of
both the Sun and the Moon, although not to high accuracy.

Based on minimoon.pas by Montenbruck and Pfleger (in chapter 3 of
Astronomy on the Personal Computer 2nd ed., Springer-Verlag, 1994)
and the low-accuracy solar coordinates algorithm of Meeus (chapter 25
of Astronomical Algorithms 2nd ed., Willmann-Bell, 1998).
====================================================================== */

function moonphase( jd )
{
   var ARC = 206264.8062;
   var P2 = Math.PI * 2.0;

   var T, L0, L, LS, D, F, DL, S, H, N, M, C;
   var mlon, mlat, slon, A;

   T  = ( jd - 2451545.0 ) / 36525.0;

   L0 =      frac( 0.606433 + 1336.855225 * T );
   L  = P2 * frac( 0.374897 + 1325.552410 * T );
   LS = P2 * frac( 0.993133 +   99.997361 * T );
   D  = P2 * frac( 0.827361 + 1236.853086 * T );
   F  = P2 * frac( 0.259086 + 1342.227825 * T );

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

   mlon = P2 * frac( L0 + DL / 1296E3 );
   mlat = ( 18520.0 * Math.sin( S ) + N ) / ARC;

   L0 = 4.8950632 + T * ( 628.3319668 + T * 5.292e-6 );
   M  = 6.2400601 + T * ( 628.3019552 + T * 2.683e-6 );

   C  = ( 0.03341611 - 8.407e-5 * T - 2.44e-7 * T * T ) * Math.sin( M ) +
        ( 3.48944e-4 - 1.763e-6 * T ) * Math.sin( 2.0 * M ) +
        5.044e-6 * Math.sin( 3.0 * M );

   slon = L0 + C;
   slon -= P2 * Math.floor( slon / P2 );

   D = mlon - slon;
   A = Math.acos( Math.cos( D ) * Math.cos( mlat ));
   if ( Math.sin( D ) < 0.0 ) A = P2 - A;

   return 180.0 * A / Math.PI;
}


/*
======================================================================
moonimage()

Return the name of the Moon image that most closely matches the lunar
phase at the date and time this page is loaded.
====================================================================== */

// function moonimage()
// {
//    var p = moonphase( julian() );
//    var i = Math.round( p / 2.0 ) * 2;
//    var s = "00" + i;
//    return "astro/images/p/m" + s.slice( s.length - 3 ) + ".jpg";
// }


/*
======================================================================
mooncode()

Return a string containing HTML code to display the Moon image and
the current date.
====================================================================== */

function mooncode()
{
   var mon = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
   var d = new Date();
   return "<img width='200' height='200' alt='Moon phase image' src='" +
      moonimage() + "'><br>\n" +
      d.getDate() + " " + mon[ d.getMonth() ] + " " + d.getFullYear();
}
