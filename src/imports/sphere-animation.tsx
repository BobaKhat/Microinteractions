import { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  ox: number;
  oy: number;
  oz: number;
  vx: number;
  vy: number;
  vz: number;
  isInner: boolean;
  isCore: boolean;
}

export function SphereAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const stateRef = useRef({
    width: 0,
    height: 0,
    rotationX: 0,
    rotationY: 0,
    mouse: null as { x: number; y: number } | null,
    isMouseDown: false,
    rocketsActive: false,
    rocketOpacity: 0,
  });

  // Rockets: each has its own orbital plane (tilt) and phase offset
  const rocketsRef = useRef(
    Array.from({ length: 4 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 4,        // starting phase offset
      speed: 0.008 + i * 0.002,             // slightly different speeds
      tiltX: (i * 0.4) - 0.6,              // orbital plane tilt around X
      tiltZ: (i * 0.3) - 0.3,              // orbital plane tilt around Z
      trailPositions: [] as { x: number; y: number; alpha: number }[],
    }))
  );

  const initParticles = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = container.offsetWidth < 800;
    const particleCount = isMobile ? 250 : 500;
    const baseRadius = 300;
    const innerRadius = baseRadius / 2.5;
    const phi = Math.PI * (3 - Math.sqrt(5));

    const particles: Particle[] = [];

    const createParticle = (
      i: number,
      total: number,
      radius: number
    ): Particle => {
      const y = 1 - (i / (total - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      return {
        x: Math.cos(theta) * r * radius,
        y: y * radius,
        z: Math.sin(theta) * r * radius,
        ox: Math.cos(theta) * r,
        oy: y,
        oz: Math.sin(theta) * r,
        vx: 0,
        vy: 0,
        vz: 0,
        isInner: radius === innerRadius,
        isCore: false,
      };
    };

    for (let i = 0; i < particleCount; i++)
      particles.push(createParticle(i, particleCount, baseRadius));
    const innerCount = isMobile
      ? Math.floor(particleCount / 3)
      : Math.floor(particleCount / 2);
    for (let i = 0; i < innerCount; i++)
      particles.push(createParticle(i, innerCount, innerRadius));

    particles.push({
      x: 0, y: 0, z: 0,
      ox: 0, oy: 0, oz: 0,
      vx: 0, vy: 0, vz: 0,
      isInner: false, isCore: true,
    });

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;
    const isMobile = container.offsetWidth < 800;
    const baseRadius = 300;
    const innerRadius = baseRadius / 2.5;
    const mouseRepulsionRadius = isMobile ? 120 : 250;
    const mouseRepulsionStrength = isMobile ? 3.0 : 6.0;
    const expandMultiplier = isMobile ? 1.6 : 1.8;
    const perspective = 800;

    function resize() {
      if (!container || !canvas) return;
      s.width = container.offsetWidth;
      s.height = container.offsetHeight;
      canvas.width = s.width;
      canvas.height = s.height;
    }

    initParticles();
    resize();
    window.addEventListener("resize", resize);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(resize)
        : null;
    if (ro) ro.observe(container);

    const updateMouse = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect();
      s.mouse = { x: x - rect.left, y: y - rect.top };
    };

    const onMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const onMouseDown = () => { s.isMouseDown = true; };
    const onMouseLeave = () => { s.mouse = null; s.isMouseDown = false; };
    const onMouseUp = () => { s.isMouseDown = false; };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseup", onMouseUp);

    let touchTimeout: ReturnType<typeof setTimeout> | null = null;
    const onTouchStart = (e: TouchEvent) => {
      s.isMouseDown = true;
      if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
      if (touchTimeout) clearTimeout(touchTimeout);
      touchTimeout = setTimeout(() => { s.isMouseDown = false; s.mouse = null; }, 300);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
      if (touchTimeout) clearTimeout(touchTimeout);
      touchTimeout = setTimeout(() => { s.isMouseDown = false; s.mouse = null; }, 300);
    };
    const onTouchEnd = () => {
      if (touchTimeout) clearTimeout(touchTimeout);
      s.isMouseDown = false;
      s.mouse = null;
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    function render() {
      ctx!.clearRect(0, 0, s.width, s.height);
      s.rotationY += 0.003;
      s.rotationX += 0.001;

      const cx = s.width / 2;
      const cy = s.height / 2;

      const scaleFactor =
        s.width < 800
          ? s.width / 650
          : s.width <= 1500
            ? Math.min(s.width / 1150, 1)
            : Math.min(s.width / 1500, 1.4);
      const expansion = s.isMouseDown ? expandMultiplier : 1.0;
      const currentOuterR = baseRadius * scaleFactor * expansion;

      // Atmosphere
      if (currentOuterR > 0) {
        const grad = ctx!.createRadialGradient(
          cx, cy, currentOuterR * 0.2,
          cx, cy, currentOuterR * 1.5
        );
        grad.addColorStop(0, "rgba(255,255,255,0.08)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx!.fillStyle = grad;
        ctx!.globalCompositeOperation = "lighter";
        ctx!.beginPath();
        ctx!.arc(cx, cy, currentOuterR * 1.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalCompositeOperation = "source-over";
      }

      // Physics
      const particles = particlesRef.current;
      particles.forEach((p) => {
        if (p.isCore) return;
        const rad =
          (p.isInner ? innerRadius : baseRadius) * scaleFactor * expansion;

        let tx =
          p.ox * rad * Math.cos(s.rotationY) -
          p.oz * rad * Math.sin(s.rotationY);
        let tz =
          p.ox * rad * Math.sin(s.rotationY) +
          p.oz * rad * Math.cos(s.rotationY);
        let ty = p.oy * rad;

        let ty2 = ty * Math.cos(s.rotationX) - tz * Math.sin(s.rotationX);
        let tz2 = ty * Math.sin(s.rotationX) + tz * Math.cos(s.rotationX);

        p.vx += (tx - p.x) * 0.05;
        p.vy += (ty2 - p.y) * 0.05;
        p.vz += (tz2 - p.z) * 0.05;

        if (s.mouse) {
          const sc = perspective / (perspective + 250 - p.z);
          const sx = p.x * sc + cx;
          const sy = p.y * sc + cy;
          const dx = sx - s.mouse.x;
          const dy = sy - s.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRepulsionRadius) {
            const f =
              (1 - dist / mouseRepulsionRadius) * mouseRepulsionStrength;
            const a = Math.atan2(dy, dx);
            p.vx += Math.cos(a) * f * 5;
            p.vy += Math.sin(a) * f * 5;
          }
        }

        p.vx *= 0.9;
        p.vy *= 0.9;
        p.vz *= 0.9;
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
      });

      particles.sort((a, b) => a.z - b.z);

      particles.forEach((p) => {
        const sc = perspective / (perspective + 250 - p.z);
        const alpha = Math.max(0.1, (sc - 0.5) * 2);

        if (p.isCore) {
          const coreRadius = 4 * sc;
          ctx!.beginPath();
          ctx!.arc(p.x * sc + cx, p.y * sc + cy, coreRadius, 0, Math.PI * 2);
          ctx!.fillStyle = "black";
          ctx!.shadowBlur = 10;
          ctx!.shadowColor = "white";
          ctx!.shadowOffsetX = 0;
          ctx!.shadowOffsetY = 0;
          ctx!.fill();
          ctx!.shadowBlur = 0;
          ctx!.shadowColor = "transparent";
        } else {
          const size = p.isInner ? 1.5 * sc : 2 * sc;
          if (size > 0) {
            ctx!.beginPath();
            ctx!.arc(p.x * sc + cx, p.y * sc + cy, size, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(255,255,255,${alpha})`;
            if (!isMobile) {
              ctx!.shadowBlur = 20;
              ctx!.shadowColor = `rgba(255,255,255,${alpha})`;
            }
            ctx!.fill();
            ctx!.shadowBlur = 0;
          }
        }
      });

      // Rockets - always visible, orbiting the outer sphere
      const rockets = rocketsRef.current;
      const orbitRadius = baseRadius * scaleFactor * expansion * 1.15;

      rockets.forEach((rocket) => {
        rocket.angle += rocket.speed;

        // Position on a circle in XZ plane
        let px = Math.cos(rocket.angle) * orbitRadius;
        let py = 0;
        let pz = Math.sin(rocket.angle) * orbitRadius;

        // Tilt the orbital plane around X axis
        const cosT = Math.cos(rocket.tiltX);
        const sinT = Math.sin(rocket.tiltX);
        let py2 = py * cosT - pz * sinT;
        let pz2 = py * sinT + pz * cosT;

        // Tilt around Z axis
        const cosZ = Math.cos(rocket.tiltZ);
        const sinZ = Math.sin(rocket.tiltZ);
        let px2 = px * cosZ - py2 * sinZ;
        let py3 = px * sinZ + py2 * cosZ;

        // Project to screen
        const sc = perspective / (perspective + 250 - pz2);
        const sx = px2 * sc + cx;
        const sy = py3 * sc + cy;

        // Compute direction of travel for rocket nose
        const nextAngle = rocket.angle + 0.05;
        let nx = Math.cos(nextAngle) * orbitRadius;
        let ny = 0;
        let nz = Math.sin(nextAngle) * orbitRadius;
        let ny2 = ny * cosT - nz * sinT;
        let nz2 = ny * sinT + nz * cosT;
        let nx2 = nx * cosZ - ny2 * sinZ;
        let ny3 = nx * sinZ + ny2 * cosZ;
        const nsc = perspective / (perspective + 250 - nz2);
        const nsx = nx2 * nsc + cx;
        const nsy = ny3 * nsc + cy;

        const dirX = nsx - sx;
        const dirY = nsy - sy;
        const dirLen = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        const ndx = dirX / dirLen;
        const ndy = dirY / dirLen;

        // Trail
        rocket.trailPositions.push({ x: sx, y: sy, alpha: sc });
        if (rocket.trailPositions.length > 30) rocket.trailPositions.shift();

        // Draw exhaust trail with fading segments
        for (let t = 0; t < rocket.trailPositions.length - 1; t++) {
          const tp = rocket.trailPositions[t];
          const tp2 = rocket.trailPositions[t + 1];
          const fade = t / rocket.trailPositions.length;
          ctx!.beginPath();
          ctx!.moveTo(tp.x, tp.y);
          ctx!.lineTo(tp2.x, tp2.y);
          ctx!.strokeStyle = `rgba(255,180,50,${fade * 0.6})`;
          ctx!.lineWidth = (1 + (t / rocket.trailPositions.length) * 2) * sc;
          ctx!.stroke();
        }

        // Draw rocket body — a small triangle pointing in travel direction
        const rocketSize = 6 * sc;
        const perpX = -ndy;
        const perpY = ndx;

        ctx!.save();
        ctx!.beginPath();
        // Nose
        ctx!.moveTo(sx + ndx * rocketSize * 1.5, sy + ndy * rocketSize * 1.5);
        // Left fin
        ctx!.lineTo(sx - ndx * rocketSize + perpX * rocketSize * 0.5, sy - ndy * rocketSize + perpY * rocketSize * 0.5);
        // Tail
        ctx!.lineTo(sx - ndx * rocketSize * 0.6, sy - ndy * rocketSize * 0.6);
        // Right fin
        ctx!.lineTo(sx - ndx * rocketSize - perpX * rocketSize * 0.5, sy - ndy * rocketSize - perpY * rocketSize * 0.5);
        ctx!.closePath();
        ctx!.fillStyle = `rgba(255,255,255,0.95)`;
        ctx!.shadowBlur = 12;
        ctx!.shadowColor = `rgba(255,200,80,0.8)`;
        ctx!.fill();
        ctx!.shadowBlur = 0;
        ctx!.restore();

        // Engine glow
        ctx!.beginPath();
        ctx!.arc(sx - ndx * rocketSize * 0.6, sy - ndy * rocketSize * 0.6, 3 * sc, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,140,30,0.9)`;
        ctx!.shadowBlur = 8;
        ctx!.shadowColor = `rgba(255,100,0,1)`;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
      if (ro) ro.disconnect();
    };
  }, [initParticles]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none cursor-pointer"
      style={{
        height: "100vh",
        backgroundColor: "black",
        touchAction: "pan-y",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ zIndex: 0 }}
      />
    </div>
  );
}