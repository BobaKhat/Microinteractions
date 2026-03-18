import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ───────── SVG Paths (from Figma) ───────── */
const PATHS = {
  design:
    "M13.0986 5.00752C13.4807 4.62741 13.4807 4.00798 13.0986 3.62787L11.6928 2.22208L11.6948 2.2241C11.3227 1.85203 10.6832 1.21249 9.77816 0.309487C9.3518 -0.10682 8.66198 -0.102798 8.23964 0.319543L0.319755 8.23339C0.218426 8.33404 0.138008 8.45373 0.08313 8.58558C0.0282523 8.71743 0 8.85884 0 9.00165C0 9.14447 0.0282523 9.28587 0.08313 9.41772C0.138008 9.54957 0.218426 9.66927 0.319755 9.76991L8.23763 17.6817C8.44177 17.8855 8.71844 18 9.00689 18C9.29534 18 9.57201 17.8855 9.77615 17.6817L13.0966 14.3634C13.4787 13.9833 13.4787 13.3638 13.0966 12.9837C12.913 12.8011 12.6646 12.6986 12.4057 12.6986C12.1468 12.6986 11.8984 12.8011 11.7149 12.9837L9.20097 15.5017C9.09639 15.6062 8.93348 15.6062 8.8289 15.5017L2.50386 9.18265C2.39928 9.07807 2.39928 8.91517 2.50386 8.81059L8.82689 2.49158C8.83494 2.48353 8.84499 2.4775 8.85304 2.46946C8.95762 2.387 9.10242 2.39504 9.19895 2.49158L11.7169 5.00752C12.099 5.38964 12.7185 5.38964 13.0986 5.00752ZM6.91027 9.04187C6.91027 9.60833 7.13551 10.1516 7.53643 10.5521C7.93736 10.9527 8.48113 11.1777 9.04812 11.1777C9.61511 11.1777 10.1589 10.9527 10.5598 10.5521C10.9607 10.1516 11.186 9.60833 11.186 9.04187C11.186 8.47542 10.9607 7.93216 10.5598 7.53161C10.1589 7.13106 9.61511 6.90604 9.04812 6.90604C8.48113 6.90604 7.93736 7.13106 7.53643 7.53161C7.13551 7.93216 6.91027 8.47542 6.91027 9.04187ZM17.694 8.26557L15.2223 5.80594C14.8402 5.42584 14.2208 5.42584 13.8407 5.80795C13.7498 5.8984 13.6777 6.0059 13.6286 6.12427C13.5794 6.24265 13.554 6.36958 13.554 6.49778C13.554 6.62597 13.5794 6.7529 13.6286 6.87128C13.6777 6.98966 13.7498 7.09716 13.8407 7.1876L15.5099 8.85484C15.6145 8.95942 15.6145 9.12232 15.5099 9.2269L13.8648 10.87C13.774 10.9604 13.7019 11.0679 13.6527 11.1863C13.6035 11.3047 13.5782 11.4316 13.5782 11.5598C13.5782 11.688 13.6035 11.8149 13.6527 11.9333C13.7019 12.0517 13.774 12.1592 13.8648 12.2496C14.0483 12.4323 14.2967 12.5348 14.5556 12.5348C14.8145 12.5348 15.0629 12.4323 15.2465 12.2496L17.696 9.80209C17.797 9.70119 17.8771 9.58135 17.9317 9.44945C17.9862 9.31754 18.0142 9.17616 18.014 9.03341C18.0138 8.89066 17.9855 8.74936 17.9306 8.61759C17.8757 8.48583 17.7953 8.3662 17.694 8.26557Z",
  engineering: "M18 11.08H11.08V2.77H2.77V11.08H11.08V18H0V2.77H2.77V0H18V11.08Z",
  marketing:
    "M4.65385 18.5H10.1923M8.80769 5.34615L6.73077 7.42308L8.11538 8.80769L6.03846 10.8846M14.3462 7.42308V8.80769C14.3462 9.91538 13.4226 11.1158 12.9615 11.5769L10.8846 13.6538L10.1923 15.7308H4.65385L3.96154 13.6538L1.88462 11.5769C1.42354 11.1158 0.5 9.91538 0.5 8.80769V7.42308C0.5 5.58696 1.22939 3.82605 2.52772 2.52772C3.82605 1.22939 5.58696 0.5 7.42308 0.5C9.25919 0.5 11.0201 1.22939 12.3184 2.52772C13.6168 3.82605 14.3462 5.58696 14.3462 7.42308Z",
  devops1:
    "M3.47143 1.28571V3.85714H1.15714V1.28571H3.47143ZM0 0V5.14286H4.62857V0H0ZM9.25714 3.21429V5.78571H6.94286V3.21429H9.25714ZM5.78571 1.92857V7.07143H10.4143V1.92857H5.78571ZM3.47143 9V11.5714H1.15714V9H3.47143ZM0 7.71429V12.8571H4.62857V7.71429H0Z",
  devops2:
    "M11.5716 5.14281V8.99995H8.10019V12.8571H4.62876V18H16.2002V5.14281H11.5716ZM9.25733 10.2857H11.5716V12.8571H9.25733V10.2857ZM8.10019 16.7142H5.7859V14.1428H8.10019V16.7142ZM11.5716 16.7142H9.25733V14.1428H11.5716V16.7142ZM15.043 16.7142H12.7288V14.1428H15.043V16.7142ZM15.043 12.8571H12.7288V10.2857H15.043V12.8571ZM12.7288 8.99995V6.42852H15.043V8.99995H12.7288Z",
  chevron:
    "M4.4955 5.98913C4.43655 5.99 4.37809 5.97594 4.32389 5.94786C4.2697 5.91978 4.22096 5.8783 4.18082 5.82609L0.134865 0.934783C-0.044955 0.717391 -0.044955 0.380435 0.134865 0.163043C0.314685 -0.0543478 0.593406 -0.0543478 0.773227 0.163043L4.5045 4.67391L8.22677 0.173913C8.40659 -0.0434783 8.68531 -0.0434783 8.86513 0.173913C9.04495 0.391304 9.04495 0.728261 8.86513 0.945652L4.81918 5.83696C4.72927 5.94565 4.61239 6 4.5045 6L4.4955 5.98913Z",
};

