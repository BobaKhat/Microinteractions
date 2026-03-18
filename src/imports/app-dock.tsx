import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import imgInstagram from "figma:asset/0794d5602914bfd59dcbd6f00460104b3fa38ae8.png";
import imgSpotify from "figma:asset/430fad33956f69f9e618610c724f86bc968db5d0.png";
import imgLinkedIn from "figma:asset/73d6004f1781089fa72bc21ff51349707d6e56f6.png";
import imgNetflix from "figma:asset/af755da27f101cfedd13463d030ae9b08404b46a.png";
import imgCinema4D from "figma:asset/00e85cfa4897cd5ab0543cc6ad48ee6c7d5ea1c7.png";
import imgFigma from "figma:asset/92cacf313bd37f358c3db5a725e5c38d366ac1fc.png";

interface AppItem {
  id: string;
  name: string;
  img: string;
  color: string; // brand color for glow + dot
}

const apps: AppItem[] = [
  { id: "instagram", name: "Instagram", img: imgInstagram, color: "#E1306C" },
  { id: "spotify", name: "Spotify", img: imgSpotify, color: "#1DB954" },
  { id: "linkedin", name: "LinkedIn", img: imgLinkedIn, color: "#0A66C2" },
  { id: "netflix", name: "Netflix", img: imgNetflix, color: "#E50914" },
  { id: "cinema4d", name: "Cinema 4D", img: imgCinema4D, color: "#4A6CF7" },
  { id: "figma", name: "Figma", img: imgFigma, color: "#A259FF" },
];

function DockIcon({ app }: { app: AppItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: 45, height: 45 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Colored dot that appears when icon jumps up */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              marginLeft: -3,
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: app.color,
              boxShadow: `0 0 8px 2px ${app.color}60`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon that jumps up */}
      <motion.div
        animate={{
          y: hovered ? -28 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 15,
          mass: 0.6,
        }}
        style={{
          width: 45,
          height: 45,
          borderRadius: 10,
          position: "relative",
          cursor: "pointer",
          overflow: "visible",
        }}
      >
        {/* Glow behind icon */}
        <motion.div
          animate={{
            opacity: hovered ? 1 : 0,
            scale: hovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: -12,
            borderRadius: 18,
            background: `radial-gradient(circle, ${app.color}40 0%, ${app.color}18 40%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Logo image */}
        <img
          alt={app.name}
          src={app.img}
          draggable={false}
          style={{
            width: 45,
            height: 45,
            borderRadius: 10,
            objectFit: "cover",
            position: "relative",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      </motion.div>
    </div>
  );
}

export function AppDock() {
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
        userSelect: "none",
        WebkitUserSelect: "none",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <p style={{ color: "#505050", fontSize: 13, fontWeight: 500 }}>
          App Dock
        </p>

        <div
          style={{
            backgroundColor: "#0e0e0e",
            borderRadius: 20,
            padding: 15,
            display: "flex",
            gap: 15,
            alignItems: "center",
            position: "relative",
            border: "0.5px solid #313131",
          }}
        >
          {apps.map((app) => (
            <DockIcon key={app.id} app={app} />
          ))}
        </div>

        <p
          style={{
            color: "#383838",
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          hover to lift
        </p>
      </div>
    </div>
  );
}