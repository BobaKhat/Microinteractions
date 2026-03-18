import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// ── Brand icons as inline SVGs ──────────────────────────────────────────

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const BlenderIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
    <path d="M12.51 13.214c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 012.212-.79c.85 0 1.631.3 2.211.79.592.5.983 1.206 1.028 2.005.045.823-.285 1.586-.865 2.153a3.389 3.389 0 01-2.374.938 3.393 3.393 0 01-2.376-.938c-.58-.567-.91-1.33-.866-2.152M12 3.209S1.1 12.267 1.067 12.29c-.547.418-.866 1.07-.866 1.777 0 1.263 1.073 2.286 2.395 2.286.347 0 .68-.073.985-.207l.023.02 2.196-.961a5.464 5.464 0 001.635 2.328 5.506 5.506 0 003.527 1.358h.006a5.502 5.502 0 003.527-1.358 5.453 5.453 0 001.635-2.328l2.196.961.023-.02c.305.134.638.207.985.207 1.322 0 2.395-1.023 2.395-2.286 0-.707-.319-1.359-.866-1.777C20.9 12.267 12 3.209 12 3.209z" />
  </svg>
);

const C4DIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="700" fill="white">C4D</text>
  </svg>
);

const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
    <path d="M4.585 6.836h8.536c1.26 0 2.28 1.058 2.28 2.365v4.29l3.963-2.785a.726.726 0 011.136.601v5.386a.726.726 0 01-1.136.601l-3.963-2.785v1.11c0 1.307-1.02 2.365-2.28 2.365H4.585c-1.26 0-2.28-1.058-2.28-2.365V9.201c0-1.307 1.02-2.365 2.28-2.365z" />
  </svg>
);

const FigmaIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
    <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zM8.148 24c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.014 4.539-4.588 4.539zm-.001-7.509a3.023 3.023 0 00-3.019 3.019c0 1.665 1.365 3.07 3.02 3.019 1.674-.05 3.056-1.442 3.056-3.117V16.49l-3.057.001zM8.148 8.981c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981H8.148zm0-7.51a3.023 3.023 0 00-3.019 3.02 3.023 3.023 0 003.019 3.019h3.117V1.471H8.148zM8.148 15.02c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98H8.148zm0-7.51a3.023 3.023 0 00-3.019 3.02 3.023 3.023 0 003.019 3.019h3.117V7.51H8.148zM15.852 15.02h-4.588V6.04h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm0-7.51h-3.117v5.96h3.117c1.665 0 3.019-1.355 3.019-3.02s-1.355-3.02-3.019-3.02z" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <text x="12" y="18" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="700" fill="white" stroke="none">13</text>
  </svg>
);

const MessagesIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
    <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const GmailIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);

// ── App data ────────────────────────────────────────────────────────────

interface AppItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  gradient: string;
  description: string;
}

const apps: AppItem[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: <InstagramIcon />,
    gradient: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
    description: "Stories & Reels",
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: <SpotifyIcon />,
    gradient: "linear-gradient(135deg, #1DB954, #168D40)",
    description: "Now Playing",
  },
  {
    id: "blender",
    name: "Blender",
    icon: <BlenderIcon />,
    gradient: "linear-gradient(135deg, #E87D0D, #DC6601)",
    description: "3D Modeling",
  },
  {
    id: "c4d",
    name: "Cinema 4D",
    icon: <C4DIcon />,
    gradient: "linear-gradient(135deg, #011A3C, #0A3D7F)",
    description: "Motion Design",
  },
  {
    id: "zoom",
    name: "Zoom",
    icon: <ZoomIcon />,
    gradient: "linear-gradient(135deg, #2D8CFF, #0B5CFF)",
    description: "Meeting at 3pm",
  },
  {
    id: "figma",
    name: "Figma",
    icon: <FigmaIcon />,
    gradient: "linear-gradient(135deg, #A259FF, #F24E1E)",
    description: "Design System",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: <CalendarIcon />,
    gradient: "linear-gradient(135deg, #FF3B30, #D63029)",
    description: "3 events today",
  },
  {
    id: "messages",
    name: "Messages",
    icon: <MessagesIcon />,
    gradient: "linear-gradient(135deg, #34C759, #28A745)",
    description: "2 unread",
  },
  {
    id: "settings",
    name: "Settings",
    icon: <SettingsIcon />,
    gradient: "linear-gradient(135deg, #636366, #48484A)",
    description: "Preferences",
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: <GmailIcon />,
    gradient: "linear-gradient(135deg, #EA4335, #C5221F)",
    description: "5 new emails",
  },
];

// ── Hexagonal layout positions ──────────────────────────────────────────
// Honeycomb layout: offset rows to create hex pattern
// Using a tighter spacing for Apple Watch feel

