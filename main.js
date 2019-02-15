var maxHealth = 200;
var currentHealth = 200;

function loseHealth() {
  if (currentHealth > 0) {
    currentHealth -= 10;
    if (currentHealth < 0) {
      currentHealth = 0;
    }
  }
  document.getElementById("healthLabel").innerHTML = currentHealth;
  move();
}

function gainHealth() {
  if (currentHealth < maxHealth) {
    currentHealth += 10;
    if (currentHealth > maxHealth) {
      currentHealth = maxHealth;
    }
  }
  document.getElementById("healthLabel").innerHTML = currentHealth;
  move();
}

function move() {
  var elem = document.getElementById("healthBar");
  var width = (currentHealth/maxHealth) * 100;
  elem.style.width = width + '%';
  elem.innerHTML = currentHealth + " / " + maxHealth;
}
