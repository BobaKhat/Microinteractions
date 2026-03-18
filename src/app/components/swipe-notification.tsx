import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "motion/react";
const imgAppIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png";

const CONTAINER_W = 310;
const GAP = 5;
const BTN_MAX = 80;
// Total drag = gap + btn + gap + btn
const TOTAL_DRAG = GAP + BTN_MAX + GAP + BTN_MAX; // 170
const SNAP_THRESHOLD = -55;

export function SwipeNotification() {
  const [dismissed, setDismissed] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const x = useMotionValue(0);

  // revealed = how much space is exposed on the right (positive value)
  // As card slides left by `x` (negative), revealed = -x

  // Btn1 (Mute): appears first, grows in the revealed gap
  // It starts growing after the initial GAP, from 0 → BTN_MAX
  const btn1Width = useTransform(x, [0, -GAP, -(GAP + BTN_MAX)], [0, 0, BTN_MAX], {
    clamp: true,
  });
  const btn1Opacity = useTransform(x, [-GAP, -(GAP + 25), -(GAP + BTN_MAX)], [0, 0.6, 1], {
    clamp: true,
  });
  const btn1Scale = useTransform(x, [-GAP, -(GAP + 15), -(GAP + BTN_MAX)], [0.3, 0.85, 1], {
    clamp: true,
  });

  // Btn2 (Delete): appears after btn1 is full
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
    <div className="bg-[#141414] flex flex-col items-center justify-center w-full h-full min-h-[400px] select-none">
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
              {/* Action buttons — absolutely positioned on the right, 
                  anchored to the right edge of the container */}
              <div
                className="absolute top-0 right-0 h-full flex items-center"
                style={{ gap: GAP }}
              >
                {/* Mute */}
                <motion.button
                  onClick={handleClose}
                  className="h-full bg-[rgba(255,255,255,0.8)] rounded-[20px] flex items-center justify-center cursor-pointer overflow-hidden active:bg-[rgba(255,255,255,0.65)] transition-colors"
                  style={{
                    width: btn1Width,
                    opacity: btn1Opacity,
                    scale: btn1Scale,
                  }}
                >
                  <span
                    className="text-[13px] text-black whitespace-nowrap"
                    style={{ fontFamily: "'SF Pro', 'Inter', sans-serif" }}
                  >
                    Mute
                  </span>
                </motion.button>

                {/* Delete */}
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

              {/* Notification card — slides left */}
              <motion.div
                className="absolute top-0 left-0 bg-[rgba(255,255,255,0.8)] rounded-[20px] h-[64px] flex items-center cursor-grab active:cursor-grabbing"
                style={{
                  x,
                  width: CONTAINER_W,
                }}
                drag="x"
                dragConstraints={{ left: -TOTAL_DRAG, right: 0 }}
                dragElastic={0.08}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
              >
                {/* App icon */}
                <div className="ml-[12px] bg-white rounded-[10px] w-[40px] h-[40px] overflow-hidden flex-shrink-0">
                  <img
                    src={imgAppIcon}
                    alt="Earthquake app"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* Content */}
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
                    An 7.1 Earthquake was recorded off Russia
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

        {/* Hint text removed */}
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
