let serveCount = 0;
let holdTimer = null;
let isHolding = false;

const score1Display = document.getElementById("scoreTeam1");
const score2Display = document.getElementById("scoreTeam2");
const startButton = document.getElementById("start");


// Read URL parameters
const params = new URLSearchParams(window.location.search);

const team1Name = params.get("team1") || "Team 1";
const team2Name = params.get("team2") || "Team 2";
const team1Score = params.get("team1Score") || 0;
const team2Score = params.get("team2Score") || 0;
const startingTurn = Number(params.get("turn")) || 1;

// Update team names
document.querySelectorAll(".scoreboards h1")[0].textContent = team1Name;
document.querySelectorAll(".scoreboards h1")[1].textContent = team2Name;

// Turn indicator logic
let currentTurn = startingTurn;
let score1 = team1Score;
let score2 = team2Score;
function updateTurnUI() {
    document.querySelectorAll(".scoreboards").forEach((box, index) => {
        box.classList.toggle("active", currentTurn === index + 1);
    });
}

updateTurnUI();
score1Display.textContent = score1;
score2Display.textContent = score2;

// Example: switch turn after scoring
function checkServeSwap() {
    if (serveCount >= 2) {
        currentTurn = currentTurn === 1 ? 2 : 1; serveCount = 0;
        updateTurnUI();
    }
}


document.addEventListener("contextmenu", (event) => event.preventDefault());

history.pushState(null, "", location.href);
window.addEventListener("popstate", () => { history.pushState(null, "", location.href); });


document.addEventListener("mousedown", (event) => {

    switch (event.button) {
        case 0: // Left click
            score1++;
            serveCount++
            break;
        case 1: // Right click
            isHolding = true;

            // Start a 2-second timer
            holdTimer = setTimeout(() => {
                if (isHolding) {
                    score1 = 0;
                    score2 = 0;
                    serveCount = 0
                    score1Display.textContent = score1;
                    score2Display.textContent = score2;
                }
            }, 1200);
            break;
        case 2: // Right click
            score2++;
            serveCount++
            break;
        case 3: // Mouse back button
            score1--;
            break;
        case 4: // Mouse forward button
            score2--;
            break;
    }

    score1Display.textContent = score1;
    score2Display.textContent = score2;
    checkServeSwap()


});


document.addEventListener("mouseup", (event) => {
    if (event.button === 1) { // Middle mouse button
        isHolding = false;

        // Cancel the timer if released early
        clearTimeout(holdTimer);
    }
});
