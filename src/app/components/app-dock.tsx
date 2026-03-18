import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const imgInstagram = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png";
const imgSpotify = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/512px-Spotify_icon.svg.png";
const imgLinkedIn = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/600px-LinkedIn_logo_initials.png";
const imgNetflix = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Netflix_2015_N_logo.svg/400px-Netflix_2015_N_logo.svg.png";
const imgCinema4D = "https://upload.wikimedia.org/wikipedia/en/d/d8/C4D_Logo.png";
const imgFigma = "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg";

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
        maxWidth: "100%",
        backgroundColor: "#141414",
        userSelect: "none",
        WebkitUserSelect: "none",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
