import { useRef, useEffect, useCallback, useState } from "react";

/* ───────── Types ───────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  speed: number;
  trail: { x: number; y: number }[];
  opacity: number;
  direction: "in" | "out";
  brightness: number;       // 0–1, per-particle intensity
  maxTrailLen: number;      // individual trail length
  grainSeed: number;        // unique seed for grain flicker
}

/* ───────── Constants ───────── */
const SIZE = 400;
const CENTER = SIZE / 2;
const DOT_RADIUS = 6;
const MAX_TRAIL_IN = 12;
const MAX_TRAIL_OUT = 18;

export function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const isHolding = useRef(false);
  const holdDuration = useRef(0);
  const phase = useRef<"idle" | "absorbing" | "charging" | "exploding" | "afterglow">("idle");
  const glowIntensity = useRef(0);
  const afterglowTimer = useRef(0);
  const shakeAmount = useRef(0);
  const savedIntensity = useRef(0);
  const chargeTimer = useRef(0);
  const chargeDuration = 80; // ~1.3 seconds at 60fps
  const dotScaleRef = useRef<number | null>(null);
  const [, setTick] = useState(0);

  /* ───── Spawn inward particle ───── */
  const spawnInwardParticle = useCallback(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 180 + Math.random() * 60;
    particles.current.push({
      x: CENTER + Math.cos(angle) * distance,
      y: CENTER + Math.sin(angle) * distance,
      vx: 0,
      vy: 0,
      life: 120 + Math.random() * 60,
      maxLife: 120 + Math.random() * 60,
      size: 1 + Math.random() * 2,
      speed: 1.2 + Math.random() * 1.5,
      trail: [],
      opacity: 1,
      direction: "in",
      brightness: Math.random(),
      maxTrailLen: MAX_TRAIL_IN,
      grainSeed: Math.random(),
    });
  }, []);

  /* ───── Spawn outward streak particles ───── */
  const spawnOutwardStreaks = useCallback((count: number, intensity: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Wide speed range: some crawl, some rocket out
      const speedRoll = Math.random();
      const baseSpeed =
        speedRoll < 0.3
          ? (0.8 + Math.random() * 1.5) * (intensity * 0.2 + 0.5)   // slow wisps
          : speedRoll < 0.7
            ? (2 + Math.random() * 4) * (intensity * 0.3 + 0.7)      // medium
            : (5 + Math.random() * 6) * (intensity * 0.4 + 0.8);     // fast streaks
      const tangent = (Math.random() - 0.5) * 2.5;
      const nx = Math.cos(angle);
      const ny = Math.sin(angle);
      const tx = -ny;
      const ty = nx;

      // Brightness: some dim wisps, some bright hot lines
      const brightnessRoll = Math.random();
      const brightness =
        brightnessRoll < 0.25 ? 0.15 + Math.random() * 0.2   // dim
        : brightnessRoll < 0.65 ? 0.4 + Math.random() * 0.3  // medium
        : 0.75 + Math.random() * 0.25;                        // bright

      // Life: wide range for length variation
      const lifeBase = speedRoll < 0.3
        ? 30 + Math.random() * 40    // short-lived wisps
        : speedRoll < 0.7
          ? 50 + Math.random() * 70  // medium
          : 80 + Math.random() * 100; // long dramatic streaks

      // Trail length: varies per particle
      const trailLen = speedRoll < 0.3
        ? 6 + Math.floor(Math.random() * 8)
        : speedRoll < 0.7
          ? 12 + Math.floor(Math.random() * 10)
          : 18 + Math.floor(Math.random() * 14);

      // Size variation
      const size = speedRoll < 0.3
        ? 0.3 + Math.random() * 0.8
        : speedRoll < 0.7
          ? 0.8 + Math.random() * 1.8
          : 1.5 + Math.random() * 2.5;

      particles.current.push({
        x: CENTER + nx * (DOT_RADIUS + 2),
        y: CENTER + ny * (DOT_RADIUS + 2),
        vx: nx * baseSpeed + tx * tangent,
        vy: ny * baseSpeed + ty * tangent,
        life: lifeBase,
        maxLife: lifeBase,
        size,
        speed: baseSpeed,
        trail: [],
        opacity: 1,
        direction: "out",
        brightness,
        maxTrailLen: trailLen,
        grainSeed: Math.random() * 1000,
      });
    }
  }, []);

  /* ───── Main draw loop ───── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Shake
    if (shakeAmount.current > 0) {
      ctx.translate(
        (Math.random() - 0.5) * shakeAmount.current,
        (Math.random() - 0.5) * shakeAmount.current
      );
    }

    const currentPhase = phase.current;

    /* ───── ABSORPTION: spawn inward particles ───── */
    if (currentPhase === "absorbing") {
      holdDuration.current += 1;
      const intensity = Math.min(holdDuration.current / 60, 5);
      const spawnRate = Math.floor(1 + intensity * 3);
      for (let i = 0; i < spawnRate; i++) spawnInwardParticle();
      shakeAmount.current = Math.min(intensity * 1.5, 8);
      // Start from idle baseline (~2.2) and ramp up as you hold longer
      const target = 2.5 + intensity * 1.2;
      glowIntensity.current += (target - glowIntensity.current) * 0.06;
    }

    /* ───── CHARGING: suck particles in, build tension, then explode ───── */
    if (currentPhase === "charging") {
      chargeTimer.current += 1;
      const chargeProgress = chargeTimer.current / chargeDuration; // 0→1

      // Rapidly pull all remaining inward particles toward center
      for (const p of particles.current) {
        if (p.direction === "in") {
          const dx2 = CENTER - p.x;
          const dy2 = CENTER - p.y;
          const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d2 > 1) {
            // Accelerating pull — gets stronger as charge builds
            const pullForce = 0.3 + chargeProgress * 1.2;
            p.vx += (dx2 / d2) * pullForce;
            p.vy += (dy2 / d2) * pullForce;
            p.vx *= 0.9;
            p.vy *= 0.9;
          }
        }
      }

      // Building glow — intensifies toward the end
      const glowTarget = savedIntensity.current * 0.6 + chargeProgress * 4;
      glowIntensity.current += (glowTarget - glowIntensity.current) * 0.08;

      // Tight micro-tremor that builds — feels like it's about to blow
      shakeAmount.current = chargeProgress * chargeProgress * 6;

      // When charge completes → spawn explosion and transition
      if (chargeTimer.current >= chargeDuration) {
        const intensity = savedIntensity.current;
        const count = Math.floor(80 + intensity * 100);
        particles.current = [];
        spawnOutwardStreaks(count, intensity);
        shakeAmount.current = 5 + intensity * 4;
        phase.current = "exploding";
        chargeTimer.current = 0;
      }
    }

    /* ───── EXPLODING: fade shake ───── */
    if (currentPhase === "exploding") {
      shakeAmount.current *= 0.96;
      if (shakeAmount.current < 0.1) shakeAmount.current = 0;
      // Smoothly decay glow from charged peak toward resting level
      const target = 2.8;
      glowIntensity.current += (target - glowIntensity.current) * 0.02;
    }

    /* ───── Update ALL particles ───── */
    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      const dx = CENTER - p.x;
      const dy = CENTER - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (p.direction === "in") {
        /* Inward spiral */
        if (dist > 2) {
          const pullStrength = 0.08 + 0.04 * Math.min(holdDuration.current / 120, 1);
          const nx = dx / dist;
          const ny = dy / dist;
          const tx = -ny;
          const ty = nx;
          p.vx += nx * pullStrength + tx * 0.6 * (p.speed * 0.02);
          p.vy += ny * pullStrength + ty * 0.6 * (p.speed * 0.02);
          p.vx *= 0.97;
          p.vy *= 0.97;
          p.x += p.vx;
          p.y += p.vy;
        }
        // Remove if absorbed
        if (dist < DOT_RADIUS + 2) {
          particles.current.splice(i, 1);
          continue;
        }
      } else {
        /* Outward spiral — slight tangential drift for curving streaks */
        const nx = dist > 1 ? dx / dist : 0;
        const ny = dist > 1 ? dy / dist : 0;
        const tx = -ny;
        const ty = nx;
        // Gentle tangential push
        p.vx += tx * 0.03;
        p.vy += ty * 0.03;
        p.vx *= 0.995;
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;

        // Remove if off-screen
        if (p.x < -20 || p.x > SIZE + 20 || p.y < -20 || p.y > SIZE + 20) {
          particles.current.splice(i, 1);
          continue;
        }
      }

      // Trail
      const maxTrail = p.direction === "in" ? MAX_TRAIL_IN : p.maxTrailLen;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > maxTrail) p.trail.shift();

      p.life -= 1;
      p.opacity = Math.min(1, p.life / 20);

      if (p.life <= 0) {
        particles.current.splice(i, 1);
        continue;
      }

      // Draw trail
      if (p.trail.length > 1) {
        const isOut = p.direction === "out";
        const frameCount = Date.now() * 0.1;

        for (let t = 1; t < p.trail.length; t++) {
          const progress = t / p.trail.length;

          if (isOut) {
            // Grain: pseudo-random flicker per segment using grainSeed
            const grainNoise = Math.sin(p.grainSeed * 73.17 + t * 37.91 + frameCount * 0.7) * 0.5 + 0.5;
            // Some segments get skipped entirely for a broken/textured look
            if (grainNoise < 0.12) continue;

            const grainMul = 0.6 + grainNoise * 0.4;
            const segOpacity = progress * p.opacity * p.brightness * 0.65 * grainMul;
            const segWidth = p.size * progress * 0.9 * (0.7 + grainNoise * 0.3);

            ctx.beginPath();
            ctx.moveTo(p.trail[t - 1].x, p.trail[t - 1].y);
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${segOpacity})`;
            ctx.lineWidth = segWidth;
            ctx.lineCap = "round";
            ctx.stroke();
          } else {
            const segOpacity = progress * p.opacity * 0.5;
            const segWidth = p.size * progress * 0.8;
            ctx.beginPath();
            ctx.moveTo(p.trail[t - 1].x, p.trail[t - 1].y);
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${segOpacity})`;
            ctx.lineWidth = segWidth;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }
      }

      // Draw particle head
      if (p.direction === "out") {
        const headOpacity = p.opacity * p.brightness;
        const headSize = p.size * Math.min(1, p.opacity + 0.3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, headSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${headOpacity})`;
        ctx.fill();

        // Bright particles get a subtle hot glow
        if (p.brightness > 0.7) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, headSize * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${headOpacity * 0.08})`;
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * Math.min(1, p.opacity + 0.3), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }
    }

    /* ───── Transition: exploding → afterglow ───── */
    if (currentPhase === "exploding" && particles.current.length === 0) {
      phase.current = "afterglow";
      afterglowTimer.current = 0;
      // Don't hard-set glow — let it continue smoothly from current value
    }

    /* ───── AFTERGLOW ───── */
    if (currentPhase === "afterglow") {
      afterglowTimer.current += 1;
      shakeAmount.current = 0;
      // Smoothly decay toward resting glow
      const target = 2.5 + Math.sin(Date.now() * 0.0015) * 0.7 + Math.sin(Date.now() * 0.0007) * 0.4;
      glowIntensity.current += (target - glowIntensity.current) * 0.03;
    }

    /* ───── IDLE ───── */
    if (currentPhase === "idle") {
      const target = 2.2 + Math.sin(Date.now() * 0.0015) * 0.8 + Math.sin(Date.now() * 0.0007) * 0.5;
      glowIntensity.current += (target - glowIntensity.current) * 0.03;
    }

    /* ───── Draw central dot + glow ───── */
    const glow = glowIntensity.current;

    // Pulsating dot radius in idle & afterglow
    let dotR = DOT_RADIUS;
    if (currentPhase === "idle" || currentPhase === "afterglow") {
      const targetScale = 1 + Math.sin(Date.now() * 0.0015) * 0.15;
      // Store smooth dot scale on the ref to lerp it
      if (!dotScaleRef.current) dotScaleRef.current = 1;
      dotScaleRef.current += (targetScale - dotScaleRef.current) * 0.03;
      dotR = DOT_RADIUS * dotScaleRef.current;
    }

    if (glow > 0) {
      // Layer 1: Tight bright core glow
      const r1 = DOT_RADIUS + glow * 8;
      const g1 = ctx.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, r1);
      g1.addColorStop(0, `rgba(255, 255, 255, ${Math.min(glow * 0.18, 0.45)})`);
      g1.addColorStop(0.2, `rgba(255, 255, 255, ${Math.min(glow * 0.12, 0.3)})`);
      g1.addColorStop(0.5, `rgba(255, 255, 255, ${Math.min(glow * 0.05, 0.12)})`);
      g1.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, r1, 0, Math.PI * 2);
      ctx.fillStyle = g1;
      ctx.fill();

      // Layer 2: Medium soft aura
      const r2 = DOT_RADIUS + glow * 28;
      const g2 = ctx.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, r2);
      g2.addColorStop(0, `rgba(255, 255, 255, ${Math.min(glow * 0.06, 0.15)})`);
      g2.addColorStop(0.15, `rgba(255, 255, 255, ${Math.min(glow * 0.04, 0.1)})`);
      g2.addColorStop(0.4, `rgba(255, 255, 255, ${Math.min(glow * 0.018, 0.045)})`);
      g2.addColorStop(0.7, `rgba(255, 255, 255, ${Math.min(glow * 0.006, 0.015)})`);
      g2.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, r2, 0, Math.PI * 2);
      ctx.fillStyle = g2;
      ctx.fill();

      // Layer 3: Wide ambient haze - ultra soft fade into black
      const r3 = DOT_RADIUS + glow * 55;
      const g3 = ctx.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, r3);
      g3.addColorStop(0, `rgba(255, 255, 255, ${Math.min(glow * 0.02, 0.05)})`);
      g3.addColorStop(0.2, `rgba(255, 255, 255, ${Math.min(glow * 0.01, 0.025)})`);
      g3.addColorStop(0.5, `rgba(255, 255, 255, ${Math.min(glow * 0.004, 0.01)})`);
      g3.addColorStop(0.8, `rgba(255, 255, 255, ${Math.min(glow * 0.001, 0.003)})`);
      g3.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, r3, 0, Math.PI * 2);
      ctx.fillStyle = g3;
      ctx.fill();
    }

    const dotColor = "rgba(255, 255, 255, 1)";

    ctx.beginPath();
    ctx.arc(CENTER, CENTER, dotR, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();

    if (glow > 0.5) {
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, dotR * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(glow * 0.15, 0.5)})`;
      ctx.fill();
    }

    ctx.restore();
    animRef.current = requestAnimationFrame(draw);
  }, [spawnInwardParticle, spawnOutwardStreaks]);

  /* ───── Canvas setup ───── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  /* ───── Handlers ───── */
  const handleDown = useCallback(() => {
    isHolding.current = true;
    holdDuration.current = 0;
    phase.current = "absorbing";
    particles.current = [];
    shakeAmount.current = 0;
    // Don't reset glow — keep current value so there's no sudden drop
    setTick((t) => t + 1);
  }, []);

  const handleUp = useCallback(() => {
    if (!isHolding.current) return;
    isHolding.current = false;

    const intensity = Math.min(holdDuration.current / 60, 5);
    savedIntensity.current = intensity;

    // Don't spawn streaks yet — enter charging phase first
    phase.current = "charging";
    chargeTimer.current = 0;
    setTick((t) => t + 1);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "100%",
        backgroundColor: "#000",
        userSelect: "none",
        WebkitUserSelect: "none",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          width: 410,
          maxWidth: "100%",
          height: 410,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleDown}
          onMouseUp={handleUp}
          onMouseLeave={() => {
            if (isHolding.current) handleUp();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            handleDown();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleUp();
          }}
          style={{
            width: SIZE,
            height: SIZE,
            cursor: "pointer",
            touchAction: "none",
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
          Hold to absorb · release to explode
        </div>
      </div>
    </div>
  );
}