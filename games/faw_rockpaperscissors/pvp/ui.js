
(function(ns) {
  const player1Controls = document.getElementById("player1Controls");
  const player2Controls = document.getElementById("player2Controls");
  const activePlayerLabel = document.getElementById("activePlayer");
  const player1UnitsCountSpan = document.getElementById("player1UnitsCount");
  const player2UnitsCountSpan = document.getElementById("player2UnitsCount");

  function updatePlayerButtons(container, player) {
    const buttons = container.querySelectorAll(".type-button");
    buttons.forEach(btn => {
      const type = btn.getAttribute("data-type");
      btn.classList.remove("hidden"); // показываем все кнопки всегда
      if (player === ns.activePlayer) {
        btn.classList.toggle("selected", ns.selectedTypes[player] === type);
      } else {
        btn.classList.remove("selected");
      }
    });
  }

  function updateUI() {
    activePlayerLabel.textContent = ns.activePlayer === "player1" ? "Игрок 1" : "Игрок 2";
    updatePlayerButtons(player1Controls, "player1");
    updatePlayerButtons(player2Controls, "player2");

    // Обновляем счетчики юнитов
    const p1Count = ns.units.filter(u => u.player === "player1").length;
    const p2Count = ns.units.filter(u => u.player === "player2").length;
    player1UnitsCountSpan.textContent = p1Count;
    player2UnitsCountSpan.textContent = p2Count;
  }

  function setupTypeButtons() {
    const allButtons = [...player1Controls.querySelectorAll(".type-button"),
                        ...player2Controls.querySelectorAll(".type-button")];
    allButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const parent = btn.closest(".player-controls");
        const player = parent.id === "player1Controls" ? "player1" : "player2";

        ns.activePlayer = player;
        ns.selectedTypes[player] = btn.getAttribute("data-type");
        updateUI();
      });

      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const parent = btn.closest(".player-controls");
        const player = parent.id === "player1Controls" ? "player1" : "player2";

        ns.activePlayer = player;
        ns.selectedTypes[player] = btn.getAttribute("data-type");
        updateUI();
      }, { passive: false });
    });
  }

  ns.ui = {
    updateUI,
    setupTypeButtons,
  };
})(Game);
