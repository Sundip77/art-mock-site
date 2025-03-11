# Media Controls for LaFlamee Website

This package contains the mute button and video section components for the LaFlamee website.

## Files Included

1. `js/mute-button.js` - JavaScript for the global mute button functionality
2. `js/video-section.js` - JavaScript for the video section with auto-play/pause based on visibility
3. `css/media-controls.css` - CSS styles for the mute button and video section
4. `media-controls-example.html` - Example HTML showing how to implement these components

## How to Use

### 1. Include the CSS and JavaScript files

Add the following to your HTML `<head>` section:

```html
<!-- Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<!-- Media Controls CSS -->
<link rel="stylesheet" href="css/media-controls.css">
```

Add the following before the closing `</body>` tag:

```html
<script src="js/mute-button.js"></script>
<script src="js/video-section.js"></script>
```

### 2. Add the Mute Button

Add the following HTML where you want the mute button to appear:

```html
<div class="floating-control">
    <button id="global-mute-toggle" aria-label="Mute or unmute all audio">
        <i class="fas fa-volume-up"></i>
    </button>
</div>
```

### 3. Add the Video Section

Use the following structure for video sections:

```html
<section id="tours" class="section">
    <div class="video-background">
        <div id="youtube-player">
            <iframe 
                id="travis-video"
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=0&mute=0&loop=1&playlist=YOUR_VIDEO_ID&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1" 
                title="Video Background" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
            </iframe>
        </div>
    </div>
    <div class="container">
        <!-- Your content here -->
    </div>
</section>
```

Replace `YOUR_VIDEO_ID` with your YouTube video ID.

## Features

1. **Global Mute Button**:
   - Toggles mute state for all audio and video elements
   - Updates YouTube iframe parameters for muting
   - Visual feedback with icon change

2. **Video Section**:
   - Automatically plays videos when they're in the viewport
   - Pauses videos when they're not visible
   - Optimized for performance

## Customization

You can customize the appearance of the mute button and video section by modifying the CSS in `css/media-controls.css`. 