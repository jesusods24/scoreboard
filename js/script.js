let score = 0;
let start = false
let holdTimer = null;
let isHolding = false;
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start");
document.addEventListener("contextmenu", (event) => event.preventDefault());
startButton.addEventListener("click", () => { start = true });
document.addEventListener("mousedown", (event) => {
    console.log(start)
    if (start){
    switch (event.button) {
        case 0: // Left click
            score++;
            break;
        case 1: // Right click
            event.preventDefault()
            isHolding = true;

        // Start a 2-second timer
            holdTimer = setTimeout(() => {
            if (isHolding) {
                score = 0;
                scoreDisplay.textContent = score;
            }
        }, 2000);
            break;
        case 2: // Right click
            event.preventDefault()
            score--;
            break;
        case 3: // Mouse back button
            score += 5;
            break;
        case 4: // Mouse forward button
            score -= 5;
            break;
        }
    }

    scoreDisplay.textContent = score;
});


document.addEventListener("mouseup", (event) => {
    if (event.button === 1) { // Middle mouse button
        isHolding = false;

        // Cancel the timer if released early
        clearTimeout(holdTimer);
    }
});
