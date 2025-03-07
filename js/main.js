// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Global variables
let isMuted = false;
let activeSection = null;

// Track active section for video control
let sectionVideos = {};

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
    
    // Update YouTube iframes
    const youtubeIframes = document.querySelectorAll('iframe[src*="youtube.com"]');
    youtubeIframes.forEach(iframe => {
        let src = iframe.src;
        
        // Remove existing mute parameter
        src = src.replace(/(&|\?)mute=\d/g, '');
        
        // Add appropriate mute parameter
        if (src.includes('?')) {
            src += '&mute=' + (isMuted ? '1' : '0');
        } else {
            src += '?mute=' + (isMuted ? '1' : '0');
        }
        
        // Update src to apply changes
        iframe.src = src;
        console.log('YouTube iframe updated:', src);
    });
    
    // Update Spotify iframes (they don't support muting via parameters, so we pause them)
    const spotifyIframes = document.querySelectorAll('iframe[src*="spotify.com"]');
    if (isMuted) {
        spotifyIframes.forEach(iframe => {
            // Store current src to restore later
            iframe.dataset.originalSrc = iframe.src;
            iframe.src = 'about:blank';
            console.log('Spotify iframe paused');
        });
    } else {
        spotifyIframes.forEach(iframe => {
            // Restore original src if available
            if (iframe.dataset.originalSrc) {
                iframe.src = iframe.dataset.originalSrc;
                console.log('Spotify iframe restored');
            }
        });
    }
}

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
                
                // Replace autoplay=1 with autoplay=0
                if (src.includes('autoplay=1')) {
                    src = src.replace('autoplay=1', 'autoplay=0');
                    sectionVideo.src = src;
                }
            }
        }
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Simplified Image Loading
const images = document.querySelectorAll('img');
images.forEach(img => {
    // Add error handling
    img.onerror = function() {
        console.error('Error loading image:', img.src);
    };
    
    // Add load handling
    img.onload = function() {
        img.style.opacity = '1';
    };
});

// Gallery images
const galleryImages = [
    {
        url: 'https://media.pitchfork.com/photos/64ab2f27be750061ad40dd13/3:2/w_1560,h_1040,c_limit/travis-scott.jpg',
        alt: 'Travis Scott portrait',
        isWide: true
    },
    {
        url: 'https://pbs.twimg.com/media/GMS0olvW8AApOU1.jpg:large',
        alt: 'Travis Scott performance',
        isWide: false
    },
    {
        url: 'https://d1mnxluw9mpf9w.cloudfront.net/media/8375/travis-scott.jpg',
        alt: 'Travis Scott stage performance',
        isWide: false
    },
    {
        url: 'https://4kwallpapers.com/images/walls/thumbs_3t/12441.jpg',
        alt: 'Travis Scott concert',
        isWide: false
    }
];

