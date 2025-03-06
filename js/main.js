// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Global audio state
let globalMuted = false;

// Function to toggle mute state for all audio elements
function toggleGlobalMute() {
    globalMuted = !globalMuted;
    
    // Update mute button icon
    const muteBtn = document.getElementById('global-mute-toggle');
    if (muteBtn) {
        const icon = muteBtn.querySelector('i');
        if (icon) {
            if (globalMuted) {
                icon.className = 'fas fa-volume-mute';
            } else {
                icon.className = 'fas fa-volume-up';
            }
        }
    }
    
    // Update all audio elements
    updateAllAudioElements();
}

// Function to update all audio elements based on global mute state
function updateAllAudioElements() {
    // Update YouTube iframes
    const youtubeIframes = document.querySelectorAll('iframe[src*="youtube.com"]');
    youtubeIframes.forEach(iframe => {
        let src = iframe.src;
        if (globalMuted) {
            // Mute the video
            if (src.includes('mute=0')) {
                src = src.replace('mute=0', 'mute=1');
            } else if (!src.includes('mute=1')) {
                src += (src.includes('?') ? '&' : '?') + 'mute=1';
            }
        } else {
            // Unmute the video
            if (src.includes('mute=1')) {
                src = src.replace('mute=1', 'mute=0');
            } else if (!src.includes('mute=0')) {
                src += (src.includes('?') ? '&' : '?') + 'mute=0';
            }
        }
        
        // Only update if the source has changed
        if (src !== iframe.src) {
            iframe.src = src;
        }
    });
    
    // Update HTML5 audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.muted = globalMuted;
    });
    
    // Update HTML5 video elements
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
        video.muted = globalMuted;
    });
    
    // Update Spotify iframes
    const spotifyIframes = document.querySelectorAll('iframe[src*="spotify.com"]');
    spotifyIframes.forEach(iframe => {
        try {
            // This is a best effort - Spotify doesn't always allow direct control
            if (iframe.contentWindow) {
                const message = globalMuted ? 'pause' : 'play';
                iframe.contentWindow.postMessage({ command: message }, '*');
            }
        } catch (e) {
            console.error('Error controlling Spotify iframe:', e);
        }
    });
    
    console.log('Global audio state updated:', globalMuted ? 'Muted' : 'Unmuted');
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

// Gallery Images
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

// Album Data
const albums = [
    {
        title: 'UTOPIA',
        year: '2023',
        cover: 'https://travisscott.rosecityworks.com/cdn/shop/files/Travis-Scott-Utopia-CD-1500.png?v=1698377013&width=1100',
        spotifyLink: 'https://open.spotify.com/album/0387OE4TJJGaH1M8sKL1K6'
    },
    {
        title: 'ASTROWORLD',
        year: '2018',
        cover: 'https://travisscott.rosecityworks.com/cdn/shop/files/Travis-Scott-Astroworld-CD-1500.png?v=1698376375&width=1100',
        spotifyLink: 'https://open.spotify.com/album/41GuZcammIkupMPKH2OJ6I'
    },
    {
        title: 'Birds in the Trap Sing McKnight',
        year: '2016',
        cover: 'https://travisscott.rosecityworks.com/cdn/shop/files/Travis-Scott-Birds-CD-1500.png?v=1698376888&width=1445',
        spotifyLink: 'https://open.spotify.com/album/42WVQWuf1teDysXiOupIZt'
    },
    {
        title: 'Rodeo',
        year: '2015',
        cover: 'https://travisscott.rosecityworks.com/cdn/shop/files/Travis-Scott-Rodeo-Deluxe-1500.png?v=1699920600&width=1445',
        spotifyLink: 'https://open.spotify.com/album/4PWBTB6NYxuxQa5c2ROUZe'
    },
    {
        title: 'Owl Pharaoh',
        year: '2013',
        cover: 'https://media-hosting.imagekit.io//9d721a6cd4d84392/s-l1600-removebg-preview.png?Expires=1835725694&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=EjWG6cDHD0YwTCRiAl4PgGHTDu1zzGauE82T~BPHoZmv3eYT7bfx403E0CYLi3pBwtlkSbRKDWgFSR0Hm0ukf7XjP96kRjbVRbobUdnFyUqpLLgeixS~OIXEL7UpfRIwH138691QZi8wlbnRz52Kz0mN3UYrrCMfiMplOy8bCNHiPRO4axFuwOkmR1jTSR2K9CnrcuUF4VY3DEQzAblrx7eTZEjYSJsm~J34kMYZQtRu1EUexpXk51IBXM4aTGFeOspggwt3SEq-ZaTBLrPS3O3~~Kt-SzjZ1sOx-I0VX~lMd-IHuDSNFPFlf8zXUNFBXLD2bmD0mZoa7LwpyYRHhA__',
        spotifyLink: 'https://open.spotify.com/album/687cZJR45JO7jhk1LHIbgq'
    },
    {
        title: 'Days Before Rodeo',
        year: '2014',
        cover: 'https://i.ibb.co/nsdKrpCM/travis-scott-vinyl-days-before-rodeo-fotor-bg-remover-2025030503355.png',
        spotifyLink: 'https://open.spotify.com/album/3mqQBxpuABnC63Hl0e6tiR'
    }
];

