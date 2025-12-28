// Project Data (EXACT 9 ITEMS)
// NOTE: Ensure your video files are in a folder named 'videos'
const PROJECTS = [
    {
        title: "Mumbai Dreamscape",
        category: "Short Form",
        description: "Rhythm-driven montage capturing the kinetic energy of the Maximum City.",
        youtubeId: "7ILmmzNzNv4",
        previewVideo: "videos/mumbai-preview.mp4"
    },
    {
        title: "BGMI Pro League Finals",
        category: "Gaming",
        description: "High-intensity tournament highlights with advanced 3D motion tracking.",
        youtubeId: "cMUcjeeYfr8",
        previewVideo: "videos/bgmi-preview.mp4"
    },
    {
        title: "ISL Top Moments",
        category: "Football",
        description: "Seamlessly stitched goal highlights from the Indian Super League.",
        youtubeId: "h4d2f9Gzb7M",
        previewVideo: "videos/isl-preview.mp4"
    },
    {
        title: "Golden Heart – Rajasthan",
        category: "Color Grading",
        description: "Study in desert warm tones and traditional Indian textiles.",
        youtubeId: "RmxaeW-abNk",
        previewVideo: "videos/rajasthan-preview.mp4"
    },
    {
        title: "Braveheart AMV",
        category: "Anime",
        description: "Blending Indian historical emotion with modern anime aesthetics.",
        youtubeId: "8kfP22meDL0",
        previewVideo: "videos/anime-preview.mp4"
    },
    {
        title: "The Artisans of Kanchipuram",
        category: "Documentary",
        description: "Observational documentary on heritage silk weavers.",
        youtubeId: "rAlC7mwPp3c",
        previewVideo: "videos/artisan-preview.mp4"
    },
    {
        title: "Zomato – Midnight Bites",
        category: "E-Commerce",
        description: "Appetite-driven social commercial with sensory editing.",
        youtubeId: "GSYCPWuJNRw",
        previewVideo: "videos/zomato-preview.mp4"
    },
    {
        title: "Mastering the Edit",
        category: "Long Form",
        description: "Educational long-form content for next-gen editors.",
        youtubeId: "ho3paS2k980",
        previewVideo: "videos/mastering-preview.mp4"
    },
    {
        title: "Tata Nano – Electric Era",
        category: "Advertisement",
        description: "High-production TVC for the electric evolution of an icon.",
        youtubeId: "5Lgg3-K0uTw",
        previewVideo: "videos/tata-preview.mp4"
    }
];

// YouTube API Setup Removed (Using Custom Local Player)

// Portfolio Render
const portfolioGrid = document.getElementById('portfolio-grid');

function renderPortfolio() {
    if (!portfolioGrid) return;
    portfolioGrid.innerHTML = '';

    PROJECTS.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card reveal';

        card.innerHTML = `
            <div class="project-img-wrapper">
                <img src="https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg" alt="${project.title}" class="project-img">
                <div class="play-overlay">
                    <i data-lucide="play-circle"></i>
                </div>
            </div>
            <div class="project-info">
                <span class="blue-badge">${project.category}</span>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
            </div>
        `;

        const imgWrapper = card.querySelector('.project-img-wrapper');
        const img = card.querySelector('.project-img');
        let previewTimeout;

        // --- LOCAL VIDEO HOVER LOGIC ---
        card.addEventListener('mouseenter', () => {
            previewTimeout = setTimeout(() => {
                // Remove existing video if present
                const existing = imgWrapper.querySelector('.preview-video');
                if (existing) existing.remove();

                const video = document.createElement('video');
                video.className = 'preview-video';
                video.src = project.previewVideo;
                video.autoplay = true;
                video.loop = true;
                video.muted = true; // Required for browser autoplay
                video.playsInline = true;

                // Styling to match card dimensions
                video.style.position = "absolute";
                video.style.top = "0";
                video.style.left = "0";
                video.style.width = "100%";
                video.style.height = "100%";
                video.style.objectFit = "cover";
                video.style.zIndex = "2";
                video.style.pointerEvents = "none"; // Allows click through to card

                // Error Handling: If video fails (404), remove it and show thumb
                video.onerror = () => {
                    video.remove();
                    img.style.opacity = "1";
                };

                imgWrapper.appendChild(video);

                // Fade out thumbnail only if video starts playing
                video.onplay = () => {
                    img.style.opacity = "0";
                };

                // Trigger play (safety for some browsers)
                video.play().catch(e => { /* Autoplay blocked or failed */ });
            }, 300);
        });

        card.addEventListener('mouseleave', () => {
            clearTimeout(previewTimeout);
            const video = imgWrapper.querySelector('.preview-video');
            if (video) {
                video.pause();
                video.remove();
            }
            // Bring thumbnail back
            img.style.opacity = "0.8";
        });

        // --- CLICK LOGIC (OPENS YOUTUBE LIGHTBOX) ---
        card.addEventListener('click', () => {
            openLightbox(project);
        });

        portfolioGrid.appendChild(card);
    });

    lucide.createIcons();
    observeReveal();
}

