// utils/monotone.ts
export type Pt = { x: number; y: number };

/**
 * Monotone cubic interpolation (Fritsch–Carlson)
 * Returns an SVG path string of cubic Beziers that never overshoot.
 * Assumes x is strictly increasing (equal spacing is fine).
 */
export function monotoneBezierPath(points: Pt[]): string {
  const n = points.length;
  if (n === 0) return '';
  if (n === 1) return `M${points[0].x},${points[0].y}`;

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);

  // secant slopes between points
  const dx: number[] = new Array(n - 1);
  const d: number[] = new Array(n - 1);
  for (let i = 0; i < n - 1; i++) {
    dx[i] = xs[i + 1] - xs[i];
    d[i] = (ys[i + 1] - ys[i]) / (dx[i] || 1e-9);
  }

  // tangents at points
  const m: number[] = new Array(n);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    // if slope changes sign or is zero → flat tangent to avoid overshoot
    if (d[i - 1] * d[i] <= 0) {
      m[i] = 0;
    } else {
      m[i] = (d[i - 1] + d[i]) / 2;
    }
  }

  // Fritsch–Carlson tightening to keep curve within bounds
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }

  // build cubic Bezier path
  let path = `M${xs[0]},${ys[0]}`;
  for (let i = 0; i < n - 1; i++) {
    const x0 = xs[i], y0 = ys[i];
    const x1 = xs[i + 1], y1 = ys[i + 1];
    const h = dx[i];

    // Hermite → Bezier conversion
    const cp1x = x0 + h / 3;
    const cp1y = y0 + (m[i] * h) / 3;
    const cp2x = x1 - h / 3;
    const cp2y = y1 - (m[i + 1] * h) / 3;

    path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x1},${y1}`;
  }
  return path;
}