// YouTube video controls for Tours section
let youtubeIframe;

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Initialize smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Initialize image loading
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

    // Initialize global mute button
    const globalMuteBtn = document.getElementById('global-mute-toggle');
    if (globalMuteBtn) {
        globalMuteBtn.addEventListener('click', toggleGlobalMute);
        console.log('Global mute button initialized');
    }

    // Simple YouTube video handling
    youtubeIframe = document.querySelector('#youtube-player iframe');
    if (youtubeIframe) {
        console.log('YouTube iframe found');
        
        // Force autoplay when scrolled into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Tours section is visible, ensuring video plays');
                    // Refresh the iframe to trigger autoplay
                    const currentSrc = youtubeIframe.src;
                    youtubeIframe.src = currentSrc;
                    
                    // Apply global mute state
                    setTimeout(() => {
                        updateAllAudioElements();
                    }, 1000);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe the tours section
        const toursSection = document.getElementById('tours');
        if (toursSection) {
            observer.observe(toursSection);
        }
    }

    // Initialize gallery with smooth scrolling
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        galleryGrid.innerHTML = '';
        console.log('Initializing gallery grid');

        // Add images to gallery
        galleryImages.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image.url;
            img.alt = image.alt;
            
            if (image.isWide) {
                img.classList.add('wide-image');
                console.log('Added wide image:', image.url);
            }
            
            // Add load event listener
            img.onload = function() {
                img.style.opacity = '1';
                console.log('Image loaded:', image.url);
            };
            
            // Add error handler
            img.onerror = function() {
                console.error('Failed to load image:', image.url);
                // Try to reload the image or use a fallback
                setTimeout(() => {
                    img.src = image.url + '?' + new Date().getTime();
                }, 1000);
            };
            
            galleryGrid.appendChild(img);
        });

        // Very simple scroll effect that won't break the layout
        const handleImageScroll = () => {
            // Get all images including the wide one
            const images = galleryGrid.querySelectorAll('img');
            
            // Apply a very subtle effect to all images
            images.forEach(img => {
                const rect = img.getBoundingClientRect();
                
                // Only apply effect if image is in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    // Calculate a very small movement based on scroll position
                    let translateY = 0;
                    
                    if (img.classList.contains('wide-image')) {
                        // Very subtle movement for wide image (max 20px)
                        translateY = Math.min(20, Math.max(-20, window.scrollY * 0.02));
                    } else {
                        // Even more subtle for regular images
                        translateY = Math.min(10, Math.max(-10, window.scrollY * 0.01));
                    }
                    
                    // Apply transform
                    img.style.transform = `translateY(${translateY}px)`;
                }
            });
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleImageScroll, { passive: true });
        
        // Initial call to set positions
        setTimeout(handleImageScroll, 500);
    }

    // Initialize form submission
    const newsletterForm = document.getElementById('newsletter-form');
    const contactForm = document.getElementById('contact-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add newsletter subscription logic here
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add contact form submission logic here
            alert('Thank you for your message. We will get back to you soon!');
            contactForm.reset();
        });
    }

    // Initialize scroll animation
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    handleScrollAnimation();

    // Initialize albums
    const albumsGrid = document.querySelector('.albums-grid');
    if (albumsGrid) {
        albumsGrid.innerHTML = '';
        
        albums.forEach(album => {
            const albumCard = document.createElement('div');
            albumCard.className = 'album-card';
            
            albumCard.innerHTML = `
                <img src="${album.cover}" alt="${album.title}" loading="lazy">
                <div class="album-info">
                    <h3>${album.title}</h3>
                    <a href="${album.spotifyLink}" class="stream-btn" target="_blank" rel="noopener">Stream Now</a>
                </div>
            `;
            
            // Add error handling for images
            const img = albumCard.querySelector('img');
            img.onerror = function() {
                console.error('Error loading album image:', img.src);
                // Fallback image if the original fails to load
                img.src = 'https://via.placeholder.com/60x60/222222/ffd700?text=TS';
            };
            
            albumsGrid.appendChild(albumCard);
        });
    }
}); 