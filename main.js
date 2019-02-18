// Saved Variables
var gameData = {
  // Variables
  maxLevel: 1,
  currentLevel: 1,

  // Player variables
  maxHealth: 100,
  currentHealth: 100,
  playerAttack: 1,
  playerDefense: 0,
  deathCounter: 0,
};

// Dynamic Variables
var saveLabelFlag = false;
var saveCounter = 0;

var healthRegen;
// Enemy variables
var enemyCurrentHealth;
var enemyMaxHealth;
var enemyAttack;
var enemyDefense;

function onLoad() {
  loadGame();
  updateHealthRegen();
  enemySetUp();
  setInterval(oneSecondFunctions, 1000);

  // Always call updateDisplay last so it doesn't miss anything
  updateDisplay();
}

function updateDisplay() {
  // Format numbers
  healthRegen = roundToTwoDecimals(healthRegen);
  gameData.currentHealth = roundToTwoDecimals(gameData.currentHealth);
  gameData.maxHealth = roundToTwoDecimals(gameData.maxHealth);
  gameData.playerAttack = roundToTwoDecimals(gameData.playerAttack);
  gameData.playerDefense = roundToTwoDecimals(gameData.playerDefense);
  enemyCurrentHealth = roundToTwoDecimals(enemyCurrentHealth);

  // Progress Bar
  var elem = document.getElementById("healthBar");
  var width = (gameData.currentHealth/gameData.maxHealth) * 100;
  elem.style.width = width + '%';
  elem.innerHTML = gameData.currentHealth + " / " + gameData.maxHealth;

  // Level Label
  var elem = document.getElementById("currentLevel");
  elem.innerHTML = "Current Level: " + gameData.currentLevel + " / " + gameData.maxLevel;

  // Health Regen Label
  var elem = document.getElementById("healthRegen");
  elem.innerHTML = "Health Regen: " + healthRegen + "/s";

  // Player Attack Label
  var elem = document.getElementById("playerAttack");
  elem.innerHTML = "Attack: " + gameData.playerAttack;

  // Player Defense Label
  var elem = document.getElementById("playerDefense");
  elem.innerHTML = "Defense: " + gameData.playerDefense;

  // Death Counter Label
  var elem = document.getElementById("deathCounter");
  elem.innerHTML = "Deaths: " + gameData.deathCounter;

  // Enemy Health Label
  var elem = document.getElementById("enemyHealth");
  elem.innerHTML = "Enemy Health: " + enemyCurrentHealth;

  // Enemy Attack Label
  var elem = document.getElementById("enemyAttack");
  elem.innerHTML = "Enemy Attack: " + enemyAttack;

  // Enemy Defense Label
  var elem = document.getElementById("enemyDefense");
  elem.innerHTML = "Enemy Defense: " + enemyDefense;
}

function oneSecondFunctions() {
  gainHealth();

  if (saveLabelFlag) {
    saveCounter += 1;
    if (saveCounter == 5) {
      var elem = document.getElementById("saveLabel");
      elem.innerHTML = "";
      saveLabelFlag = false;
    }
  }
}

function saveGame() {
  localStorage.setItem("save", JSON.stringify(gameData));
  var elem = document.getElementById("saveLabel");
  elem.innerHTML = "Game Saved!";
  saveLabelFlag = true;
  saveCounter = 0;
}

function loadGame() {
  var saveGame = JSON.parse(localStorage.getItem("save"));
  if (saveGame !== null) {
  gameData = saveGame
  }
}

// Attack enemy. Lose health and gain health regen, defense, etc
function attack() {
  if (gameData.currentHealth > 0) {
    // Check for a stronger enemy
    if (enemyAttack > gameData.playerDefense) {
      var amount = enemyAttack - gameData.playerDefense;
      gameData.currentHealth -= amount;
      gameData.playerDefense += enemyAttack * 0.01;
    }

    // Check for stronger player
    if (gameData.playerAttack > enemyDefense) {
      var amount = gameData.playerAttack - enemyDefense;
      enemyCurrentHealth -= amount;
      gameData.playerAttack += 0.01 + enemyDefense * 0.01;
    }

    // Enemy death
    if (enemyCurrentHealth <= 0) {
      if (gameData.currentLevel == gameData.maxLevel) {
        gameData.maxLevel += 1;
      }
      enemySetUp();
    }

    // Player death
    if (gameData.currentHealth <= 0) {
      gameData.currentHealth = 0;
      gameData.maxHealth += gameData.playerAttack + gameData.playerDefense;
      updateHealthRegen();
      gameData.playerAttack = gameData.playerAttack / 2;
      gameData.playerDefense = gameData.playerDefense / 2;
      gameData.deathCounter += 1;
    }
  }
  updateDisplay();
}

// Gain health
function gainHealth() {
  if (gameData.currentHealth < gameData.maxHealth) {
    gameData.currentHealth += healthRegen;
    if (gameData.currentHealth > gameData.maxHealth) {
      gameData.currentHealth = gameData.maxHealth;
    }
  }
  updateDisplay();
}

// Change levels
function levelChange(levelIncrease) {
  if (levelIncrease && gameData.currentLevel != gameData.maxLevel) {
    gameData.currentLevel += 1;
  } else if (!levelIncrease) {
    if (gameData.currentLevel != 1) {
      gameData.currentLevel -= 1;
    }
  }
  enemySetUp();
  updateDisplay();
}

function enemySetUp() {
  enemyMaxHealth = 9 + Math.pow(gameData.currentLevel, 4);
  enemyCurrentHealth = enemyMaxHealth;
  enemyAttack = Math.pow(gameData.currentLevel, 2);
  enemyDefense = Math.pow(gameData.currentLevel, 2) - 1;
}

function updateHealthRegen() {
  healthRegen = gameData.maxHealth / 60;
}

// Math Functions
function roundToTwoDecimals(number) {
  number = Math.round(number * 100) / 100;
  return number;
}
