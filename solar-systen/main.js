// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').prepend(renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0x333333));
const sunLight = new THREE.PointLight(0xffffff, 1.5, 100);
scene.add(sunLight);

// Tooltip
const tooltip = document.querySelector('.tooltip');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredPlanet = null;

// Planet data
const planets = [
    { 
        name: "Mercury", radius: 0.4, distance: 5, speed: 0.04, 
        color: 0xAAAAAA, details: "<h3>Mercury</h3>Closest to Sun<br>Diameter: 4,880 km<br>Orbit: 88 days" 
    },
    { 
        name: "Venus", radius: 0.6, distance: 7, speed: 0.015, 
        color: 0xFFCC66, details: "<h3>Venus</h3>Hottest planet<br>Diameter: 12,104 km<br>Orbit: 225 days" 
    },
    { 
        name: "Earth", radius: 0.6, distance: 10, speed: 0.01, 
        color: 0x3399FF, details: "<h3>Earth</h3>Our home<br>Diameter: 12,742 km<br>Orbit: 365.25 days" 
    },
    { 
        name: "Mars", radius: 0.5, distance: 15, speed: 0.008, 
        color: 0xFF3300, details: "<h3>Mars</h3>The Red Planet<br>Diameter: 6,779 km<br>Orbit: 687 days" 
    },
    { 
        name: "Jupiter", radius: 1.2, distance: 20, speed: 0.002, 
        color: 0xFF9966, details: "<h3>Jupiter</h3>Largest planet<br>Diameter: 139,820 km<br>Orbit: 12 years" 
    },
    { 
        name: "Saturn", radius: 1.0, distance: 25, speed: 0.0009, 
        color: 0xFFFF99, details: "<h3>Saturn</h3>Ringed giant<br>Diameter: 116,460 km<br>Orbit: 29.5 years",
        hasRings: true 
    },
    { 
        name: "Uranus", radius: 0.8, distance: 30, speed: 0.0004, 
        color: 0x66FFFF, details: "<h3>Uranus</h3>Ice giant<br>Diameter: 50,724 km<br>Orbit: 84 years" 
    },
    { 
        name: "Neptune", radius: 0.8, distance: 35, speed: 0.0001, 
        color: 0x3366FF, details: "<h3>Neptune</h3>Windiest planet<br>Diameter: 49,244 km<br>Orbit: 165 years" 
    }
];

// Create Sun
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
);
scene.add(sun);
sunLight.position.set(0, 0, 0);

// Create stars
const starsGeometry = new THREE.BufferGeometry();
const starsVertices = [];
for (let i = 0; i < 10000; i++) {
    starsVertices.push(
        THREE.MathUtils.randFloatSpread(2000),
        THREE.MathUtils.randFloatSpread(2000),
        THREE.MathUtils.randFloatSpread(2000)
    );
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xFFFFFF })));

// Create planets
const planetObjects = [];
planets.forEach((planet, index) => {
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(planet.radius, 32, 32),
        new THREE.MeshPhongMaterial({ color: planet.color })
    );
    mesh.position.x = planet.distance;
    scene.add(mesh);
    
    // Add rings for Saturn
    if (planet.hasRings) {
        const ringGeometry = new THREE.RingGeometry(
            planet.radius * 1.2,
            planet.radius * 2.2,
            64
        );
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0xC0C0C0,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        mesh.add(rings);
    }
    
    planetObjects.push({ 
        mesh, 
        ...planet,
        originalSpeed: planet.speed
    });
    
    // Create orbit path
    const orbitPoints = [];
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(
            planet.distance * Math.cos(angle),
            0,
            planet.distance * Math.sin(angle)
        ));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    scene.add(new THREE.Line(
        orbitGeometry,
        new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.3 })
    ));
    
    // Add speed control
    const slider = document.createElement('div');
    slider.className = 'slider-container';
    slider.innerHTML = `
        <label for="speed-${index}">${planet.name}</label>
        <input type="range" id="speed-${index}" min="0" max="0.1" step="0.001" value="${planet.speed}">
    `;
    document.getElementById('speed-controls').appendChild(slider);
    
    document.getElementById(`speed-${index}`).addEventListener('input', (e) => {
        planetObjects[index].speed = parseFloat(e.target.value);
    });
});

// Camera and controls
camera.position.z = 50;
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation state
let isPaused = false;
document.getElementById('pause-btn').addEventListener('click', () => {
    isPaused = !isPaused;
    document.getElementById('pause-btn').textContent = isPaused ? 'Resume' : 'Pause';
});

// Mouse interaction
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetObjects.map(p => p.mesh));
    
    if (intersects.length > 0) {
        const planet = planetObjects.find(p => p.mesh === intersects[0].object);
        hoveredPlanet = planet;
        tooltip.innerHTML = planet.details;
        tooltip.style.left = `${event.clientX + 15}px`;
        tooltip.style.top = `${event.clientY}px`;
        tooltip.classList.add('active');
        intersects[0].object.material.color.setHex(0xFFFF00);
    } else {
        if (hoveredPlanet) {
            hoveredPlanet.mesh.material.color.setHex(hoveredPlanet.color);
        }
        tooltip.classList.remove('active');
        hoveredPlanet = null;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (!isPaused) {
        const time = Date.now() / 1000;
        planetObjects.forEach(planet => {
            planet.mesh.position.x = planet.distance * Math.cos(planet.speed * time);
            planet.mesh.position.z = planet.distance * Math.sin(planet.speed * time);
            planet.mesh.rotation.y += 0.01;
        });
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

