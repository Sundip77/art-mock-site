// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

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

// Clear existing gallery content
const galleryGrid = document.querySelector('.gallery-grid');
if (galleryGrid) {
    galleryGrid.innerHTML = '';

    // Add images to gallery
    galleryImages.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.alt;
        
        if (image.isWide) {
            img.classList.add('wide-image');
        }
        
        // Add load event listener
        img.onload = function() {
            img.style.opacity = '1';
        };
        
        galleryGrid.appendChild(img);
    });

    // Handle scroll-based image position
    const handleImageScroll = () => {
        const images = galleryGrid.querySelectorAll('img.wide-image');
        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            
            if (progress > 0.3 && progress < 0.7) {
                img.classList.add('scrolled-up');
            } else {
                img.classList.remove('scrolled-up');
            }
        });
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleImageScroll);
    });
    handleImageScroll();
}

// Form Submission
const newsletterForm = document.getElementById('newsletter-form');
const contactForm = document.getElementById('contact-form');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    alert('Thank you for subscribing to our newsletter!');
    newsletterForm.reset();
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add contact form submission logic here
    alert('Thank you for your message. We will get back to you soon!');
    contactForm.reset();
});

// Scroll Animation
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

// Initialize AOS (Animate on Scroll)
window.addEventListener('load', () => {
    handleScrollAnimation();
});

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

// Add albums to the page
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