// Album Data with background videos - Using exact YouTube IDs provided
const albums = [
    {
        title: 'UTOPIA',
        year: '2023',
        cover: 'https://travisscott.rosecityworks.com/cdn/shop/files/Travis-Scott-Utopia-CD-1500.png?v=1698377013&width=1100',
        spotifyLink: 'spotify:album:18NOKLkZETa4sWwLMIm0UZ',
        spotifyWebLink: 'https://open.spotify.com/album/18NOKLkZETa4sWwLMIm0UZ?si=niCwOFO-Q_qz9eSuRs4rHQ',
        videoId: 'FRjQH1kLjEc' // UTOPIA video
    },
    {
        title: 'ASTROWORLD',
        year: '2018',
        cover: 'https://travisscott.rosecityworks.com/cdn/shop/files/Travis-Scott-Astroworld-CD-1500.png?v=1698376375&width=1100',
        spotifyLink: 'spotify:album:41GuZcammIkupMPKH2OJ6I',
        spotifyWebLink: 'https://open.spotify.com/album/41GuZcammIkupMPKH2OJ6I?si=Wd9-Qs-eTLCZXbKQRYUYmA',
        videoId: '6ONRf7h3Mdk' // ASTROWORLD video - updated
    },
    {
        title: 'Birds in the Trap Sing McKnight',
        year: '2016',
        cover: 'https://travisscott.rosecityworks.com/cdn/shop/files/Travis-Scott-Birds-CD-1500.png?v=1698376888&width=1445',
        spotifyLink: 'spotify:album:42WVQWuf1teDysXiOupIZt',
        spotifyWebLink: 'https://open.spotify.com/album/42WVQWuf1teDysXiOupIZt?si=Wd9-Qs-eTLCZXbKQRYUYmA',
        videoId: 'Dst9gZkq1a8' // Birds video - updated
    },
    {
        title: 'Rodeo',
        year: '2015',
        cover: 'https://travisscott.rosecityworks.com/cdn/shop/files/Travis-Scott-Rodeo-Deluxe-1500.png?v=1699920600&width=1445',
        spotifyLink: 'spotify:album:4PWBTB6NYSKQwfo79I3prg',
        spotifyWebLink: 'https://open.spotify.com/album/4PWBTB6NYSKQwfo79I3prg?si=PCBEW6_FTGKUtt4W9s75Gg',
        videoId: 'KnZ8h3MRuYg' // Rodeo video - updated with new link
    },
    {
        title: 'Owl Pharaoh',
        year: '2013',
        cover: 'https://media-hosting.imagekit.io//9d721a6cd4d84392/s-l1600-removebg-preview.png?Expires=1835725694&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=EjWG6cDHD0YwTCRiAl4PgGHTDu1zzGauE82T~BPHoZmv3eYT7bfx403E0CYLi3pBwtlkSbRKDWgFSR0Hm0ukf7XjP96kRjbVRbobUdnFyUqpLLgeixS~OIXEL7UpfRIwH138691QZi8wlbnRz52Kz0mN3UYrrCMfiMplOy8bCNHiPRO4axFuwOkmR1jTSR2K9CnrcuUF4VY3DEQzAblrx7eTZEjYSJsm~J34kMYZQtRu1EUexpXk51IBXM4aTGFeOspggwt3SEq-ZaTBLrPS3O3~~Kt-SzjZ1sOx-I0VX~lMd-IHuDSNFPFlf8zXUNFBXLD2bmD0mZoa7LwpyYRHhA__',
        spotifyLink: 'spotify:playlist:0FxFmzE4EI4xibIs9jaIVN',
        spotifyWebLink: 'https://open.spotify.com/playlist/0FxFmzE4EI4xibIs9jaIVN?si=b35be59cb25b4b95',
        videoId: 'X4MSlFq8bNI' // Owl Pharaoh video - updated with new link
    },
    {
        title: 'Days Before Rodeo',
        year: '2014',
        cover: 'https://i.ibb.co/nsdKrpCM/travis-scott-vinyl-days-before-rodeo-fotor-bg-remover-2025030503355.png',
        spotifyLink: 'spotify:album:54Y471E7GNBSOXjZtqONId',
        spotifyWebLink: 'https://open.spotify.com/album/54Y471E7GNBSOXjZtqONId?si=e0WAR_GtQ-ytkFL-reJhxw',
        videoId: 'sS8ELauHmGM' // Days Before Rodeo video - updated with new link
    }
];

// Album Carousel Variables
let currentAlbumIndex = 0;
let isAnimating = false;

// YouTube video controls for Tours section
let youtubeIframe;

