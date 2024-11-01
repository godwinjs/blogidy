let gameSequence = [];
let playerSequence = [];
let level = 1;
let isPlaying = false;
let startTime;
let gameTimer;
let currentHash = null;
let lastClickTime = 0;
let currentSessionId = null;
let encryptedData = null;
let responseKey = null;
let colorTokens = {};
let isGameInProgress = false;
let gameStartTime = null;
let totalGameTime = 0;
let highestLevelReached = 1;

const MIN_CLICK_INTERVAL = 100; // milliseconds
let sequenceTimeout = null;

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
const startButton = document.getElementById('start-game');
const lights = document.querySelectorAll('.light');
const currentLevel = document.getElementById('current-level');
const timer = document.getElementById('timer');
const progressBar = document.getElementById('sequence-progress');
const gameMessage = document.getElementById('game-message');

startButton.addEventListener('click', () => {
    clearGameTimer();
    startGame();
});

lights.forEach(light => {
    light.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastClickTime < MIN_CLICK_INTERVAL) return;
        lastClickTime = now;
        
        if (isPlaying) {
            const token = light.dataset.token;
            playLight(light);
            checkSequence(token);
        }
    });
});

function startGame() {
    if (isGameInProgress) return;
    
    isGameInProgress = true;
    startButton.disabled = true;
    startButton.classList.add('opacity-50', 'cursor-not-allowed');
    
    // Reset game state
    level = 1;
    highestLevelReached = 1;
    currentLevel.textContent = level;
    gameSequence = [];
    playerSequence = [];
    isPlaying = false;
    currentHash = null;
    currentSessionId = null;
    encryptedData = null;
    gameStartTime = Date.now();
    totalGameTime = 0;
    
    // Reset UI
    timer.textContent = '0';
    updateProgress(0, 1);
    document.getElementById('current-score').textContent = '0';
    clearGameTimer();
    
    updateGameMessage('Get ready...');
    setTimeout(getNewSequence, 1000);
}

function getNewSequence() {
    fetch('/get_sequence', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: `level=${level}`
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (!data.data || !data.hash || !data.session_id || !data.tokens || !data.color_classes) {
            throw new Error('Invalid server response');
        }
        
        // Apply random classes to lights
        const lightElements = document.querySelectorAll('.light');
        const colors = ['red', 'blue', 'green', 'yellow'];
        colors.forEach((color, index) => {
            if (lightElements[index]) {
                // Remove any existing color classes
                lightElements[index].className = 'light cursor-pointer shadow-lg hover:shadow-xl';
                // Add new random class
                lightElements[index].classList.add(`light-${data.color_classes[color]}`);
                lightElements[index].dataset.token = data.tokens[index];
            }
        });
        
        currentHash = data.hash;
        currentSessionId = data.session_id;
        encryptedData = data.data;
        showSequence(data.display_time);
    })
    .catch(error => {
        updateGameMessage('An error occurred. Please try again.');
        startButton.disabled = false;
    });
}

function showSequence(displayTime) {
    updateGameMessage('Watch carefully...');
    
    const formData = new URLSearchParams();
    formData.append('data', encryptedData);
    formData.append('level', level.toString());
    formData.append('session_id', currentSessionId);
    
    fetch('/decrypt_sequence', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData.toString()
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Failed to decrypt sequence');
            });
        }
        return response.json();
    })
    .then(data => {
        if (!data.sequence || !Array.isArray(data.sequence)) {
            throw new Error('Invalid sequence format');
        }
        
        gameSequence = data.sequence;
        updateProgress(0, gameSequence.length);
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < gameSequence.length) {
                const token = gameSequence[i];
                const light = document.querySelector(`[data-token="${token}"]`);
                if (!light) {
                    clearInterval(interval);
                    throw new Error('Invalid light token');
                }
                playLight(light);
                updateProgress(i + 1, gameSequence.length);
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    updateGameMessage('Your turn! Repeat the sequence.');
                    startPlayerTurn();
                }, 500);
            }
        }, displayTime / gameSequence.length);
    })
    .catch(error => {
        updateGameMessage('Failed to load sequence: ' + error.message);
        startButton.disabled = false;
    });
}

