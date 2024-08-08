
function newGame(show_invisible_stuff) {
  let g = {
    player: null,
    enemies: getEnemies(),
    bullets: getBullets(),
    ammoboxes: getAmmoboxes(),
    walls: getWalls(show_invisible_stuff),
    spawners: getSpawners(show_invisible_stuff),
    ammoboxZones: getAmmoboxZones(show_invisible_stuff),
    healthkitZones: getHealthkitZones(show_invisible_stuff),
    healthkits: getHealthkits(),
  };
	return g;
}

function destroyAllGameObjects(e, b, w, a, s, az, hk, hkz) {
  while(e.number > 0)
    destroyEnemy(e, e.number - 1);
  while(b.number > 0)
    destroyBullet(b, b.number - 1);
  while(w.number > 0)
    destroyWall(w, w.number - 1);
  while(a.number > 0)
    destroyAmmobox(a, a.number - 1);
  while(s.number > 0)
    destroySpawner(s, s.number - 1);
  while(az.number > 0)
    destroyAmmoboxZone(az, az.number - 1);
  while(hk.number > 0)
    destroyHealthkit(hk, hk.number - 1);
  while(hkz.number > 0)
    destroyHealthkitZone(hkz, hkz.number - 1);
}

function gameSetLevel(g, lvl) {
  destroyAllGameObjects(g.enemies, g.bullets, g.walls, g.ammoboxes, g.spawners, g.ammoboxZones, g.healthkits, g.healthkitZones);
  if(lvl == 0) {
    g.player = newPlayer(500, 500);
  }
  if(lvl == 1) {
    g.player = newPlayer(500, 500);
    createSpawner(g.spawners, 500, 30, 3500, 10, 6);
    createSpawner(g.spawners, 30, 500, 3000, 10, 3);
    createSpawner(g.spawners, 950, 500, 2500, 10, 13);
    createSpawner(g.spawners, 500, 950, 2000, 10, 7);
    createSpawner(g.spawners, 150, 310, 1500, 50, 7);
    createSpawner(g.spawners, 180, 770, 750, 10, 11);
    createSpawner(g.spawners, 950, 950, 1000, 10, 5);
    createSpawner(g.spawners, 800, 50, 500, 100, 11);
    createAmmoboxZone(g.ammoboxZones, 550, 600, 215, 340, 3000, 5000);
    createAmmoboxZone(g.ammoboxZones, 765, 600, 215, 340, 2500, 6000);
    createAmmoboxZone(g.ammoboxZones, 200, 350, 100, 100, 3500, 7000);
  	createWall(g.walls, 0, 0, 10, 1000);
  	createWall(g.walls, 0, 0, 1000, 10);
  	createWall(g.walls, 0, 1000, 1000, 10);
  	createWall(g.walls, 1000, 0, 10, 1000);
  	createWall(g.walls, 300, 560, 135, 150);
  	createWall(g.walls, 30, 560, 140, 410);
  	createWall(g.walls, 170, 820, 270, 150);
  	createWall(g.walls, 30, 30, 400, 260);
  	createWall(g.walls, 30, 30, 100, 400);
  	createWall(g.walls, 330, 30, 100, 400);
  	createWall(g.walls, 545, 430, 190, 10);
  	createWall(g.walls, 800, 430, 190, 10);
  	createWall(g.walls, 545, 130, 10, 300);
  	createWall(g.walls, 545, 10, 10, 55);
  	createHealthkitZone(g.healthkitZones, 450, 450, 100, 100, 3000, 5000);
  	createHealthkitZone(g.healthkitZones, 570, 150, 50, 250, 1500, 3000);
  }
  if(lvl == 2) {
    g.player = newPlayer(200, 300);
    createSpawner(g.spawners, 100, 100, 500, 100, 10);
  	createSpawner(g.spawners, 600, 300, 1000, 200, 20);
  	createSpawner(g.spawners, 300, 600, 1500, 50, 30);
  	createSpawner(g.spawners, 800, 50, 2000, 10, 40);
  	createWall(g.walls, 10, 10, 10, 980);
  	createWall(g.walls, 10, 10, 980, 10);
  	createWall(g.walls, 10, 980, 980, 10);
  	createWall(g.walls, 980, 10, 10, 980);
  }
}

function updateGame(dt, g, input) {
  if(input.mouse.leftButtonPressed)
	  createBullet(g.bullets, g.player, input);
	if(g.player != null && g.player.hp < 0)
	  g.player = null;
	if(g.player != null && (g.player.x < 0 || g.player.x > 1000 || g.player.y < 0 || g.player.y > 1000)) {
	  g.player.x = 500;
    g.player.y = 500;	  
	} 
	updateSpawners(dt, g.spawners, g.enemies);
	updateAmmoboxes(dt, g.ammoboxes);
	updateHealthkits(dt, g.healthkits);
	updateAmmoboxZones(dt, g.ammoboxZones, g.ammoboxes);
	updateHealthkitZones(dt, g.healthkitZones, g.healthkits);
  updateEnemies(dt, g.enemies, g.player, g.spawners);
  updateBullets(dt, g.bullets);
  updatePlayer(dt, g.player, input);
  updateCollisionsPlayerWall(dt, g.player, g.walls);
  updateCollisionsEnemyWall(dt, g.enemies, g.walls);
  updateCollisionsBulletEnemy(dt, g.bullets, g.enemies);
  updateCollisionsPlayerEnemy(dt, g.player, g.enemies);
  updateCollisionsBulletWall(dt, g.bullets, g.walls);
  updateCollisionsAmmoPlayer(dt, g.player, g.ammoboxes);
  updateCollisionsHealthkitPlayer(dt, g.player, g.healthkits);
}

function drawGame(ctx, g, input) {
  drawWalls(ctx, g.walls);
  drawSpawners(ctx, g.spawners);
  drawAmmoboxZones(ctx, g.ammoboxZones);
  drawAmmoboxes(ctx, g.ammoboxes);
  drawHealthkits(ctx, g.healthkits);
  drawHealthkitZones(ctx, g.healthkitZones);
  drawEnemies(ctx, g.enemies);
  drawBullets(ctx, g.bullets);
	drawPlayer(ctx, g.player, input);
	drawHUD(ctx, g.player);
	drawCrosshair(ctx, input);
}

function drawCrosshair(ctx, input) {
  let w = 10, h = 10;
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'gray';
  ctx.strokeRect(input.mouse.x - w/2, input.mouse.y - h/2, w, h);
}
