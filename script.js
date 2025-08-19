// DOM elements
const audioBox = document.getElementById('audio-box');
const kuromiBox = document.getElementById('kuromi-box');
const galleryBox = document.getElementById('gallery-box');
const audioSection = document.getElementById('audio-section');
const kuromiSection = document.getElementById('kuromi-section');
const gallerySection = document.getElementById('gallery-section');
const container = document.querySelector('.container');
const backButtons = document.querySelectorAll('.back-button');

// Get all video elements
const videos = document.querySelectorAll('video');

// Track which boxes are unlocked
let audioUnlocked = true; // First box is initially unlocked
let kuromiUnlocked = false;
let galleryUnlocked = false;

// Function to pause all videos
function pauseAllVideos() {
    videos.forEach(video => {
        if (!video.paused) {
            video.pause();
        }
    });
}

// Function to play videos in a specific section
function playSectionVideos(section) {
    // First pause all videos
    pauseAllVideos();
    
    // Then play videos in the current section
    const sectionVideos = section.querySelectorAll('video');
    sectionVideos.forEach(video => {
        // Only play if the video has the autoplay attribute
        if (video.hasAttribute('autoplay')) {
            video.play().catch(e => {
                console.log('Autoplay prevented by browser:', e);
            });
        }
    });
}

// Box click handlers
audioBox.addEventListener('click', () => {
    if (audioUnlocked) {
        container.style.display = 'none';
        audioSection.style.display = 'block';
        
        // Unlock the second box after first is opened
        if (!kuromiUnlocked) {
            kuromiUnlocked = true;
            kuromiBox.classList.remove('locked');
            kuromiBox.classList.add('unlocked');
            kuromiBox.querySelector('.lock-icon').style.display = 'none';
        }
        
        // Play videos in the audio section
        playSectionVideos(audioSection);
    }
});

kuromiBox.addEventListener('click', () => {
    if (kuromiUnlocked) {
        container.style.display = 'none';
        kuromiSection.style.display = 'block';
        
        // Unlock the third box after second is opened
        if (!galleryUnlocked) {
            galleryUnlocked = true;
            galleryBox.classList.remove('locked');
            galleryBox.classList.add('unlocked');
            galleryBox.querySelector('.lock-icon').style.display = 'none';
        }
        
        // Play videos in the kuromi section
        playSectionVideos(kuromiSection);
    } else {
        // Shake effect for locked box
        kuromiBox.style.animation = 'shake 0.5s';
        setTimeout(() => {
            kuromiBox.style.animation = '';
        }, 500);
    }
});

galleryBox.addEventListener('click', () => {
    if (galleryUnlocked) {
        container.style.display = 'none';
        gallerySection.style.display = 'block';
        
        // Play videos in the gallery section
        playSectionVideos(gallerySection);
    } else {
        // Shake effect for locked box
        galleryBox.style.animation = 'shake 0.5s';
        setTimeout(() => {
            galleryBox.style.animation = '';
        }, 500);
    }
});

// Back button handlers
backButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        container.style.display = 'flex';
        
        // Pause all videos when returning to main page
        pauseAllVideos();
    });
});

// Initialize with user interaction
document.addEventListener('DOMContentLoaded', () => {
    // Video background fallback for mobile
    if (window.innerWidth <= 768) {
        const bgVideo = document.getElementById('bg-video');
        if (bgVideo) {
            bgVideo.style.display = 'none';
        }
    }
    
    // Play videos in the background video if it exists
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) {
        bgVideo.play().catch(e => {
            console.log('Background video autoplay prevented:', e);
        });
    }
});

// Pause videos when page is hidden (tab switch)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseAllVideos();
    } else {
        // When returning to the tab, play videos in the current visible section
        if (audioSection.style.display === 'block') {
            playSectionVideos(audioSection);
        } else if (kuromiSection.style.display === 'block') {
            playSectionVideos(kuromiSection);
        } else if (gallerySection.style.display === 'block') {
            playSectionVideos(gallerySection);
        } else {
            // If we're on the main container, play background video
            const bgVideo = document.getElementById('bg-video');
            if (bgVideo) {
                bgVideo.play().catch(e => {
                    console.log('Background video autoplay prevented:', e);
                });
            }
        }
    }
});

// Handle browser autoplay policies by adding a start button if needed
function handleAutoplay() {
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) {
        bgVideo.play().catch(e => {
            console.log('Autoplay prevented, showing start button');
            // Create a start button if autoplay is blocked
            const startButton = document.createElement('button');
            startButton.textContent = 'Start Experience';
            startButton.style.position = 'fixed';
            startButton.style.top = '50%';
            startButton.style.left = '50%';
            startButton.style.transform = 'translate(-50%, -50%)';
            startButton.style.padding = '15px 30px';
            startButton.style.fontSize = '18px';
            startButton.style.zIndex = '1000';
            startButton.style.cursor = 'pointer';
            startButton.addEventListener('click', () => {
                bgVideo.play();
                startButton.remove();
            });
            document.body.appendChild(startButton);
        });
    }
}

// Call handleAutoplay on page load
document.addEventListener('DOMContentLoaded', handleAutoplay);