// Hero section animations
function initHeroAnimations() {
    const socialLinks = document.querySelectorAll('.social-links a');
    const heroButtons = document.querySelectorAll('.hero-btn');
    
    // Stagger animation for social links
    socialLinks.forEach((link, index) => {
        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 200 * index);
    });
    
    // Stagger animation for buttons
    heroButtons.forEach((button, index) => {
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 500 + (200 * index));
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Initialize features
    initAlbumCarousel();
    initGallery();
    initMobileMenu();
    initHeroAnimations();
    
    // Fix mute button - SUPER SIMPLE APPROACH
    const muteButton = document.getElementById('global-mute-toggle');
    if (muteButton) {
        console.log('Found mute button, adding click handler');
        
        // Add click event listener
        muteButton.addEventListener('click', function() {
            // Toggle mute state
            isMuted = !isMuted;
            console.log('Mute button clicked, new state:', isMuted ? 'MUTED' : 'UNMUTED');
            
            // Update button icon
            const icon = muteButton.querySelector('i');
            if (icon) {
                icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            }
            
            // Handle all audio elements
            const audioElements = document.querySelectorAll('audio');
            audioElements.forEach(function(audio) {
                audio.muted = isMuted;
                console.log('Set audio element muted to:', isMuted);
            });
            
            // Handle all video elements
            const videoElements = document.querySelectorAll('video');
            videoElements.forEach(function(video) {
                video.muted = isMuted;
                console.log('Set video element muted to:', isMuted);
            });
            
            // Handle YouTube iframes
            const youtubeIframes = document.querySelectorAll('iframe[src*="youtube.com"]');
            youtubeIframes.forEach(function(iframe) {
                // Create new src with updated mute parameter
                let src = iframe.src;
                
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
                console.log('Updated YouTube iframe src with mute:', isMuted);
            });
            
            // Handle Spotify iframes
            const spotifyIframes = document.querySelectorAll('iframe[src*="spotify.com"]');
            spotifyIframes.forEach(function(iframe) {
                if (isMuted) {
                    // Store original src
                    iframe.setAttribute('data-original-src', iframe.src);
                    // Set to blank to stop playback
                    iframe.src = 'about:blank';
                    console.log('Paused Spotify iframe');
                } else {
                    // Restore original src if available
                    const originalSrc = iframe.getAttribute('data-original-src');
                    if (originalSrc) {
                        iframe.src = originalSrc;
                        console.log('Restored Spotify iframe');
                    }
                }
            });
        });
    } else {
        console.error('Mute button not found!');
    }
    
    // Set up section visibility tracking
    setupSectionVisibilityTracking();
});

// Track section visibility and control videos
function setupSectionVisibilityTracking() {
    console.log('Setting up section visibility tracking');
    
    // Get sections with videos
    const musicSection = document.getElementById('music');
    const toursSection = document.getElementById('tours');
    
    // Set up scroll event listener
    window.addEventListener('scroll', function() {
        // Check music section visibility
        if (musicSection && isElementInViewport(musicSection)) {
            if (activeSection !== 'music') {
                activeSection = 'music';
                console.log('Music section is now visible');
                playMusicSectionVideos();
                pauseToursSectionVideos();
            }
        } 
        // Check tours section visibility
        else if (toursSection && isElementInViewport(toursSection)) {
            if (activeSection !== 'tours') {
                activeSection = 'tours';
                console.log('Tours section is now visible');
                playToursSectionVideos();
                pauseMusicSectionVideos();
            }
        } 
        // No video sections visible
        else {
            if (activeSection) {
                console.log('No video sections visible');
                pauseAllVideos();
                activeSection = null;
            }
        }
    });
    
    // Initial check
    setTimeout(function() {
        if (musicSection && isElementInViewport(musicSection)) {
            activeSection = 'music';
            console.log('Music section is initially visible');
            playMusicSectionVideos();
        } else if (toursSection && isElementInViewport(toursSection)) {
            activeSection = 'tours';
            console.log('Tours section is initially visible');
            playToursSectionVideos();
        }
    }, 1000);
}