// Custom Video Player Logic
const lightbox = document.getElementById('lightbox');
const mainVideo = document.getElementById('main-video');
const playPauseBtn = document.getElementById('play-pause');
const progressBar = document.querySelector('.progress-bar');
const progressArea = document.querySelector('.progress-area');
const speedBtn = document.getElementById('speed-toggle');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const timeDisplay = document.querySelector('.time-display');
const titleElem = document.getElementById('player-title');
const descElem = document.getElementById('player-description');

// Format Time (mm:ss)
function formatTime(seconds) {
    if (!seconds) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (secs < 10) secs = "0" + secs;
    return `${mins}:${secs}`;
}

// Open Lightbox
function openLightbox(project) {
    if (!lightbox || !mainVideo) return;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Set Content
    if (titleElem) titleElem.innerText = project.title;
    if (descElem) descElem.innerText = project.description;

    // Set Video Source (Local file used for preview is also used for main player)
    mainVideo.src = project.previewVideo;

    // Reset Controls
    mainVideo.playbackRate = 1.0;
    speedBtn.innerText = "1x";
    progressBar.style.width = "0%";
    mainVideo.currentTime = 0;
    updatePlayIcon(true); // Show Pause icon assuming autoplay

    // Attempt Autoplay
    mainVideo.play().catch(error => {
        updatePlayIcon(false); // If autoplay fails, show Play icon
    });
}

// Close Lightbox
function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    mainVideo.pause();
    mainVideo.src = ""; // Stop buffering
}

// --- Player Controls ---

// Toggle Play/Pause
function togglePlay() {
    if (mainVideo.paused) {
        mainVideo.play();
        updatePlayIcon(true);
    } else {
        mainVideo.pause();
        updatePlayIcon(false);
    }
}

function updatePlayIcon(isPlaying) {
    const icon = playPauseBtn.querySelector('i');
    if (isPlaying) {
        // Pause Icon
        icon.innerHTML = `<line x1="10" x2="10" y1="4" y2="20"/><line x1="14" x2="14" y1="4" y2="20"/>`;
        // Note: Manually setting SVG content or class for Lucide. 
        // Simplest to just recreate the SVG logic or toggle classes if Lucide was distinct.
        // Re-running Lucide create might be overkill. Let's just swap innerHTML for simplicity.
        // Actually, Lucide replaces <i> with <svg>. So we need to handle that carefully.
        // BETTER APPROACH: Use Lucide's data attributes and re-render or valid SVG manually?
        // Let's use standard HTML entity or simple SVG for reliability.
        playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>`;
    } else {
        // Play Icon
        playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    }
}

// Update Progress Bar
mainVideo.addEventListener('timeupdate', (e) => {
    const { currentTime, duration } = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    timeDisplay.innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
});

// Click Progress Bar to Seek
progressArea.addEventListener('click', (e) => {
    let timelineWidth = progressArea.clientWidth;
    let clickX = e.offsetX;
    let duration = mainVideo.duration;
    mainVideo.currentTime = (clickX / timelineWidth) * duration;
});

// Toggle Speed (1x -> 2x -> 1x)
speedBtn.addEventListener('click', () => {
    if (mainVideo.playbackRate === 1.0) {
        mainVideo.playbackRate = 2.0;
        speedBtn.innerText = "2x";
    } else {
        mainVideo.playbackRate = 1.0;
        speedBtn.innerText = "1x";
    }
});

// Toggle Fullscreen
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        if (mainVideo.requestFullscreen) mainVideo.requestFullscreen();
        else if (mainVideo.webkitRequestFullscreen) mainVideo.webkitRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
});

// Event Listeners
playPauseBtn.addEventListener('click', togglePlay);
mainVideo.addEventListener('click', togglePlay); // Click video to toggle
document.getElementById('player-close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-overlay')?.addEventListener('click', closeLightbox);

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
    } else if (e.code === 'KeyF') {
        if (!document.fullscreenElement) {
            if (mainVideo.requestFullscreen) mainVideo.requestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    } else if (e.code === 'Escape') {
        closeLightbox();
    }
});

// Reveal Animation
function observeReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Form Handling
document.getElementById('project-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerHTML = '<span>Sent!</span>';
    setTimeout(() => {
        btn.innerHTML = 'Send Message';
        e.target.reset();
    }, 3000);
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loader')?.classList.add('hidden');
    }, 1000);
    renderPortfolio();
});

// Scroll Navbar
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) navbar?.classList.add('scrolled');
    else navbar?.classList.remove('scrolled');
});