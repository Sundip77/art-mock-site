let cassetteScene, cassetteCamera, cassetteRenderer, cassetteModel;
let cassetteRotationY = 0;
let cassetteMouseX = 0;
let cassetteMouseXOnMouseDown = 0;
let cassetteDragging = false;

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
    cassetteRenderer.setSize(200, 200);
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
    
    // Load model
    const loader = new THREE.GLTFLoader();
    loader.load(
        'models/cassette.gltf', // Update this path to your cassette model
        function(gltf) {
            cassetteModel = gltf.scene;
            cassetteScene.add(cassetteModel);
            
            // Center the model
            const box = new THREE.Box3().setFromObject(cassetteModel);
            const center = box.getCenter(new THREE.Vector3());
            cassetteModel.position.sub(center);
            
            // Scale the model
            const scale = 1.5;
            cassetteModel.scale.set(scale, scale, scale);
            
            // Enable shadows
            cassetteModel.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            // Add initial rotation for better view
            cassetteModel.rotation.x = Math.PI / 6;
        },
        function(xhr) {
            console.log('Cassette model: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.error('An error occurred loading the cassette model:', error);
        }
    );
    
    // Start animation
    animateCassette();
}

function animateCassette() {
    requestAnimationFrame(animateCassette);
    
    if (cassetteModel) {
        // Gentle auto-rotation
        cassetteModel.rotation.y += 0.01;
        
        // Add subtle floating animation
        cassetteModel.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
    
    cassetteRenderer.render(cassetteScene, cassetteCamera);
}

// Initialize when the page loads
window.addEventListener('load', function() {
    // Wait a bit to ensure the main model is loaded first
    setTimeout(initCassetteModel, 1000);
});

// Handle intersection observer to only animate when visible
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // Start or resume animation when visible
                    if (cassetteModel) {
                        animateCassette();
                    } else {
                        initCassetteModel();
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