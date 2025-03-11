// Video section functionality
let sectionVideos = {};

// Function to pause all videos except in the active section
function pauseInactiveVideos() {
    // Get all sections with videos
    const sections = ['music', 'tours'];
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Check if section is in viewport
        const isVisible = isElementInViewport(section);
        
        // Get videos in this section
        let sectionVideo = null;
        if (sectionId === 'music') {
            sectionVideo = document.querySelector('#album-bg-video iframe');
        } else if (sectionId === 'tours') {
            sectionVideo = document.querySelector('#youtube-player iframe');
        }
        
        if (sectionVideo) {
            if (isVisible) {
                // Section is visible, play video
                console.log(`${sectionId} section is visible, playing video`);
                let src = sectionVideo.src;
                
                // Store the video for this section
                sectionVideos[sectionId] = sectionVideo;
                
                // Make sure autoplay is enabled
                if (!src.includes('autoplay=1')) {
                    if (src.includes('autoplay=0')) {
                        src = src.replace('autoplay=0', 'autoplay=1');
                    } else {
                        src += (src.includes('?') ? '&' : '?') + 'autoplay=1';
                    }
                    sectionVideo.src = src;
                }
            } else {
                // Section is not visible, pause video
                console.log(`${sectionId} section is not visible, pausing video`);
                let src = sectionVideo.src;
                
                // Make sure autoplay is disabled
                if (src.includes('autoplay=1')) {
                    src = src.replace('autoplay=1', 'autoplay=0');
                    sectionVideo.src = src;
                }
            }
        }
    });
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Initialize video control
document.addEventListener('DOMContentLoaded', function() {
    // Initial check
    pauseInactiveVideos();
    
    // Check on scroll
    window.addEventListener('scroll', function() {
        pauseInactiveVideos();
    });
}); 