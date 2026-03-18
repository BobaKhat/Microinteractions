import { useRef, useEffect, useCallback } from "react";

const BASE_R = 140;
const INNER_R = BASE_R / 2.5;
const PERSP = 800;

interface Particle {
  x: number; y: number; z: number;
  ox: number; oy: number; oz: number;
  vx: number; vy: number; vz: number;
  isInner: boolean;
  isCore: boolean;
}

interface OrbitDot {
  angle: number;
  speed: number;
  tiltX: number;
  tiltZ: number;
  radius: number;
}

function makeParticle(i: number, total: number, radius: number): Particle {
  const phi = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / (total - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const th = phi * i;
  return {
    x: Math.cos(th) * r * radius,
    y: y * radius,
    z: Math.sin(th) * r * radius,
    ox: Math.cos(th) * r,
    oy: y,
    oz: Math.sin(th) * r,
    vx: 0, vy: 0, vz: 0,
    isInner: radius === INNER_R,
    isCore: false,
  };
}

export function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    rotX: 0,
    rotY: 0,
    mouse: null as { x: number; y: number } | null,
    isDown: false,
    glow: 0,
    particles: [] as Particle[],
    orbitDots: Array.from({ length: 6 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 6,
      speed: 0.04 + i * 0.012,
      tiltX: (i * Math.PI) / 3.5,
      tiltZ: (i * Math.PI) / 5,
      radius: 30 + i * 10,
    })) as OrbitDot[],
    raf: 0,
  });

  const initParticles = useCallback(() => {
    const particles: Particle[] = [];
    const count = 350;
    const inner = Math.floor(count / 2.5);
    for (let i = 0; i < count; i++) particles.push(makeParticle(i, count, BASE_R));
    for (let i = 0; i < inner; i++) particles.push(makeParticle(i, inner, INNER_R));
    particles.push({
      x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0,
      vx: 0, vy: 0, vz: 0, isInner: false, isCore: true,
    });
    stateRef.current.particles = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    initParticles();

    const setMouse = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      s.mouse = { x: clientX - r.left, y: clientY - r.top };
    };

    const onMouseMove = (e: MouseEvent) => setMouse(e.clientX, e.clientY);
    const onMouseDown = () => { s.isDown = true; };
    const onMouseLeave = () => { s.mouse = null; s.isDown = false; };
    const onMouseUp = () => { s.isDown = false; };

    let touchTimer: ReturnType<typeof setTimeout>;
    const onTouchStart = (e: TouchEvent) => {
      s.isDown = true;
      if (e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY);
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => { s.isDown = false; s.mouse = null; }, 300);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY);
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => { s.isDown = false; s.mouse = null; }, 300);
    };
    const onTouchEnd = () => {
      clearTimeout(touchTimer);
      s.isDown = false;
      s.mouse = null;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      resize();
      initParticles();
    });
    resizeObserver.observe(canvas.parentElement!);

    const render = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const W = rect.width;
      const H = rect.height;

      ctx.clearRect(0, 0, W, H);

      s.rotY += 0.003;
      s.rotX += 0.001;
      s.glow += ((s.isDown ? 1 : 0) - s.glow) * 0.08;

      const scale = W / 400;
      const repulseR = 120;
      const repulseS = 3.0;
      const expandM = 2.2;

      const expansion = s.isDown ? expandM : 1.0;
      const outerR = BASE_R * scale * expansion;
      const cx = W / 2;
      const cy = H / 2;

      // Atmosphere
      if (outerR > 0) {
        const atmo = ctx.createRadialGradient(cx, cy, outerR * 0.2, cx, cy, outerR * 1.5);
        atmo.addColorStop(0, "rgba(255,255,255,0.08)");
        atmo.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = atmo;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      // Physics + projection
      s.particles.forEach((p) => {
        if (p.isCore) return;
        const rad = (p.isInner ? INNER_R : BASE_R) * scale * expansion;

        let tx = p.ox * rad * Math.cos(s.rotY) - p.oz * rad * Math.sin(s.rotY);
        let tz = p.ox * rad * Math.sin(s.rotY) + p.oz * rad * Math.cos(s.rotY);
        let ty = p.oy * rad;

        let ty2 = ty * Math.cos(s.rotX) - tz * Math.sin(s.rotX);
        let tz2 = ty * Math.sin(s.rotX) + tz * Math.cos(s.rotX);

        p.vx += (tx - p.x) * 0.05;
        p.vy += (ty2 - p.y) * 0.05;
        p.vz += (tz2 - p.z) * 0.05;

        // Mouse repulsion
        if (s.mouse) {
          const sc = PERSP / (PERSP + 250 - p.z);
          const sx = p.x * sc + cx;
          const sy = p.y * sc + cy;
          const dx = sx - s.mouse.x;
          const dy = sy - s.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repulseR) {
            const f = (1 - dist / repulseR) * repulseS;
            const a = Math.atan2(dy, dx);
            p.vx += Math.cos(a) * f * 5;
            p.vy += Math.sin(a) * f * 5;
          }
        }

        p.vx *= 0.9; p.vy *= 0.9; p.vz *= 0.9;
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
      });

      // Sort back-to-front
      s.particles.sort((a, b) => a.z - b.z);

      // Draw particles
      s.particles.forEach((p) => {
        const sc = PERSP / (PERSP + 250 - p.z);
        const alpha = Math.max(0.1, (sc - 0.5) * 2);
        const px = p.x * sc + cx;
        const py = p.y * sc + cy;

        if (p.isCore) {
          ctx.beginPath();
          ctx.arc(px, py, 4 * sc, 0, Math.PI * 2);
          ctx.fillStyle = "black";
          ctx.shadowBlur = 10;
          ctx.shadowColor = "white";
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
          return;
        }

        const size = (p.isInner ? 1.5 : 2) * sc;
        if (size <= 0) return;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(255,255,255,${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Orbiting dots
      if (s.glow > 0.01) {
        s.orbitDots.forEach((dot) => {
          dot.angle += dot.speed;
          const orbitR = dot.radius * scale;

          let dx = Math.cos(dot.angle) * orbitR;
          let dy = 0;
          let dz = Math.sin(dot.angle) * orbitR;

          const cosT = Math.cos(dot.tiltX), sinT = Math.sin(dot.tiltX);
          const dy2 = dy * cosT - dz * sinT;
          const dz2 = dy * sinT + dz * cosT;

          const cosZ = Math.cos(dot.tiltZ), sinZ = Math.sin(dot.tiltZ);
          const dx2 = dx * cosZ - dy2 * sinZ;
          const dy3 = dx * sinZ + dy2 * cosZ;

          const dsc = PERSP / (PERSP + 250 - dz2);
          const dsx = dx2 * dsc + cx;
          const dsy = dy3 * dsc + cy;

          const glowG = ctx.createRadialGradient(dsx, dsy, 0, dsx, dsy, 5 * dsc);
          glowG.addColorStop(0, `rgba(255,255,255,${0.4 * s.glow})`);
          glowG.addColorStop(1, "rgba(255,255,255,0)");

          ctx.globalCompositeOperation = "lighter";
          ctx.beginPath();
          ctx.arc(dsx, dsy, 5 * dsc, 0, Math.PI * 2);
          ctx.fillStyle = glowG;
          ctx.fill();
          ctx.globalCompositeOperation = "source-over";

          ctx.beginPath();
          ctx.arc(dsx, dsy, 1.2 * dsc, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.8 * s.glow})`;
          ctx.fill();
        });
      }

      s.raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(s.raf);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      resizeObserver.disconnect();
      clearTimeout(touchTimer);
    };
  }, [initParticles]);

  return (
    <div
      style={{
        width: 410,
        height: 410,
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.2)",
          textTransform: "uppercase",
          pointerEvents: "none",
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        Hold to expand
      </div>
    </div>
  );
}