/* ───────── Data ───────── */
interface Department {
  id: string;
  name: string;
  glowColor: string; // rgb string for rgba()
  iconType: "design" | "engineering" | "marketing" | "devops";
  positions: string[];
}

const DEPARTMENTS: Department[] = [
  {
    id: "design",
    name: "Design",
    glowColor: "168, 85, 247",
    iconType: "design",
    positions: ["Associate Product Designer", "Design Lead"],
  },
  {
    id: "engineering",
    name: "Engineering",
    glowColor: "249, 115, 22",
    iconType: "engineering",
    positions: ["Frontend Engineer", "Backend Engineer", "Full Stack Engineer"],
  },
  {
    id: "marketing",
    name: "Marketing",
    glowColor: "59, 130, 246",
    iconType: "marketing",
    positions: ["Growth Lead", "Content Strategist"],
  },
  {
    id: "devops",
    name: "Dev Ops",
    glowColor: "34, 197, 94",
    iconType: "devops",
    positions: ["Site Reliability Engineer", "Platform Engineer"],
  },
];

/* ───────── Icon renderers ───────── */
function DeptIcon({
  type,
  color,
}: {
  type: Department["iconType"];
  color: string;
}) {
  const fill = `rgb(${color})`;
  if (type === "design") {
    return (
      <svg width="18" height="18" viewBox="0 0 18.014 18" fill="none" className="shrink-0">
        <path d={PATHS.design} fill={fill} />
      </svg>
    );
  }
  if (type === "engineering") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
        <path d={PATHS.engineering} fill={fill} />
      </svg>
    );
  }
  if (type === "marketing") {
    return (
      <svg width="15" height="19" viewBox="0 0 14.8462 19" fill="none" className="shrink-0">
        <path d={PATHS.marketing} stroke={fill} fill="none" />
      </svg>
    );
  }
  return (
    <svg width="16" height="18" viewBox="0 0 16.2003 18" fill="none" className="shrink-0">
      <path d={PATHS.devops1} fill={fill} />
      <path d={PATHS.devops2} fill={fill} />
    </svg>
  );
}

/* ───────── Separator line ───────── */
function Separator() {
  return (
    <div className="flex items-center justify-center shrink-0" style={{ width: 0, height: 18 }}>
      <div style={{ width: 18, height: 0, transform: "rotate(90deg)" }}>
        <svg width="18" height="1" viewBox="0 0 18 1" fill="none">
          <line x2="18" y1="0.5" y2="0.5" stroke="rgba(255,255,255,0.08)" />
        </svg>
      </div>
    </div>
  );
}

/* ───────── Spring configs ───────── */
const BOUNCE_SPRING = { type: "spring" as const, stiffness: 500, damping: 22 };
const CHEVRON_SPRING = { type: "spring" as const, stiffness: 400, damping: 20 };

