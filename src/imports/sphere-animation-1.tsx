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

interface OrbitDot {
  angle: number;
  speed: number;
  tiltX: number;
  tiltZ: number;
  radius: number;
}

export function SphereAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const glowRef = useRef(0);
  const stateRef = useRef({
    width: 0,
    height: 0,
    rotationX: 0,
    rotationY: 0,
    mouse: null as { x: number; y: number } | null,
    isMouseDown: false,
  });

  // Orbiting dots around the core
  const orbitDotsRef = useRef<OrbitDot[]>(
    Array.from({ length: 6 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 6,
      speed: 0.04 + i * 0.012,
      tiltX: (i * Math.PI) / 3.5,
      tiltZ: (i * Math.PI) / 5,
      radius: 30 + i * 10,
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

      // Smooth fade transition
      const target = s.isMouseDown ? 1 : 0;
      glowRef.current += (target - glowRef.current) * 0.08;
      const fade = glowRef.current;

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

      // Orbiting glowing white dots — only when clicking
      if (fade > 0.01) {
        const dots = orbitDotsRef.current;

        dots.forEach((dot) => {
          dot.angle += dot.speed;
          const orbitR = dot.radius * scaleFactor;

          // Position on circle in XZ plane
          let dx = Math.cos(dot.angle) * orbitR;
          let dy = 0;
          let dz = Math.sin(dot.angle) * orbitR;

          // Tilt around X
          const cosT = Math.cos(dot.tiltX);
          const sinT = Math.sin(dot.tiltX);
          const dy2 = dy * cosT - dz * sinT;
          const dz2 = dy * sinT + dz * cosT;

          // Tilt around Z
          const cosZ = Math.cos(dot.tiltZ);
          const sinZ = Math.sin(dot.tiltZ);
          const dx2 = dx * cosZ - dy2 * sinZ;
          const dy3 = dx * sinZ + dy2 * cosZ;

          // Project
          const dsc = perspective / (perspective + 250 - dz2);
          const dsx = dx2 * dsc + cx;
          const dsy = dy3 * dsc + cy;

          // Soft glow around dot
          const glowGrad = ctx!.createRadialGradient(
            dsx, dsy, 0,
            dsx, dsy, 5 * dsc
          );
          glowGrad.addColorStop(0, `rgba(255,255,255,${0.4 * fade})`);
          glowGrad.addColorStop(1, "rgba(255,255,255,0)");
          ctx!.beginPath();
          ctx!.arc(dsx, dsy, 5 * dsc, 0, Math.PI * 2);
          ctx!.fillStyle = glowGrad;
          ctx!.globalCompositeOperation = "lighter";
          ctx!.fill();
          ctx!.globalCompositeOperation = "source-over";

          // Dot body
          const dotSize = 1.2 * dsc;
        });
      }

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