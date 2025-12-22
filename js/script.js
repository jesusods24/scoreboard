let serveCount = 0;
let holdTimer = null;
let isHolding = false;

// DOM references
const score1Display = document.getElementById("scoreTeam1");
const score2Display = document.getElementById("scoreTeam2");

// Read URL parameters
const params = new URLSearchParams(window.location.search);

const team1Name = params.get("team1") || "Team 1";
const team2Name = params.get("team2") || "Team 2";
const team1Score = Number(params.get("team1Score")) || 0;
const team2Score = Number(params.get("team2Score")) || 0;
const startingTurn = Number(params.get("turn")) || 1;

// Update team names
document.querySelectorAll(".scoreboards h1")[0].textContent = team1Name;
document.querySelectorAll(".scoreboards h1")[1].textContent = team2Name;

// Game state
let currentTurn = startingTurn;
let score1 = team1Score;
let score2 = team2Score;

// Turn indicator
function updateTurnUI() {
    document.querySelectorAll(".scoreboards").forEach((box, index) => {
        box.classList.toggle("active", currentTurn === index + 1);
    });
}

updateTurnUI();
score1Display.textContent = score1;
score2Display.textContent = score2;

// Serve swap logic
function checkServeSwap() {
    if (serveCount >= 2) {
        currentTurn = currentTurn === 1 ? 2 : 1;
        serveCount = 0;
        updateTurnUI();
    }
}

// Restart game
function restart() {
    score1 = 0;
    score2 = 0;
    serveCount = 0;

    score1Display.textContent = score1;
    score2Display.textContent = score2;
    updateTurnUI();
}

// Disable right-click menu
document.addEventListener("contextmenu", (event) => event.preventDefault());

// Block browser back button
history.pushState(null, "", location.href);
window.addEventListener("popstate", () => {
    history.pushState(null, "", location.href);
});

// ------------------------------
// MOUSE CONTROLS
// ------------------------------
document.addEventListener("mousedown", (event) => {
    switch (event.button) {
        case 0: // Left click → Team 1 scores
            score1++;
            serveCount++;
            break;

        case 1: // Middle click → Hold to restart
            isHolding = true;
            holdTimer = setTimeout(() => {
                if (isHolding) restart();
            }, 1200);
            break;

        case 2: // Right click → Team 2 scores
            score2++;
            serveCount++;
            break;

        case 3: // Back button → Undo Team 1
            score1--;
            break;

        case 4: // Forward button → Undo Team 2
            score2--;
            break;
    }

    score1Display.textContent = score1;
    score2Display.textContent = score2;
    checkServeSwap();
});

// Cancel restart hold
document.addEventListener("mouseup", (event) => {
    if (event.button === 1) {
        isHolding = false;
        clearTimeout(holdTimer);
    }
});

// ------------------------------
// KEYBOARD CONTROLS
// ------------------------------
document.addEventListener("keydown", (event) => {
    switch (event.key) {

        // Team 1 scoring
        case "ArrowLeft":
            score1++;
            serveCount++;
            break;

        // Team 2 scoring
        case "ArrowRight":
            score2++;
            serveCount++;
            break;

        // Undo Team 1
        case "ArrowUp":
            score1--;
            break;

        // Undo Team 2
        case "ArrowDown":
            score2--;
            break;

        // Restart
        case "r":
            restart();
            break;
    }

    score1Display.textContent = score1;
    score2Display.textContent = score2;
    checkServeSwap();
});