// Play videos in music section
function playMusicSectionVideos() {
    console.log('Playing music section videos');
    
    // Play album background video
    const albumBgVideo = document.querySelector('#album-bg-video iframe');
    if (albumBgVideo) {
        let src = albumBgVideo.src;
        
        // Ensure autoplay is enabled
        if (src.includes('autoplay=0')) {
            src = src.replace('autoplay=0', 'autoplay=1');
        } else if (!src.includes('autoplay=1')) {
            src += (src.includes('?') ? '&' : '?') + 'autoplay=1';
        }
        
        // Ensure mute state is respected
        if (isMuted && src.includes('mute=0')) {
            src = src.replace('mute=0', 'mute=1');
        } else if (!isMuted && src.includes('mute=1')) {
            src = src.replace('mute=1', 'mute=0');
        } else if (!src.includes('mute=')) {
            src += (src.includes('?') ? '&' : '?') + 'mute=' + (isMuted ? '1' : '0');
        }
        
        // Update src
        albumBgVideo.src = src;
        console.log('Updated album background video src:', src);
    }
    
    // Play Spotify player if not muted
    const spotifyPlayer = document.querySelector('.music-player iframe');
    if (spotifyPlayer && !isMuted) {
        const originalSrc = spotifyPlayer.getAttribute('data-original-src');
        if (originalSrc) {
            spotifyPlayer.src = originalSrc;
            console.log('Restored Spotify player');
        }
    }
}

// Pause videos in music section
function pauseMusicSectionVideos() {
    console.log('Pausing music section videos');
    
    // Pause album background video
    const albumBgVideo = document.querySelector('#album-bg-video iframe');
    if (albumBgVideo) {
        let src = albumBgVideo.src;
        
        // Ensure autoplay is disabled
        if (src.includes('autoplay=1')) {
            src = src.replace('autoplay=1', 'autoplay=0');
        } else if (!src.includes('autoplay=0')) {
            src += (src.includes('?') ? '&' : '?') + 'autoplay=0';
        }
        
        // Update src
        albumBgVideo.src = src;
        console.log('Updated album background video src to pause:', src);
    }
    
    // Pause Spotify player
    const spotifyPlayer = document.querySelector('.music-player iframe');
    if (spotifyPlayer) {
        // Store original src
        if (!spotifyPlayer.getAttribute('data-original-src')) {
            spotifyPlayer.setAttribute('data-original-src', spotifyPlayer.src);
        }
        // Set to blank to stop playback
        spotifyPlayer.src = 'about:blank';
        console.log('Paused Spotify player');
    }
}

// Play videos in tours section
function playToursSectionVideos() {
    console.log('Playing tours section videos');
    
    // Play tour video
    const tourVideo = document.querySelector('#youtube-player iframe');
    if (tourVideo) {
        let src = tourVideo.src;
        
        // Ensure autoplay is enabled
        if (src.includes('autoplay=0')) {
            src = src.replace('autoplay=0', 'autoplay=1');
        } else if (!src.includes('autoplay=1')) {
            src += (src.includes('?') ? '&' : '?') + 'autoplay=1';
        }
        
        // Ensure mute state is respected
        if (isMuted && src.includes('mute=0')) {
            src = src.replace('mute=0', 'mute=1');
        } else if (!isMuted && src.includes('mute=1')) {
            src = src.replace('mute=1', 'mute=0');
        } else if (!src.includes('mute=')) {
            src += (src.includes('?') ? '&' : '?') + 'mute=' + (isMuted ? '1' : '0');
        }
        
        // Update src
        tourVideo.src = src;
        console.log('Updated tour video src:', src);
    }
}

// Pause videos in tours section
function pauseToursSectionVideos() {
    console.log('Pausing tours section videos');
    
    // Pause tour video
    const tourVideo = document.querySelector('#youtube-player iframe');
    if (tourVideo) {
        let src = tourVideo.src;
        
        // Ensure autoplay is disabled
        if (src.includes('autoplay=1')) {
            src = src.replace('autoplay=1', 'autoplay=0');
        } else if (!src.includes('autoplay=0')) {
            src += (src.includes('?') ? '&' : '?') + 'autoplay=0';
        }
        
        // Update src
        tourVideo.src = src;
        console.log('Updated tour video src to pause:', src);
    }
}

