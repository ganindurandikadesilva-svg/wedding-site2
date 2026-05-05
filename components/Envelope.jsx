"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

/* ── Floating petals ─────────────────────────────── */
function Petal({ delay, x, size, duration }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x, rotate: 0 }}
      animate={{ opacity: [0, 0.7, 0], y: "110vh", rotate: 360 }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
      style={{
        position: "fixed",
        top: 0,
        left: x,
        width: size,
        height: size,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="10" rx="8" ry="14" fill="rgba(201,168,76,0.35)" />
        <ellipse
          cx="20"
          cy="10"
          rx="8"
          ry="14"
          fill="rgba(155,114,200,0.2)"
          transform="rotate(60 20 20)"
        />
        <ellipse
          cx="20"
          cy="10"
          rx="8"
          ry="14"
          fill="rgba(201,168,76,0.2)"
          transform="rotate(120 20 20)"
        />
      </svg>
    </motion.div>
  );
}

/* ── Stars bg ────────────────────────────────────── */
function StarField() {
  const [stars, setStars] = useState([]);
  useEffect(() => {
    setStars(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 4,
      })),
    );
  }, []);
  return (
    <div
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    >
      {stars.map((s) => (
        <motion.div
          key={s.id}
          animate={{ opacity: [0.1, 0.9, 0.1] }}
          transition={{
            duration: 2.5 + Math.random() * 3,
            delay: s.delay,
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
          }}
        />
      ))}
    </div>
  );
}

/* ── Ornamental ring ─────────────────────────────── */
function OrnamentalRing({ size = 300, opacity = 0.12 }) {
  const lines = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    const rad = (angle * Math.PI) / 180;
    return {
      x1: Math.round(150 + 120 * Math.cos(rad) * 1000) / 1000,
      y1: Math.round(150 + 120 * Math.sin(rad) * 1000) / 1000,
      x2: Math.round(150 + 140 * Math.cos(rad) * 1000) / 1000,
      y2: Math.round(150 + 140 * Math.sin(rad) * 1000) / 1000,
    };
  });
  const dots = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 360) / 8;
    const rad = (angle * Math.PI) / 180;
    return {
      cx: Math.round(150 + 130 * Math.cos(rad) * 1000) / 1000,
      cy: Math.round(150 + 130 * Math.sin(rad) * 1000) / 1000,
    };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{ opacity }}>
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#9b72c8" />
        </linearGradient>
      </defs>
      <circle
        cx="150"
        cy="150"
        r="140"
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="1"
      />
      <circle
        cx="150"
        cy="150"
        r="120"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="0.5"
        strokeDasharray="4 6"
      />
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#c9a84c"
          strokeWidth="0.8"
          opacity="0.6"
        />
      ))}
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r="3"
          fill="#c9a84c"
          opacity="0.7"
        />
      ))}
    </svg>
  );
}

/* ── Wax seal — clean lotus only, no text ────────── */
function WaxSeal({ onClick, isOpening }) {
  return (
    <motion.button
      onClick={onClick}
      animate={
        isOpening
          ? { scale: [1, 1.3, 0], opacity: [1, 1, 0], rotate: [0, 15, 0] }
          : { scale: [1, 1.04, 1] }
      }
      transition={
        isOpening
          ? { duration: 0.6, ease: "easeIn" }
          : { repeat: Infinity, duration: 3, ease: "easeInOut", delay: 2 }
      }
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        zIndex: 20,
      }}
    >
      <svg width="110" height="110" viewBox="0 0 110 110">
        <defs>
          <radialGradient id="sealGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#5a3590" />
            <stop offset="60%" stopColor="#2d1b4e" />
            <stop offset="100%" stopColor="#1a0d30" />
          </radialGradient>
          <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="8"
              floodColor="#c9a84c"
              floodOpacity="0.3"
            />
          </filter>
        </defs>

        {/* Scalloped edge */}
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i * 360) / 16;
          const rad = (angle * Math.PI) / 180;
          const cx = 55 + 50 * Math.cos(rad);
          const cy = 55 + 50 * Math.sin(rad);
          return <circle key={i} cx={cx} cy={cy} r="7" fill="url(#sealGrad)" />;
        })}

        {/* Body */}
        <circle
          cx="55"
          cy="55"
          r="46"
          fill="url(#sealGrad)"
          filter="url(#sealShadow)"
        />

        {/* Rings */}
        <circle
          cx="55"
          cy="55"
          r="40"
          fill="none"
          stroke="#c9a84c"
          strokeWidth="1"
          opacity="0.5"
        />
        <circle
          cx="55"
          cy="55"
          r="30"
          fill="none"
          stroke="#c9a84c"
          strokeWidth="0.5"
          opacity="0.25"
        />

        {/* Lotus petals — outer */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <ellipse
            key={a}
            cx="55"
            cy="40"
            rx="3.5"
            ry="10"
            fill="rgba(155,114,200,0.3)"
            stroke="#9b72c8"
            strokeWidth="0.4"
            transform={`rotate(${a} 55 55)`}
          />
        ))}

        {/* Lotus petals — inner gold */}
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse
            key={a}
            cx="55"
            cy="44"
            rx="3"
            ry="8"
            fill="rgba(201,168,76,0.5)"
            stroke="#c9a84c"
            strokeWidth="0.4"
            transform={`rotate(${a} 55 55)`}
          />
        ))}

        {/* Center gem */}
        <circle
          cx="55"
          cy="55"
          r="9"
          fill="rgba(201,168,76,0.2)"
          stroke="#c9a84c"
          strokeWidth="0.8"
        />
        <circle cx="55" cy="55" r="4" fill="#c9a84c" opacity="0.55" />

        {/* OPEN hint at bottom */}
        <text
          x="55"
          y="90"
          textAnchor="middle"
          fontFamily="Montserrat, sans-serif"
          fontSize="5"
          fill="#c9a84c"
          letterSpacing="3"
          opacity="0.7"
        >
          OPEN
        </text>
      </svg>
    </motion.button>
  );
}

