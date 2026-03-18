import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Briefcase } from "lucide-react";

interface Position {
  title: string;
  location: string;
  type: string;
}

interface Category {
  label: string;
  positions: Position[];
  glowColor: string;
}

const CATEGORIES: Category[] = [
  {
    label: "Design",
    positions: [
      { title: "Staff Product Designer", location: "San Francisco", type: "Full-time" },
      { title: "Associate Product Designer", location: "Remote", type: "Full-time" },
      { title: "Brand Designer", location: "New York", type: "Contract" },
    ],
    glowColor: "168, 85, 247", // purple
  },
  {
    label: "Growth",
    positions: [
      { title: "Growth Lead", location: "San Francisco", type: "Full-time" },
      { title: "Growth Analyst", location: "Remote", type: "Full-time" },
    ],
    glowColor: "34, 197, 94", // green
  },
  {
    label: "Marketing",
    positions: [
      { title: "Content Strategist", location: "New York", type: "Full-time" },
      { title: "Performance Marketing Manager", location: "Remote", type: "Full-time" },
      { title: "Social Media Lead", location: "Los Angeles", type: "Contract" },
    ],
    glowColor: "59, 130, 246", // blue
  },
  {
    label: "Engineering",
    positions: [
      { title: "Senior Frontend Engineer", location: "San Francisco", type: "Full-time" },
      { title: "Backend Engineer", location: "Remote", type: "Full-time" },
    ],
    glowColor: "249, 115, 22", // orange
  },
  {
    label: "Product",
    positions: [
      { title: "Senior Product Manager", location: "San Francisco", type: "Full-time" },
      { title: "Associate PM", location: "Remote", type: "Full-time" },
      { title: "Product Ops Lead", location: "New York", type: "Full-time" },
    ],
    glowColor: "236, 72, 153", // pink
  },
];

function CategoryRow({
  category,
  isOpen,
  onToggle,
  isCompressed,
}: {
  category: Category;
  isOpen: boolean;
  onToggle: () => void;
  isCompressed: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, category.positions]);

  return (
    <motion.div
      className="relative"
      animate={{
        scaleY: isCompressed ? 0.97 : 1,
        y: isCompressed ? 2 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 600,
        damping: 25,
      }}
      style={{ transformOrigin: "top center" }}
    >
      {/* Category Header */}
      <motion.button
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full cursor-pointer relative z-10"
        style={{
          padding: "18px 24px",
          borderRadius: 12,
          border: "1px solid",
          borderColor: isOpen
            ? `rgba(${category.glowColor}, 0.3)`
            : "rgba(255,255,255,0.08)",
          backgroundColor: isOpen
            ? `rgba(${category.glowColor}, 0.04)`
            : "rgba(255,255,255,0.03)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "'Inter', sans-serif",
          transition: "border-color 0.3s, background-color 0.3s",
        }}
        animate={{
          boxShadow: isHovered || isOpen
            ? `0 0 20px rgba(${category.glowColor}, 0.15), 0 0 40px rgba(${category.glowColor}, 0.08)`
            : "0 0 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: `rgba(${category.glowColor}, ${isHovered || isOpen ? 0.9 : 0.4})`,
              boxShadow: isHovered || isOpen
                ? `0 0 8px rgba(${category.glowColor}, 0.6)`
                : "none",
              transition: "all 0.3s",
            }}
          />
          <span
            style={{
              color: isHovered || isOpen
                ? "rgba(255,255,255,0.9)"
                : "rgba(255,255,255,0.5)",
              fontSize: "0.95rem",
              fontWeight: 500,
              letterSpacing: "0.01em",
              transition: "color 0.3s",
            }}
          >
            {category.label}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.2)",
              fontSize: "0.75rem",
              marginLeft: 4,
            }}
          >
            {category.positions.length} {category.positions.length === 1 ? "role" : "roles"}
          </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronDown
            size={16}
            style={{
              color: isHovered || isOpen
                ? `rgba(${category.glowColor}, 0.8)`
                : "rgba(255,255,255,0.2)",
              transition: "color 0.3s",
            }}
          />
        </motion.div>
      </motion.button>

      {/* Positions Panel — the dropping part */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="overflow-hidden relative z-0"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: contentHeight + 8,
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { type: "spring", stiffness: 400, damping: 30 },
                opacity: { duration: 0.15 },
              },
            }}
            transition={{
              height: {
                type: "spring",
                stiffness: 170,
                damping: 10,
                mass: 1,
              },
              opacity: { duration: 0.2, delay: 0.05 },
            }}
          >
            <motion.div
              ref={contentRef}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{
                type: "spring",
                stiffness: 170,
                damping: 10,
                mass: 1,
              }}
              style={{
                paddingTop: 6,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {category.positions.map((position, i) => (
                <motion.div
                  key={position.title}
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 22,
                    delay: i * 0.06,
                  }}
                >
                  <PositionCard
                    position={position}
                    glowColor={category.glowColor}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Landing shadow that appears when panel drops */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-0 left-4 right-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              height: 20,
              background: `radial-gradient(ellipse at center, rgba(${category.glowColor}, 0.08) 0%, transparent 70%)`,
              filter: "blur(4px)",
              transform: "translateY(6px)",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PositionCard({
  position,
  glowColor,
}: {
  position: Position;
  glowColor: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer"
      style={{
        padding: "14px 20px",
        borderRadius: 10,
        backgroundColor: hovered
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.02)",
        border: "1px solid",
        borderColor: hovered
          ? `rgba(${glowColor}, 0.15)`
          : "rgba(255,255,255,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.2s",
        fontFamily: "'Inter', sans-serif",
      }}
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex items-center gap-3">
        <Briefcase
          size={14}
          style={{
            color: hovered
              ? `rgba(${glowColor}, 0.7)`
              : "rgba(255,255,255,0.15)",
            transition: "color 0.2s",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            color: hovered
              ? "rgba(255,255,255,0.85)"
              : "rgba(255,255,255,0.5)",
            fontSize: "0.85rem",
            fontWeight: 400,
            transition: "color 0.2s",
          }}
        >
          {position.title}
        </span>
      </div>
      <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
        <span
          style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: "0.7rem",
          }}
        >
          {position.location}
        </span>
        <span
          style={{
            color: `rgba(${glowColor}, ${hovered ? 0.6 : 0.3})`,
            fontSize: "0.65rem",
            padding: "2px 8px",
            borderRadius: 6,
            backgroundColor: `rgba(${glowColor}, ${hovered ? 0.1 : 0.05})`,
            transition: "all 0.2s",
          }}
        >
          {position.type}
        </span>
      </div>
    </motion.div>
  );
}

export function JobAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className="flex items-center justify-center w-full select-none"
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        fontFamily: "'Inter', sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ width: 480, maxWidth: "100%" }}>
        {/* Header */}
        <div className="mb-8">
          <p
            style={{
              color: "rgba(255,255,255,0.2)",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Open positions
          </p>
          <h2
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "1.5rem",
              fontWeight: 500,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Join the team
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((category, index) => {
            // Compress the category directly below the open one
            const isCompressed =
              openIndex !== null && index === openIndex + 1;

            return (
              <CategoryRow
                key={category.label}
                category={category}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                isCompressed={isCompressed}
              />
            );
          })}
        </div>

        {/* Hint */}
        <p
          className="text-center mt-8"
          style={{
            color: "rgba(255,255,255,0.08)",
            fontSize: "0.65rem",
            letterSpacing: "0.05em",
          }}
        >
          Click a category to explore roles
        </p>
      </div>
    </div>
  );
}