function startPlayerTurn() {
    isPlaying = true;
    playerSequence = []; // Reset player sequence
    updateProgress(0, gameSequence.length); // Reset progress for player's turn
    startTime = Date.now();
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    updateTimer();
    const MAX_SEQUENCE_TIME = 30000; // 30 seconds in milliseconds

    // Set timeout for sequence completion
    sequenceTimeout = setTimeout(() => {
        if (isPlaying) {
            updateGameMessage('Time limit exceeded! Game Over!');
            gameOver('timeout');  // Pass reason for game over
        }
    }, MAX_SEQUENCE_TIME);
}

function updateTimer() {
    gameTimer = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        timer.textContent = elapsed.toFixed(1);
    }, 100);
}

function playLight(light) {
    if (!light) {
        console.error('Invalid light element');
        return null;
    }
    
    const token = light.dataset.token;
    light.classList.add('active');
    setTimeout(() => light.classList.remove('active'), 300);
    return token;
}

function checkSequence(token) {
    playerSequence.push(token);
    const currentIndex = playerSequence.length - 1;
    
    updateProgress(playerSequence.length, gameSequence.length);
    
    if (token !== gameSequence[currentIndex]) {
        updateGameMessage('Wrong sequence! Game Over!');
        gameOver();
        return;
    }
    
    if (playerSequence.length === gameSequence.length) {
        updateGameMessage('Level Complete! Get ready for the next sequence...');
        levelComplete();
    }
}

function levelComplete() {
    isPlaying = false;
    clearAllTimers();
    
    // Update highest level reached
    highestLevelReached = level;
    
    // Update total game time
    totalGameTime = (Date.now() - gameStartTime) / 1000;
    
    submitScore(highestLevelReached, totalGameTime, 'completed');
    level++;
    currentLevel.textContent = level;
    document.getElementById('current-score').textContent = highestLevelReached;
    setTimeout(getNewSequence, 1000);
}

function gameOver(reason = 'failed') {
    isGameInProgress = false;
    isPlaying = false;
    clearAllTimers();
    
    // Calculate final game time
    totalGameTime = (Date.now() - gameStartTime) / 1000;
    
    // Reset progress bar
    updateProgress(0, 1);
    
    // Submit the highest level reached
    submitScore(highestLevelReached, totalGameTime, reason);
    
    const shareText = encodeURIComponent(
        `I reached Level ${level} in DevFest Lagos Lights in ${totalGameTime.toFixed(2)}s! Can you beat my score? 🎮✨ #DevFestLagos2024 #DevFestLights`
    );
    const shareUrl = encodeURIComponent(window.location.origin);
    
    const template = document.getElementById('game-over-modal');
    const modal = template.content.cloneNode(true);
    
    modal.querySelector('.level-reached').textContent = level;
    
    modal.querySelector('.share-twitter').href = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
    modal.querySelector('.share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`;
    
    const modalElement = modal.querySelector('.fixed');
    modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) {
            closeGameOver();
        }
    });
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeGameOver() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
    
    // Re-enable start button
    startButton.disabled = false;
    startButton.classList.remove('opacity-50', 'cursor-not-allowed');
    
    updateGameMessage('Click Start Game to play again!');
    
    // Reset UI elements
    timer.textContent = '0';
    updateProgress(0, 1);
    document.getElementById('current-score').textContent = '0';
    
    // Clear any existing timers
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

function submitScore(level, time, reason = 'completed') {
    const data = `level=${level}&time=${time}&sequence=${JSON.stringify(gameSequence)}&hash=${currentHash}&reason=${reason}`;
    
    fetch('/submit_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: data
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Failed to save score');
            });
        }
        return response.json();
    })
    .catch(error => {
        updateGameMessage('Failed to save score: ' + error.message);
    });
}

function updateProgress(current, total) {
    const progress = (current / total) * 100;
    progressBar.style.width = `${progress}%`;
}

function updateGameMessage(message) {
    gameMessage.textContent = message;
}

function clearGameTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

function clearAllTimers() {
    // Clear game timer
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    // Clear sequence timeout
    if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
        sequenceTimeout = null;
    }
}