/* ── Monogram placed in envelope upper-right quadrant */
function EnvelopeMonogram() {
  return (
    <div
      style={{
        position: "absolute",
        // upper-right quadrant: right of vertical centerline, above horizontal centerline
        top: "18%",
        right: "12%",
        pointerEvents: "none",
        zIndex: 15,
        textAlign: "center",
      }}
    >
      {/* Thin decorative rule above */}
      <div
        style={{
          width: 40,
          height: 1,
          background:
            "linear-gradient(to right, transparent, rgba(201,168,76,0.5), transparent)",
          margin: "0 auto 5px",
        }}
      />

      {/* T & D */}
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.35rem",
          fontWeight: 400,
          color: "rgba(201,168,76,0.85)",
          lineHeight: 1,
          letterSpacing: "0.08em",
          fontStyle: "italic",
        }}
      >
        T{" "}
        <span style={{ fontSize: "0.9rem", color: "rgba(201,168,76,0.55)" }}>
          &amp;
        </span>{" "}
        D
      </div>

      {/* Thin decorative rule below */}
      <div
        style={{
          width: 40,
          height: 1,
          background:
            "linear-gradient(to right, transparent, rgba(201,168,76,0.5), transparent)",
          margin: "5px auto 0",
        }}
      />

      {/* Year in small caps */}
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "0.28rem",
          letterSpacing: "0.35em",
          color: "rgba(201,168,76,0.45)",
          textTransform: "uppercase",
          marginTop: 4,
        }}
      >
        2026
      </div>
    </div>
  );
}

