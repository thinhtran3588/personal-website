"use client";

import { useEffect, useRef, useState } from "react";

type TypedTextProps = {
  roles: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
};

export function TypedText({
  roles,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypedTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const phaseRef = useRef<"typing" | "pausing" | "deleting">("typing");
  const charIndexRef = useRef(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const step = () => {
      const currentRole = roles[roleIndex];

      switch (phaseRef.current) {
        case "typing": {
          if (charIndexRef.current < currentRole.length) {
            charIndexRef.current += 1;
            setDisplayText(currentRole.slice(0, charIndexRef.current));
            timeoutId = setTimeout(step, typingSpeed);
          } else {
            phaseRef.current = "pausing";
            timeoutId = setTimeout(step, pauseDuration);
          }
          break;
        }
        case "pausing": {
          phaseRef.current = "deleting";
          timeoutId = setTimeout(step, deletingSpeed);
          break;
        }
        case "deleting": {
          if (charIndexRef.current > 0) {
            charIndexRef.current -= 1;
            setDisplayText(currentRole.slice(0, charIndexRef.current));
            timeoutId = setTimeout(step, deletingSpeed);
          } else {
            phaseRef.current = "typing";
            setRoleIndex((prev) => (prev + 1) % roles.length);
          }
          break;
        }
      }
    };

    timeoutId = setTimeout(step, typingSpeed);
    return () => clearTimeout(timeoutId);
  }, [roles, roleIndex, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="text-[var(--accent)]" aria-label={roles[roleIndex]}>
      {displayText}
      <span className="typing-cursor" aria-hidden="true">
        |
      </span>
    </span>
  );
}