// Pause all videos
function pauseAllVideos() {
    pauseMusicSectionVideos();
    pauseToursSectionVideos();
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Consider element visible if at least 40% of it is in the viewport
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const elementHeight = rect.bottom - rect.top;
    const visibleRatio = visibleHeight / elementHeight;
    
    return visibleRatio > 0.4;
}

// Function to initialize the album carousel
function initAlbumCarousel() {
    const carouselTrack = document.querySelector('.album-carousel-track');
    const albumBgVideo = document.getElementById('album-bg-video');
    const albumTitle = document.querySelector('.album-title');
    const albumYear = document.querySelector('.album-year');
    const albumLink = document.querySelector('.album-link');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    
    if (!carouselTrack || !albumBgVideo) return;
    
    // Clear any existing content
    carouselTrack.innerHTML = '';
    
    // Create album items
    albums.forEach((album, index) => {
        const albumItem = document.createElement('div');
        albumItem.className = 'album-item';
        albumItem.dataset.index = index;
        
        if (index === currentAlbumIndex) {
            albumItem.classList.add('active');
        } else if (index === getPrevIndex(currentAlbumIndex)) {
            albumItem.classList.add('prev');
        } else if (index === getNextIndex(currentAlbumIndex)) {
            albumItem.classList.add('next');
        }
        
        albumItem.innerHTML = `<img src="${album.cover}" alt="${album.title}" loading="lazy">`;
        
        // Add click event to album item
        albumItem.addEventListener('click', () => {
            if (!isAnimating && index !== currentAlbumIndex) {
                navigateToAlbum(index);
            }
        });
        
        carouselTrack.appendChild(albumItem);
    });
    
    // Set up navigation arrows
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            if (!isAnimating) {
                navigateToAlbum(getPrevIndex(currentAlbumIndex));
            }
        });
    }
    
    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            if (!isAnimating) {
                navigateToAlbum(getNextIndex(currentAlbumIndex));
            }
        });
    }
    
    // Set up keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isElementInViewport(carouselTrack)) {
            if (e.key === 'ArrowLeft' && !isAnimating) {
                navigateToAlbum(getPrevIndex(currentAlbumIndex));
            } else if (e.key === 'ArrowRight' && !isAnimating) {
                navigateToAlbum(getNextIndex(currentAlbumIndex));
            }
        }
    });
    
    // Set up mouse move navigation
    const albumCarousel = document.querySelector('.album-carousel');
    if (albumCarousel) {
        albumCarousel.addEventListener('mousemove', (e) => {
            const rect = albumCarousel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            
            // If mouse is in the left 30% of the carousel
            if (x < width * 0.3) {
                albumCarousel.style.cursor = 'url("https://img.icons8.com/ios-filled/50/000000/long-arrow-left.png"), w-resize';
            } 
            // If mouse is in the right 30% of the carousel
            else if (x > width * 0.7) {
                albumCarousel.style.cursor = 'url("https://img.icons8.com/ios-filled/50/000000/long-arrow-right.png"), e-resize';
            } 
            // If mouse is in the middle 40% of the carousel
            else {
                albumCarousel.style.cursor = 'default';
            }
        });
        
        albumCarousel.addEventListener('click', (e) => {
            if (isAnimating) return;
            
            const rect = albumCarousel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            
            // If click is in the left 30% of the carousel
            if (x < width * 0.3) {
                navigateToAlbum(getPrevIndex(currentAlbumIndex));
            } 
            // If click is in the right 30% of the carousel
            else if (x > width * 0.7) {
                navigateToAlbum(getNextIndex(currentAlbumIndex));
            }
        });
    }
    
    // Initialize with the first album
    updateAlbumDetails(currentAlbumIndex);
    
    // Only play video if music section is visible
    const musicSection = document.getElementById('music');
    if (musicSection && isElementInViewport(musicSection)) {
        updateBackgroundVideo(currentAlbumIndex, true); // true = autoplay
    } else {
        updateBackgroundVideo(currentAlbumIndex, false); // false = don't autoplay
    }
}