/* ───────── Component ───────── */
export function JobDropdown({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "transparent",
        userSelect: "none",
        WebkitUserSelect: "none",
        fontFamily: "'DM Mono', monospace",
        padding: "20px 24px",
        ...style,
      }}
    >
      <div style={{ width: "100%", maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%" }}>
          {/* Header */}
          <p
            style={{
              color: "rgba(255,255,255,0.2)",
              fontSize: 11,
              fontWeight: 500,
              marginBottom: 14,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            View Open Positions
          </p>

          {/* Department rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {DEPARTMENTS.map((dept) => {
              const isOpen = expandedId === dept.id;

              return (
                <div
                  key={dept.id}
                  style={{
                    borderRadius: 12,
                    border: "1px solid",
                    borderColor: isOpen
                      ? `rgba(${dept.glowColor}, 0.2)`
                      : "rgba(255,255,255,0.04)",
                    overflow: "hidden",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                    boxShadow: isOpen
                      ? `0 0 20px rgba(${dept.glowColor}, 0.1), 0 0 40px rgba(${dept.glowColor}, 0.05)`
                      : "none",
                  }}
                >
                  {/* Department header row */}
                  <DeptHeader dept={dept} isOpen={isOpen} onToggle={() => toggle(dept.id)} />

                  {/* Expandable positions */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ height: BOUNCE_SPRING, opacity: { duration: 0.15 } }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "6px 6px 6px 6px" }}>
                          {dept.positions.map((position, i) => (
                            <PositionRow
                              key={position}
                              position={position}
                              glowColor={dept.glowColor}
                              index={i}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Department Header Button ───────── */
function DeptHeader({
  dept,
  isOpen,
  onToggle,
}: {
  dept: Department;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        height: 54,
        backgroundColor: isHovered
          ? `rgba(${dept.glowColor}, 0.06)`
          : isOpen
            ? `rgba(${dept.glowColor}, 0.04)`
            : "#0a0a0a",
        borderRadius: 10,
        border: "1px solid",
        borderColor: isHovered
          ? `rgba(${dept.glowColor}, 0.2)`
          : isOpen
            ? `rgba(${dept.glowColor}, 0.15)`
            : "rgba(255,255,255,0.03)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 18px",
        cursor: "pointer",
        outline: "none",
        position: "relative",
        zIndex: 1,
        fontFamily: "'DM Mono', monospace",
        transition: "border-color 0.3s, background-color 0.3s",
      }}
      animate={{
        boxShadow:
          isHovered || isOpen
            ? `0 0 20px rgba(${dept.glowColor}, 0.12), 0 0 40px rgba(${dept.glowColor}, 0.06)`
            : "0 0 0px rgba(0,0,0,0)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
    >
      {/* Left side: icon | name • */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <DeptIcon type={dept.iconType} color={dept.glowColor} />
        <Separator />
        <span
          style={{
            color:
              isHovered || isOpen
                ? "#ffffff"
                : "rgba(255,255,255,0.85)",
            fontSize: 14,
            fontWeight: 500,
            whiteSpace: "nowrap",
            transition: "color 0.3s",
          }}
        >
          {dept.name}
        </span>
        {/* Color dot */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: `rgba(${dept.glowColor}, ${isHovered || isOpen ? 0.9 : 0.4})`,
            boxShadow:
              isHovered || isOpen
                ? `0 0 8px rgba(${dept.glowColor}, 0.5)`
                : "none",
            transition: "all 0.3s",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            color: "rgba(255,255,255,0.15)",
            fontSize: 11,
          }}
        >
          {dept.positions.length} {dept.positions.length === 1 ? "role" : "roles"}
        </span>
      </div>

      {/* Chevron */}
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={CHEVRON_SPRING}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
          <path
            d={PATHS.chevron}
            fill={
              isHovered || isOpen
                ? `rgba(${dept.glowColor}, 0.9)`
                : "rgba(255,255,255,0.7)"
            }
            style={{ transition: "fill 0.3s" }}
          />
        </svg>
      </motion.div>
    </motion.button>
  );
}

/* ───────── Position Row ───────── */
function PositionRow({
  position,
  glowColor,
  index,
}: {
  position: string;
  glowColor: string;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{
        ...BOUNCE_SPRING,
        delay: index * 0.06,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        height: 48,
        backgroundColor: isHovered
          ? `rgba(${glowColor}, 0.06)`
          : "#080808",
        borderRadius: 9,
        border: `1px solid`,
        borderColor: isHovered
          ? `rgba(${glowColor}, 0.25)`
          : `rgba(${glowColor}, 0.04)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 18px",
        cursor: "pointer",
        transition: "background-color 0.25s, border-color 0.25s",
      }}
    >
      <motion.div
        style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}
        animate={{
          x: isHovered ? 3 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <span
          style={{
            color: isHovered
              ? `rgba(${glowColor}, 1)`
              : "rgba(255,255,255,0.7)",
            fontSize: 12,
            fontWeight: 500,
            transition: "color 0.25s",
          }}
        >
          {position}
        </span>
        <span
          style={{
            color: isHovered
              ? `rgba(${glowColor}, 0.9)`
              : "rgba(255,255,255,0.3)",
            fontSize: 11,
            fontWeight: 500,
            cursor: "pointer",
            transition: "color 0.25s",
          }}
        >
          Apply
        </span>
      </motion.div>

      {/* Hover glow effect */}
      <motion.div
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: 9,
          pointerEvents: "none",
        }}
        animate={{
          boxShadow: isHovered
            ? `0 0 30px 4px rgba(${glowColor}, 0.15), 0 0 60px 8px rgba(${glowColor}, 0.06)`
            : `0 0 0px 0px rgba(${glowColor}, 0)`,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}