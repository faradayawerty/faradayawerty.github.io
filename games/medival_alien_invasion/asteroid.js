
let TYPE_ASTEROID = 3;

function create_asteroid(x_, y_, size) {
  return {
    type: TYPE_ASTEROID,
    x: x_,
    y: y_,
    w: size,
    h: size,
  };
}
