// Single-hue court heatmap. Paints into a small alpha buffer, then colours it
// through a lookup table, so the cost stays flat no matter how large the screen is.
export function createHeat(canvas) {
  const STAMP_RADIUS = 34, STAMP_ALPHA = 0.11, DECAY = 0.016, CUTOFF = 34, BUFFER_WIDTH = 480;
  const STOPS = [[0, 34, 62, 12, 0], [0.22, 48, 86, 14, 130], [0.5, 142, 186, 18, 215], [0.78, 210, 241, 29, 240], [1, 250, 255, 214, 255]];

  const ctx = canvas.getContext('2d');
  const buffer = document.createElement('canvas');
  const b = buffer.getContext('2d', { willReadFrequently: true });

  const stamp = document.createElement('canvas');
  stamp.width = stamp.height = STAMP_RADIUS * 2;
  const s = stamp.getContext('2d');
  const g = s.createRadialGradient(STAMP_RADIUS, STAMP_RADIUS, 0, STAMP_RADIUS, STAMP_RADIUS, STAMP_RADIUS);
  g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  s.fillStyle = g; s.fillRect(0, 0, STAMP_RADIUS * 2, STAMP_RADIUS * 2);

  const lut = new Uint8ClampedArray(256 * 4);
  for (let i = 0; i < 256; i++) {
    if (i < CUTOFF) continue; // 8-bit fade never reaches zero, so drop the residue
    const t = (i - CUTOFF) / (255 - CUTOFF);
    let k = 0; while (k < STOPS.length - 2 && t > STOPS[k + 1][0]) k++;
    const [t0, ...c0] = STOPS[k], [t1, ...c1] = STOPS[k + 1], m = Math.min(1, (t - t0) / (t1 - t0));
    for (let n = 0; n < 4; n++) lut[i * 4 + n] = c0[n] + (c1[n] - c0[n]) * m;
  }

  let w = 0, h = 0, output, running = false, inView = true, last = null, lastPaint = 0;

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = BUFFER_WIDTH; h = Math.max(1, Math.round(BUFFER_WIDTH * r.height / Math.max(1, r.width)));
    canvas.width = buffer.width = w; canvas.height = buffer.height = h;
    output = ctx.createImageData(w, h);
    last = null;
  }

  function paint(x, y) {
    b.globalCompositeOperation = 'source-over';
    b.globalAlpha = STAMP_ALPHA;
    b.drawImage(stamp, x - STAMP_RADIUS, y - STAMP_RADIUS);
  }

  function render() {
    const src = b.getImageData(0, 0, w, h).data, out = output.data;
    for (let i = 3, n = src.length; i < n; i += 4) {
      const a = src[i] * 4;
      out[i - 3] = lut[a]; out[i - 2] = lut[a + 1]; out[i - 1] = lut[a + 2]; out[i] = lut[a + 3];
    }
    ctx.putImageData(output, 0, 0);
  }

  function frame(now) {
    if (!inView) { running = false; return; }
    b.globalCompositeOperation = 'destination-out';
    b.globalAlpha = 1;
    b.fillStyle = `rgba(0,0,0,${DECAY})`;
    b.fillRect(0, 0, w, h);
    render();
    if (now - lastPaint > 7000) { b.clearRect(0, 0, w, h); render(); running = false; return; } // idle: stop burning frames
    requestAnimationFrame(frame);
  }

  function wake() { if (!running && inView) { running = true; requestAnimationFrame(frame); } }

  // u and v are 0..1 across the canvas
  function add(u, v) {
    const x = u * w, y = v * h;
    if (last) {
      const d = Math.hypot(x - last.x, y - last.y), steps = Math.min(24, Math.ceil(d / 5));
      for (let i = 1; i <= steps; i++) paint(last.x + (x - last.x) * i / steps, last.y + (y - last.y) * i / steps);
    } else paint(x, y);
    last = { x, y };
    lastPaint = performance.now();
    wake();
  }

  function lift() { last = null; }

  new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView && performance.now() - lastPaint < 7000) wake(); }).observe(canvas);
  addEventListener('resize', resize);
  resize();
  return { add, lift, render };
}
