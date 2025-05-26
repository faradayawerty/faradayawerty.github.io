
var Game = Game || {};

(function(ns) {
  // Константы и базовые настройки
  ns.CELL_SIZE = 50;
  ns.WIDTH = 800;
  ns.HEIGHT = 500;

  ns.TYPES = ["rock", "paper", "scissors"];
  ns.EMOJIS = { rock: "🪨", paper: "📄", scissors: "✂️" };
  ns.COLORS = { player: "lightblue", enemy: "tomato" };

  ns.MAX_PLAYER_UNITS = 15;
  ns.MAX_ENEMY_UNITS = 15;

  ns.units = [];
  ns.placing = true;
  ns.selectedType = "rock";
  ns.loop = null;
  ns.playerUnitCount = 0;
  ns.winnerText = "";

  // UI elements, инициализируем позже
  ns.elements = {};

})(Game);
