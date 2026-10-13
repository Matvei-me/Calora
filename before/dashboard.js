document.addEventListener("DOMContentLoaded", () => {
  const user = Calora.getUser();
  if (!user) {
    window.location.replace("index.html");
    return;
  }
  const hello = document.getElementById("helloText");
  hello.textContent = `Привет, ${user.name || user.email.split("@")[0]}!`;

  function updateStats() {
    const products = Calora.products().filter(product => product.status === "meal");
    const total = products.reduce((sum, product) => sum + Number(product.calories || 0), 0);
    const goal = Calora.goal();
    const remaining = Math.max(0, goal - total);
    const progress = Math.min(100, Math.round(total / goal * 100));
    document.getElementById("remainingCalories").textContent = `${remaining} ккал`;
    document.getElementById("calorieStat").textContent = `${total} ккал`;
    document.getElementById("goalText").textContent = goal;
    document.getElementById("calorieGoalStat").textContent = `из ${goal} ккал`;
    document.getElementById("calorieTag").textContent = `${progress}% цели выполнено`;
    document.getElementById("calorieRing").style.background = `conic-gradient(var(--green-dark) 0 ${progress}%, #e6e5d8 ${progress}% 100%)`;
  }
  updateStats();
});
