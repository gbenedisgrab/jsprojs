let scene,
    renderer,
    container,
    width,
    height;

let camera,
    fov, aspect, near, far;

function init() {
  width = window.innerWidth;
  height = window.innerHeight;

  fov = 50;
  aspect = width / height;
  near = 1;
  far = 2000;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.x = 300;
  camera.position.z = 300;
  camera.position.y = 200;
  camera.lookAt(new THREE.Vector3(0,0,0));

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;

  container = document.getElementById('scene');
  container.appendChild(renderer.domElement);
}

function createBox() {
  let geometry = new THREE.BoxGeometry( 100, 100, 100 );
  let material = new THREE.MeshPhongMaterial( { color: 0xd97d34 } );
  let cube = new THREE.Mesh( geometry, material );
  cube.castShadow = true;

  scene.add( cube );
}

function createFloor() {
  var planeGeometry = new THREE.PlaneBufferGeometry( 400, 400, 10, 10 );
  var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x45545a } )
  let plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.position.set(0, -100, 0);

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
  light.shadowCameraRight = d;
  light.shadowCameraTop = d;
  light.shadowCameraBottom = -d;

  light.shadowCameraFar = 1000;

  scene.add( light );
  scene.add( new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.6 ) );
  scene.add( new THREE.AmbientLight(0xa59f75, 0.6) );
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

init();
lighting();
createBox();
createFloor();

animate();
