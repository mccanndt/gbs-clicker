// Variables
var maxLevel = 1;
var currentLevel = 1;

// Player variables
var maxHealth = 100;
var currentHealth = 100;
var healthRegen;
var playerAttack = 1;
var playerDefense = 0;
var deathCounter = 0;

// Enemy variables
var enemyCurrentHealth;
var enemyMaxHealth;
var enemyAttack;
var enemyDefense;

function onLoad() {
  updateHealthRegen();
  enemySetUp();
  setInterval(oneSecondFunctions, 1000);

  // Always call updateDisplay last so it doesn't miss anything
  updateDisplay();
}

function updateDisplay() {
  // Format numbers
  healthRegen = roundToTwoDecimals(healthRegen);
  currentHealth = roundToTwoDecimals(currentHealth);
  maxHealth = roundToTwoDecimals(maxHealth);
  playerAttack = roundToTwoDecimals(playerAttack);
  playerDefense = roundToTwoDecimals(playerDefense);
  enemyCurrentHealth = roundToTwoDecimals(enemyCurrentHealth);

  // Progress Bar
  var elem = document.getElementById("healthBar");
  var width = (currentHealth/maxHealth) * 100;
  elem.style.width = width + '%';
  elem.innerHTML = currentHealth + " / " + maxHealth;

  // Level Label
  var elem = document.getElementById("currentLevel");
  elem.innerHTML = "Current Level: " + currentLevel + " / " + maxLevel;

  // Health Regen Label
  var elem = document.getElementById("healthRegen");
  elem.innerHTML = "Health Regen: " + healthRegen + "/s";

  // Player Attack Label
  var elem = document.getElementById("playerAttack");
  elem.innerHTML = "Attack: " + playerAttack;

  // Player Defense Label
  var elem = document.getElementById("playerDefense");
  elem.innerHTML = "Defense: " + playerDefense;

  // Death Counter Label
  var elem = document.getElementById("deathCounter");
  elem.innerHTML = "Deaths: " + deathCounter;

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
}

// Attack enemy. Lose health and gain health regen, defense, etc
function attack() {
  if (currentHealth > 0) {
    // Check for a stronger enemy
    if (enemyAttack > playerDefense) {
      var amount = enemyAttack - playerDefense;
      currentHealth -= amount;
      playerDefense += enemyAttack * 0.01;
    }

    // Check for stronger player
    if (playerAttack > enemyDefense) {
      var amount = playerAttack - enemyDefense;
      enemyCurrentHealth -= amount;
      playerAttack += 0.01 + enemyDefense * 0.01;
    }

    // Enemy death
    if (enemyCurrentHealth <= 0) {
      if (currentLevel == maxLevel) {
        maxLevel += 1;
      }
      enemySetUp();
    }

    // Player death
    if (currentHealth <= 0) {
      currentHealth = 0;
      maxHealth += playerAttack + playerDefense;
      updateHealthRegen();
      playerAttack = playerAttack / 2;
      playerDefense = playerDefense / 2;
      deathCounter += 1;
    }
  }
  updateDisplay();
}

// Gain health
function gainHealth() {
  if (currentHealth < maxHealth) {
    currentHealth += healthRegen;
    if (currentHealth > maxHealth) {
      currentHealth = maxHealth;
    }
  }
  updateDisplay();
}

// Change levels
function levelChange(levelIncrease) {
  if (levelIncrease && currentLevel != maxLevel) {
    currentLevel += 1;
  } else if (!levelIncrease) {
    if (currentLevel != 1) {
      currentLevel -= 1;
    }
  }
  enemySetUp();
  updateDisplay();
}

function enemySetUp() {
  enemyMaxHealth = 9 + Math.pow(currentLevel, 4);
  enemyCurrentHealth = enemyMaxHealth;
  enemyAttack = Math.pow(currentLevel, 2);
  enemyDefense = Math.pow(currentLevel, 2) - 1;
}

function updateHealthRegen() {
  healthRegen = maxHealth / 60;
}

// Math Functions
function roundToTwoDecimals(number) {
  number = Math.round(number * 100) / 100;
  return number;
}