// Function to navigate to a specific album
function navigateToAlbum(index) {
    if (isAnimating || index === currentAlbumIndex) return;
    
    isAnimating = true;
    
    const albumItems = document.querySelectorAll('.album-item');
    const prevIndex = currentAlbumIndex;
    currentAlbumIndex = index;
    
    // Update classes for all album items
    albumItems.forEach((item, i) => {
        // Remove all position classes
        item.classList.remove('active', 'prev', 'next');
        
        // Add appropriate class based on new index
        if (i === currentAlbumIndex) {
            item.classList.add('active');
        } else if (i === getPrevIndex(currentAlbumIndex)) {
            item.classList.add('prev');
        } else if (i === getNextIndex(currentAlbumIndex)) {
            item.classList.add('next');
        }
    });
    
    // Update album details and background
    updateAlbumDetails(currentAlbumIndex);
    
    // Only play video if music section is visible
    const musicSection = document.getElementById('music');
    if (musicSection && isElementInViewport(musicSection)) {
        updateBackgroundVideo(currentAlbumIndex, true); // true = autoplay
    } else {
        updateBackgroundVideo(currentAlbumIndex, false); // false = don't autoplay
    }
    
    // Reset animation flag after transition completes
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

// Function to open Spotify links effectively
function openSpotifyLink(uri, webLink, albumTitle) {
    console.log('Opening Spotify for ' + albumTitle + ': ' + webLink);
    
    // For Owl Pharaoh, which is a playlist, handle it differently
    if (webLink.includes('playlist')) {
        console.log('Opening as playlist: ' + webLink);
        // Open directly in a new tab for playlists
        window.open(webLink, '_blank');
        return;
    }
    
    // First try to open the Spotify app with the URI
    const spotifyAppAttempt = document.createElement('iframe');
    spotifyAppAttempt.style.display = 'none';
    spotifyAppAttempt.src = uri;
    document.body.appendChild(spotifyAppAttempt);
    
    // After a short delay, also open the web link in a new tab
    // This ensures at least one method works
    setTimeout(() => {
        // Clean up the iframe
        try {
            document.body.removeChild(spotifyAppAttempt);
        } catch (e) {
            // Ignore errors if already removed
        }
        
        // Open web link in new tab
        window.open(webLink, '_blank');
    }, 300);
    
    // Also create a direct link as a fallback
    const directLink = document.createElement('a');
    directLink.href = webLink;
    directLink.target = '_blank';
    directLink.rel = 'noopener noreferrer';
    directLink.style.display = 'none';
    document.body.appendChild(directLink);
    
    // Click the link after a short delay
    setTimeout(() => {
        directLink.click();
        // Clean up
        try {
            document.body.removeChild(directLink);
        } catch (e) {
            // Ignore errors if already removed
        }
    }, 600);
}

// Function to update album details
function updateAlbumDetails(index) {
    const album = albums[index];
    const albumTitle = document.querySelector('.album-title');
    const albumYear = document.querySelector('.album-year');
    const albumLink = document.querySelector('.album-link');
    
    if (albumTitle) albumTitle.textContent = album.title;
    if (albumYear) albumYear.textContent = album.year;
    
    if (albumLink) {
        // Remove any existing event listeners to prevent duplicates
        const newAlbumLink = albumLink.cloneNode(true);
        albumLink.parentNode.replaceChild(newAlbumLink, albumLink);
        
        // Set up the new link with proper attributes
        newAlbumLink.href = album.spotifyWebLink;
        newAlbumLink.setAttribute('target', '_blank');
        newAlbumLink.setAttribute('rel', 'noopener noreferrer');
        newAlbumLink.textContent = 'Stream Now';
        
        // Add data attributes for both URI and web link
        newAlbumLink.dataset.spotifyUri = album.spotifyLink;
        newAlbumLink.dataset.spotifyWeb = album.spotifyWebLink;
        newAlbumLink.dataset.albumTitle = album.title;
        
        // Add a direct click handler that forces the link to open
        newAlbumLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const albumTitle = this.dataset.albumTitle;
            const spotifyUri = this.dataset.spotifyUri;
            const spotifyWeb = this.dataset.spotifyWeb;
            
            // Use the specialized function to open Spotify
            openSpotifyLink(spotifyUri, spotifyWeb, albumTitle);
        });
    }
}

