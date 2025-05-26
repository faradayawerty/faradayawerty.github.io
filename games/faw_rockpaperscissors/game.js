
var Game = Game || {};

(function(ns) {
  // Константы и базовые настройки
  ns.CELL_SIZE = 50;
  ns.WIDTH = 800;
  ns.HEIGHT = 500;

  ns.TYPES = ["rock", "paper", "scissors"];
  ns.EMOJIS = { rock: "🪨", paper: "📄", scissors: "✂️" };
  ns.COLORS = { player: "lightblue", enemy: "tomato" };

  ns.units = [];
  ns.placing = true;
  ns.selectedType = "rock";
  ns.loop = null;
  ns.winnerText = "";

  // UI elements, инициализируем позже
  ns.elements = {};

})(Game);
