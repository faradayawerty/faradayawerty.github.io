
var Game = Game || {};

(function(ns) {
  ns.CELL_SIZE = 30;
  ns.WIDTH = window.innerWidth * 0.8;
  ns.HEIGHT = window.innerHeight * 0.8;

  ns.units = [];
  ns.placing = true;
  ns.selectedType = "rock";
  ns.loop = null;
  ns.winnerText = "";
  ns.winnerTeam = null;
  ns.currentLevelIndex = 0;
  ns.maxPlayerUnits = 5;

  ns.elements = {};

  ns.COLORS = {
    player: "lightblue",
    enemy: "tomato",
  };

  ns.EMOJIS = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂️",
  };
})(Game);
