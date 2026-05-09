"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

const confettiPieces = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  left: `${(index * 23) % 100}%`,
  delay: `${(index % 14) * 0.08}s`,
  duration: `${2.4 + (index % 6) * 0.18}s`,
  drift: `${((index % 9) - 4) * 18}px`,
  rotate: `${(index * 47) % 360}deg`,
  color: ["#00a36c", "#0077e3", "#02163a", "#f59e0b", "#ef4444"][index % 5],
  shape: index % 4 === 0 ? "streamer" : "piece",
}));

export function CelebrationConfetti() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShow(false), 4200);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return (
    <div aria-hidden="true" className="celebration-confetti">
      {confettiPieces.map((piece) => (
        <span
          className={`celebration-confetti__${piece.shape}`}
          key={piece.id}
          style={
            {
              "--confetti-color": piece.color,
              "--confetti-delay": piece.delay,
              "--confetti-drift": piece.drift,
              "--confetti-duration": piece.duration,
              "--confetti-left": piece.left,
              "--confetti-rotate": piece.rotate,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
