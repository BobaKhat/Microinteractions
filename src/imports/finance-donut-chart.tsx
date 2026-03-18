import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DollarSign, Bitcoin, TrendingUp } from "lucide-react";

/* ───────── Data ───────── */
const SEGMENTS = [
  { id: "cash", label: "Cash", amount: 10860, color: "#B0FF5B", dimColor: "#4a6a20", glowRgb: "176,255,91", icon: DollarSign },
  { id: "crypto", label: "Crypto", amount: 3580, color: "#C05BFF", dimColor: "#602E80", glowRgb: "192,91,255", icon: Bitcoin },
  { id: "stocks", label: "Stocks", amount: 5420, color: "#3860F0", dimColor: "#1C3078", glowRgb: "56,96,240", icon: TrendingUp },
];

const TOTAL = SEGMENTS.reduce((s, seg) => s + seg.amount, 0);

/* ───────── Config ───────── */
const SIZE = 320;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 110;
const STROKE_NORMAL = 20;
const STROKE_EXPANDED = 26;
const STROKE_SHRUNK = 12;
const CORNER_RADIUS = 5;
const GAP_ANGLE = 0.14; // actual angular gap — shapes won't bleed past this

/* ───────── Geometry helpers ───────── */
function pt(cx: number, cy: number, r: number, a: number) {
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/**
 * Build a filled thick‑arc shape with rounded corners (radius `cr`).
 * The shape doesn't use strokeLinecap, so it never bleeds past its angles.
 */
function roundedArcPath(
  cx: number, cy: number,
  innerR: number, outerR: number,
  startA: number, endA: number,
  cr: number,
) {
  // Angular offsets that correspond to `cr` arc‑length on each radius
  const crOuter = cr / outerR;
  const crInner = cr / innerR;

  // --- Key points (clockwise: start‑outer → end‑outer → end‑inner → start‑inner) ---
  // Corner 1: start‑outer
  const c1Before = pt(cx, cy, outerR - cr, startA);          // radial approach
  const c1Ctrl   = pt(cx, cy, outerR, startA);                // sharp corner
  const c1After  = pt(cx, cy, outerR, startA + crOuter);      // arc departure

  // Outer arc runs from (startA + crOuter) to (endA - crOuter)
  const outerArcEnd = pt(cx, cy, outerR, endA - crOuter);
  const outerLarge  = (endA - crOuter) - (startA + crOuter) > Math.PI ? 1 : 0;

  // Corner 2: end‑outer
  const c2Ctrl  = pt(cx, cy, outerR, endA);
  const c2After = pt(cx, cy, outerR - cr, endA);

  // Corner 3: end‑inner
  const c3Before = pt(cx, cy, innerR + cr, endA);
  const c3Ctrl   = pt(cx, cy, innerR, endA);
  const c3After  = pt(cx, cy, innerR, endA - crInner);

  // Inner arc runs from (endA - crInner) back to (startA + crInner) — counter‑clockwise
  const innerArcEnd = pt(cx, cy, innerR, startA + crInner);
  const innerLarge  = (endA - crInner) - (startA + crInner) > Math.PI ? 1 : 0;

  // Corner 4: start‑inner
  const c4Ctrl  = pt(cx, cy, innerR, startA);
  const c4After = pt(cx, cy, innerR + cr, startA);

  return [
    `M ${c1Before.x} ${c1Before.y}`,
    // Corner 1 (quadratic bezier)
    `Q ${c1Ctrl.x} ${c1Ctrl.y} ${c1After.x} ${c1After.y}`,
    // Outer arc
    `A ${outerR} ${outerR} 0 ${outerLarge} 1 ${outerArcEnd.x} ${outerArcEnd.y}`,
    // Corner 2
    `Q ${c2Ctrl.x} ${c2Ctrl.y} ${c2After.x} ${c2After.y}`,
    // Radial line down to inner (end side)
    `L ${c3Before.x} ${c3Before.y}`,
    // Corner 3
    `Q ${c3Ctrl.x} ${c3Ctrl.y} ${c3After.x} ${c3After.y}`,
    // Inner arc (counter‑clockwise = sweep 0)
    `A ${innerR} ${innerR} 0 ${innerLarge} 0 ${innerArcEnd.x} ${innerArcEnd.y}`,
    // Corner 4
    `Q ${c4Ctrl.x} ${c4Ctrl.y} ${c4After.x} ${c4After.y}`,
    "Z",
  ].join(" ");
}

function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}

