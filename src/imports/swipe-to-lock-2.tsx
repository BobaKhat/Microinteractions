import { useState, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
  type PanInfo,
} from "motion/react";

const TRACK_WIDTH = 520;
const HANDLE_SIZE = 130;
const TRACK_HEIGHT = 160;
const PADDING = 15;
const MAX_DRAG = TRACK_WIDTH - HANDLE_SIZE - PADDING * 2;
const LOCK_THRESHOLD = MAX_DRAG * 0.65;

// Chevron SVG (the ">" arrow from the Figma design)
function ChevronIcon() {
  return (
    <svg
      width="32"
      height="56"
      viewBox="0 0 46 80"
      fill="none"
      style={{ position: "absolute" }}
    >
      <path
        clipRule="evenodd"
        d="M44.171 44.4437L8.83296 80L0 71.1125L30.9216 40L0 8.88749L8.83296 0L44.171 35.5563C45.3421 36.7349 46 38.3333 46 40C46 41.6666 45.3421 43.2651 44.171 44.4437Z"
        fill="#B4E85A"
        fillRule="evenodd"
      />
    </svg>
  );
}

// Lock SVG (the padlock from the Figma design)
function LockIcon({ opacity = 1 }: { opacity: number }) {
  return (
    <motion.svg
      width="38"
      height="48"
      viewBox="0 0 56 70"
      fill="none"
      style={{ opacity, position: "absolute" }}
    >
      <path
        d="M7 70H49C52.85 70 56 66.85 56 63V31.5C56 27.65 52.85 24.5 49 24.5H45.5V17.5C45.5 7.84 37.66 0 28 0C18.34 0 10.5 7.84 10.5 17.5V24.5H7C3.15 24.5 0 27.65 0 31.5V63C0 66.85 3.15 70 7 70ZM17.5 17.5C17.5 11.725 22.225 7 28 7C33.775 7 38.5 11.725 38.5 17.5V24.5H17.5V17.5Z"
        fill="#C7FF67"
      />
    </motion.svg>
  );
}

// Animated lock that transitions from unlocked (shackle raised) to locked
function AnimatedLockIcon({
  isLocked,
  lockIconOpacity,
}: {
  isLocked: boolean;
  lockIconOpacity: ReturnType<typeof useTransform>;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: lockIconOpacity,
      }}
    >
      {/* Impact glow behind the lock */}
      <motion.div
        style={{
          position: "absolute",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(199,255,103,0.4) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isLocked
            ? {
                scale: [0, 2.2, 0],
                opacity: [0, 0.8, 0],
              }
            : { scale: 0, opacity: 0 }
        }
        transition={{
          duration: 0.6,
          ease: "easeOut",
          delay: 0.15,
        }}
      />

      <motion.svg
        width="38"
        height="52"
        viewBox="-4 -12 64 82"
        fill="none"
        initial={{ scale: 1 }}
        animate={
          isLocked
            ? {
                scale: [1, 1.35, 0.9, 1.1, 1],
                rotate: [0, -3, 3, -1.5, 0],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{
          duration: 0.6,
          ease: "easeOut",
          times: [0, 0.25, 0.45, 0.7, 1],
          delay: 0.1,
        }}
      >
        {/* Lock body */}
        <rect x="0" y="24.5" width="56" height="45.5" rx="7" fill="#C7FF67" />
        {/* Keyhole */}
        <circle cx="28" cy="44" r="6" fill="#1a1a0a" />
        <rect x="25" y="44" width="6" height="12" rx="2" fill="#1a1a0a" />
        {/* Shackle - animates from raised/open to closed */}
        <motion.path
          d="M17.5 24.5V17.5C17.5 11.725 22.225 7 28 7C33.775 7 38.5 11.725 38.5 17.5V24.5"
          stroke="#C7FF67"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          initial={{ y: -18, rotate: 35 }}
          animate={{
            y: isLocked ? 0 : -18,
            rotate: isLocked ? 0 : 35,
          }}
          style={{ originX: "70%", originY: "100%" }}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 10,
            mass: 0.5,
          }}
        />
      </motion.svg>
    </motion.div>
  );
}

