// Global mute functionality
let isMuted = false;

// Function to toggle mute state for all audio elements
function toggleGlobalMute() {
    isMuted = !isMuted;
    
    // Update icon
    const muteIcon = document.querySelector('#global-mute-toggle i');
    if (muteIcon) {
        muteIcon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }
    
    // Update all audio/video elements
    updateAllAudioElements();
    
    console.log('Global mute toggled. Muted:', isMuted);
}

// Function to update all audio elements based on global mute state
function updateAllAudioElements() {
    console.log('Updating all audio elements. Muted:', isMuted);
    
    // Update all audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.muted = isMuted;
        console.log('Audio element muted:', audio.muted);
    });
    
    // Update all video elements
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
        video.muted = isMuted;
        console.log('Video element muted:', video.muted);
    });
    
    // Handle YouTube iframes
    const youtubeIframes = document.querySelectorAll('iframe[src*="youtube.com"]');
    youtubeIframes.forEach(iframe => {
        let src = iframe.src;
        
        // Store original src if not already stored
        if (!iframe.dataset.originalSrc) {
            iframe.dataset.originalSrc = src;
        }
        
        // Update mute parameter in YouTube iframe src
        if (src.includes('mute=1') || src.includes('mute=0')) {
            src = src.replace(isMuted ? 'mute=0' : 'mute=1', isMuted ? 'mute=1' : 'mute=0');
        } else {
            src += (src.includes('?') ? '&' : '?') + (isMuted ? 'mute=1' : 'mute=0');
        }
        
        iframe.src = src;
        console.log('YouTube iframe updated:', iframe.src);
    });
}

// Initialize mute button
document.addEventListener('DOMContentLoaded', function() {
    const muteButton = document.getElementById('global-mute-toggle');
    if (muteButton) {
        muteButton.addEventListener('click', toggleGlobalMute);
    }
}); 