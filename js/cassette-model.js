let cassetteScene, cassetteCamera, cassetteRenderer, cassetteModel;
let cassetteRotationY = 0;
let cassetteMouseX = 0;
let cassetteMouseXOnMouseDown = 0;
let cassetteDragging = false;
let animationId = null;

function initCassetteModel() {
    // Create scene
    cassetteScene = new THREE.Scene();
    
    // Create camera
    cassetteCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    cassetteCamera.position.z = 5;
    cassetteCamera.position.y = 0.5;
    
    // Create renderer
    cassetteRenderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    cassetteRenderer.setSize(300, 300); // Match the CSS size
    cassetteRenderer.setClearColor(0x000000, 0);
    cassetteRenderer.setPixelRatio(window.devicePixelRatio);
    cassetteRenderer.shadowMap.enabled = true;
    
    // Add renderer to DOM
    const container = document.getElementById('cassette-model-container');
    if (container) {
        container.appendChild(cassetteRenderer.domElement);
    } else {
        console.error('Cassette model container not found');
        return;
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    cassetteScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(0, 1, 1);
    directionalLight.castShadow = true;
    cassetteScene.add(directionalLight);
    
    // Add spotlight for dramatic effect
    const spotLight = new THREE.SpotLight(0xff6b00, 1);
    spotLight.position.set(0, 5, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    cassetteScene.add(spotLight);
    
    // Create Cactus Jack logo model
    createCactusJackModel();
    
    // Start animation
    animateCassette();
}

function createCactusJackModel() {
    // Create a group to hold all model parts
    cassetteModel = new THREE.Group();
    
    // Create materials
    const baseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x111111, 
        specular: 0x222222,
        shininess: 30
    });
    
    const accentMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff6b00, 
        specular: 0xffaa77,
        shininess: 50,
        emissive: 0x441100,
        emissiveIntensity: 0.3
    });
    
    // Create base circle
    const baseGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.rotation.x = Math.PI / 2;
    base.castShadow = true;
    base.receiveShadow = true;
    cassetteModel.add(base);
    
    // Create Cactus Jack smiley face
    
    // Face outline
    const faceGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 32);
    const face = new THREE.Mesh(faceGeometry, accentMaterial);
    face.position.z = 0.15;
    face.castShadow = true;
    face.receiveShadow = true;
    cassetteModel.add(face);
    
    // Left eye (X shape)
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.6, 0, 0.2);
    
    const leftEyeLine1Geometry = new THREE.BoxGeometry(0.5, 0.1, 0.1);
    leftEyeLine1Geometry.rotateZ(Math.PI / 4);
    const leftEyeLine1 = new THREE.Mesh(leftEyeLine1Geometry, accentMaterial);
    leftEyeGroup.add(leftEyeLine1);
    
    const leftEyeLine2Geometry = new THREE.BoxGeometry(0.5, 0.1, 0.1);
    leftEyeLine2Geometry.rotateZ(-Math.PI / 4);
    const leftEyeLine2 = new THREE.Mesh(leftEyeLine2Geometry, accentMaterial);
    leftEyeGroup.add(leftEyeLine2);
    
    cassetteModel.add(leftEyeGroup);
    
    // Right eye (X shape)
    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.6, 0, 0.2);
    
    const rightEyeLine1Geometry = new THREE.BoxGeometry(0.5, 0.1, 0.1);
    rightEyeLine1Geometry.rotateZ(Math.PI / 4);
    const rightEyeLine1 = new THREE.Mesh(rightEyeLine1Geometry, accentMaterial);
    rightEyeGroup.add(rightEyeLine1);
    
    const rightEyeLine2Geometry = new THREE.BoxGeometry(0.5, 0.1, 0.1);
    rightEyeLine2Geometry.rotateZ(-Math.PI / 4);
    const rightEyeLine2 = new THREE.Mesh(rightEyeLine2Geometry, accentMaterial);
    rightEyeGroup.add(rightEyeLine2);
    
    cassetteModel.add(rightEyeGroup);
    
    // Mouth (downward curve)
    const mouthGeometry = new THREE.TorusGeometry(0.8, 0.1, 16, 16, Math.PI);
    const mouth = new THREE.Mesh(mouthGeometry, accentMaterial);
    mouth.position.z = 0.2;
    mouth.position.y = -0.5;
    mouth.rotation.x = Math.PI;
    mouth.castShadow = true;
    mouth.receiveShadow = true;
    cassetteModel.add(mouth);
    
    // Add the model to the scene
    cassetteScene.add(cassetteModel);
    
    // Scale the model
    cassetteModel.scale.set(1.2, 1.2, 1.2);
}

function animateCassette() {
    animationId = requestAnimationFrame(animateCassette);
    
    if (cassetteModel) {
        // Gentle auto-rotation - make sure it's visible
        cassetteModel.rotation.y += 0.01;
        
        // Add subtle floating animation
        cassetteModel.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
    
    cassetteRenderer.render(cassetteScene, cassetteCamera);
}

// Initialize when the page loads
window.addEventListener('load', function() {
    // Initialize immediately
    setTimeout(initCassetteModel, 500);
});

// Handle intersection observer to only animate when visible
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // Start or resume animation when visible
                    if (cassetteModel) {
                        if (!animationId) {
                            animateCassette();
                        }
                    } else {
                        initCassetteModel();
                    }
                } else {
                    // Stop animation when not visible
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            });
        }, { threshold: 0.1 });
        
        const container = document.getElementById('cassette-model-container');
        if (container) {
            observer.observe(container);
        }
    }
}); 