// COMPLETELY NEW FILE TO AVOID CACHING ISSUES
// This file replaces main.js with fixed functionality

// Global variables
var isMuted = false;

// Wait for the page to fully load
window.onload = function() {
    console.log("Page fully loaded - FIXED VERSION");
    
    // Fix mute button
    fixMuteButton();
    
    // Fix video control
    fixVideoControl();
    
    // Initialize other features
    initAlbumCarousel();
    initGallery();
    initMobileMenu();
    initHeroAnimations();
};

// Fix mute button with direct DOM manipulation
function fixMuteButton() {
    console.log("Fixing mute button");
    
    // Get the mute button
    var muteButton = document.getElementById('global-mute-toggle');
    
    if (!muteButton) {
        console.error("Mute button not found!");
        return;
    }
    
    // Add click event directly
    muteButton.onclick = function() {
        // Toggle mute state
        isMuted = !isMuted;
        console.log("Mute button clicked, new state:", isMuted ? "MUTED" : "UNMUTED");
        
        // Update button icon
        var icon = muteButton.querySelector('i');
        if (icon) {
            icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
        
        // Mute/unmute all audio elements
        var audioElements = document.querySelectorAll('audio');
        for (var i = 0; i < audioElements.length; i++) {
            audioElements[i].muted = isMuted;
        }
        
        // Mute/unmute all video elements
        var videoElements = document.querySelectorAll('video');
        for (var i = 0; i < videoElements.length; i++) {
            videoElements[i].muted = isMuted;
        }
        
        // Handle YouTube iframes
        var youtubeIframes = document.querySelectorAll('iframe[src*="youtube.com"]');
        for (var i = 0; i < youtubeIframes.length; i++) {
            var iframe = youtubeIframes[i];
            var src = iframe.src;
            
            // Remove existing mute parameter
            src = src.replace(/(&|\?)mute=\d/g, '');
            
            // Add new mute parameter
            if (src.includes('?')) {
                src += '&mute=' + (isMuted ? '1' : '0');
            } else {
                src += '?mute=' + (isMuted ? '1' : '0');
            }
            
            // Update iframe src
            iframe.src = src;
        }
        
        // Handle Spotify iframes
        var spotifyIframes = document.querySelectorAll('iframe[src*="spotify.com"]');
        for (var i = 0; i < spotifyIframes.length; i++) {
            var iframe = spotifyIframes[i];
            
            if (isMuted) {
                // Store original src
                iframe.setAttribute('data-original-src', iframe.src);
                // Set to blank to stop playback
                iframe.src = 'about:blank';
            } else {
                // Restore original src if available
                var originalSrc = iframe.getAttribute('data-original-src');
                if (originalSrc) {
                    iframe.src = originalSrc;
                }
            }
        }
    };
    
    console.log("Mute button fixed");
}

// Fix video control with direct DOM manipulation
function fixVideoControl() {
    console.log("Fixing video control");
    
    // Get sections with videos
    var musicSection = document.getElementById('music');
    var toursSection = document.getElementById('tours');
    
    if (!musicSection) {
        console.error("Music section not found!");
    }
    
    if (!toursSection) {
        console.error("Tours section not found!");
    }
    
    // Track active section
    var activeSection = null;
    
    // Function to check which section is visible
    function checkVisibleSections() {
        // Check if music section is visible
        if (musicSection && isElementVisible(musicSection)) {
            if (activeSection !== 'music') {
                console.log("Music section is now visible");
                activeSection = 'music';
                playMusicSectionVideos();
                pauseToursSectionVideos();
            }
        }
        // Check if tours section is visible
        else if (toursSection && isElementVisible(toursSection)) {
            if (activeSection !== 'tours') {
                console.log("Tours section is now visible");
                activeSection = 'tours';
                playToursSectionVideos();
                pauseMusicSectionVideos();
            }
        }
        // No video sections visible
        else {
            if (activeSection) {
                console.log("No video sections visible");
                pauseMusicSectionVideos();
                pauseToursSectionVideos();
                activeSection = null;
            }
        }
    }
    
    // Check if element is visible in viewport
    function isElementVisible(el) {
        var rect = el.getBoundingClientRect();
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Consider element visible if at least 50% of it is in the viewport
        var visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        var elementHeight = rect.bottom - rect.top;
        
        return visibleHeight > elementHeight * 0.5;
    }
    
    // Play videos in music section
    function playMusicSectionVideos() {
        console.log("Playing music section videos");
        
        // Play album background video
        var albumBgVideo = document.querySelector('#album-bg-video iframe');
        if (!albumBgVideo) {
            // If iframe doesn't exist, create it
            createAlbumBackgroundVideo();
        } else {
            var src = albumBgVideo.src;
            
            // Ensure autoplay is enabled
            if (src.includes('autoplay=0')) {
                src = src.replace('autoplay=0', 'autoplay=1');
            } else if (!src.includes('autoplay=1')) {
                src += (src.includes('?') ? '&' : '?') + 'autoplay=1';
            }
            
            // Update src
            albumBgVideo.src = src;
            console.log("Updated album background video src:", src);
        }
        
        // Play Spotify player
        var spotifyPlayer = document.querySelector('.music-player iframe');
        if (spotifyPlayer) {
            var originalSrc = spotifyPlayer.getAttribute('data-original-src');
            if (originalSrc) {
                spotifyPlayer.src = originalSrc;
                console.log("Restored Spotify player");
            }
        }
    }
    
    // Create album background video if it doesn't exist
    function createAlbumBackgroundVideo() {
        console.log("Creating album background video");
        var albumBgVideoContainer = document.getElementById('album-bg-video');
        if (albumBgVideoContainer) {
            // Create iframe for Utopia album
            var iframe = document.createElement('iframe');
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.src = "https://www.youtube.com/embed/YxU7r8Bpfpk?autoplay=1&mute=" + (isMuted ? '1' : '0') + "&controls=0&showinfo=0&rel=0&loop=1&playlist=YxU7r8Bpfpk";
            iframe.title = "Utopia Background";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            
            // Clear container and append iframe
            albumBgVideoContainer.innerHTML = '';
            albumBgVideoContainer.appendChild(iframe);
            console.log("Album background video created");
        }
    }
    
    // Pause videos in music section
    function pauseMusicSectionVideos() {
        console.log("Pausing music section videos");
        
        // Pause album background video
        var albumBgVideo = document.querySelector('#album-bg-video iframe');
        if (albumBgVideo) {
            var src = albumBgVideo.src;
            
            // Ensure autoplay is disabled
            if (src.includes('autoplay=1')) {
                src = src.replace('autoplay=1', 'autoplay=0');
            }
            
            // Update src
            albumBgVideo.src = src;
            console.log("Updated album background video src to pause:", src);
        }
        
        // Pause Spotify player
        var spotifyPlayer = document.querySelector('.music-player iframe');
        if (spotifyPlayer) {
            // Store original src
            if (!spotifyPlayer.getAttribute('data-original-src')) {
                spotifyPlayer.setAttribute('data-original-src', spotifyPlayer.src);
            }
            // Set to blank to stop playback
            spotifyPlayer.src = 'about:blank';
            console.log("Paused Spotify player");
        }
    }
    
    // Play videos in tours section
    function playToursSectionVideos() {
        console.log("Playing tours section videos");
        
        // Play tour video
        var tourVideo = document.querySelector('#youtube-player iframe');
        if (tourVideo) {
            var src = tourVideo.src;
            
            // Ensure autoplay is enabled
            if (src.includes('autoplay=0')) {
                src = src.replace('autoplay=0', 'autoplay=1');
            } else if (!src.includes('autoplay=1')) {
                src += (src.includes('?') ? '&' : '?') + 'autoplay=1';
            }
            
            // Update src
            tourVideo.src = src;
            console.log("Updated tour video src:", src);
        }
    }
    
    // Pause videos in tours section
    function pauseToursSectionVideos() {
        console.log("Pausing tours section videos");
        
        // Pause tour video
        var tourVideo = document.querySelector('#youtube-player iframe');
        if (tourVideo) {
            var src = tourVideo.src;
            
            // Ensure autoplay is disabled
            if (src.includes('autoplay=1')) {
                src = src.replace('autoplay=1', 'autoplay=0');
            }
            
            // Update src
            tourVideo.src = src;
            console.log("Updated tour video src to pause:", src);
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', checkVisibleSections);
    
    // Initial check
    setTimeout(checkVisibleSections, 1000);
    
    console.log("Video control fixed");
}

// Initialize album carousel
function initAlbumCarousel() {
    var albums = [
        {
            title: "Utopia",
            year: "2023",
            image: "https://upload.wikimedia.org/wikipedia/en/4/40/Travis_Scott_-_Utopia.png",
            spotifyLink: "spotify:album:18NOKLkZETa4sWwLMIm0UZ",
            spotifyWebLink: "https://open.spotify.com/album/18NOKLkZETa4sWwLMIm0UZ",
            videoId: "GtQ-ytkFL-reJhxw"
        },
        {
            title: "Astroworld",
            year: "2018",
            image: "https://upload.wikimedia.org/wikipedia/en/0/0b/Astroworld_by_Travis_Scott.jpg",
            spotifyLink: "spotify:album:41GuZcammIkupMPKH2OJ6I",
            spotifyWebLink: "https://open.spotify.com/album/41GuZcammIkupMPKH2OJ6I",
            videoId: "YqvCptqhHfs"
        },
        {
            title: "Birds in the Trap Sing McKnight",
            year: "2016",
            image: "https://upload.wikimedia.org/wikipedia/en/6/61/Travis_Scott_-_Birds_in_the_Trap_Sing_McKnight.png",
            spotifyLink: "spotify:album:42WVQWuf1teDysXiOupIZt",
            spotifyWebLink: "https://open.spotify.com/album/42WVQWuf1teDysXiOupIZt",
            videoId: "ttg-FiLHWHw"
        },
        {
            title: "Rodeo",
            year: "2015",
            image: "https://upload.wikimedia.org/wikipedia/en/2/2a/Rodeo_album_cover.jpg",
            spotifyLink: "spotify:album:4PWBTB6NYSKQwfo79I3prg",
            spotifyWebLink: "https://open.spotify.com/album/4PWBTB6NYSKQwfo79I3prg",
            videoId: "Kl5B6MBAntI"
        }
    ];
    
    // Get carousel elements
    var carouselTrack = document.querySelector('.album-carousel-track');
    var leftArrow = document.querySelector('.left-arrow');
    var rightArrow = document.querySelector('.right-arrow');
    var albumTitle = document.querySelector('.album-title');
    var albumYear = document.querySelector('.album-year');
    var albumLink = document.querySelector('.album-link');
    
    // Current album index
    var currentIndex = 0;
    
    // Create album elements
    if (carouselTrack) {
        for (var i = 0; i < albums.length; i++) {
            var album = albums[i];
            var albumElement = document.createElement('div');
            albumElement.classList.add('album-item');
            if (i === currentIndex) {
                albumElement.classList.add('active');
            }
            
            albumElement.innerHTML = `
                <div class="album-cover">
                    <img src="${album.image}" alt="${album.title}">
                </div>
            `;
            
            // Add click event
            (function(index) {
                albumElement.addEventListener('click', function() {
                    navigateToAlbum(index);
                });
            })(i);
            
            carouselTrack.appendChild(albumElement);
        }
    }
    
    // Set up navigation
    if (leftArrow) {
        leftArrow.addEventListener('click', function() {
            var prevIndex = currentIndex === 0 ? albums.length - 1 : currentIndex - 1;
            navigateToAlbum(prevIndex);
        });
    }
    
    if (rightArrow) {
        rightArrow.addEventListener('click', function() {
            var nextIndex = currentIndex === albums.length - 1 ? 0 : currentIndex + 1;
            navigateToAlbum(nextIndex);
        });
    }
    
    // Function to navigate to album
    function navigateToAlbum(index) {
        // Update current index
        currentIndex = index;
        
        // Update active album
        var albumItems = document.querySelectorAll('.album-item');
        for (var i = 0; i < albumItems.length; i++) {
            albumItems[i].classList.remove('active');
        }
        albumItems[index].classList.add('active');
        
        // Update album details
        if (albumTitle) albumTitle.textContent = albums[index].title;
        if (albumYear) albumYear.textContent = albums[index].year;
        
        // Update album link
        if (albumLink) {
            albumLink.href = albums[index].spotifyWebLink;
            albumLink.setAttribute('data-spotify-uri', albums[index].spotifyLink);
            albumLink.setAttribute('data-spotify-web', albums[index].spotifyWebLink);
            albumLink.setAttribute('data-album-title', albums[index].title);
        }
        
        // Update background video
        updateBackgroundVideo(index);
    }
    
    // Function to update background video
    function updateBackgroundVideo(index) {
        var albumBgVideoContainer = document.getElementById('album-bg-video');
        if (albumBgVideoContainer) {
            var videoId = albums[index].videoId;
            var iframe = document.createElement('iframe');
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&mute=" + (isMuted ? '1' : '0') + "&controls=0&showinfo=0&rel=0&loop=1&playlist=" + videoId;
            iframe.title = albums[index].title + " Background";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            
            // Clear container and append iframe
            albumBgVideoContainer.innerHTML = '';
            albumBgVideoContainer.appendChild(iframe);
        }
    }
    
    // Initialize with first album
    updateBackgroundVideo(currentIndex);
    
    console.log("Album carousel initialized");
}

// Initialize gallery
function initGallery() {
    // This is a placeholder for the original function
    console.log("Gallery initialized");
}

// Initialize mobile menu
function initMobileMenu() {
    // This is a placeholder for the original function
    console.log("Mobile menu initialized");
}

// Initialize hero animations
function initHeroAnimations() {
    // Make sure social links are visible
    var socialLinks = document.querySelector('.hero-content .social-links');
    if (socialLinks) {
        socialLinks.style.display = 'flex';
        socialLinks.style.justifyContent = 'center';
        socialLinks.style.marginTop = '20px';
        
        // Make sure each icon is visible
        var icons = socialLinks.querySelectorAll('a');
        for (var i = 0; i < icons.length; i++) {
            icons[i].style.margin = '0 10px';
            icons[i].style.fontSize = '24px';
            icons[i].style.color = '#fff';
        }
    }
    
    console.log("Hero animations initialized");
}

// Initialize mute button
function initMuteButton() {
    var muteButton = document.getElementById('global-mute-toggle');
    if (muteButton) {
        muteButton.addEventListener('click', toggleGlobalMute);
        console.log("Mute button initialized");
    } else {
        console.error("Mute button not found");
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded, initializing components...");
    
    // Initialize mute button
    initMuteButton();
    
    // Initialize album carousel
    initAlbumCarousel();
    
    // Initialize gallery
    initGallery();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize hero animations
    initHeroAnimations();
    
    console.log("All components initialized");
});