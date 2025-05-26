
(function(ns) {
  ns.wrapDistance = function(a, b, size) {
    let d = b - a;
    if (Math.abs(d) > size / 2) d -= Math.sign(d) * size;
    return d;
  };

  ns.shouldChase = function(t1, t2) {
    const map = { rock: "scissors", scissors: "paper", paper: "rock" };
    return map[t1] === t2;
  };

  ns.shouldFlee = function(t1, t2) {
    const map = { rock: "paper", paper: "scissors", scissors: "rock" };
    return map[t1] === t2;
  };

  ns.resolveConflict = function(a, b) {
    const map = { rock: "scissors", scissors: "paper", paper: "rock" };
    if (map[a.type] === b.type) {
      b.type = a.type;
      b.team = a.team;
    } else if (map[b.type] === a.type) {
      a.type = b.type;
      a.team = b.team;
    }
  };
})(Game);
