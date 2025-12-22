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
const winningScore = Number(params.get("win")) || 11;

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
updateServer()

// Restart game
function restart() {
    score1 = 0;
    score2 = 0;

    score1Display.textContent = score1;
    score2Display.textContent = score2;

    currentTurn = startingTurn;   // reset server to original starter
    updateServer();               // recalc serve logic for 0–0
}


function updateServer() {
    const totalPoints = score1 + score2;
    const deuceTotal = (winningScore - 1) * 2;

    const otherPlayer = startingTurn === 1 ? 2 : 1;

    // Before deuce
    if (totalPoints < deuceTotal) {
        const rotation = Math.floor(totalPoints / 2) % 2;
        currentTurn = rotation === 0 ? startingTurn : otherPlayer;
    } 
    // After deuce
    else {
        const rotation = totalPoints % 2;
        currentTurn = rotation === 0 ? startingTurn : otherPlayer;
    }

    updateTurnUI();
}

function checkWin() {
    const diff = Math.abs(score1 - score2);

    if (score1 >= winningScore && diff >= 2) {
        setTimeout(() => {
            alert(`${team1Name} wins!`);
            restart();
        });
        return true;
    }

    if (score2 >= winningScore && diff >= 2) {
        setTimeout(() => {
            alert(`${team2Name} wins!`);
            restart();
        });
        return true;
    }

    return false;
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
        case 0:
            score1++;
            break;

        case 1:
            isHolding = true;
            holdTimer = setTimeout(() => {
                if (isHolding) restart();
            }, 1200);
            break;

        case 2:
            score2++;
            break;

        case 3:
            score1--;
            break;

        case 4:
            score2--;
            break;
    }

    score1Display.textContent = score1;
    score2Display.textContent = score2;
    updateServer();
    checkWin();
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
        case "ArrowLeft":
            score1++;
            break;

        case "ArrowRight":
            score2++;
            break;

        case "ArrowUp":
            score1--;
            break;

        case "ArrowDown":
            score2--;
            break;

        case "r":
            restart();
            break;
    }

    score1Display.textContent = score1;
    score2Display.textContent = score2;
    updateServer();
    checkWin();
});
