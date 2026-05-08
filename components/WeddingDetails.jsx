"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";

/* ─── Design tokens ──────────────────────────────── */
const T = {
  fg: "#f0e8ff",
  fgMuted: "rgba(240,232,255,0.6)",
  fgFaint: "rgba(240,232,255,0.3)",
  gold: "#c9a84c",
  goldFaint: "rgba(201,168,76,0.15)",
  goldMid: "rgba(201,168,76,0.4)",
  purple: "#9b72c8",
  purpleFaint: "rgba(155,114,200,0.12)",
  bg: "#0d0820",
  card: "rgba(30,16,60,0.7)",
  border: "rgba(201,168,76,0.15)",
  displayFont: "'Cormorant Garamond', serif",
  labelFont: "'Montserrat', sans-serif",
};

/* ─── Animations ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Reveal({ children, style = {}, custom = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={custom}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─── Starfield ──────────────────────────────────── */
function Stars() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 2 + 0.5,
        d: Math.random() * 5,
      })),
    );
  }, []);
  return (
    <div
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    >
      {items.map((s) => (
        <motion.div
          key={s.id}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: s.d,
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            borderRadius: "50%",
            background: "#fff",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Gold divider ───────────────────────────────── */
function Divider({ icon = "✦" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        margin: "36px 0",
      }}
    >
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(to right, transparent, ${T.gold})`,
        }}
      />
      <span style={{ color: T.gold, fontSize: "0.8rem" }}>{icon}</span>
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(to left, transparent, ${T.gold})`,
        }}
      />
    </div>
  );
}

