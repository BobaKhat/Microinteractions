import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "motion/react";

const EarthquakeIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden="true">
    <defs>
      <linearGradient id="eqBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0A0A0B" />
        <stop offset="55%" stopColor="#18181B" />
        <stop offset="100%" stopColor="#3F3F46" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#eqBg)" />
    <rect x="0.5" y="0.5" width="39" height="39" rx="9.5" fill="none" stroke="rgba(255,255,255,0.1)" />
    <path
      d="M7 22.5 H12 L14.2 17 L17.1 27 L19.8 19.5 L22.4 22.5 H27 L29.7 16 L33 22.5"
      fill="none"
      stroke="white"
      strokeWidth="2.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="14.2" cy="17" r="1" fill="white" opacity="0.95" />
    <circle cx="29.7" cy="16" r="1" fill="white" opacity="0.95" />
  </svg>
);

const CONTAINER_W = 310;
const GAP = 5;
const BTN_MAX = 80;
const TOTAL_DRAG = GAP + BTN_MAX + GAP + BTN_MAX;
const SNAP_THRESHOLD = -55;

export default function SwipeNotification() {
  const [dismissed, setDismissed] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const x = useMotionValue(0);

  const btn1Width = useTransform(x, [0, -GAP, -(GAP + BTN_MAX)], [0, 0, BTN_MAX], {
    clamp: true,
  });
  const btn1Opacity = useTransform(x, [-GAP, -(GAP + 25), -(GAP + BTN_MAX)], [0, 0.6, 1], {
    clamp: true,
  });
  const btn1Scale = useTransform(x, [-GAP, -(GAP + 15), -(GAP + BTN_MAX)], [0.3, 0.85, 1], {
    clamp: true,
  });

  const phase2Start = -(GAP + BTN_MAX + GAP);
  const phase2End = -TOTAL_DRAG;
  const btn2Width = useTransform(x, [phase2Start, phase2End], [0, BTN_MAX], {
    clamp: true,
  });
  const btn2Opacity = useTransform(
    x,
    [phase2Start, phase2Start - 25, phase2End],
    [0, 0.6, 1],
    { clamp: true }
  );
  const btn2Scale = useTransform(
    x,
    [phase2Start, phase2Start - 15, phase2End],
    [0.3, 0.85, 1],
    { clamp: true }
  );

  const handleDragEnd = () => {
    const current = x.get();
    if (current < SNAP_THRESHOLD) {
      animate(x, -TOTAL_DRAG, {
        type: "spring",
        stiffness: 400,
        damping: 35,
      });
    } else {
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 35,
      });
    }
  };

  const handleClose = () => {
    animate(x, 0, {
      type: "spring",
      stiffness: 400,
      damping: 35,
    });
  };

  const handleDelete = () => {
    setDismissed(true);
    setTimeout(() => {
      setDismissed(false);
      x.set(0);
      setResetKey((k) => k + 1);
    }, 1200);
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen min-h-[400px] select-none"
      style={{ background: "linear-gradient(180deg, #050506 0%, #101012 45%, #1A1A1D 100%)" }}
    >
      <div style={{ width: CONTAINER_W, height: 64 }} className="relative">
        <AnimatePresence mode="wait">
          {!dismissed ? (
            <motion.div
              key={`notification-${resetKey}`}
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  opacity: { duration: 0.25 },
                  height: { duration: 0.35, delay: 0.1 },
                },
              }}
              className="relative"
              style={{ height: 64 }}
            >
              <div
                className="absolute top-0 right-0 h-full flex items-center"
                style={{ gap: GAP }}
              >
                <motion.button
                  onClick={handleClose}
                  className="h-full rounded-[20px] flex items-center justify-center cursor-pointer overflow-hidden active:bg-[rgba(255,255,255,0.72)] transition-colors border border-white/35"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(212,212,216,0.78))", 
                    width: btn1Width,
                    opacity: btn1Opacity,
                    scale: btn1Scale,
                  }}
                >
                  <span
                    className="text-[13px] text-[#111111] whitespace-nowrap"
                    style={{ fontFamily: "'SF Pro', 'Inter', sans-serif" }}
                  >
                    Mute
                  </span>
                </motion.button>

                <motion.button
                  onClick={handleDelete}
                  className="h-full bg-[rgba(255,59,48,0.15)] rounded-[20px] flex items-center justify-center cursor-pointer overflow-hidden active:bg-[rgba(255,59,48,0.25)] transition-colors"
                  style={{
                    width: btn2Width,
                    opacity: btn2Opacity,
                    scale: btn2Scale,
                  }}
                >
                  <span
                    className="text-[13px] text-[rgba(255,59,48,1)] whitespace-nowrap"
                    style={{ fontFamily: "'SF Pro', 'Inter', sans-serif" }}
                  >
                    Delete
                  </span>
                </motion.button>
              </div>

              <motion.div
                className="absolute top-0 left-0 rounded-[20px] h-[64px] flex items-center cursor-grab active:cursor-grabbing backdrop-blur-md border border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(228,228,231,0.76))", 
                  x,
                  width: CONTAINER_W,
                }}
                drag="x"
                dragConstraints={{ left: -TOTAL_DRAG, right: 0 }}
                dragElastic={0.08}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
              >
                <div
                  className="ml-[12px] rounded-[10px] w-[40px] h-[40px] overflow-hidden flex-shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.18)] ring-1 ring-white/[0.08]"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))" }}
                >
                  <EarthquakeIcon />
                </div>

                <div className="ml-[12px] flex-1 min-w-0 pr-[14px]">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[13px] text-black truncate"
                      style={{
                        fontFamily: "'SF Pro', 'Inter', sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      Earthquake Notification
                    </span>
                    <span
                      className="text-[10px] text-[rgba(0,0,0,0.8)] flex-shrink-0 ml-[8px]"
                      style={{
                        fontFamily: "'SF Pro', 'Inter', sans-serif",
                      }}
                    >
                      8min ago
                    </span>
                  </div>
                  <p
                    className="text-[13px] text-black mt-[2px] truncate"
                    style={{
                      fontFamily: "'SF Pro', 'Inter', sans-serif",
                    }}
                  >
                    A 7.1 earthquake was recorded off Russia
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="dismissed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="h-[64px] flex items-center justify-center"
            >
              <span
                className="text-[13px] text-[rgba(255,255,255,0.35)]"
                style={{ fontFamily: "'SF Pro', 'Inter', sans-serif" }}
              >
                Notification dismissed
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p
        className="mt-4 text-[11px] text-[#383838]"
        style={{ fontFamily: "'SF Pro', 'Inter', sans-serif", fontWeight: 500 }}
      >
        swipe left to reveal actions
      </p>
    </div>
  );
}
