import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "motion/react";

const CORRECT_PIN = "123456";
const PIN_LENGTH = 6;

export function PasscodeEntry() {
  const [pin, setPin] = useState("");
  const [state, setState] = useState<"idle" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldControls = useAnimation();
  const buttonControls = useAnimation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH);
    setPin(value);
    if (state === "error") {
      setState("idle");
    }
  };

  const handleSubmit = async () => {
    if (state === "error") {
      setPin("");
      setState("idle");
      inputRef.current?.focus();
      return;
    }
    if (pin.length === 0) return;
    if (pin !== CORRECT_PIN) {
      setState("error");
      const shakeSequence = [
        { x: -6 },
        { x: 6 },
        { x: -4 },
        { x: 4 },
        { x: -2 },
        { x: 2 },
        { x: 0 },
      ];
      fieldControls.start({
        x: shakeSequence.map((s) => s.x),
        transition: { duration: 0.4, ease: "easeInOut" },
      });
      buttonControls.start({
        x: shakeSequence.map((s) => s.x),
        transition: { duration: 0.4, ease: "easeInOut", delay: 0.05 },
      });
    } else {
      setState("idle");
      setPin("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isError = state === "error";

  return (
    <div
      className="bg-transparent flex flex-col items-center justify-center w-full h-full min-h-[400px] select-none"
      onClick={() => inputRef.current?.focus()}
    >
      <div style={{ width: "100%", maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="flex flex-col items-center gap-[16px] w-full" style={{ maxWidth: 300, padding: "0 20px" }}>
          {/* Label */}
          <p
            className="font-['Inter',sans-serif] text-[14px] tracking-wide"
            style={{ color: isError ? "#FF4D4D" : "#666" }}
          >
            {isError ? "Incorrect passcode" : "Type a passcode"}
          </p>

          {/* Input field with dots */}
          <motion.div
            animate={fieldControls}
            className="relative w-full h-[64px] rounded-[15px] cursor-text"
            style={{
              backgroundColor: isError ? "#3a0404" : "#0d0d0d",
              border: isError ? "2px solid #7E0000" : "1px solid #252525",
            }}
            onClick={() => inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={pin}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength={PIN_LENGTH}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text"
              autoComplete="off"
            />

            {/* Dots */}
            <div className="flex items-center justify-center gap-[20px] h-full">
              {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor:
                      i < pin.length
                        ? isError
                          ? "#FF4D4D"
                          : "white"
                        : isError
                          ? "rgba(126, 0, 0, 0.5)"
                          : "rgba(255, 255, 255, 0.2)",
                  }}
                  animate={{
                    scale: i < pin.length ? [1, 1.3, 1] : 1,
                  }}
                  transition={{ duration: 0.15 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Error message */}
          {/* removed redundant error message - top label + red styling already communicates error */}
          <div className="h-[16px] w-full" />

          {/* Button */}
          <motion.button
            animate={buttonControls}
            onClick={handleSubmit}
            className="w-[200px] py-[15px] rounded-[10px] relative cursor-pointer"
            style={{
              backgroundColor: isError ? "#3a0404" : "#0d0d0d",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="absolute inset-0 rounded-[10px] pointer-events-none"
              style={{
                border: isError ? "1px solid #7E0000" : "1px solid #252525",
              }}
            />
            <span className="font-['Inter',sans-serif] font-semibold text-[16px] text-white relative">
              {isError ? "Click to try again" : "Enter Pin"}
            </span>
          </motion.button>
        </div>

      </div>
    </div>
  );
}