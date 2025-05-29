
const mat4 = {
  create: function () {
    return [
      1, 0, 0, 0,  // 0 1 2 3
      0, 1, 0, 0,  // 4 5 6 7
      0, 0, 1, 0,  // 8 9 10 11
      0, 0, 0, 1   // 12 13 14 15
    ];
  },

  perspective: function (out, fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;

    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;

    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;

    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
  },

  lookAt: function (out, eye, center, up) {
    const [ex, ey, ez] = eye;
    const [cx, cy, cz] = center;
    const [ux, uy, uz] = up;

    let zx = ex - cx,
        zy = ey - cy,
        zz = ez - cz;

    let len = Math.hypot(zx, zy, zz);
    zx /= len; zy /= len; zz /= len;

    let xx = uy * zz - uz * zy;
    let xy = uz * zx - ux * zz;
    let xz = ux * zy - uy * zx;

    len = Math.hypot(xx, xy, xz);
    xx /= len; xy /= len; xz /= len;

    let yx = zy * xz - zz * xy;
    let yy = zz * xx - zx * xz;
    let yz = zx * xy - zy * xx;

    out[0] = xx;
    out[1] = yx;
    out[2] = zx;
    out[3] = 0;

    out[4] = xy;
    out[5] = yy;
    out[6] = zy;
    out[7] = 0;

    out[8] = xz;
    out[9] = yz;
    out[10] = zz;
    out[11] = 0;

    out[12] = -(xx * ex + xy * ey + xz * ez);
    out[13] = -(yx * ex + yy * ey + yz * ez);
    out[14] = -(zx * ex + zy * ey + zz * ez);
    out[15] = 1;

    return out;
  },

  multiply: function (out, a, b) {
    const o = new Array(16);

    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        o[i * 4 + j] =
          a[0 * 4 + j] * b[i * 4 + 0] +
          a[1 * 4 + j] * b[i * 4 + 1] +
          a[2 * 4 + j] * b[i * 4 + 2] +
          a[3 * 4 + j] * b[i * 4 + 3];
      }
    }

    for (let i = 0; i < 16; i++) out[i] = o[i];
    return out;
  },

  rotate: function (out, a, rad, axis) {
    let [x, y, z] = axis;
    let len = Math.hypot(x, y, z);
    if (len < 0.00001) return null;
    x /= len; y /= len; z /= len;

    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;

    const rot = [
      x * x * t + c,     y * x * t + z * s, z * x * t - y * s, 0,
      x * y * t - z * s, y * y * t + c,     z * y * t + x * s, 0,
      x * z * t + y * s, y * z * t - x * s, z * z * t + c,     0,
      0,                 0,                 0,                 1
    ];

    return this.multiply(out, a, rot);
  }
};