/* ─── Label ──────────────────────────────────────── */
function Label({ children, style = {} }) {
  return (
    <p
      style={{
        fontFamily: T.labelFont,
        fontSize: "0.5rem",
        letterSpacing: "0.45em",
        color: T.gold,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/* ─── Location Pin SVG ───────────────────────────── */
function LocationPin({ size = 18, color = T.gold }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="9"
        r="2.5"
        fill={color}
        fillOpacity="0.5"
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  );
}

/* ─── Countdown ──────────────────────────────────── */
function useCountdown(target) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(target) - new Date();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

function CountdownUnit({ value, label }) {
  return (
    <div
      style={{
        textAlign: "center",
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 18,
        padding: "20px 16px 16px",
        minWidth: 72,
        backdropFilter: "blur(20px)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,168,76,0.1)",
      }}
    >
      <div
        style={{
          fontFamily: T.displayFont,
          fontSize: "2.8rem",
          color: T.fg,
          lineHeight: 1,
          fontWeight: 300,
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <Label style={{ marginTop: 8, fontSize: "0.42rem", color: T.fgMuted }}>
        {label}
      </Label>
    </div>
  );
}

/* ─── Person card ────────────────────────────────── */
function PersonCard({ role, p1, p2, name, custom }) {
  return (
    <Reveal custom={custom}>
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 24,
          padding: "32px 28px",
          textAlign: "center",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(201,168,76,0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(to right, transparent, ${T.gold}, transparent)`,
            opacity: 0.4,
          }}
        />
        <Label style={{ marginBottom: 12, color: T.purple }}>{role}</Label>
        <p
          style={{
            fontFamily: T.labelFont,
            fontSize: "0.72rem",
            color: T.fgMuted,
            lineHeight: 1.8,
          }}
        >
          {p1}
        </p>
        <p
          style={{
            fontFamily: T.labelFont,
            fontSize: "0.72rem",
            color: T.fgMuted,
            marginBottom: 22,
          }}
        >
          {p2}
        </p>
        <h2
          style={{
            fontFamily: T.displayFont,
            fontSize: "3.4rem",
            fontWeight: 300,
            color: T.fg,
            lineHeight: 1,
          }}
        >
          {name}
        </h2>
      </div>
    </Reveal>
  );
}

/* ─── Section wrapper ────────────────────────────── */
function Section({ children, style = {} }) {
  return <section style={{ marginBottom: 70, ...style }}>{children}</section>;
}

/* ─── Lotus ornament ─────────────────────────────── */
function Lotus({ size = 90 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="lotusGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#9b72c8" stopOpacity="0.15" />
        </radialGradient>
      </defs>
      <circle
        cx="45"
        cy="45"
        r="42"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="0.6"
        opacity="0.25"
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <ellipse
          key={a}
          cx="45"
          cy="22"
          rx="7"
          ry="16"
          fill="rgba(155,114,200,0.15)"
          stroke="#9b72c8"
          strokeWidth="0.5"
          opacity="0.7"
          transform={`rotate(${a} 45 45)`}
        />
      ))}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse
          key={a}
          cx="45"
          cy="30"
          rx="5"
          ry="11"
          fill="rgba(201,168,76,0.18)"
          stroke="#c9a84c"
          strokeWidth="0.5"
          opacity="0.8"
          transform={`rotate(${a} 45 45)`}
        />
      ))}
      <circle
        cx="45"
        cy="45"
        r="12"
        fill="url(#lotusGrad)"
        stroke="#c9a84c"
        strokeWidth="0.8"
        opacity="0.6"
      />
      <circle cx="45" cy="45" r="5" fill="#c9a84c" opacity="0.45" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════ */
export default function WeddingDetails() {
  const router = useRouter();
  const countdown = useCountdown("2026-08-19T10:30:00");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  /* ─── Couple image URL ───────────────────────────── */
  /* Replace this with your actual image path, e.g. "/images/couple.jpg" */
  const COUPLE_IMAGE_URL = "../couple_image.png"; // e.g. "/images/couple.jpg" or "https://..."

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(170deg, #1a0835 0%, #0d0820 40%, #070515 100%)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <Stars />

      {/* Ambient blobs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(155,114,200,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "-5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Close button */}
      <motion.button
        onClick={() => router.push("/")}
        whileHover={{ scale: 1.05, borderColor: "rgba(201,168,76,0.5)" }}
        whileTap={{ scale: 0.96 }}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 100,
          fontFamily: T.labelFont,
          fontSize: "0.5rem",
          letterSpacing: "0.25em",
          color: T.fgMuted,
          textTransform: "uppercase",
          cursor: "pointer",
          background: "rgba(13,8,32,0.8)",
          backdropFilter: "blur(16px)",
          padding: "10px 20px",
          borderRadius: 30,
          border: `1px solid ${T.border}`,
        }}
      >
        ← Close
      </motion.button>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 440,
          margin: "0 auto",
          padding: "0 28px 100px",
        }}
      >
        {/* ══ 1. HERO ══════════════════════════════════ */}
        <div
          ref={heroRef}
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            style={{
              y: heroY,
              opacity: heroOpacity,
              textAlign: "center",
              width: "100%",
            }}
          >
            <Reveal custom={0}>
              <Label style={{ marginBottom: 32 }}>
                ✦ &nbsp; Please Join Us &nbsp; ✦
              </Label>
            </Reveal>

            <Reveal custom={1}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                style={{ margin: "0 auto 28px" }}
              >
                <Lotus size={100} />
              </motion.div>
            </Reveal>

            <Reveal custom={2}>
              <h1
                style={{
                  fontFamily: T.displayFont,
                  fontSize: "clamp(3.5rem, 14vw, 5rem)",
                  color: T.fg,
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                Sameera
              </h1>
            </Reveal>

            <Reveal custom={3}>
              <p
                style={{
                  fontFamily: T.displayFont,
                  fontSize: "2rem",
                  color: T.gold,
                  fontStyle: "italic",
                  margin: "8px 0",
                }}
              >
                &amp;
              </p>
            </Reveal>

            <Reveal custom={4}>
              <h1
                style={{
                  fontFamily: T.displayFont,
                  fontSize: "clamp(3.5rem, 14vw, 5rem)",
                  color: T.fg,
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                Chathurika
              </h1>
            </Reveal>

            <Reveal custom={5}>
              <Label style={{ marginTop: 28, color: T.fgMuted }}>
                Wednesday · 19 August · 2026
              </Label>
            </Reveal>

            <Reveal custom={6}>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ marginTop: 42, color: T.goldMid, fontSize: "0.7rem" }}
              >
                ↓ scroll
              </motion.div>
            </Reveal>
          </motion.div>
        </div>

        {/* ══ 2. INTRO ══════════════════════════════════ */}
        <Section>
          <Reveal custom={0}>
            <p
              style={{
                fontFamily: T.labelFont,
                fontSize: "0.72rem",
                color: T.fgMuted,
                textAlign: "center",
                lineHeight: 2.2,
                letterSpacing: "0.05em",
              }}
            >
              You are cordially invited to celebrate
              <br />
              the union of two souls in love
            </p>
          </Reveal>

          <Reveal custom={1} style={{ marginTop: 32 }}>
            <div
              style={{
                width: 210,
                height: 210,
                borderRadius: "50%",
                margin: "0 auto",
                background: "linear-gradient(135deg, #2a1650, #1a0e38)",
                border: `2px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 0 12px rgba(201,168,76,0.04), 0 0 0 24px rgba(155,114,200,0.03), 0 30px 80px rgba(0,0,0,0.5)`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {COUPLE_IMAGE_URL ? (
                <img
                  src={COUPLE_IMAGE_URL}
                  alt="Sameera & Chathurika"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                    display: "block",
                  }}
                />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "3.5rem" }}>💑</div>
                  <p
                    style={{
                      fontFamily: T.labelFont,
                      fontSize: "0.38rem",
                      color: T.fgFaint,
                      letterSpacing: "0.3em",
                      marginTop: 8,
                    }}
                  >
                    PHOTO
                  </p>
                </div>
              )}

              {/* Shimmer ring — always on top */}
              <div
                style={{
                  position: "absolute",
                  inset: -1,
                  borderRadius: "50%",
                  border: "1px solid rgba(201,168,76,0.2)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </Reveal>
        </Section>

        {/* ══ 3. PARENTS ════════════════════════════════ */}
        <Section>
          <PersonCard
            role="Beloved Daughter of"
            p1="Mr. D. G Jayathissa"
            p2="& Mrs. Sitha Dayarathne"
            name="Chathurika"
            custom={0}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "10px 0",
            }}
          >
            <Reveal custom={1}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #9b72c8, #c9a84c)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 30px rgba(155,114,200,0.3)",
                }}
              >
                <span
                  style={{
                    fontFamily: T.displayFont,
                    fontSize: "1.8rem",
                    color: "#fff",
                    fontStyle: "italic",
                  }}
                >
                  &amp;
                </span>
              </motion.div>
            </Reveal>
          </div>

          <PersonCard
            role="Beloved Son of"
            p1="Mr. A. K. A Sumanapala"
            p2="& Mrs. W. G. Chandrika"
            name="Sameera"
            custom={2}
          />
        </Section>

        {/* ══ 4. DATE & TIME ════════════════════════════ */}
        <Section>
          <Divider />
          <Reveal custom={0}>
            <Label style={{ textAlign: "center", marginBottom: 28 }}>
              The Day
            </Label>
          </Reveal>

          <Reveal custom={1}>
            <div
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 24,
                padding: "36px 28px",
                backdropFilter: "blur(24px)",
                textAlign: "center",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,168,76,0.08)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: `linear-gradient(to right, transparent, ${T.gold}, transparent)`,
                  opacity: 0.4,
                }}
              />

              <div
                style={{
                  fontFamily: T.displayFont,
                  fontSize: "5rem",
                  color: T.gold,
                  lineHeight: 0.9,
                  fontWeight: 300,
                  marginBottom: 4,
                }}
              >
                19
              </div>
              <div
                style={{
                  fontFamily: T.displayFont,
                  fontSize: "1.6rem",
                  color: T.fg,
                  letterSpacing: "0.12em",
                  marginBottom: 4,
                }}
              >
                AUGUST
              </div>
              <div
                style={{
                  fontFamily: T.displayFont,
                  fontSize: "1.2rem",
                  color: T.fgMuted,
                  letterSpacing: "0.3em",
                }}
              >
                2026
              </div>

              <div
                style={{
                  margin: "24px 0",
                  height: 1,
                  background: `linear-gradient(to right, transparent, ${T.goldMid}, transparent)`,
                }}
              />

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background:
                    "linear-gradient(135deg, rgba(155,114,200,0.2), rgba(155,114,200,0.1))",
                  border: "1px solid rgba(155,114,200,0.3)",
                  borderRadius: 40,
                  padding: "10px 22px",
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: "0.9rem" }}>🪷</span>
                <Label style={{ color: T.purple, letterSpacing: "0.2em" }}>
                  Poruwa at 11:05 AM
                </Label>
              </div>

              <div style={{ marginTop: 4 }}>
                <div
                  style={{
                    fontFamily: T.displayFont,
                    fontSize: "2.6rem",
                    color: T.fg,
                    fontWeight: 300,
                  }}
                >
                  09:00 AM
                </div>
                <Label style={{ color: T.fgMuted, marginTop: 6 }}>
                  to 04:00 PM
                </Label>
              </div>

              <div style={{ marginTop: 20 }}>
                <span
                  style={{
                    fontFamily: T.labelFont,
                    fontSize: "0.42rem",
                    letterSpacing: "0.4em",
                    color: T.gold,
                    background: T.goldFaint,
                    padding: "6px 18px",
                    borderRadius: 20,
                    border: `1px solid ${T.goldMid}`,
                    textTransform: "uppercase",
                  }}
                >
                  Saturday
                </span>
              </div>
            </div>
          </Reveal>
        </Section>

        {/* ══ 5. COUNTDOWN ══════════════════════════════ */}
        <Section>
          <Divider />
          <Reveal custom={0}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2
                style={{
                  fontFamily: T.displayFont,
                  fontSize: "2.2rem",
                  color: T.fg,
                  fontWeight: 300,
                }}
              >
                The Wait Until <em style={{ color: T.gold }}>Magic</em>
              </h2>
              <Label style={{ marginTop: 12, color: T.fgMuted }}>
                Counting Down
              </Label>
            </div>
          </Reveal>

          <Reveal custom={1}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <CountdownUnit value={countdown.days} label="Days" />
              <CountdownUnit value={countdown.hours} label="Hours" />
              <CountdownUnit value={countdown.minutes} label="Mins" />
              <CountdownUnit value={countdown.seconds} label="Secs" />
            </div>
          </Reveal>
        </Section>

        {/* ══ 6. VENUE ══════════════════════════════════ */}
        <Section>
          <Divider />
          <Reveal custom={0}>
            <Label style={{ marginBottom: 14 }}>The Venue</Label>
          </Reveal>

          <Reveal custom={1}>
            <h2
              style={{
                fontFamily: T.displayFont,
                fontSize: "clamp(2.8rem, 10vw, 3.8rem)",
                color: T.fg,
                fontWeight: 300,
                lineHeight: 1.05,
                marginBottom: 8,
              }}
            >
              Green Valley
              <br />
              Resort
            </h2>
          </Reveal>

          <Reveal custom={2}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: T.purpleFaint,
                  border: `1px solid rgba(155,114,200,0.3)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LocationPin size={16} color={T.purple} />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: T.labelFont,
                    fontSize: "0.7rem",
                    color: T.fg,
                    fontWeight: 500,
                    lineHeight: 1.6,
                  }}
                >
                  Akuressa
                </p>
                <p
                  style={{
                    fontFamily: T.labelFont,
                    fontSize: "0.65rem",
                    color: T.fgMuted,
                  }}
                >
                  Sri Lanka
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal custom={3}>
            <p
              style={{
                fontFamily: T.labelFont,
                fontSize: "0.7rem",
                color: T.fgMuted,
                lineHeight: 2,
                marginBottom: 28,
              }}
            >
              We can't wait to celebrate together in an evening filled with
              love, music, and unforgettable memories.
            </p>
          </Reveal>

          {/* Map */}
          <Reveal custom={4}>
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                height: 220,
                border: `1px solid ${T.border}`,
                boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                marginBottom: 20,
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.2649299116115!2d80.47964157364686!3d6.09497292799757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae1424155fb6e45%3A0x785d5d52b126a25c!2sWasana%20Hotel!5e0!3m2!1sen!2slk!4v1778253008203!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  display: "block",
                  filter: "invert(90%) hue-rotate(180deg)",
                }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </Reveal>

          {/* Directions button */}
          <Reveal custom={5}>
            <motion.a
              href="https://www.google.com/maps/place/Wasana+Hotel/@6.0949729,80.4796416,17z/data=!3m1!4b1!4m6!3m5!1s0x3ae1424155fb6e45:0x785d5d52b126a25c!8m2!3d6.0949676!4d80.4822165!16s%2Fg%2F11b633y8n2?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 12px 40px rgba(201,168,76,0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                padding: "18px",
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
                border: `1px solid ${T.border}`,
                color: T.gold,
                fontFamily: T.labelFont,
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                textDecoration: "none",
                backdropFilter: "blur(16px)",
              }}
            >
              <LocationPin size={14} color={T.gold} />
              <span>Get Directions</span>
            </motion.a>
          </Reveal>
        </Section>

        {/* ══ FOOTER ════════════════════════════════════ */}
        <Divider />
        <div style={{ textAlign: "center", paddingBottom: 20 }}>
          <Reveal custom={0}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <Lotus size={60} />
              </motion.div>
            </div>
          </Reveal>

          <Reveal custom={1}>
            <p
              style={{
                fontFamily: T.displayFont,
                fontSize: "1.3rem",
                fontStyle: "italic",
                color: T.fgMuted,
                margin: "20px 0 8px",
              }}
            >
              "Two souls, one beautiful journey"
            </p>
          </Reveal>

          <Reveal custom={2}>
            <Label style={{ color: T.fgFaint, fontSize: "0.4rem" }}>
              Sameera &amp; Chathurika · August 2026
            </Label>
          </Reveal>

          <Reveal custom={3}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                marginTop: 20,
                color: T.gold,
                opacity: 0.4,
              }}
            >
              {["✦", "✦", "✦"].map((s, i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.6,
                    repeat: Infinity,
                  }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