const ICON_SIZE = 64;
const GAP = 8;
const TOTAL = ICON_SIZE + GAP;

// Hex grid positions (col, row) with row offset
// Layout:
//     0 1 2       (row 0, 3 items)
//    0 1 2 3      (row 1, 4 items, offset left)
//     0 1 2       (row 2, 3 items)

function getHexPositions(): { x: number; y: number }[] {
  const rowHeight = TOTAL * 0.87; // vertical spacing for hex
  const positions: { x: number; y: number }[] = [];

  // Row 0: 3 icons (offset right by half)
  for (let i = 0; i < 3; i++) {
    positions.push({
      x: i * TOTAL + TOTAL * 0.5,
      y: 0,
    });
  }
  // Row 1: 4 icons
  for (let i = 0; i < 4; i++) {
    positions.push({
      x: i * TOTAL,
      y: rowHeight,
    });
  }
  // Row 2: 3 icons (offset right by half)
  for (let i = 0; i < 3; i++) {
    positions.push({
      x: i * TOTAL + TOTAL * 0.5,
      y: rowHeight * 2,
    });
  }

  return positions;
}

const hexPositions = getHexPositions();

// ── Jiggle keyframes via CSS ────────────────────────────────────────────
const jiggleKeyframes = `
@keyframes jiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}
`;

// ── Component ───────────────────────────────────────────────────────────

export function AppleWatchGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const gridWidth = 4 * TOTAL;
  const gridHeight = TOTAL * 0.87 * 2 + ICON_SIZE;

  const handleClick = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const expandedApp = apps.find((a) => a.id === expandedId);
  const expandedIndex = expandedApp ? apps.indexOf(expandedApp) : -1;
  const expandedPos = expandedIndex >= 0 ? hexPositions[expandedIndex] : null;

  return (
    <div style={{ width: "100%", maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "center" }} className="select-none">
      <style>{jiggleKeyframes}</style>

      <div
        className="relative"
        style={{ width: gridWidth, height: gridHeight }}
      >
        {apps.map((app, i) => {
          const pos = hexPositions[i];
          const isExpanded = expandedId === app.id;
          const isHovered = hoveredId === app.id;
          const someExpanded = expandedId !== null;

          // Calculate displacement when another icon is expanded
          let displaceX = 0;
          let displaceY = 0;

          if (someExpanded && !isExpanded && expandedPos) {
            const dx = pos.x - expandedPos.x;
            const dy = pos.y - expandedPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
              const pushStrength = Math.max(0, 1 - dist / (TOTAL * 3)) * 45;
              displaceX = (dx / dist) * pushStrength;
              displaceY = (dy / dist) * pushStrength;
            }
          }

          return (
            <motion.div
              key={app.id}
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                left: pos.x,
                top: pos.y,
                zIndex: isExpanded ? 50 : 1,
              }}
              animate={{
                x: isExpanded ? (gridWidth / 2 - pos.x - ICON_SIZE / 2) : displaceX,
                y: isExpanded ? (gridHeight / 2 - pos.y - ICON_SIZE / 2) : displaceY,
                scale: isExpanded ? 2.8 : someExpanded && !isExpanded ? 0.7 : 1,
                opacity: someExpanded && !isExpanded ? 0.3 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 0.8,
              }}
              onClick={() => handleClick(app.id)}
              onHoverStart={() => setHoveredId(app.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: app.gradient,
                  animation: isHovered && !isExpanded ? "jiggle 0.3s ease-in-out infinite" : "none",
                  boxShadow: isExpanded
                    ? "0 0 40px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.5)"
                    : "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                {app.icon}
              </div>
            </motion.div>
          );
        })}

        {/* Expanded overlay info */}
        <AnimatePresence>
          {expandedApp && expandedPos && (
            <motion.div
              key="expanded-info"
              className="absolute flex flex-col items-center pointer-events-none"
              style={{
                left: 0,
                top: 0,
                width: gridWidth,
                height: gridHeight,
                zIndex: 40,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              <div
                className="absolute flex flex-col items-center gap-[4px]"
                style={{
                  left: gridWidth / 2,
                  top: gridHeight / 2 + ICON_SIZE * 1.6,
                  transform: "translateX(-50%)",
                }}
              >
                <span className="font-['Inter',sans-serif] text-white text-[14px] tracking-wide">
                  {expandedApp.name}
                </span>
                <span className="font-['Inter',sans-serif] text-[#888] text-[11px]">
                  {expandedApp.description}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hint text */}
      <AnimatePresence>
        {!expandedId && (
          <motion.p
            className="mt-[24px] font-['Inter',sans-serif] text-[12px] text-[#555] tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Hover & click to interact
          </motion.p>
        )}
      </AnimatePresence>

    </div>
  );
}