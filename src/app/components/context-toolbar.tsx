import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "../../imports/svg-fcz7tka2ul";

type ActionState = "idle" | "confirmed";

interface ButtonState {
  copy: ActionState;
  paste: ActionState;
  delete: ActionState;
}

// ── Animated confirmation icons ─────────────────────────────────────────

function AnimatedCheckmark() {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <motion.path
        d="M4 12.5L9.5 18L20 6"
        stroke="#00D54B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
      />
    </motion.svg>
  );
}

function AnimatedArrow() {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      {/* Arrow line */}
      <motion.path
        d="M4 12H18"
        stroke="#0C8CF3"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
      />
      {/* Arrow head */}
      <motion.path
        d="M13 7L18 12L13 17"
        stroke="#0C8CF3"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.2 }}
      />
    </motion.svg>
  );
}

function AnimatedXCircle() {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      {/* X mark — appears first */}
      <motion.path
        d="M9 9L15 15"
        stroke="#CA0000"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
      />
      <motion.path
        d="M15 9L9 15"
        stroke="#CA0000"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, ease: "easeOut", delay: 0.12 }}
      />
      {/* Circle — draws after X */}
      <motion.circle
        cx="12"
        cy="12"
        r="9"
        stroke="#CA0000"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 }}
      />
    </motion.svg>
  );
}

// ── Copy icon (clipboard from Figma) ────────────────────────────────────

function CopyIcon() {
  return (
    <div className="h-[30px] relative shrink-0 w-[25.7px]">
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 25.7143 29.9998"
      >
        <path d={svgPaths.pfe4dc80} fill="#4B4949" />
        <path d={svgPaths.p33080880} fill="#00D54B" />
      </svg>
    </div>
  );
}

function PasteIcon() {
  return (
    <div className="h-[30px] relative shrink-0 w-[26px]">
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 26 30"
      >
        <path
          clipRule="evenodd"
          d={svgPaths.p1516e680}
          fill="#0C8CF3"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}

function DeleteIcon() {
  return (
    <div className="h-[30px] relative shrink-0 w-[24px]">
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 30"
      >
        <path d={svgPaths.p2f677280} fill="#CA0000" />
      </svg>
    </div>
  );
}

// ── Main toolbar component ──────────────────────────────────────────────

export function ContextToolbar() {
  const [states, setStates] = useState<ButtonState>({
    copy: "idle",
    paste: "idle",
    delete: "idle",
  });

  const [hovered, setHovered] = useState<string | null>(null);

  const timeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const handleClick = useCallback((action: keyof ButtonState) => {
    // Clear existing timeout for this action
    if (timeouts.current[action]) {
      clearTimeout(timeouts.current[action]);
    }

    setStates((prev) => ({ ...prev, [action]: "confirmed" }));

    // Reset after delay
    timeouts.current[action] = setTimeout(() => {
      setStates((prev) => ({ ...prev, [action]: "idle" }));
    }, 1800);
  }, []);

  const buttons = [
    {
      key: "copy" as const,
      icon: <CopyIcon />,
      label: "Copy",
      color: "#00D54B",
      confirmIcon: <AnimatedCheckmark />,
    },
    {
      key: "paste" as const,
      icon: <PasteIcon />,
      label: "Paste",
      color: "#0C8CF3",
      confirmIcon: <AnimatedArrow />,
    },
    {
      key: "delete" as const,
      icon: <DeleteIcon />,
      label: "Delete",
      color: "#CA0000",
      confirmIcon: <AnimatedXCircle />,
    },
  ];

  return (
    <div className="bg-transparent flex flex-col items-center justify-center w-full h-full min-h-[400px] select-none">
      <div className="bg-[#0d0d0d] rounded-[12px] relative">
        <div className="flex gap-[25px] items-center px-[20px] py-[15px]">
          {buttons.map((btn) => {
            const isConfirmed = states[btn.key] === "confirmed";

            return (
              <motion.button
                key={btn.key}
                className="flex gap-[8px] items-center justify-center p-[10px] rounded-[5px] cursor-pointer relative overflow-hidden"
                style={{ minWidth: 77, minHeight: 50 }}
                onClick={() => handleClick(btn.key)}
                onMouseEnter={() => setHovered(btn.key)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                {/* Icon — always visible */}
                {btn.icon}

                {/* Text or confirmation icon */}
                <div className="relative w-[40px] h-[18px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {!isConfirmed ? (
                      <motion.span
                        key="label"
                        className="absolute whitespace-nowrap text-[12px] text-center"
                        style={{
                          fontFamily: "'SF Pro', 'Inter', sans-serif",
                          fontWeight: 510,
                          color:
                            hovered === btn.key ? btn.color : "#535257",
                          transition: "color 0.15s ease",
                        }}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                      >
                        {btn.label}
                      </motion.span>
                    ) : (
                      <motion.div
                        key="confirm"
                        className="absolute flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 25,
                        }}
                      >
                        {btn.confirmIcon}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>
        {/* Border overlay matching Figma */}
        <div
          aria-hidden="true"
          className="absolute border border-[#222222] border-solid inset-0 pointer-events-none rounded-[12px]"
        />
      </div>
    </div>
  );
}