/* ───────── Component ───────── */
export function FinanceDonut({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [displayAmount, setDisplayAmount] = useState(TOTAL);
  const [displayLabel, setDisplayLabel] = useState("in assets");
  const animFrameRef = useRef(0);
  const currentAmountRef = useRef(TOTAL);

  const animateNumber = useCallback((target: number, duration = 400) => {
    cancelAnimationFrame(animFrameRef.current);
    const start = currentAmountRef.current;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      currentAmountRef.current = current;
      setDisplayAmount(current);
      if (progress < 1) animFrameRef.current = requestAnimationFrame(tick);
    }
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const handleClick = useCallback(
    (id: string) => {
      if (selected === id) {
        setSelected(null);
        setDisplayLabel("in assets");
        animateNumber(TOTAL);
      } else {
        setSelected(id);
        const seg = SEGMENTS.find((s) => s.id === id)!;
        setDisplayLabel(`in ${seg.label.toLowerCase()}`);
        animateNumber(seg.amount);
      }
    },
    [selected, animateNumber],
  );

  useEffect(() => () => cancelAnimationFrame(animFrameRef.current), []);

  // Build arc angles
  const startAngle = -Math.PI / 2;
  let cursor = startAngle;
  const totalGap = GAP_ANGLE * SEGMENTS.length;
  const available = Math.PI * 2 - totalGap;

  const arcs = SEGMENTS.map((seg) => {
    const fraction = seg.amount / TOTAL;
    const sweep = fraction * available;
    const arcStart = cursor + GAP_ANGLE / 2;
    const arcEnd = arcStart + sweep;
    cursor = arcEnd + GAP_ANGLE / 2;
    return { ...seg, arcStart, arcEnd, fraction };
  });

  const selectedSeg = selected ? SEGMENTS.find((s) => s.id === selected) : null;
  const textColor = selectedSeg ? selectedSeg.color : "#ffffff";
  const textGlow = selectedSeg
    ? `0 0 50px rgba(${selectedSeg.glowRgb},0.8), 0 0 20px rgba(${selectedSeg.glowRgb},0.4)`
    : "none";

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#000",
        userSelect: "none",
        WebkitUserSelect: "none",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "40px 20px",
        position: "relative",
        ...style,
      }}
    >
      <div style={{ position: "relative", width: SIZE, height: SIZE }}>
        {/* Glow layer */}
        <AnimatePresence>
          {selectedSeg && (
            <motion.div
              key={selectedSeg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "absolute",
                inset: -40,
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(${selectedSeg.glowRgb},0.25) 20%, transparent 65%)`,
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          )}
        </AnimatePresence>

        {/* SVG Donut */}
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ position: "relative", zIndex: 1, overflow: "visible" }}
        >
          {/* Inner guide circle */}
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS - STROKE_NORMAL / 2 - 6}
            fill="none"
            stroke="#353535"
            strokeWidth={1}
          />

          {/* Filled arc segments */}
          {arcs.map((arc) => {
            const isSelected = selected === arc.id;
            const isDimmed = selected !== null && !isSelected;

            const sw = isSelected
              ? STROKE_EXPANDED
              : isDimmed
                ? STROKE_SHRUNK
                : STROKE_NORMAL;
            const outerR = RADIUS + sw / 2;
            const innerR = RADIUS - sw / 2;
            const cr = CORNER_RADIUS;

            const d = roundedArcPath(CX, CY, innerR, outerR, arc.arcStart, arc.arcEnd, cr);

            return (
              <motion.path
                key={arc.id}
                d={d}
                fill={isDimmed ? arc.dimColor : arc.color}
                cursor="pointer"
                onClick={() => handleClick(arc.id)}
                initial={false}
                animate={{
                  opacity: isDimmed ? 0.5 : 1,
                }}
                transition={{
                  opacity: { duration: 0.4 },
                }}
                style={{
                  filter: isSelected
                    ? `drop-shadow(0 0 25px rgba(${arc.glowRgb},0.7))`
                    : "none",
                  transition: "filter 0.4s ease, d 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                  pointerEvents: "fill",
                }}
              />
            );
          })}
        </svg>

        {/* Center text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selected ?? "all"}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "40px",
                  color: textColor,
                  textShadow: textGlow,
                  transition: "color 0.4s ease, text-shadow 0.4s ease",
                  letterSpacing: "-0.01em",
                }}
              >
                ${formatNumber(displayAmount)}
              </span>
              <span
                style={{
                  fontSize: "16px",
                  color: "#696969",
                  marginTop: 4,
                }}
              >
                {displayLabel}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
        {SEGMENTS.map((seg) => {
          const isSelected = selected === seg.id;
          const isDimmed = selected !== null && !isSelected;
          const dotColor = isDimmed ? seg.dimColor : seg.color;

          return (
            <button
              key={seg.id}
              onClick={() => handleClick(seg.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: dotColor,
                  boxShadow: isSelected ? `0 0 8px rgba(${seg.glowRgb},0.6)` : "none",
                  transition: "background-color 0.4s ease, box-shadow 0.4s ease",
                }}
              />
              <seg.icon
                size={14}
                style={{
                  color: isDimmed ? seg.dimColor : seg.color,
                  transition: "color 0.4s ease",
                  filter: isSelected ? `drop-shadow(0 0 4px rgba(${seg.glowRgb},0.6))` : "none",
                }}
              />
              <span
                style={{
                  fontSize: "16px",
                  color: "#696969",
                  transition: "color 0.3s ease",
                }}
              >
                {seg.label}
              </span>
            </button>
          );
        })}
      </div>

      <span
        style={{
          marginTop: 28,
          color: "rgba(255,255,255,0.18)",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          whiteSpace: "nowrap",
        }}
      >
        click segment to expand
      </span>
    </div>
  );
}