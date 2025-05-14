
ENEMY_SIZE = 30;

function create_enemy(x_, y_) {
  return {
    x: x_,
    y: y_,
    w: ENEMY_SIZE,
    h: ENEMY_SIZE,
    color: "green"
  };
}
