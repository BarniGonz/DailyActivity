// Animation and visual effects
function createBackgroundParticles() {
    const bgAnimation = document.querySelector('.bg-animation');

    // Blue particles
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle', 'particle-blue');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = particle.style.height = (Math.random() * 15 + 10) + 'px';
        particle.style.animationDelay = Math.random() * 14 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 12) + 's';
        bgAnimation.appendChild(particle);
    }

    // Purple particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle', 'particle-purple');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = particle.style.height = (Math.random() * 10 + 8) + 'px';
        particle.style.animationDelay = Math.random() * 17 + 's';
        particle.style.animationDuration = (Math.random() * 12 + 15) + 's';
        bgAnimation.appendChild(particle);
    }

    // Gold sparkle particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle', 'particle-gold');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = particle.style.height = (Math.random() * 6 + 4) + 'px';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 8 + 8) + 's';
        bgAnimation.appendChild(particle);
    }
}

function startRandomization() {
    isRandomizing = true;
    
    // Add global randomizing class for grid effect
    grid.classList.add('randomizing-all');
    
    // Add processing class to each card
    cards.forEach(card => {
        card.classList.add('processing', 'randomizing');
    });

    // Stop randomization after 4 seconds
    setTimeout(() => {
        stopRandomization();
    }, 4000);
}

function stopRandomization() {
    isRandomizing = false;
    
    // Remove global randomizing class
    grid.classList.remove('randomizing-all');
    
    // Remove processing classes from all cards
    cards.forEach(card => {
        card.classList.remove('processing', 'randomizing');
    });
}

function showTitleScreen(activity) {
    activityTitleText.textContent = activity;
    activityTitleScreen.classList.add('show');

    // Special background based on difficulty
    let bgColors;
    switch (currentDifficulty) {
        case 'expert':
            bgColors = 'linear-gradient(145deg, rgba(255, 193, 7, 0.97), rgba(255, 235, 59, 0.94), rgba(255, 152, 0, 0.92), rgba(255, 193, 7, 0.97))';
            break;
        case 'challenge':
            bgColors = 'linear-gradient(145deg, rgba(156, 39, 176, 0.97), rgba(186, 104, 200, 0.94), rgba(171, 71, 188, 0.92), rgba(156, 39, 176, 0.97))';
            break;
        default:
            bgColors = 'linear-gradient(145deg, rgba(74, 144, 226, 0.97), rgba(100, 200, 255, 0.94), rgba(156, 39, 176, 0.92), rgba(74, 144, 226, 0.97))';
    }
    activityTitleScreen.style.background = bgColors;
}

function triggerUltimateConfetti() {
    const colors = ['#4a90e2', '#64c8ff', '#9c27b0', '#ffc107', '#5c6bc0', '#ff9800', '#e91e63'];

    // Multiple confetti bursts
    const burstCount = currentDifficulty === 'expert' ? 10 : currentDifficulty === 'challenge' ? 8 : 6;

    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
            confetti({
                particleCount: 50 + i * 15,
                spread: 100 + i * 25,
                origin: {
                    x: Math.random() * 0.8 + 0.1,
                    y: Math.random() * 0.5 + 0.1
                },
                canvas: confettiCanvas,
                colors: colors,
                shapes: ['square', 'circle'],
                gravity: 0.7 + Math.random() * 0.5,
                scalar: 1.2 + Math.random() * 1.0,
                ticks: 300 + i * 60
            });
        }, i * 400);
    }

    // Special celebration for expert mode
    if (currentDifficulty === 'expert') {
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 360,
                origin: { x: 0.5, y: 0.5 },
                canvas: confettiCanvas,
                colors: ['#ffc107', '#ff9800', '#ff5722'],
                shapes: ['star'],
                gravity: 0.6,
                scalar: 2.5,
                ticks: 500
            });
        }, 2500);
    }
}

function showAchievement(achievement) {
    achievementPopup.innerHTML = `🏆 Achievement Unlocked: ${achievement}!`;
    achievementPopup.classList.add('show');
    playSound(achievementBuffer);

    setTimeout(() => {
        achievementPopup.classList.remove('show');
    }, 5000);
}

function continueToResult() {
    activityTitleScreen.classList.remove('show');

    setTimeout(() => {
        resultActivity.textContent = selectedActivity;
        resultDescription.textContent = activityDescriptions[selectedActivity] || 'Perfect choice for today!';
        result.classList.add('show');
    }, 600);
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.style.filter = isDarkTheme ? 'invert(1) hue-rotate(180deg)' : 'none';
    themeToggle.textContent = isDarkTheme ? '☀️' : '🌙';
}

// Canvas resize
function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}