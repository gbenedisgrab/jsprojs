import {scene} as THREE from 'js/three.js';

let scene, renderer, container, width, height;
let cameara, fov, aspect, near, far;
let cube=[];

function init() {
  width = window.innerWidth;
  height = window.innerHeight;
  fov = 50;
  aspect = width/height;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( fov, aspect, 1, 3000 );
  camera.position.x = 200;
  camera.position.z = 600;
  camera.position.y = 200;
  camera.lookAt(new THREE.Vector3(320,0,0));
  renderer = new THREE.WebGLRenderer({anitalias: true,});
  renderer.setSize( width, height );
  renderer.shadowMap.enabled = true;
  container = document.getElementById('scene');
  container.appendChild(renderer.domElement);
}
function createBox() {


  for (let i=0;i<10;i++){
    let geometry = new THREE.BoxGeometry( 30+3*i, 30+3*i, 30+3*i );
    let color = 0xd97d34;
    if (i%2 == 0){
      color = 0x45324d;
    }
    let material = new THREE.MeshPhongMaterial( { color: color } );
    let c = new THREE.Mesh( geometry, material );
    c.castShadow=true;
    c.position.set(i*80,0,0);
    scene.add(c);
    cube.push(c)
  }
}

function createFloor() {
  var planeGeometry = new THREE.PlaneBufferGeometry( 1000, 400, 10, 10 );
  var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x45545a } )
  let plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.position.set(300, -100, 0);

  plane.receiveShadow = true;
  plane.rotation.x = -90 * Math.PI / 180;
  scene.add( plane );
}
function lighting() {
  const light = new THREE.DirectionalLight( 0xffffff, 1);
  light.position.set( -100, 500, 400 );
  light.castShadow = true;

  const d = 200;
  light.shadowCameraLeft = -d;
  light.shadowCameraRight = d+600;
  light.shadowCameraTop = d;
  light.shadowCameraBottom = -d;

  light.shadowCameraFar = 1000;

  scene.add( light );
  scene.add( new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.6 ) );
  scene.add( new THREE.AmbientLight(0xa59f75, 0.6) );
}

var animate = function () {
  requestAnimationFrame( animate );
  for (let i=0;i<10;i++){
    cube[i].rotation.x += .01;
    cube[i].rotation.y += i*.01;
    cube[i].rotation.z += (10-i)*(10-i) /1000;
  }

  renderer.render( scene, camera );
};
init();
createBox();
createFloor();
lighting();
animate();
