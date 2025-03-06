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
    
    // Create a simple cassette model since we're having issues with loading external models
    createSimpleCassetteModel();
    
    // Start animation
    animateCassette();
}

function createSimpleCassetteModel() {
    // Create a group to hold all cassette parts
    cassetteModel = new THREE.Group();
    
    // Create materials
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333, 
        specular: 0x111111,
        shininess: 30
    });
    
    const tapeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x111111, 
        specular: 0x222222,
        shininess: 50
    });
    
    const labelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        specular: 0x444444,
        shininess: 10
    });
    
    // Create cassette body
    const bodyGeometry = new THREE.BoxGeometry(3, 0.3, 2);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    cassetteModel.add(body);
    
    // Create label
    const labelGeometry = new THREE.BoxGeometry(2.5, 0.05, 1.5);
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.y = 0.18;
    label.castShadow = true;
    label.receiveShadow = true;
    cassetteModel.add(label);
    
    // Create tape reels
    const reelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
    
    const leftReel = new THREE.Mesh(reelGeometry, tapeMaterial);
    leftReel.position.set(-0.8, 0, 0);
    leftReel.rotation.x = Math.PI / 2;
    leftReel.castShadow = true;
    leftReel.receiveShadow = true;
    cassetteModel.add(leftReel);
    
    const rightReel = new THREE.Mesh(reelGeometry, tapeMaterial);
    rightReel.position.set(0.8, 0, 0);
    rightReel.rotation.x = Math.PI / 2;
    rightReel.castShadow = true;
    rightReel.receiveShadow = true;
    cassetteModel.add(rightReel);
    
    // Create tape windows
    const windowGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.8);
    const windowMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x666666, 
        transparent: true,
        opacity: 0.7,
        specular: 0x999999,
        shininess: 100
    });
    
    const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    leftWindow.position.set(-0.8, 0.2, 0);
    leftWindow.castShadow = true;
    leftWindow.receiveShadow = true;
    cassetteModel.add(leftWindow);
    
    const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    rightWindow.position.set(0.8, 0.2, 0);
    rightWindow.castShadow = true;
    rightWindow.receiveShadow = true;
    cassetteModel.add(rightWindow);
    
    // Since TextGeometry requires a font that we may not have loaded,
    // let's create a simple plane with a texture instead
    const textMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff6b00,
        specular: 0x444444,
        shininess: 10
    });
    
    const textPlane = new THREE.PlaneGeometry(2, 0.4);
    const textMesh = new THREE.Mesh(textPlane, textMaterial);
    textMesh.position.set(0, 0.21, 0);
    textMesh.rotation.x = -Math.PI / 2;
    cassetteModel.add(textMesh);
    
    // Add the model to the scene
    cassetteScene.add(cassetteModel);
    
    // Scale the model to be larger
    cassetteModel.scale.set(1.5, 1.5, 1.5);
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