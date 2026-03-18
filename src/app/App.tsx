import { SwipeToLock } from "./components/swipe-to-lock";
import { MessageReveal } from "./components/message-reveal";
import { HoldConfirm } from "./components/hold-confirm";
import { JobDropdown } from "./components/job-dropdown";
import { NetworthChart } from "./components/networth-chart";
import { VolumeInteraction } from "./components/volume-interaction";
import { AppDock } from "./components/app-dock";
import { PasscodeEntry } from "./components/passcode-entry";
import { FlashlightToggle } from "./components/flashlight-toggle";
import { BlackHole } from "./components/black-hole";
import { ParticleSphere } from "./components/particle-sphere";
import { ProgressBar } from "./components/progress-bar";
import { FinanceDonut } from "./components/finance-donut";
import { BookingButton } from "./components/booking-button";
import { SkeletonSearch } from "./components/skeleton-search";
import { ContextToolbar } from "./components/context-toolbar";
import { SwipeNotification } from "./components/swipe-notification";
import { LiquidBlob } from "./components/liquid-blob";
import { useState } from "react";
import { motion } from "motion/react";

interface GridCellProps {
  children: React.ReactNode;
  title: string;
  bg?: string;
  tag?: "business" | "experimental";
  businessValue?: {
    headline: string;
    logic: string;
  };
}

