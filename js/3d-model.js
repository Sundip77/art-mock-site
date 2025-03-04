let scene, camera, renderer, model;
let targetRotationY = 0;
let mouseX = 0;
let mouseXOnMouseDown = 0;
let isDragging = false;

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera with better positioning
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 7;
    camera.position.y = 1;
    
    // Create renderer with better settings
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    
    // Add renderer to DOM
    document.getElementById('model-container').appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(0, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add spotlight for dramatic effect
    const spotLight = new THREE.SpotLight(0xffd700, 1);
    spotLight.position.set(0, 5, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    scene.add(spotLight);
    
    // Load model
    const loader = new THREE.GLTFLoader();
    loader.load(
        'models/travis-scott.glb',
        function(gltf) {
            model = gltf.scene;
            scene.add(model);
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            // Adjust model position
            model.position.y = -1;
            
            // Scale the model
            const scale = 2;
            model.scale.set(scale, scale, scale);
            
            // Enable shadows
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            // Add initial rotation for better view
            model.rotation.y = Math.PI / 4;
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.error('An error occurred loading the model:', error);
        }
    );
    
    // Add event listeners for interaction
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('touchend', onDocumentTouchEnd, false);
    
    // Start animation
    animate();
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    isDragging = true;
    
    mouseXOnMouseDown = event.clientX;
    
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseMove(event) {
    if (!isDragging) return;
    
    const movementX = event.clientX - mouseXOnMouseDown;
    targetRotationY = movementX * 0.01;
    
    mouseXOnMouseDown = event.clientX;
}

function onDocumentMouseUp() {
    isDragging = false;
    targetRotationY = 0;
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut() {
    isDragging = false;
    targetRotationY = 0;
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        isDragging = true;
        mouseXOnMouseDown = event.touches[0].pageX;
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length === 1 && isDragging) {
        event.preventDefault();
        const movementX = event.touches[0].pageX - mouseXOnMouseDown;
        targetRotationY = movementX * 0.01;
        mouseXOnMouseDown = event.touches[0].pageX;
    }
}

function onDocumentTouchEnd() {
    isDragging = false;
    targetRotationY = 0;
}

function animate() {
    requestAnimationFrame(animate);
    
    if (model) {
        // Apply rotation based on drag
        if (isDragging) {
            model.rotation.y += targetRotationY;
        } else {
            // Gentle auto-rotation when not dragging
            model.rotation.y += 0.005;
        }
        
        // Add subtle floating animation
        model.position.y = -1 + Math.sin(Date.now() * 0.001) * 0.1;
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize when the page loads
window.addEventListener('load', init); 