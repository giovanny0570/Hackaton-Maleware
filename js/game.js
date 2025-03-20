const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Adjust canvas size based on device's width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bird = { x: 50, y: canvas.height / 2, velocity: 0, gravity: 0.3, jump: -7 };
let pipes = []; let score = 0; let gameOver = false;
let gameStarted = false;

// Function to draw the envelope (bird)
function drawEnvelope(x, y) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + 30, y + 20); ctx.lineTo(x, y + 40); ctx.lineTo(x - 30, y + 20);
    ctx.closePath(); ctx.fill();
}

// Function to draw the pipes
function drawPipe(x, height) {
    ctx.fillStyle = 'lime';
    ctx.fillRect(x, 0, 50, height);
    ctx.fillRect(x, height + 200, 50, canvas.height - height - 200);
    ctx.fillStyle = 'black';
    for (let i = 0; i < canvas.height; i += 40) {
        ctx.fillText(Math.random() < 0.5 ? '0' : '1', x + 15, i + 20);
    }
}

// Function to update the game logic
function update() {
    if (!gameStarted || gameOver) return;

    // Update bird velocity and position
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Check for boundary collisions (top or bottom)
    if (bird.y > canvas.height || bird.y < 0) {
        gameOver = true;
        setTimeout(() => {
            window.location.href = 'lose.html'; // Redirect to lose page
        }, 500);
        return;
    }

    // Generate new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
        let height = Math.floor(Math.random() * (canvas.height - 200)) + 50;
        pipes.push({ x: canvas.width, height });
    }

    // Update pipes and check for collisions
    pipes.forEach(pipe => {
        pipe.x -= 2; // Move pipe to the left
        if (pipe.x + 50 < 0) pipes.shift(); // Remove off-screen pipes
        if (pipe.x === bird.x) score++; // Increment score when passing a pipe

        // If the score reaches 10, end the game and redirect to win page
        if (score >= 10) {
            gameOver = true;
            setTimeout(() => {
                window.location.href = 'win.html'; // Redirect to win page
            }, 500);
        }

        // Check for collision with pipes
        if (bird.x > pipe.x && bird.x < pipe.x + 50 && (bird.y < pipe.height || bird.y > pipe.height + 200)) {
            gameOver = true;
            setTimeout(() => {
                window.location.href = 'lose.html'; // Redirect to lose page
            }, 500);
        }
    });
}

// Function to draw the game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the bird and pipes
    drawEnvelope(bird.x, bird.y);
    pipes.forEach(pipe => drawPipe(pipe.x, pipe.height));

    // Display score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Display messages for starting the game and game over
    if (!gameStarted) {
        // Center text horizontally
        const message = 'Haal 10 punten om uw data terug te krijgen!';
        const textWidth = ctx.measureText(message).width;
        const textX = (canvas.width - textWidth) / 2; // Horizontal centering
        const textY = canvas.height / 2; // Vertical centering

        ctx.fillText(message, textX, textY);
    } else if (gameOver) {
        // If game over, either win or lose will be handled with redirect
        ctx.fillText('', canvas.width / 2 - 60, canvas.height / 2);
    }
}

// Function to control the game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Mobile touch event (start the game or make the bird jump)
window.addEventListener('touchstart', (e) => { 
    if (!gameStarted) {
        gameStarted = true;
    }
    if (gameStarted && !gameOver) {
        bird.velocity = bird.jump;
    } else if (gameOver) {
        // Reset game if user taps after losing
        bird.y = canvas.height / 2;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        gameOver = false;
        gameStarted = false;
    }
});

// PC keyboard event (spacebar to make the bird jump)
window.addEventListener('keydown', (e) => { 
    if (e.key === ' ' && !gameStarted) {
        gameStarted = true;
    }
    if (e.key === ' ' && gameStarted && !gameOver) {
        bird.velocity = bird.jump;
    }
    if (e.key === 'r' && gameOver) {
        // Reset game if user presses 'R'
        bird.y = canvas.height / 2;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        gameOver = false;
        gameStarted = false;
    }
});

// Resize canvas when the window size changes (important for mobile devices)
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start the game loop
gameLoop();