function GridCell({ children, title, bg, tag, businessValue }: GridCellProps) {
  const [flipped, setFlipped] = useState(false);
  const dotColor = tag === "business" ? "#4A90FF" : tag === "experimental" ? "#B8D430" : undefined;
  const isClickable = tag === "business" && businessValue;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
      {/* 3D flip container */}
      <div
        style={{
          width: 410,
          height: 410,
          perspective: 1200,
        }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
            mass: 1,
          }}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front face */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              backgroundColor: bg || "#141414",
              border: "1px solid #333333",
              borderRadius: 20,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            {children}
          </div>

          {/* Back face */}
          {businessValue && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                backgroundColor: "#0d0d0d",
                border: "1px solid #4A90FF33",
                borderRadius: 20,
                overflow: "hidden",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "48px 40px",
                cursor: "pointer",
              }}
              onClick={() => setFlipped(false)}
            >
              {/* Decorative accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "linear-gradient(90deg, transparent, #4A90FF, transparent)",
                  opacity: 0.6,
                }}
              />

              {/* UX Logic label */}
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#4A90FF",
                  fontFamily: "'DM Mono', monospace",
                  marginBottom: 16,
                }}
              >
                UX Logic
              </span>

              {/* Title */}
              <h3
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif",
                  margin: "0 0 12px",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {businessValue.headline}
              </h3>

              {/* Logic description */}
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.82rem",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {businessValue.logic}
              </p>

              {/* Tap to return hint */}
              <span
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.12)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Click to flip back
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Title label */}
      <span
        style={{
          color: "rgba(255,255,255,0.18)",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          cursor: isClickable ? "pointer" : "default",
          transition: "color 0.2s ease",
        }}
        onClick={isClickable ? () => setFlipped((f) => !f) : undefined}
        onMouseEnter={(e) => {
          if (isClickable) (e.currentTarget as HTMLElement).style.color = "rgba(74,144,255,0.5)";
        }}
        onMouseLeave={(e) => {
          if (isClickable) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.18)";
        }}
      >
        {dotColor && (
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: dotColor,
              flexShrink: 0,
              boxShadow: `0 0 6px ${dotColor}44`,
            }}
          />
        )}
        {title}
      </span>
    </div>
  );
}

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#090909",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto 40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "1.8rem",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Microinteraction Library
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: "0.85rem",
            marginTop: 8,
            letterSpacing: "0.02em",
          }}
        >
          A collection of interactive UI experiments
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(410px, 1fr))",
          gap: 10,
          justifyItems: "center",
        }}
      >
        {/* Row 1: Business value — core patterns */}
        <GridCell
          title="Progress Bar"
          tag="business"
          businessValue={{
            headline: "Reduce user anxiety during waits",
            logic: "Determinate progress indicators set clear expectations for task duration. Users are 3x more likely to wait through a process when they can see measurable advancement vs. an indeterminate spinner.",
          }}
        >
          <ProgressBar />
        </GridCell>
        <GridCell
          title="Booking Button"
          tag="business"
          businessValue={{
            headline: "Confirm actions with micro-feedback",
            logic: "Animated state transitions on CTAs provide instant confirmation that a tap registered. This eliminates the 'did it work?' doubt that causes double-taps and duplicate submissions in booking flows.",
          }}
        >
          <BookingButton />
        </GridCell>
        <GridCell
          title="Hold to Confirm"
          tag="business"
          businessValue={{
            headline: "Add intentionality to destructive actions",
            logic: "Hold-to-confirm adds a friction threshold that prevents accidental deletes, cancellations, or irreversible changes without interrupting flow with a disruptive modal dialog.",
          }}
        >
          <HoldConfirm />
        </GridCell>

        {/* Row 2: Data / Finance */}
        <GridCell
          title="Finance Donut"
          tag="business"
          businessValue={{
            headline: "At-a-glance portfolio composition",
            logic: "Donut charts leverage pre-attentive processing — users grasp proportional breakdowns in under 500ms. Animated segment reveals guide the eye sequentially, preventing information overload.",
          }}
        >
          <FinanceDonut />
        </GridCell>
        <GridCell
          title="Assets Chart"
          tag="business"
          businessValue={{
            headline: "Build trust through data transparency",
            logic: "Interactive trend lines with hover tooltips let users interrogate their own data, creating a sense of control. Smooth chart animations signal data freshness and platform reliability.",
          }}
        >
          <NetworthChart />
        </GridCell>
        <GridCell
          title="Swipe to Lock"
          tag="business"
          businessValue={{
            headline: "Balance security with convenience",
            logic: "Gesture-based locking leverages muscle memory — users complete the action faster than PIN entry while feeling the physical metaphor of 'sliding a lock.' The haptic-like animation reinforces the secured state.",
          }}
        >
          <SwipeToLock />
        </GridCell>

        {/* Row 3: Messaging / Notifications */}
        <GridCell
          title="Message Reveal"
          tag="business"
          businessValue={{
            headline: "Drive engagement through progressive disclosure",
            logic: "Staggered message animations create anticipation and rhythm, mimicking real conversation cadence. Users stay engaged longer when content appears progressively rather than all at once.",
          }}
        >
          <MessageReveal />
        </GridCell>
        <GridCell
          title="Swipe Notification"
          tag="business"
          businessValue={{
            headline: "Reduce notification fatigue with gestural triage",
            logic: "Swipe-to-dismiss maps to a universal mobile mental model. The directional gesture creates a satisfying 'done' feeling, encouraging users to process notifications rather than ignoring them entirely.",
          }}
        >
          <SwipeNotification />
        </GridCell>
        <GridCell
          title="Context Toolbar"
          tag="business"
          businessValue={{
            headline: "Surface actions exactly where they're needed",
            logic: "In-context toolbars reduce Fitts' Law distance — actions appear near the selection point, eliminating the cognitive cost of scanning a distant menu bar. This keeps users in flow state.",
          }}
        >
          <ContextToolbar />
        </GridCell>

        {/* Row 4: Navigation / Selection */}
        <GridCell
          title="Job Dropdown"
          tag="business"
          businessValue={{
            headline: "Structured browsing aids role discovery",
            logic: "Department-grouped dropdowns with color-coded categories create visual hierarchy in dense lists. Accordion expansion lets users scan at their own pace, reducing the overwhelm of flat job boards.",
          }}
        >
          <JobDropdown />
        </GridCell>
        <GridCell
          title="Passcode Entry"
          tag="business"
          businessValue={{
            headline: "Tactile feedback builds security confidence",
            logic: "Animated dot fills and subtle shake-on-error provide instant status without text labels. The physical keypad metaphor leverages years of mobile muscle memory, reducing input errors.",
          }}
        >
          <PasscodeEntry />
        </GridCell>

        {/* Row 5: Controls / Utility */}
        <GridCell
          title="Volume Control"
          tag="business"
          businessValue={{
            headline: "Direct manipulation feels intuitive",
            logic: "Continuous slider controls with real-time visual feedback create a 1:1 mapping between gesture and result. Users feel in control because the UI responds instantly to every micro-movement.",
          }}
        >
          <VolumeInteraction />
        </GridCell>
        <GridCell
          title="App Dock"
          tag="business"
          businessValue={{
            headline: "Spatial memory enables faster navigation",
            logic: "Magnification-on-hover leverages spatial memory — users remember positions, not labels. The fisheye effect adds playful discoverability while keeping the dock compact at rest.",
          }}
        >
          <AppDock />
        </GridCell>
        <GridCell
          title="Glow Toggle"
          tag="business"
          businessValue={{
            headline: "Satisfying feedback increases feature adoption",
            logic: "Ambient glow effects create an emotional reward loop — the toggle doesn't just change state, it transforms the environment. This 'delightful surplus' makes utilitarian features feel premium.",
          }}
        >
          <FlashlightToggle />
        </GridCell>

        {/* Row 6: Experimental / Canvas */}
        <GridCell
          title="Skeleton Search"
          tag="business"
          businessValue={{
            headline: "Perceived performance reduces bounce rate",
            logic: "Skeleton screens maintain layout continuity during loads, preventing jarring content shifts. The shimmer animation signals 'loading' without the anxiety of a blank screen, keeping users anchored.",
          }}
        >
          <SkeletonSearch />
        </GridCell>
        <GridCell title="Black Hole" bg="#000" tag="experimental"><BlackHole /></GridCell>
        <GridCell title="Particle Sphere" bg="#000" tag="experimental"><ParticleSphere /></GridCell>

        {/* Special */}
        <GridCell title="Neural Network" bg="#000" tag="experimental"><LiquidBlob style={{ minHeight: 400 }} /></GridCell>
      </div>
    </div>
  );
}