// Function to update background video
function updateBackgroundVideo(index, shouldAutoplay) {
    const album = albums[index];
    const albumBgVideo = document.getElementById('album-bg-video');
    
    if (!albumBgVideo) return;
    
    // Create YouTube iframe for background
    // Add start parameter for specific videos to start at the right timestamp
    let startTime = '';
    if (album.title === 'Days Before Rodeo') {
        startTime = '&start=22';
    } else if (album.title === 'Rodeo') {
        startTime = '&start=24'; // Start Rodeo video at 24 seconds
    } else if (album.title === 'Owl Pharaoh') {
        startTime = '&start=148'; // Updated timestamp for Owl Pharaoh
    } else if (album.title === 'UTOPIA') {
        startTime = '&start=16'; // Start UTOPIA video at 16 seconds
    }
    
    albumBgVideo.innerHTML = `
        <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${album.videoId}?autoplay=${shouldAutoplay ? '1' : '0'}&mute=${isMuted ? '1' : '0'}&loop=1&playlist=${album.videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1${startTime}" 
            title="${album.title} Background" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
        </iframe>
    `;
    
    console.log(`Updated background video for ${album.title} with autoplay=${shouldAutoplay}`);
}

// Helper function to get previous index with wrap-around
function getPrevIndex(currentIndex) {
    return (currentIndex - 1 + albums.length) % albums.length;
}

// Helper function to get next index with wrap-around
function getNextIndex(currentIndex) {
    return (currentIndex + 1) % albums.length;
}

// Initialize parallax effect for gallery
function initParallaxEffect() {
    const parallaxContainer = document.getElementById('parallax-container');
    const parallaxImage = document.getElementById('parallax-image');
    
    if (!parallaxContainer || !parallaxImage) {
        console.warn('Parallax elements not found');
        return;
    }
    
    let isInViewport = false;
    
    function calculatePositions() {
        if (!isInViewport) return;
        
        const scrollPosition = window.scrollY;
        const containerTop = parallaxContainer.getBoundingClientRect().top + scrollPosition;
        const containerHeight = parallaxContainer.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Check if the container is in the viewport
        if (scrollPosition + windowHeight > containerTop && 
            scrollPosition < containerTop + containerHeight) {
            
            // Calculate how far the container is from the top of the viewport
            const distanceFromTop = (scrollPosition + windowHeight) - containerTop;
            const percentage = distanceFromTop / (containerHeight + windowHeight);
            
            // Apply the parallax effect
            const translateY = Math.min(percentage * 50, 50); // Max 50px movement
            parallaxImage.style.transform = `translateY(-${translateY}px)`;
        }
    }
    
    // Check if element is in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isInViewport = entry.isIntersecting;
            if (isInViewport) {
                calculatePositions();
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(parallaxContainer);
    
    // Add scroll event listener
    window.addEventListener('scroll', calculatePositions);
    window.addEventListener('resize', calculatePositions);
}

// Initialize gallery with animations
function initGallery() {
    // Get gallery elements
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const wideImage = document.querySelector('.wide-image-container img');
    
    // Add animation classes to gallery items
    galleryItems.forEach((item, index) => {
        item.classList.add('fade-in-animation');
        item.style.animationDelay = `${index * 0.2}s`;
        
        // Add hover effect
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        });
    });
    
    // Initialize parallax effect for the wide image
    initParallaxEffect();
}

// Initialize tour cards with animation delays
function initTourCards() {
    const tourCards = document.querySelectorAll('.tour-card');
    tourCards.forEach((card, index) => {
        card.style.setProperty('--index', index);
    });
}

// Setup intersection observers for animations
function setupAnimationObservers() {
    const sections = document.querySelectorAll('.section');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
} 