// Create the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
document.body.appendChild(renderer.domElement);

// Add lighting for shading
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 5, 5); // Place light in front of the camera
pointLight.castShadow = true;
scene.add(pointLight);

// Add a dry mass sphere
const dryMassGeometry = new THREE.SphereGeometry(0.3, 64, 64); // Smooth sphere
const dryMassMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 50 });
const dryMassSphere = new THREE.Mesh(dryMassGeometry, dryMassMaterial);
dryMassSphere.position.x = -5; // Further apart
dryMassSphere.castShadow = true;
dryMassSphere.receiveShadow = true;
scene.add(dryMassSphere);

// Add a wet mass sphere
const wetMassGeometry = new THREE.SphereGeometry(0.6, 64, 64); // Smooth sphere
const wetMassMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 50 });
const wetMassSphere = new THREE.Mesh(wetMassGeometry, wetMassMaterial);
wetMassSphere.position.x = 4; // Further apart
wetMassSphere.castShadow = true;
wetMassSphere.receiveShadow = true;
scene.add(wetMassSphere);

// Create labels above spheres
const dryMassLabel = document.createElement("div");
dryMassLabel.style.position = "absolute";
dryMassLabel.style.color = "white";
dryMassLabel.style.fontFamily = "Arial, sans-serif";
dryMassLabel.style.fontSize = "16px";
dryMassLabel.style.textAlign = "center";
dryMassLabel.textContent = "Dry Mass: 1 ton"; // Default value
dryMassLabel.style.zIndex = "20"; // Ensure on top
document.body.appendChild(dryMassLabel);

const wetMassLabel = document.createElement("div");
wetMassLabel.style.position = "absolute";
wetMassLabel.style.color = "white";
wetMassLabel.style.fontFamily = "Arial, sans-serif";
wetMassLabel.style.fontSize = "16px";
wetMassLabel.style.textAlign = "center";
wetMassLabel.textContent = "Wet Mass: 2.7 tons"; // Default value
wetMassLabel.style.zIndex = "10"; // Ensure on top
document.body.appendChild(wetMassLabel);

// Add labels for sliders
const dryMassSliderLabel = document.createElement("div");
dryMassSliderLabel.style.position = "absolute";
dryMassSliderLabel.style.color = "white";
dryMassSliderLabel.style.fontFamily = "Arial, sans-serif";
dryMassSliderLabel.style.fontSize = "16px";
dryMassSliderLabel.style.textAlign = "center";
dryMassSliderLabel.style.bottom = "50px"; // Place above the slider
dryMassSliderLabel.style.left = "25%"; // Align with the slider
dryMassSliderLabel.style.transform = "translateX(-50%)";
dryMassSliderLabel.style.zIndex = "10";
dryMassSliderLabel.textContent = `Dry Mass: 1 ton`; // Initial value
document.body.appendChild(dryMassSliderLabel);

const deltaVSliderLabel = document.createElement("div");
deltaVSliderLabel.style.position = "absolute";
deltaVSliderLabel.style.color = "white";
deltaVSliderLabel.style.fontFamily = "Arial, sans-serif";
deltaVSliderLabel.style.fontSize = "16px";
deltaVSliderLabel.style.textAlign = "center";
deltaVSliderLabel.style.bottom = "50px"; // Place above the slider
deltaVSliderLabel.style.left = "75%"; // Align with the slider
deltaVSliderLabel.style.transform = "translateX(-50%)";
deltaVSliderLabel.style.zIndex = "10";
deltaVSliderLabel.textContent = `Delta Velocity: 7600 m/s`; // Initial value
document.body.appendChild(deltaVSliderLabel);

// Dry mass slider setup
const dryMassSlider = document.createElement("input");
dryMassSlider.type = "range";
dryMassSlider.min = 1; // Min value: 1 ton
dryMassSlider.max = 20; // Max value: 20 tons
dryMassSlider.step = 1; // Step: 1 ton
dryMassSlider.value = 1; // Default value: 1 ton
dryMassSlider.style.position = "absolute";
dryMassSlider.style.bottom = "10px";
dryMassSlider.style.left = "25%";
dryMassSlider.style.transform = "translateX(-50%)";
dryMassSlider.style.zIndex = "10"; // Ensure sliders are above everything
document.body.appendChild(dryMassSlider);

