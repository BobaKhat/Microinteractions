import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "./svg-dwrnwqtxbx";

function Avatar({ size = 98 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "#a6136e",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          color: "#fff",
          fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
          fontWeight: 590,
          fontSize: size * 0.61,
          lineHeight: 1,
        }}
      >
        B
      </span>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="75"
      height="75"
      viewBox="0 0 75 75"
      fill="none"
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect width="75" height="75" rx="37.5" fill="#00D54B" />
      <path d={svgPaths.p74d4980} fill="white" />
    </svg>
  );
}

const expandSpring = { type: "spring" as const, stiffness: 380, damping: 30 };
const collapseSpring = { type: "spring" as const, stiffness: 350, damping: 24 };

/* Content width uses a smooth tween — springs on width cause oscillation/deform */
const contentTransition = {
  width: { type: "tween" as const, duration: 0.32, ease: [0.4, 0, 0.2, 1] as const },
  opacity: { duration: 0.15 },
};

const GLOW =
  "0px 0px 50px 4px rgba(166,19,110,0.45), inset 0 0 0 0.9px #a6136e";

export function MessageReveal() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [questionMarks, setQuestionMarks] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isExpanded) {
      setQuestionMarks(0);
      intervalRef.current = setInterval(() => {
        setQuestionMarks((prev) => {
          if (prev >= 8) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setQuestionMarks(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isExpanded]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#000",
        fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "40px 20px",
        gap: 40,
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* Main pill — glow lives on this element so overflow doesn't clip it */}
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        animate={{
          boxShadow: GLOW,
          borderRadius: isExpanded ? 90 : 300,
          padding: isExpanded ? 45 : 30,
        }}
        transition={isExpanded ? expandSpring : collapseSpring}
        style={{
          backgroundColor: "#1e1b1b",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          borderRadius: 300,
          padding: 30,
          gap: 0,
          boxShadow: GLOW,
        }}
      >
        {/* Avatar */}
        <Avatar />

        {/* Text + Check */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="content"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={contentTransition}
              style={{
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {/* 15px spacer after avatar */}
              <div style={{ width: 25, flexShrink: 0 }} />

              <p
                style={{
                  color: "#d9d9d9",
                  fontSize: 36,
                  fontWeight: 400,
                  lineHeight: "normal",
                  fontFamily:
                    "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                Did you read my slack message
                {"?".repeat(questionMarks)}
              </p>

              {/* 15px spacer before checkmark */}
              <div style={{ width: 25, flexShrink: 0 }} />

              <CheckIcon />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Status text */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: isExpanded
              ? "#a6136e"
              : "rgba(166,19,110,0.3)",
            boxShadow: isExpanded
              ? "0 0 8px rgba(166,19,110,0.5)"
              : "none",
            transition: "all 0.3s ease",
          }}
        />
        <span
          style={{
            color: isExpanded
              ? "rgba(166,19,110,0.6)"
              : "rgba(255,255,255,0.3)",
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            transition: "color 0.3s ease",
          }}
        >
          {isExpanded
            ? "Message shown — tap to dismiss"
            : "Tap icon to reveal"}
        </span>
      </div>
    </div>
  );
}