export function SwipeToLock() {
  const [isLocked, setIsLocked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Derived values from drag position
  const chevronOpacity = useTransform(x, [MAX_DRAG * 0.85, MAX_DRAG * 0.9], [1, 0]);
  const lockIconOpacity = useTransform(x, [MAX_DRAG * 0.9, MAX_DRAG * 0.95], [0, 1]);
  const textOpacity = useTransform(x, [0, MAX_DRAG * 0.4], [1, 0]);

  // Track progressively darkens as you slide
  const trackBg = useTransform(
    x,
    [0, MAX_DRAG],
    ["rgba(180,232,90,0.15)", "rgba(180,232,90,0.05)"]
  );

  // Handle: starts as solid black circle, transitions to glass (#B4E85A at 15%)
  // then locked state is 5% opacity
  const handleBg = useTransform(
    x,
    [0, MAX_DRAG * 0.4, MAX_DRAG],
    ["rgba(0,0,0,1)", "rgba(180,232,90,0.12)", "rgba(180,232,90,0.15)"]
  );
  const handleGlassOpacity = useTransform(
    x,
    [0, MAX_DRAG * 0.3, MAX_DRAG],
    [0, 0.6, 1]
  );
  const handleGlow = useTransform(
    x,
    [0, MAX_DRAG],
    [
      "0 0 15px 3px rgba(0,0,0,0.8)",
      "0 0 15px 3px rgba(180,232,90,0.3)",
    ]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      setIsDragging(false);
      const currentX = x.get();

      if (currentX >= LOCK_THRESHOLD) {
        // Snap to locked
        animate(x, MAX_DRAG, {
          type: "spring",
          stiffness: 400,
          damping: 25,
        });
        setIsLocked(true);
      } else {
        // Snap back
        animate(x, 0, {
          type: "spring",
          stiffness: 500,
          damping: 30,
        });
      }
    },
    [x]
  );

  const handleReset = useCallback(() => {
    if (isLocked) {
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 25,
      });
      setIsLocked(false);
    }
  }, [isLocked, x]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full select-none"
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        fontFamily: "'Inter', sans-serif",
        padding: "40px 20px",
        gap: 40,
      }}
    >
      {/* Track */}
      <div
        ref={trackRef}
        style={{
          position: "relative",
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          maxWidth: "95vw",
        }}
      >
        {/* Track background - progressively darkens via motion value */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 100,
            backgroundColor: trackBg,
            overflow: "hidden",
            borderWidth: 1.5,
            borderStyle: "solid",
          }}
          animate={{
            borderColor: isLocked
              ? "rgba(180,232,90,0.25)"
              : "rgba(180,232,90,0)",
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Shimmer effect when unlocked */}
          <AnimatePresence>
            {!isLocked && (
              <motion.div
                key="shimmer"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(180,232,90,0.08) 50%, transparent 100%)",
                }}
                animate={{
                  x: ["-100%", "100%"],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1,
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Center text */}
        <motion.p
          style={{
            position: "absolute",
            top: "50%",
            left: PADDING + HANDLE_SIZE,
            right: PADDING,
            transform: "translateY(-50%)",
            color: "#C7FF67",
            fontSize: "2rem",
            fontWeight: 300,
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
            textShadow: "0px 0px 10px rgba(0,0,0,0.8)",
            pointerEvents: "none",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          <motion.span style={{ opacity: isLocked ? 0 : textOpacity }}>
            Swipe to lock
          </motion.span>
          <motion.span
            style={{
              position: "absolute",
              left: -PADDING - HANDLE_SIZE,
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLocked ? 1 : 0 }}
            transition={{ duration: 0.3, delay: isLocked ? 0.1 : 0 }}
          >
            Locked
          </motion.span>
        </motion.p>

        {/* Draggable handle */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: MAX_DRAG }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{
            x,
            position: "absolute",
            top: PADDING,
            left: PADDING,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            zIndex: 10,
            cursor: isLocked ? "pointer" : "grab",
          }}
          onClick={handleReset}
          whileTap={!isLocked ? { scale: 0.95 } : undefined}
        >
          {/* Handle circle with glass texture */}
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: handleBg,
              boxShadow: handleGlow,
              position: "relative",
              overflow: "hidden",
              borderWidth: 2,
              borderStyle: "solid",
              borderColor: "#B4E85A",
            }}
            animate={{
              scale: isDragging ? 1.05 : 1,
              borderColor: isLocked ? "rgba(180,232,90,0.5)" : "#B4E85A",
              backgroundColor: isLocked ? "rgba(180,232,90,0.05)" : undefined,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            {/* Glass effect layers — simulating Figma Glass (light -38°, refraction 80, depth 100) */}

            {/* Primary light reflection — -38° angle (upper-left-ish) */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "linear-gradient(-38deg, transparent 30%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.25) 60%, transparent 75%)",
                pointerEvents: "none",
                opacity: handleGlassOpacity,
              }}
            />

            {/* Secondary caustic / refraction highlight */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "radial-gradient(ellipse at 35% 25%, rgba(200,240,120,0.12) 0%, transparent 50%)",
                pointerEvents: "none",
                opacity: handleGlassOpacity,
              }}
            />

            {/* Depth ring — bright inner edge from high depth value */}
            <motion.div
              style={{
                position: "absolute",
                inset: 2,
                borderRadius: "50%",
                border: "1px solid rgba(180,232,90,0.15)",
                pointerEvents: "none",
                opacity: handleGlassOpacity,
              }}
            />

            {/* Bottom edge shadow for glass depth */}
            <motion.div
              style={{
                position: "absolute",
                bottom: "5%",
                left: "15%",
                right: "15%",
                height: "35%",
                borderRadius: "50%",
                background: "linear-gradient(0deg, rgba(0,0,0,0.2) 0%, transparent 100%)",
                pointerEvents: "none",
                opacity: handleGlassOpacity,
              }}
            />

            {/* Dispersion — subtle color fringe at edges */}
            <motion.div
              style={{
                position: "absolute",
                inset: -1,
                borderRadius: "50%",
                boxShadow: "inset 0 0 12px 2px rgba(180,232,90,0.08), inset 0 0 4px 1px rgba(200,255,100,0.05)",
                pointerEvents: "none",
                opacity: handleGlassOpacity,
              }}
            />

            {/* Chevron icon (unlocked state) */}
            <motion.div
              style={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: chevronOpacity,
              }}
            >
              <ChevronIcon />
            </motion.div>

            {/* Animated lock icon (transitions in during drag) */}
            <AnimatedLockIcon
              isLocked={isLocked}
              lockIconOpacity={lockIconOpacity}
            />
          </motion.div>
        </motion.div>

        {/* Success pulse ring on lock */}
        {isLocked && (
          <motion.div
            style={{
              position: "absolute",
              top: PADDING,
              right: PADDING,
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              borderRadius: "50%",
              border: "2px solid rgba(180,232,90,0.4)",
              pointerEvents: "none",
            }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
      </div>

      {/* Status indicator */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
          }}
          animate={{
            backgroundColor: isLocked ? "#C7FF67" : "rgba(180,232,90,0.3)",
            boxShadow: isLocked
              ? "0 0 8px rgba(199,255,103,0.5)"
              : "0 0 0px rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
          animate={{
            color: isLocked
              ? "rgba(199,255,103,0.5)"
              : "rgba(255,255,255,0.3)",
          }}
          transition={{ duration: 0.3 }}
        >
          {isLocked ? "Secured — tap to unlock" : "Drag handle to lock"}
        </motion.span>
      </motion.div>
    </div>
  );
}