// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerInterval; // Timer for countdown
let score = 0; // Player's score
let timeLeft = 30; // 30-second timer
const feedback = document.getElementById("feedback-message");

const winMessages = [
  "Amazing! You brought clean water to the village!",
  "You did it! The community celebrates your effort!",
  "Victory! Every drop counts, and you caught enough!"
];
const loseMessages = [
  "Try again! The village still needs more clean water.",
  "Almost there! Avoid the dirty drops next time.",
  "Keep going! Clean water is just a few drops away."
];

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = timeLeft;
  feedback.style.display = "none";
  feedback.textContent = "";

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);
  // Start the timer countdown
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  document.getElementById("time").textContent = timeLeft;
  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  // Remove all drops from the game container
  const container = document.getElementById("game-container");
  container.innerHTML = "";
  // Show feedback message
  let messageArr = score >= 20 ? winMessages : loseMessages;
  let msg = messageArr[Math.floor(Math.random() * messageArr.length)];
  feedback.textContent = msg + ` (Final Score: ${score})`;
  feedback.style.display = "block";
  updateScoreDisplay();
}

function updateScoreDisplay() {
  const scoreElem = document.getElementById("score");
  scoreElem.textContent = score;
  // Animate score color for feedback
  scoreElem.style.transition = "color 0.2s";
  scoreElem.style.color = "#FFC907"; // highlight color
  setTimeout(() => {
    scoreElem.style.color = "#131313"; // revert to default
  }, 300);
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");

  // Randomly decide if this is a good drop or a bad drop (dirty water)
  const isBadDrop = Math.random() < 0.25; // 25% chance for a bad drop
  drop.className = isBadDrop ? "water-drop bad-drop" : "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });

  // Add click event to handle good/bad drop
  drop.addEventListener("click", function() {
    if (!gameRunning) return;
    if (isBadDrop) {
      // Bad drop: subtract 2 points (min 0) and show penalty feedback
      score = Math.max(0, score - 2);
      feedback.textContent = "Oh no! That was dirty water. -2 points.";
      feedback.style.color = "#F5402C";
      feedback.style.display = "block";
      setTimeout(() => { feedback.style.display = "none"; }, 1200);
    } else {
      // Good drop: add 1 point and show positive feedback
      score++;
      feedback.textContent = "+1! Clean water collected!";
      feedback.style.color = "#2E9DF7";
      feedback.style.display = "block";
      setTimeout(() => { feedback.style.display = "none"; }, 800);
    }
    updateScoreDisplay();
    drop.remove(); // Remove drop when clicked
  });

  // --- Add a clickable can element ---
  const can = document.createElement("img");
  can.src = "img/water-can.png";
  can.alt = "Water Can";
  can.className = "water-can";
  can.style.position = "absolute";
  can.style.width = "50px";
  can.style.height = "50px";
  // Place can randomly near the bottom
  const canX = Math.random() * (gameWidth - 50);
  can.style.left = canX + "px";
  can.style.bottom = "10px";
  can.style.cursor = "pointer";

  // Add can to the game container
  document.getElementById("game-container").appendChild(can);

  // Can click event: +3 points
  can.addEventListener("click", function() {
    if (!gameRunning) return;
    score += 3;
    feedback.textContent = "+3! Water can bonus!";
    feedback.style.color = "#FFC907";
    feedback.style.display = "block";
    setTimeout(() => { feedback.style.display = "none"; }, 900);
    updateScoreDisplay();
    can.remove();
  });

  // Remove can after 2.5 seconds if not clicked
  setTimeout(() => {
    can.remove();
  }, 2500);
}