// Delta velocity slider setup
const deltaVSlider = document.createElement("input");
deltaVSlider.type = "range";
deltaVSlider.min = 2000; // Min value: 7600 m/s
deltaVSlider.max = 12000; // Max value: 12000 m/s
deltaVSlider.step = 100; // Step: 100 m/s
deltaVSlider.value = 7600; // Default value: 7600 m/s
deltaVSlider.style.position = "absolute";
deltaVSlider.style.bottom = "10px";
deltaVSlider.style.left = "75%";
deltaVSlider.style.transform = "translateX(-50%)";
deltaVSlider.style.zIndex = "20"; // Ensure sliders are above everything
document.body.appendChild(deltaVSlider);

// Rocket equation: Calculate wet mass based on dry mass, deltaV, and exhaust velocity
function RocketEquation(massDry, deltaVelocity, exhaustVelocity) {
  const ratioVelocity = deltaVelocity / exhaustVelocity;
  const ratioMass = Math.exp(ratioVelocity);
  return ratioMass * massDry; // Wet mass
}

// Calculate radius from volume
function calculateRadiusFromVolume(volume) {
  return Math.cbrt((3 * volume) / (4 * Math.PI)); // Radius = (3V / 4π)^(1/3)
}

// Initial conditions
let dryMass = 1; // Default dry mass
let deltaVelocity = 7600; // Default delta velocity
const exhaustVelocity = 2800;

// Calculate initial wet mass
let targetDryMassRadius = calculateRadiusFromVolume(dryMass);
let targetWetMassRadius = calculateRadiusFromVolume(
  RocketEquation(dryMass, deltaVelocity, exhaustVelocity)
);

// Update label positions and values
function updateLabels() {
  dryMassLabel.textContent = `Dry Mass: ${dryMass.toFixed(1)} tons`;
  wetMassLabel.textContent = `Wet Mass: ${RocketEquation(dryMass, deltaVelocity, exhaustVelocity).toFixed(1)} tons`;

  const dryVector = dryMassSphere.position.clone().project(camera);
  const wetVector = wetMassSphere.position.clone().project(camera);

  dryMassLabel.style.left = `${(dryVector.x * 0.5 + 0.5) * window.innerWidth - 50}px`;
  dryMassLabel.style.top = `${(1 - (dryVector.y * 0.5 + 0.5)) * window.innerHeight - 220}px`;

  wetMassLabel.style.left = `${(wetVector.x * 0.5 + 0.5) * window.innerWidth - 50}px`;
  wetMassLabel.style.top = `${(1 - (wetVector.y * 0.5 + 0.5)) * window.innerHeight - 220}px`;
}

// Update slider labels
function updateSliderLabels() {
  dryMassSliderLabel.textContent = `Dry Mass: ${dryMassSlider.value} tons`;
  deltaVSliderLabel.textContent = `Delta Velocity: ${deltaVSlider.value} m/s`;
}

// Update target values, labels, and slider labels
function updateWetMass() {
  dryMass = parseFloat(dryMassSlider.value);
  deltaVelocity = parseFloat(deltaVSlider.value);

  targetDryMassRadius = calculateRadiusFromVolume(dryMass);
  targetWetMassRadius = calculateRadiusFromVolume(
    RocketEquation(dryMass, deltaVelocity, exhaustVelocity)
  );

  updateLabels();
  updateSliderLabels();
}

// Add event listeners to sliders
dryMassSlider.addEventListener("input", updateWetMass);
deltaVSlider.addEventListener("input", updateWetMass);

// Handle window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Smoothly interpolate the scale values
  dryMassSphere.scale.setScalar(
    THREE.MathUtils.lerp(dryMassSphere.scale.x, targetDryMassRadius, 0.1)
  );
  wetMassSphere.scale.setScalar(
    THREE.MathUtils.lerp(wetMassSphere.scale.x, targetWetMassRadius, 0.1)
  );

  // Update label positions
  updateLabels();

  renderer.render(scene, camera);
}

animate();
