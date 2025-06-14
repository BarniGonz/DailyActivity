// Game logic and management
let cards = [];
let gameStarted = false;
let gameFinished = false;
let currentDifficulty = 'normal';
let soundEnabled = true;
let isDarkTheme = false;
let selectedActivity = '';
let isRandomizing = false;
let gameStats = {
    selections: parseInt(localStorage.getItem('ultimate-activity-selections') || '0'),
    games: parseInt(localStorage.getItem('ultimate-activity-games') || '0'),
    streak: parseInt(localStorage.getItem('ultimate-activity-streak') || '0'),
    achievements: JSON.parse(localStorage.getItem('ultimate-activity-achievements') || '[]'),
    lastPlayDate: localStorage.getItem('ultimate-activity-last-date') || ''
};

// DOM elements
const grid = document.querySelector('.grid');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const result = document.getElementById('result');
const resultActivity = document.querySelector('.result-activity');
const resultDescription = document.querySelector('.result-description');
const confettiCanvas = document.getElementById('confetti-canvas');
const selectionsCount = document.getElementById('selections-count');
const gamesPlayed = document.getElementById('games-played');
const streakCount = document.getElementById('streak-count');
const achievementCount = document.getElementById('achievement-count');
const instruction = document.getElementById('instruction');
const soundToggle = document.getElementById('sound-toggle');
const themeToggle = document.getElementById('theme-toggle');
const achievementPopup = document.getElementById('achievement-popup');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const activityTitleScreen = document.getElementById('activity-title-screen');
const activityTitleText = document.getElementById('activity-title-text');
const activityTitleContinue = document.getElementById('activity-title-continue');

function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function updateStatsDisplay() {
    selectionsCount.textContent = gameStats.selections;
    gamesPlayed.textContent = gameStats.games;
    streakCount.textContent = gameStats.streak;
    achievementCount.textContent = gameStats.achievements.length;
}

function saveStats() {
    localStorage.setItem('ultimate-activity-selections', gameStats.selections.toString());
    localStorage.setItem('ultimate-activity-games', gameStats.games.toString());
    localStorage.setItem('ultimate-activity-streak', gameStats.streak.toString());
    localStorage.setItem('ultimate-activity-achievements', JSON.stringify(gameStats.achievements));
    localStorage.setItem('ultimate-activity-last-date', new Date().toDateString());
}

function checkAchievements() {
    const newAchievements = [];

    if (gameStats.selections === 1 && !gameStats.achievements.includes('First Pick')) {
        newAchievements.push('First Pick');
    }

    if (gameStats.streak >= 5 && !gameStats.achievements.includes('Streak Master')) {
        newAchievements.push('Streak Master');
    }

    if (gameStats.selections >= 100 && !gameStats.achievements.includes('Century Club')) {
        newAchievements.push('Century Club');
    }

    if (gameStats.games >= 50 && !gameStats.achievements.includes('Dedication')) {
        newAchievements.push('Dedication');
    }

    newAchievements.forEach(achievement => {
        gameStats.achievements.push(achievement);
        showAchievement(achievement);
    });

    if (newAchievements.length > 0) {
        saveStats();
        updateStatsDisplay();
    }
}

function startGame() {
    if (!audioContext) {
        initAudio();
    }

    gameStarted = true;
    gameFinished = false;
    result.classList.remove('show');
    activityTitleScreen.classList.remove('show');

    const shuffledActivities = shuffle(activities[currentDifficulty]);

    cards.forEach((card, index) => {
        card.classList.remove('flipped', 'game-over', 'selected', 'processing', 'randomizing');
        card.querySelector('.front').textContent = '?';
        card.querySelector('.back').textContent = shuffledActivities[index];
        card.style.pointerEvents = 'auto';
        card.style.opacity = '1';
    });

    // Start the enhanced randomization process
    startRandomization();

    gameStats.games++;

    // Check for daily streak
    const today = new Date().toDateString();
    if (gameStats.lastPlayDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (gameStats.lastPlayDate !== yesterday.toDateString()) {
            gameStats.streak = 0; // Reset streak if not consecutive
        }
    }

    saveStats();
    updateStatsDisplay();
    checkAchievements();

    startButton.disabled = true;
    resetButton.disabled = false;
    instruction.textContent = `Cards are randomizing with blur! Wait for them to settle, then click on any card to reveal your ${currentDifficulty} difficulty activity!`;
    instruction.style.background = 'linear-gradient(135deg, rgba(74, 144, 226, 0.18), rgba(100, 200, 255, 0.12))';
    instruction.style.color = '#1a237e';
}

function handleCardClick(card) {
    if (!gameStarted || gameFinished || card.classList.contains('flipped') || isRandomizing) return;

    card.classList.add('flip-animation', 'flipped');
    card.style.willChange = 'transform';
    playSound(flipBuffer);

    setTimeout(() => {
        card.classList.remove('flip-animation');
        card.classList.add('selected');
        card.style.willChange = 'auto';

        cards.forEach(c => {
            if (c !== card) {
                c.classList.add('game-over');
            }
        });

        const activity = card.querySelector('.back').textContent;
        selectedActivity = activity;

        // Show ultra OP title screen
        showTitleScreen(activity);

        gameStats.selections++;
        gameStats.streak++;
        saveStats();
        updateStatsDisplay();
        checkAchievements();

        playSound(selectBuffer);
        triggerUltimateConfetti();

        gameFinished = true;
        instruction.textContent = `Excellent ${currentDifficulty} choice! Start a new game or reset to play again.`;
        instruction.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.18), rgba(139, 195, 74, 0.12))';
        instruction.style.color = '#2e7d32';

        if (navigator.vibrate) {
            const vibrationPattern = currentDifficulty === 'expert' ? [250, 100, 250, 100, 250] :
                                   currentDifficulty === 'challenge' ? [250, 100, 250] : [250];
            navigator.vibrate(vibrationPattern);
        }
    }, 500);
}

function resetBoard() {
    // Stop any ongoing randomization
    stopRandomization();
    
    cards.forEach(card => {
        card.classList.remove('flipped', 'game-over', 'selected', 'flip-animation', 'processing', 'randomizing');
        card.querySelector('.front').textContent = '?';
        card.querySelector('.back').textContent = '';
        card.style.pointerEvents = 'auto';
        card.style.opacity = '1';
        card.style.willChange = 'auto';
    });

    result.classList.remove('show');
    activityTitleScreen.classList.remove('show');
    resultActivity.textContent = '';
    selectedActivity = '';
    gameStarted = false;
    gameFinished = false;
    isRandomizing = false;

    startButton.disabled = false;
    resetButton.disabled = true;
    instruction.textContent = 'Click "Start Ultimate Game" to begin your enhanced activity selection experience!';
    instruction.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 255, 0.7))';
    instruction.style.color = '#1a237e';
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    difficultyButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
    });
}

// Initialize cards
function initializeCards() {
    for (let i = 0; i < 9; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('tabindex', '0');
        card.innerHTML = `
            <div class="front">?</div>
            <div class="back"></div>
        `;
        grid.appendChild(card);
        cards.push(card);
    }
}