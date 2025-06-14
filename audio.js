// Enhanced audio system
let audioContext;
let flipBuffer, selectBuffer, achievementBuffer;

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        createAudioBuffers();
    } catch (e) {
        console.log('Audio context not supported');
    }
}

function createAudioBuffers() {
    if (!audioContext) return;

    const sampleRate = audioContext.sampleRate;

    // Enhanced flip sound
    flipBuffer = audioContext.createBuffer(1, sampleRate * 0.3, sampleRate);
    const flipData = flipBuffer.getChannelData(0);
    for (let i = 0; i < flipData.length; i++) {
        const t = i / sampleRate;
        flipData[i] = (Math.sin(2 * Math.PI * 500 * t) +
                       Math.sin(2 * Math.PI * 750 * t) * 0.6) *
                      Math.exp(-t / 0.12) * 0.25;
    }

    // Enhanced select sound
    selectBuffer = audioContext.createBuffer(1, sampleRate * 0.8, sampleRate);
    const selectData = selectBuffer.getChannelData(0);
    for (let i = 0; i < selectData.length; i++) {
        const t = i / sampleRate;
        selectData[i] = (Math.sin(2 * Math.PI * 600 * t) +
                       Math.sin(2 * Math.PI * 800 * t) +
                       Math.sin(2 * Math.PI * 1000 * t) +
                       Math.sin(2 * Math.PI * 1200 * t) * 0.6) *
                       Math.exp(-t / 0.18) * 0.18;
    }

    // Achievement sound
    achievementBuffer = audioContext.createBuffer(1, sampleRate * 1.2, sampleRate);
    const achData = achievementBuffer.getChannelData(0);
    for (let i = 0; i < achData.length; i++) {
        const t = i / sampleRate;
        achData[i] = (Math.sin(2 * Math.PI * 600 * t) +
                     Math.sin(2 * Math.PI * 800 * t) +
                     Math.sin(2 * Math.PI * 1000 * t) +
                     Math.sin(2 * Math.PI * 1200 * t)) *
                     Math.sin(Math.PI * t / 1.2) * 0.12;
    }
}

function playSound(buffer) {
    if (audioContext && buffer && soundEnabled) {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
        source.start();
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
}