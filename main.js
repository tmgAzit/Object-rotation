import * as THREE from 'three'; // access all to threejs

// Access orbit controls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// import all the texture images for the objects
import earthTexture from './img/earth.jpg';
import jupiterTexture from './img/jupiter.jpg';
import marsTexture from './img/mars.jpg';
import mercuryTexture from './img/mercury.jpg';
import neptuneTexture from './img/neptune.jpg';
import plutoTexture from './img/pluto.jpg';
import saturnTexture from './img/saturn.jpg';
import saturnRingTexture from './img/saturn ring.png';
import starsTexture from './img/stars.jpg';
import sunTexture from './img/sun.jpg';
import uranusTexture from './img/uranus.jpg';
import uranusRingTexture from './img/uranus ring.png';
import venusTexture from './img/venus.jpg';

// assign THREEjs - WebGLRenderer() as a renderer.
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); //give size to the renderer
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement); // add renderer-domElement to the document.

// In renderer, we have scene which include camera, lights, and mesh/object.
// Lets add Scene
const scene = new THREE.Scene();

// Build the camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
//add camera to scene
scene.add(camera);

// Add Light to the scene
const ambientLight = new THREE.AmbientLight(0x333333, 15);
scene.add(ambientLight);

// Orbit-controls
const orbit = new OrbitControls(camera, renderer.domElement);
//now create an axes helper
// const axesHelper = new THREE.AxesHelper(10);
// scene.add(axesHelper);

//Adjust camera postion - bydefault its position is in center, so
camera.position.set(-90, 140, 140);
// update the orbit - automatically
orbit.update();

//To create stars we use cube texture loader to load 3d image texture
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

// add texture loader
const textureLoader = new THREE.TextureLoader();
// lets addign the texture to the variable
const sunMap = textureLoader.load(sunTexture);
sunMap.colorSpace = THREE.SRGBColorSpace;
// lets create sun of our solar system
const sunGeometry = new THREE.SphereGeometry(16, 30, 30);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunMap,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
// add sun to the scene
scene.add(sun);

// // lets create mercury reletive to the sun
// const mercuryGeometry = new THREE.SphereGeometry(3.2, 30, 30);
// const mercuryMaterial = new THREE.MeshStandardMaterial({
//   map: textureLoader.load(mercuryTexture),
// });
// const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
// // add mercury relative to the sun
// sun.add(mercury);
// mercury.position.x = 28;

// lets create mercury and other planets using factory function
const mercury = createPlanet(3.2, mercuryTexture, 30);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const neptune = createPlanet(7, neptuneTexture, 200);
const uranus = createPlanet(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture,
});
const pluto = createPlanet(2.8, plutoTexture, 216);

// add point Light which takes the argument color, intensity and coverage/distance
const pointLight = new THREE.PointLight(0xffffff, 3000, 600);
scene.add(pointLight);

// We will create a factory function to create all the planets
function createPlanet(size, texture, position, ring) {
  const mapPlanet = textureLoader.load(texture);
  mapPlanet.colorSpace = THREE.SRGBColorSpace;
  const geometry = new THREE.SphereGeometry(size, 30, 30);
  const material = new THREE.MeshStandardMaterial({
    map: mapPlanet,
  });
  const planet = new THREE.Mesh(geometry, material);
  const obj = new THREE.Object3D();
  obj.add(planet);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(obj);
  planet.position.x = position;
  return { planet, obj };
}

// To render, the actual scene of the renderer. THREEJS renderer uses setAnimationLoop() function.
//Set Animation loop - before this we create a function and pass that as an argument
//Lets create animation loop function
function animate() {
  // Self rotate
  sun.rotateY(0.004);
  mercury.planet.rotateY(0.004);
  venus.planet.rotateY(0.002);
  mars.planet.rotateY(0.018);
  earth.planet.rotateY(0.02);
  jupiter.planet.rotateY(0.04);
  saturn.planet.rotateY(0.038);
  neptune.planet.rotateY(0.032);
  uranus.planet.rotateY(0.03);
  pluto.planet.rotateY(0.008);
  // rotate around sun
  mercury.obj.rotateY(0.04);
  venus.obj.rotateY(0.015);
  mars.obj.rotateY(0.008);
  earth.obj.rotateY(0.01);
  jupiter.obj.rotateY(0.002);
  saturn.obj.rotateY(0.0009);
  neptune.obj.rotateY(0.0001);
  uranus.obj.rotateY(0.0004);
  pluto.obj.rotateY(0.00007);
  renderer.render(scene, camera);
}

// Render
renderer.setAnimationLoop(animate);

// Resizing renderer automatically to the screen changes.
window.addEventListener('resize', (e) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
