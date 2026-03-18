import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "../../imports/svg-mf43amhcvk";

const GREEN = "#FFB800";
const HOLD_DURATION = 2200; // ms to hold before confirming
const RIPPLE_COUNT = 5;
const RIPPLE_INTERVAL = 0.45; // seconds between each ripple wave

export function HoldConfirm() {
  const [phase, setPhase] = useState<"idle" | "holding" | "confirmed">("idle");
  const [progress, setProgress] = useState(0); // 0 → 1
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(0);

  const startHold = useCallback(() => {
    if (phase === "confirmed") return;
    setPhase("holding");
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / HOLD_DURATION, 1);
      setProgress(p);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPhase("confirmed");
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [phase]);

  const cancelHold = useCallback(() => {
    if (phase === "holding") {
      cancelAnimationFrame(rafRef.current);
      setPhase("idle");
      setProgress(0);
    }
  }, [phase]);

  const reset = useCallback(() => {
    setPhase("idle");
    setProgress(0);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Outer circle scale for collapse effect
  const isConfirmed = phase === "confirmed";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#141414",
        userSelect: "none",
        WebkitUserSelect: "none",
        fontFamily: "'Inter', sans-serif",
        padding: "24px 12px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Card */}
        <div
          style={{
            width: "100%",
            height: 320,
            backgroundColor: "#141414",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer circle with glow */}
          <AnimatePresence>
            {!isConfirmed && (
              <motion.div
                initial={false}
                animate={{ scale: 1, opacity: 1 }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                style={{
                  position: "absolute",
                  width: 315,
                  height: 315,
                }}
              >
                <svg
                  width="315"
                  height="315"
                  viewBox="0 0 315 315"
                  fill="none"
                  style={{ display: "block", width: "100%", height: "100%" }}
                >
                  <circle
                    cx="157.5"
                    cy="157.5"
                    r="157.25"
                    stroke="#414141"
                    strokeWidth="1"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center button */}
          <motion.div
            onPointerDown={isConfirmed ? reset : startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            animate={{
              scale: phase === "holding" ? 0.95 : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              width: 110,
              height: 110,
              position: "relative",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            {/* Circle background + border */}
            <motion.div
              animate={{
                backgroundColor: isConfirmed ? GREEN : "#101010",
                borderColor: isConfirmed ? GREEN : GREEN,
              }}
              transition={{
                backgroundColor: { duration: 0.25, ease: "easeOut" },
              }}
              style={{
                position: "absolute",
                inset: -1,
                borderRadius: "50%",
                border: `1px solid ${GREEN}`,
              }}
            />

            {/* Progress ring track (always visible) */}
            {!isConfirmed && (
              <svg
                width="124"
                height="124"
                viewBox="0 0 124 124"
                fill="none"
                style={{
                  position: "absolute",
                  top: -7,
                  left: -7,
                  zIndex: 2,
                }}
              >
                <circle
                  cx="62"
                  cy="62"
                  r="58"
                  stroke="rgba(255,184,0,0.08)"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            )}

            {/* Progress ring */}
            {phase === "holding" && (
              <svg
                width="124"
                height="124"
                viewBox="0 0 124 124"
                fill="none"
                style={{
                  position: "absolute",
                  top: -7,
                  left: -7,
                  zIndex: 3,
                  transform: "rotate(-90deg)",
                  filter: `drop-shadow(0 0 ${4 + progress * 8}px rgba(255,184,0,${0.3 + progress * 0.5}))`,
                }}
              >
                <circle
                  cx="62"
                  cy="62"
                  r="58"
                  stroke={GREEN}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 58}
                  strokeDashoffset={2 * Math.PI * 58 * (1 - progress)}
                  style={{ transition: "stroke-dashoffset 0.05s linear" }}
                />
              </svg>
            )}

            {/* Text */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                zIndex: 4,
              }}
            >
              <AnimatePresence mode="wait">
                {isConfirmed ? (
                  <motion.div
                    key="confirmed"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                      delay: 0.05,
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <motion.path
                        d="M4 12.5L9.5 18L20 6"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.15,
                          ease: "easeOut",
                        }}
                      />
                    </svg>
                    <p
                      style={{
                        color: "#000",
                        fontSize: 11,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      Confirmed
                    </p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="confirm"
                    initial={false}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      color: GREEN,
                      fontSize: phase === "holding" ? 20 : 16,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                      transition: "font-size 0.2s",
                    }}
                  >
                    {phase === "holding"
                      ? `${Math.round(progress * 100)}%`
                      : "CONFIRM"}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Expanding outer glow while holding */}
          {phase === "holding" && (() => {
            const innerEdge = 35; // inner button edge as % of outer circle
            const front = innerEdge + progress * (95 - innerEdge); // glow front moves outward
            const glowOpacity = Math.min(progress * 1.5, 1) * 0.4;
            const glowHex = Math.round(glowOpacity * 255).toString(16).padStart(2, "0");
            const trailHex = Math.round(glowOpacity * 0.3 * 255).toString(16).padStart(2, "0");
            return (
              <div
                style={{
                  position: "absolute",
                  width: 315,
                  height: 315,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, transparent ${Math.max(front - 30, innerEdge - 5)}%, ${GREEN}${trailHex} ${Math.max(front - 15, innerEdge)}%, ${GREEN}${glowHex} ${front}%, transparent ${Math.min(front + 12, 100)}%)`,
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
            );
          })()}

          {/* Continuous ripples while holding */}
          {phase === "holding" &&
            Array.from({ length: RIPPLE_COUNT }).map((_, i) => (
              <motion.div
                key={`hold-ripple-${i}`}
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                  scale: [1, 315 / 110],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut",
                  delay: i * RIPPLE_INTERVAL,
                  repeat: Infinity,
                  repeatDelay: RIPPLE_COUNT * RIPPLE_INTERVAL - 1.2,
                }}
                style={{
                  position: "absolute",
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  border: `0.5px solid ${GREEN}`,
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              />
            ))}

          {/* Ripple rings on confirmed */}
          <AnimatePresence>
            {isConfirmed &&
              Array.from({ length: RIPPLE_COUNT }).map((_, i) => (
                <motion.div
                  key={`ripple-${i}`}
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 315 / 110, opacity: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: i * RIPPLE_INTERVAL,
                  }}
                  style={{
                    position: "absolute",
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    border: `0.5px solid ${GREEN}`,
                    opacity: 0.7 - i * 0.12,
                    zIndex: 1,
                  }}
                />
              ))}
          </AnimatePresence>
        </div>

        {/* Reset / instruction */}
        <AnimatePresence mode="wait">
          {isConfirmed ? (
            <motion.button
              key="reset"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              onClick={reset}
              style={{
                color: "#383838",
                fontSize: 11,
                fontWeight: 500,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 12px",
                height: 24,
              }}
            >
              tap to reset
            </motion.button>
          ) : (
            <motion.p
              key="hint"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                color: "#383838",
                fontSize: 11,
                fontWeight: 500,
                height: 24,
                display: "flex",
                alignItems: "center",
              }}
            >
              hold to confirm
            </motion.p>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}