
function scene_create() {
	return {
		theta: 0,
		geometries: [],
		camX: 0,
		camY: 0,
		camZ: 0
	};
}

function scene_render(ctx, s) {
	if(!s)
		return;

	// Поворот камеры (можно изменить кнопки)
	if(input.keys['q'])
		s.theta += 0.01;
	if(input.keys['e'])
		s.theta -= 0.01;
	
	// Перемещение камеры
	if(input.keys['w'])
		s.camZ += 10;
	if(input.keys['s'])
		s.camZ -= 10;
	if(input.keys['a'])
		s.camX -= 10;
	if(input.keys['d'])
		s.camX += 10;
	if(input.keys['z'])
		s.camY -= 10;
	if(input.keys['x'])
		s.camY += 10;

	let P = mat([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0.003, 1
	]);

	let A = mat([
		1, 0, 0, -s.camX,
		0, 1, 0, -s.camY,
		0, 0, 1, -s.camZ,
		0, 0, 0, 1
	]);

	let S = mat([
		0.5, 0, 0, 0,
		0, 0.5, 0, 0,
		0, 0, 0.5, 0,
		0, 0, 0,    1
	]);

	let R = mat([
		Math.cos(s.theta), 0, -Math.sin(s.theta), 0,
		0, 1,  0, 0,
		Math.sin(s.theta), 0,  Math.cos(s.theta), 0,
		0, 0,  0, 1
	])

	let T = mult(P, mult(S, mult(A, R)));

	let triangles_to_draw = [];

	for (let j = 0; j < s.geometries.length; j++) {
		let geo = s.geometries[j];

		for (let i = 0; i < geo.triangles.length; i++) {
			let tri = geo.triangles[i];

			let p1 = T(geo.points[tri[0]]);
			let p2 = T(geo.points[tri[1]]);
			let p3 = T(geo.points[tri[2]]);
			let z_avg = (p1[2]/p1[3] + p2[2]/p2[3] + p3[2]/p3[3]) / 3;

			triangles_to_draw.push({ p1, p2, p3, z: z_avg });
		}
	}

	triangles_to_draw.sort((a, b) => b.z - a.z);
	for (let tri of triangles_to_draw)
		triangle_render(ctx, tri.p1, tri.p2, tri.p3);

}

function triangle_render(ctx, p1, p2, p3, color="white", fill="#1177ddaa") {
	if(p1[2]/p1[3] < 0)
		return;
	if(p2[2]/p2[3] < 0)
		return;
	if(p3[2]/p3[3] < 0)
		return;
	ctx.beginPath();
	ctx.moveTo(p1[0]/p1[3], p1[1]/p1[3]);
	ctx.lineTo(p2[0]/p2[3], p2[1]/p2[3]);
	ctx.lineTo(p3[0]/p3[3], p3[1]/p3[3]);
	ctx.closePath();
	ctx.fillStyle = fill;
	ctx.fill();
	ctx.strokeStyle = color;
	ctx.stroke();
}

function scene_add_cube(s, x, y, z, a, b, c) {
    const px = x,      py = y,      pz = z;
    const qx = x + a,  qy = y + b,  qz = z + c;

    const points = [
        [px, py, pz, 1], // 0: left-bottom-front
        [qx, py, pz, 1], // 1: right-bottom-front
        [qx, qy, pz, 1], // 2: right-top-front
        [px, qy, pz, 1], // 3: left-top-front
        [px, py, qz, 1], // 4: left-bottom-back
        [qx, py, qz, 1], // 5: right-bottom-back
        [qx, qy, qz, 1], // 6: right-top-back
        [px, qy, qz, 1], // 7: left-top-back
    ];

    const triangles = [
        // front face
        [0, 1, 2], [0, 2, 3],
        // right face
        [1, 5, 6], [1, 6, 2],
        // back face
        [5, 4, 7], [5, 7, 6],
        // left face
        [4, 0, 3], [4, 3, 7],
        // bottom face
        [4, 5, 1], [4, 1, 0],
        // top face
        [3, 2, 6], [3, 6, 7],
    ];

    s.geometries.push({
        points: points,
        triangles: triangles
    });
}

