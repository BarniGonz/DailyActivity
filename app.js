// Main application initialization and event handling
document.addEventListener('DOMContentLoaded', () => {
    // Initialize everything
    updateStatsDisplay();
    createBackgroundParticles();
    initAudio();
    initializeCards();
    
    // Enhanced touch interactions
    cards.forEach(card => {
        card.addEventListener('touchstart', (e) => {
            if (gameStarted && !gameFinished && !card.classList.contains('flipped') && !isRandomizing) {
                card.style.transform = 'perspective(1500px) rotateX(4deg) scale(1.04)';
            }
        }, { passive: true });

        card.addEventListener('touchend', (e) => {
            if (!card.classList.contains('flipped') && !isRandomizing) {
                card.style.transform = '';
            }
        }, { passive: true });
    });

    // Event listeners
    cards.forEach(card => {
        card.addEventListener('click', () => handleCardClick(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(card);
            }
        });
    });

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetBoard);
    themeToggle.addEventListener('click', toggleTheme);
    soundToggle.addEventListener('click', toggleSound);
    activityTitleContinue.addEventListener('click', continueToResult);

    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setDifficulty(btn.dataset.difficulty);
        });
    });

    // Canvas resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.key.toLowerCase()) {
            case ' ':
            case 'enter':
                if (!startButton.disabled && e.target === document.body) {
                    e.preventDefault();
                    startGame();
                } else if (activityTitleScreen.classList.contains('show')) {
                    e.preventDefault();
                    continueToResult();
                }
                break;
            case 'r':
                if (!resetButton.disabled) {
                    e.preventDefault();
                    resetBoard();
                }
                break;
            case 't':
                toggleTheme();
                break;
            case 's':
                toggleSound();
                break;
            case '1':
                setDifficulty('normal');
                break;
            case '2':
                setDifficulty('challenge');
                break;
            case '3':
                setDifficulty('expert');
                break;
        }
    });

    // Prevent context menu on cards
    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.card')) {
            e.preventDefault();
        }
    });

    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Initialize achievement check on load
    checkAchievements();
});