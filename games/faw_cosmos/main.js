
function main() {
  const canvas = document.getElementById("cosmosCanvas");
  const fpsCounter = document.getElementById("fpsCounter");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = initWebGL(canvas);
  if (!gl) return;

  const vertexShaderSource = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    uniform mat4 uMatrix;
    varying vec4 vColor;

    void main() {
      gl_Position = uMatrix * aPosition;
      vColor = aColor;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `;

  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  const positions = new Float32Array([
    -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,
    -1, -1, -1,  -1,  1, -1,   1,  1, -1,   1, -1, -1,
    -1,  1, -1,  -1,  1,  1,   1,  1,  1,   1,  1, -1,
    -1, -1, -1,   1, -1, -1,   1, -1,  1,  -1, -1,  1,
     1, -1, -1,   1,  1, -1,   1,  1,  1,   1, -1,  1,
    -1, -1, -1,  -1, -1,  1,  -1,  1,  1,  -1,  1, -1,
  ]);

  const colors = new Float32Array([
    1, 0, 0, 1,  1, 0, 0, 1,  1, 0, 0, 1,  1, 0, 0, 1,
    0, 1, 0, 1,  0, 1, 0, 1,  0, 1, 0, 1,  0, 1, 0, 1,
    0, 0, 1, 1,  0, 0, 1, 1,  0, 0, 1, 1,  0, 0, 1, 1,
    1, 1, 0, 1,  1, 1, 0, 1,  1, 1, 0, 1,  1, 1, 0, 1,
    1, 0, 1, 1,  1, 0, 1, 1,  1, 0, 1, 1,  1, 0, 1, 1,
    0, 1, 1, 1,  0, 1, 1, 1,  0, 1, 1, 1,  0, 1, 1, 1,
  ]);

  const indices = new Uint16Array([
    0, 1, 2,  0, 2, 3,
    4, 5, 6,  4, 6, 7,
    8, 9,10,  8,10,11,
   12,13,14, 12,14,15,
   16,17,18, 16,18,19,
   20,21,22, 20,22,23
  ]);

  function createBuffer(data, type = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, usage);
    return buffer;
  }

  createBuffer(positions);
  const positionLoc = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  createBuffer(colors);
  const colorLoc = gl.getAttribLocation(program, "aColor");
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLoc);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, createBuffer(indices, gl.ELEMENT_ARRAY_BUFFER));

  const uMatrix = gl.getUniformLocation(program, "uMatrix");

  let angle = 0;

  // FPS счётчик
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;

  function render() {
    const now = performance.now();
    frameCount++;
    if (now - lastTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastTime = now;
      fpsCounter.textContent = `FPS: ${fps}`;
    }

    angle += 0.01;

    const proj = mat4.create();
    mat4.perspective(proj, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);

    const view = mat4.create();
    mat4.lookAt(view, [0, 0, 6], [0, 0, 0], [0, 1, 0]);

    const model = mat4.create();
    mat4.rotate(model, model, angle, [0.5, 1, 0]);

    const pv = mat4.create();
    mat4.multiply(pv, proj, view);

    const mvp = mat4.create();
    mat4.multiply(mvp, pv, model);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uMatrix, false, mvp);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
  }

  render();
}

main();