export default function Envelope() {
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => router.push("/invite"), 2200);
  };

  const petals = [
    { delay: 0, x: "10%", size: 24, duration: 8 },
    { delay: 1.5, x: "25%", size: 18, duration: 11 },
    { delay: 3, x: "45%", size: 30, duration: 9 },
    { delay: 0.8, x: "65%", size: 20, duration: 13 },
    { delay: 2.2, x: "80%", size: 22, duration: 10 },
    { delay: 4, x: "90%", size: 16, duration: 12 },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 60% 40%, #1e0f3a 0%, #0d0820 50%, #050312 100%)",
      }}
    >
      <StarField />
      {mounted && petals.map((p, i) => <Petal key={i} {...p} />)}

      {/* Ambient rings */}
      {[
        { size: 600, opacity: 0.07 },
        { size: 900, opacity: 0.04 },
      ].map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <OrnamentalRing size={r.size} opacity={r.opacity} />
        </div>
      ))}

      {/* Ambient glow blobs */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "20%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(155,114,200,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center w-full px-6"
        style={{ maxWidth: 520 }}
      >
        {/* Top label */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.55rem",
            letterSpacing: "0.5em",
            color: "#c9a84c",
            textTransform: "uppercase",
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          ✦ &nbsp; You Are Invited &nbsp; ✦
        </motion.p>

        {/* Names */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.6 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.6rem, 8vw, 3.8rem)",
            color: "#f0e8ff",
            fontWeight: 300,
            letterSpacing: "0.06em",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Tharindu
          <span
            style={{ color: "#c9a84c", fontStyle: "italic", margin: "0 14px" }}
          >
            &
          </span>
          Dasuni
        </motion.h1>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.58rem",
            color: "rgba(201,168,76,0.7)",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            marginTop: 10,
            marginBottom: 50,
          }}
        >
          05 · September · 2026
        </motion.p>

        {/* Envelope */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1.1,
            delay: 1.2,
            type: "spring",
            stiffness: 60,
            damping: 14,
          }}
          onMouseMove={handleMouseMove}
          style={{ perspective: 1000 }}
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              width: 300,
              height: 400,
              position: "relative",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Envelope body */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 24,
                background:
                  "linear-gradient(145deg, #2a1650 0%, #1a0e38 40%, #100820 100%)",
                boxShadow:
                  "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.15), inset 0 1px 0 rgba(201,168,76,0.1)",
                overflow: "hidden",
              }}
            >
              {/* Inner radial */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(100,60,170,0.2) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Corner ornaments */}
              {[
                { top: 0, left: 0 },
                { top: 0, right: 0 },
                { bottom: 0, right: 0 },
                { bottom: 0, left: 0 },
              ].map((pos, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 60,
                    height: 60,
                    ...pos,
                    opacity: 0.3,
                  }}
                >
                  <svg viewBox="0 0 60 60">
                    <path
                      d={`M0,0 L30,0 Q${i % 2 === 0 ? "0,0 0,30" : "60,0 60,30"}`}
                      stroke="#c9a84c"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <circle
                      cx={i < 2 ? (i === 0 ? 8 : 52) : i === 2 ? 52 : 8}
                      cy={i < 2 ? 8 : 52}
                      r="2.5"
                      fill="#c9a84c"
                    />
                  </svg>
                </div>
              ))}

              {/* Horizontal center line */}
              <div
                style={{
                  position: "absolute",
                  left: 24,
                  right: 24,
                  top: "50%",
                  height: 1,
                  background:
                    "linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent)",
                }}
              />
              {/* Vertical center line */}
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  bottom: 24,
                  left: "50%",
                  width: 1,
                  background:
                    "linear-gradient(to bottom, transparent, rgba(201,168,76,0.2), transparent)",
                }}
              />

              {/* T & D monogram — upper-right quadrant */}
              <EnvelopeMonogram />

              {/* Side rotated text */}
              <div
                style={{
                  position: "absolute",
                  left: -8,
                  top: "50%",
                  transform: "translateY(-50%) rotate(-90deg)",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.38rem",
                    letterSpacing: "0.4em",
                    color: "rgba(201,168,76,0.7)",
                    textTransform: "uppercase",
                  }}
                >
                  Tharindu & Dasuni · 2026
                </span>
              </div>

              {/* Wax seal */}
              <WaxSeal onClick={handleOpen} isOpening={isOpening} />

              {/* Tap hint */}
              <AnimatePresence>
                {!isOpening && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                    style={{
                      position: "absolute",
                      bottom: 22,
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.4rem",
                      letterSpacing: "0.3em",
                      color: "rgba(201,168,76,0.8)",
                      textTransform: "uppercase",
                    }}
                  >
                    ✦ &nbsp; Tap Seal to Open &nbsp; ✦
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Opening burst */}
              <AnimatePresence>
                {isOpening && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 4] }}
                      transition={{ duration: 0.8 }}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle, rgba(201,168,76,0.9), rgba(155,114,200,0.5), transparent)",
                        pointerEvents: "none",
                      }}
                    />
                    {Array.from({ length: 12 }, (_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 0.8, 0], scale: [0, 1] }}
                        transition={{ duration: 0.6, delay: i * 0.03 }}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          width: 2,
                          height: 120,
                          background:
                            "linear-gradient(to top, transparent, rgba(201,168,76,0.5))",
                          transformOrigin: "50% 100%",
                          transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                          pointerEvents: "none",
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Envelope flap */}
            <motion.div
              animate={isOpening ? { rotateX: -180, y: -20 } : { rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.32, 0, 0.67, 0],
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 130,
                transformOrigin: "top center",
                perspective: 800,
                zIndex: 30,
              }}
            >
              <svg width="300" height="130" viewBox="0 0 300 130">
                <defs>
                  <linearGradient
                    id="flapG"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3a1f6e" />
                    <stop offset="100%" stopColor="#1a0e38" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 300,0 150,120" fill="url(#flapG)" />
                <polygon
                  points="0,0 300,0 150,120"
                  fill="none"
                  stroke="rgba(201,168,76,0.2)"
                  strokeWidth="1"
                />
                <circle
                  cx="150"
                  cy="50"
                  r="8"
                  fill="none"
                  stroke="rgba(201,168,76,0.25)"
                  strokeWidth="0.8"
                />
                <circle cx="150" cy="50" r="3" fill="rgba(201,168,76,0.2)" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            color: "rgba(240,232,255,0.5)",
            fontStyle: "italic",
            letterSpacing: "0.08em",
            marginTop: 36,
            textAlign: "center",
          }}
        >
          "Two souls, one beautiful journey"
        </motion.p>

        {/* Gold dots footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
            color: "#c9a84c",
            opacity: 0.4,
          }}
        >
          {["✦", "✦", "✦"].map((s, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
            >
              {s}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
