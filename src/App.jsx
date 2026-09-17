import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   CLICK CREATIVO — Prototipo de sitio
   Paleta: azul petróleo #123C4D · naranja #F0743A · beige #EDE5D8 · negro #1A1A1A
   Tipografías: Poppins (display) + Inter (texto)
   Concepto: "el clic" = movimiento + conexión. La intro es el logo
   (dos mitades) que se unen al hacer click. Ese es EL momento animado.
   ============================================================ */

// ---- Logo real de Click Creativo, vectorizado del original ----
// Dos ganchos entrelazados (path izquierdo azul + path derecho naranja).
// viewBox 0 0 200 135. En estado unido forman el eslabón; con split se separan.
const HOOK_L = "M 59.65,0.21 C 55.14,0.72 50.29,2.30 43.47,5.51 C 27.12,13.18 13.48,26.25 7.00,40.23 C -3.26,62.50 -2.19,87.47 9.87,105.67 C 21.37,123.04 37.89,132.50 59.36,134.08 C 64.77,134.48 74.36,133.63 80.50,132.28 C 99.55,127.94 116.86,114.24 128.81,94.06 C 131.46,89.61 133.99,83.30 133.37,82.73 C 132.70,82.06 103.89,69.60 103.56,69.77 C 103.33,69.94 102.99,70.84 102.77,71.74 C 102.26,74.05 97.64,81.04 94.26,84.48 C 86.70,92.32 76.56,95.36 65.73,93.10 C 58.29,91.53 48.99,84.25 45.16,77.04 C 40.54,68.36 40.54,57.09 45.10,48.52 C 48.94,41.36 59.76,33.24 67.31,32.00 C 70.81,31.38 71.43,31.16 71.20,30.42 C 71.09,30.03 69.45,23.15 67.48,15.09 C 65.56,7.03 63.87,0.27 63.65,0.10 C 63.48,-0.07 61.67,-0.01 59.65,0.21 Z";
const HOOK_R = "M 126.16,1.28 C 119.28,2.41 111.17,5.00 105.58,7.88 C 88.73,16.39 75.54,32.45 68.16,53.37 C 66.24,58.72 64.94,65.43 65.68,66.16 C 66.13,66.61 70.64,67.63 91.32,71.97 L 97.36,73.21 L 98.03,70.11 C 99.44,62.95 103.61,55.51 109.14,49.98 C 116.97,42.20 131.74,40.12 142.34,45.42 C 155.08,51.73 161.78,64.19 159.92,77.94 C 158.57,87.75 150.62,97.78 140.42,102.63 L 136.98,104.27 L 138.33,107.03 C 139.07,108.55 142.22,115.03 145.32,121.46 C 148.37,127.94 151.13,133.18 151.36,133.18 C 153.05,133.13 159.19,130.48 162.74,128.28 C 176.33,119.88 188.67,106.24 194.25,93.39 C 198.31,84.09 200.00,75.80 200.00,65.26 C 199.94,45.30 193.41,29.18 180.50,17.12 C 165.50,3.14 147.01,-2.27 126.16,1.28 Z";

function ClickLogo({ size = 120, split = 0, colorL = "#123C4D", colorR = "#F0743A", mono }) {
  // split: 0 = logo real entrelazado; >0 = ganchos separados en diagonal ("antes")
  const c = mono || null;
  // viewBox con padding simétrico (px) para que al separarse el logo no se
  // salga ni se descentre. El logo real ocupa 200x135; agregamos margen.
  const padX = 55, padY = 40;
  const vbW = 200 + padX * 2, vbH = 135 + padY * 2;
  const h = size * (vbH / vbW);
  return (
    <svg width={size} height={h} viewBox={`0 0 ${vbW} ${vbH}`} aria-label="Click Creativo" style={{ display: "block", overflow: "visible" }}>
      <g transform={`translate(${padX} ${padY})`}>
        {/* gancho izquierdo — se aleja hacia arriba-izquierda al separarse */}
        <g style={{
          transform: `translate(${-split}px, ${-split * .5}px)`,
          transition: "transform .7s cubic-bezier(.34,1.3,.5,1)",
        }}>
          <path d={HOOK_L} fill={c || colorL} />
        </g>
        {/* gancho derecho — se aleja hacia abajo-derecha al separarse */}
        <g style={{
          transform: `translate(${split}px, ${split * .5}px)`,
          transition: "transform .7s cubic-bezier(.34,1.3,.5,1)",
        }}>
          <path d={HOOK_R} fill={c || colorR} />
        </g>
      </g>
    </svg>
  );
}

// ---- Hook: revela un elemento cuando entra en viewport (una sola vez) ----
function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); obs.disconnect(); }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, seen];
}

// ---- Hook: cuenta de 0 hasta un número cuando entra en viewport ----
function useCountUp(target, { duration = 1400, decimals = 0 } = {}) {
  const [val, setVal] = useState(0);
  const [ref, seen] = useInView({ threshold: 0.4 });
  useEffect(() => {
    if (!seen) return;
    let raf, start;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, target]);
  return [ref, val];
}

// ---- Título de sección con efecto de revelado tipo máscara ----
function RevealTitle({ children, color = "#123C4D", eyebrowText, eyebrowColor }) {
  const [ref, seen] = useInView({ threshold: 0.3 });
  return (
    <div ref={ref}>
      {eyebrowText && (
        <p style={{
          ...eyebrow(eyebrowColor || "#F0743A"),
          opacity: seen ? 1 : 0, transform: seen ? "none" : "translateY(8px)",
          transition: "opacity .5s ease, transform .5s ease",
        }}>{eyebrowText}</p>
      )}
      <div style={{ overflow: "hidden" }}>
        <h2 style={{
          ...h2, color,
          transform: seen ? "translateY(0)" : "translateY(105%)",
          transition: "transform .7s cubic-bezier(.22,1,.36,1) .1s",
        }}>{children}</h2>
      </div>
    </div>
  );
}

const NAV = ["Nosotras", "Servicios", "Clientes", "Resultados", "Contacto"];

const WHATSAPP = "5492646608412"; // 264 660 8412
const waLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

const FOUNDERS = [
  { name: "Candela Coll", role: "Cofundadora · Comunicación & Estrategia", img: "/Cande.jpg" },
  { name: "Clara Avellaneda", role: "Cofundadora · Contenido & Producción", img: "/Clari.jpg" },
];

const MISION = "Conectar marcas con personas a través de ideas creativas ejecutadas con precisión profesional — en redes sociales, contenido, campañas y producción audiovisual.";

const VALORES = [
  { t: "Creatividad con propósito", d: "Cada idea busca un objetivo, no solo llamar la atención." },
  { t: "Acompañamiento real", d: "Estamos con vos en cada etapa, con seguimiento constante y comunicación directa, no solo entrega de reportes." },
  { t: "Resultados que impulsan", d: "Cada acción se mide contra un objetivo de negocio, no solo de likes." },
  { t: "Diferenciación", d: "Te ayudamos a construir una marca que se distinga de tu competencia, no una plantilla más." },
  { t: "Conexión genuina", d: "El fin último de todo lo anterior: que tu marca haga clic con las personas correctas." },
];

const SERVICES = [
  { n: "01", t: "Gestión de redes", d: "Instagram, Facebook y TikTok. Ideamos, planificamos y publicamos contenido estratégico para que tu marca tenga presencia activa y alineada a sus objetivos.", tone: "beige", img: "Grilla de reels (Donata) — vertical", kind: "grid" },
  { n: "02", t: "Contenido orgánico", d: "Fotos, videos, reels y piezas audiovisuales auténticas, pensadas para conectar con tu público y mostrar el valor real de tu empresa.", tone: "orange", img: "Persona filmando con celular — vertical", kind: "photo" },
  { n: "03", t: "Cobertura aérea con dron", d: "Imágenes y videos aéreos de alta calidad para mostrar proyectos, instalaciones y espacios desde una perspectiva diferencial.", tone: "blue", img: "VIDEO de dron — horizontal (pendiente)", kind: "video" },
  { n: "04", t: "Fotografía profesional", d: "Producciones de productos, espacios, equipos y servicios. Imágenes que potencian tu identidad visual y transmiten confianza.", tone: "beige", img: "Platos / botella Seis Luces / uvas — vertical", kind: "photo" },
  { n: "05", t: "Análisis de experiencia", d: "Analizamos tu empresa desde la mirada real del cliente. Te mostramos qué mejorar, cómo hacerlo y por qué ayuda a crecer.", tone: "orange", img: "Sin imagen aún", kind: "none" },
  { n: "06", t: "Cobertura de eventos", d: "Registramos eventos corporativos y sociales con contenido dinámico para difusión y posicionamiento de marca.", tone: "blue", img: "Sin imagen aún", kind: "none" },
  { n: "07", t: "Pauta publicitaria", d: "Gestión y optimización de campañas en Meta Ads: segmentación, monitoreo y ajuste según rendimiento.", tone: "beige", img: "Sin imagen aún", kind: "none" },
  { n: "08", t: "Manual de marca", d: "Desarrollamos tu identidad visual completa: paleta, tipografías, usos del logo y criterios de aplicación.", tone: "orange", img: "Sin imagen aún", kind: "none" },
];

const CLIENTS = [
  "Donata del Desierto", "Punto Donata", "La Vereda Donata", "Refugio Donata",
  "Club Andino Mercedario", "Coldwell Banker Impacto Pro", "Seis Luces", "El Retorno",
  "Jarana Sanguchería", "Andalué", "Vasco Pescadería", "INAR Energía Solar",
  "Parador Corona", "ARG Carpas", "GEG Servicios", "Peñón del Águila",
  "Plug & Play", "Wabi Sabi", "Belle Pur", "Aurae Centro Holístico",
  "Session Pro", "Quintana House", "Black Pear", "Beable",
  "GR Consultora", "Nutricionista Gabriela Badías", "Doble Pe", "Agencia LJ",
];

const TESTIMONIALS = [
  { tag: "cobertura de evento", txt: "Chicas, ¿cómo andan? Quería agradecerles por el laburo que hicieron ayer, ¡me encantaron las fotos y los videos! Y gracias también por la buena onda y la predisposición.", who: "Cliente — Cobertura" },
  { tag: "gestión de redes", txt: "Se está re notando el laburo de todas, estamos teniendo muchísimas devoluciones positivas de la gente y eso es re lindo. Además se empezó a mover mucho y ya están saliendo presupuestos nuevos.", who: "Nani — Redes sociales" },
  { tag: "análisis de experiencia", txt: "Nos ayudaron a ver cosas que no veíamos de puertas adentro. El informe fue clarísimo y con acciones concretas, no solo diagnóstico.", who: "Cliente — Análisis CX" },
];

const STATS = [
  { num: 3, prefix: "+", suffix: "", l: "años de trayectoria" },
  { num: 20, prefix: "+", suffix: "", l: "marcas acompañadas" },
  { num: 436, prefix: "", suffix: "k", l: "visualizaciones en un mes" },
  { num: 8, prefix: "", suffix: "", l: "servicios integrales" },
];

export default function App() {
  const [entered, setEntered] = useState(false);
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#123C4D", background: "#EDE5D8" }}>
      <StyleTag />
      {!entered && <Intro onEnter={() => setEntered(true)} />}
      {entered && <Site />}
    </div>
  );
}

/* ===================== INTRO ===================== */
function Intro({ onEnter }) {
  const [clicked, setClicked] = useState(false);
  const handle = () => {
    if (clicked) return;
    setClicked(true);
    setTimeout(onEnter, 850); // deja terminar la unión + fade
  };
  return (
    <div
      onClick={handle}
      className="intro"
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "#EDE5D8", cursor: "pointer",
        opacity: clicked ? 0 : 1, transition: "opacity .5s ease .35s",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: 34, display: "flex", justifyContent: "center" }}>
          <ClickLogo size={160} split={clicked ? 0 : 40} colorL="#123C4D" colorR="#F0743A" />
        </div>
        <h1 style={{
          fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "clamp(38px,7vw,68px)",
          lineHeight: .92, letterSpacing: "-.02em", margin: 0,
        }}>
          <span style={{ color: "#123C4D" }}>click</span>{" "}
          <span style={{ color: "#F0743A" }}>creativo</span>
        </h1>
        <p style={{ fontSize: 15, letterSpacing: ".18em", textTransform: "uppercase", marginTop: 14, color: "#123C4D", opacity: .7 }}>
          agencia de comunicación digital
        </p>

        <button
          onClick={(e) => { e.stopPropagation(); handle(); }}
          className="pulse"
          style={{
            marginTop: 46, border: "none", cursor: "pointer",
            background: "#F0743A", color: "#EDE5D8",
            fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 18,
            padding: "18px 46px", borderRadius: 999,
            display: "inline-flex", alignItems: "center", gap: 12,
          }}
        >
          <span style={{
            width: 12, height: 12, borderRadius: 999, background: "#EDE5D8",
            boxShadow: clicked ? "0 0 0 8px rgba(237,229,216,.35)" : "none", transition: "box-shadow .3s",
          }} />
          Hacé clic para entrar
        </button>
        <p style={{ fontSize: 13, marginTop: 22, opacity: .55 }}>Estás a un clic de impulsar tu marca</p>
      </div>
    </div>
  );
}

/* ===================== SITE (router simple) ===================== */
function Site() {
  const [route, setRoute] = useState("home"); // "home" | "servicios" | "nosotros" | "clientes"
  useEffect(() => { window.scrollTo(0, 0); }, [route]);
  return (
    <div style={{ animation: "fadeIn .6s ease both" }}>
      <Header route={route} go={setRoute} />
      {route === "home" && (
        <>
          <Hero go={setRoute} />
          <NosotrasPreview go={setRoute} />
          <Concepto />
          <ServiciosPreview go={setRoute} />
          <MarcasCinta go={setRoute} />
          <Resultados />
          <Contacto />
        </>
      )}
      {route === "servicios" && <ServiciosPage go={setRoute} />}
      {route === "nosotros" && <NosotrosPage go={setRoute} />}
      {route === "clientes" && <ClientesPage go={setRoute} />}
      <Footer go={setRoute} />
    </div>
  );
}

function Header({ route, go }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const dark = solid || route === "servicios" || route === "nosotros" || route === "clientes";
  const items = [
    { label: "Nosotros", to: "nosotros" },
    { label: "Servicios", to: "servicios" },
    { label: "Clientes", to: "clientes" },
    { label: "Contacto", to: "home", hash: "contacto" },
  ];
  const nav = (it) => {
    if (it.to === "servicios" || it.to === "nosotros" || it.to === "clientes") { go(it.to); return; }
    if (route !== "home") { go("home"); setTimeout(() => document.getElementById(it.hash)?.scrollIntoView({ behavior: "smooth" }), 60); }
    else document.getElementById(it.hash)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px clamp(18px,5vw,56px)",
      background: dark ? "rgba(18,60,77,.97)" : "transparent",
      transition: "background .3s",
    }}>
      <div onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <ClickLogo size={34} split={0} colorL={dark ? "#EDE5D8" : "#123C4D"} colorR="#F0743A" />
        <span style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 18,
          color: dark ? "#EDE5D8" : "#123C4D",
        }}>click creativo</span>
      </div>
      <nav style={{ display: "flex", gap: 28, alignItems: "center" }} className="nav-desktop">
        {items.map((it) => {
          const active = (route === "servicios" && it.to === "servicios") || (route === "nosotros" && it.to === "nosotros") || (route === "clientes" && it.to === "clientes");
          return (
            <button key={it.label} onClick={() => nav(it)} style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500,
              color: dark ? "#EDE5D8" : "#123C4D", opacity: active ? 1 : .9,
              borderBottom: active ? "2px solid #F0743A" : "2px solid transparent",
              paddingBottom: 3,
            }}>{it.label}</button>
          );
        })}
      </nav>
    </header>
  );
}

function Hero({ go }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 100); return () => clearTimeout(t); }, []);
  const step = (d) => ({
    opacity: on ? 1 : 0, transform: on ? "none" : "translateY(24px)",
    transition: `opacity .7s ease ${d}s, transform .7s cubic-bezier(.22,1,.36,1) ${d}s`,
  });
  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "0 clamp(18px,6vw,90px)", background: "#EDE5D8", position: "relative", overflow: "hidden",
    }}>
      {/* marca de agua: logo gigante */}
      <div style={{ position: "absolute", right: "-6%", top: "12%", opacity: on ? .06 : 0, transition: "opacity 1.2s ease .4s" }}>
        <ClickLogo size={640} split={0} mono="#123C4D" />
      </div>
      <div style={{ position: "relative", maxWidth: 1100 }}>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, letterSpacing: ".22em", textTransform: "uppercase", color: "#F0743A", marginBottom: 20, ...step(0.1) }}>
          agencia de comunicación digital · san juan
        </p>
        <h1 style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(44px,9vw,104px)",
          lineHeight: .95, letterSpacing: "-.03em", margin: 0, color: "#123C4D", ...step(0.22),
        }}>
          Estás a un clic<br />de impulsar<br />tu marca
        </h1>
        <p style={{ fontSize: "clamp(16px,2.2vw,21px)", lineHeight: 1.55, maxWidth: 560, marginTop: 30, color: "#123C4D", ...step(0.38) }}>
          Conectamos marcas con personas a través de ideas creativas ejecutadas con
          precisión profesional — en redes, contenido, campañas y producción audiovisual.
        </p>
        <div style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap", ...step(0.52) }}>
          <a href="#contacto" style={btnPrimary}>Impulsá tu marca</a>
          <button onClick={() => go("servicios")} style={{ ...btnGhost, cursor: "pointer" }}>Ver servicios</button>
        </div>
      </div>
    </section>
  );
}

function StatCard({ s, i }) {
  const [ref, val] = useCountUp(s.num, { duration: 1300 });
  const display = s.suffix === "k" ? Math.round(val) + "k" : Math.round(val).toString();
  return (
    <div ref={ref} style={{
      background: "#123C4D", borderRadius: 18, padding: "30px 26px",
    }}>
      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 42, color: "#F0743A", lineHeight: 1 }}>
        {s.prefix}{display}
      </div>
      <div style={{ fontSize: 14, color: "#EDE5D8", marginTop: 8, opacity: .85 }}>{s.l}</div>
    </div>
  );
}

function NosotrasPreview({ go }) {
  const [ref, seen] = useInView();
  return (
    <section id="nosotras" ref={ref} style={{ background: "#F0743A", color: "#EDE5D8", padding: "clamp(70px,10vw,130px) clamp(18px,6vw,90px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="grid-2">
        <div>
          <RevealTitle color="#EDE5D8" eyebrowText="quiénes somos" eyebrowColor="#123C4D">
            Dos comunicadoras obsesionadas con que tu marca conecte
          </RevealTitle>
          <p style={{
            fontSize: 18, lineHeight: 1.6, marginTop: 24, maxWidth: 520,
            opacity: seen ? 1 : 0, transform: seen ? "none" : "translateY(16px)",
            transition: "opacity .6s ease .25s, transform .6s ease .25s",
          }}>
            Somos <strong>Candela Coll</strong> y <strong>Clara Avellaneda</strong>. Hace más de 3 años
            ayudamos a empresas a mejorar su presencia digital con contenido estratégico y una
            comunicación más profesional, cercana y efectiva. Trabajamos con más de 20 marcas de
            distintos rubros, adaptando cada estrategia a sus objetivos.
          </p>
          <button onClick={() => go("nosotros")} style={{
            marginTop: 30, background: "#123C4D", color: "#EDE5D8", border: "none", cursor: "pointer",
            fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, padding: "15px 32px", borderRadius: 999,
            opacity: seen ? 1 : 0, transition: "opacity .6s ease .4s",
          }}>Conocé más sobre nosotras</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {STATS.map((s, i) => <StatCard key={s.l} s={s} i={i} />)}
        </div>
      </div>
    </section>
  );
}

// El "clic" — concepto de marca. El logo se une al entrar en pantalla.
function Concepto() {
  const [ref, seen] = useInView({ threshold: 0.4 });
  return (
    <section ref={ref} style={{ background: "#123C4D", color: "#EDE5D8", padding: "clamp(80px,12vw,150px) clamp(18px,6vw,90px)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", marginBottom: 30 }}>
          <ClickLogo size={90} split={seen ? 0 : 30} colorL="#EDE5D8" colorR="#F0743A" />
        </div>
        <p style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(24px,4vw,40px)", lineHeight: 1.3, letterSpacing: "-.01em",
          opacity: seen ? 1 : 0, transform: seen ? "none" : "translateY(20px)",
          transition: "opacity .7s ease .2s, transform .7s ease .2s",
        }}>
          Un clic es el instante exacto en el que algo conecta: una idea que prende, un
          contenido que detiene el scroll, una campaña que <span style={{ color: "#F0743A" }}>hace clic</span> con su público.
        </p>
        <p style={{
          fontSize: 17, lineHeight: 1.65, marginTop: 28, opacity: seen ? .8 : 0, maxWidth: 640, margin: "28px auto 0",
          transform: seen ? "none" : "translateY(16px)",
          transition: "opacity .7s ease .4s, transform .7s ease .4s",
        }}>
          Ese instante es nuestro territorio. Movimiento y conexión, precisión y chispa.
          Esa doble lectura es el corazón de lo que hacemos.
        </p>
      </div>
    </section>
  );
}

function ServiciosPreview({ go }) {
  return (
    <section id="servicios" style={{ background: "#EDE5D8", padding: "clamp(70px,10vw,130px) clamp(18px,6vw,90px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <RevealTitle color="#123C4D" eyebrowText="qué hacemos" eyebrowColor="#F0743A">
          Ocho servicios para que tu marca conecte de verdad
        </RevealTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20, marginTop: 50 }}>
          {SERVICES.map((s, i) => <ServiceCard key={s.n} s={s} i={i} />)}
        </div>
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <button onClick={() => go("servicios")} style={{ ...btnPrimary, cursor: "pointer" }}>Ver todos los servicios en detalle</button>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ s, i }) {
  const [ref, seen] = useInView({ threshold: 0.15 });
  const [hov, setHov] = useState(false);
  const palette = {
    beige: { bg: "#EDE5D8", fg: "#123C4D", accent: "#F0743A", border: "#123C4D" },
    orange: { bg: "#F0743A", fg: "#EDE5D8", accent: "#123C4D", border: "#F0743A" },
    blue: { bg: "#123C4D", fg: "#EDE5D8", accent: "#F0743A", border: "#123C4D" },
  }[s.tone];
  const isBeige = s.tone === "beige";
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: palette.bg, color: palette.fg,
        border: isBeige ? "1.5px solid rgba(18,60,77,.18)" : "none",
        borderRadius: 20, padding: "34px 30px 30px", minHeight: 230,
        display: "flex", flexDirection: "column",
        opacity: seen ? 1 : 0,
        transform: seen ? (hov ? "translateY(-6px) scale(1)" : "none") : "translateY(34px) scale(.97)",
        transition: seen
          ? `opacity .6s ease ${(i % 3) * 0.1}s, transform .35s ease`
          : "opacity .6s ease, transform .6s ease",
        boxShadow: hov ? "0 18px 40px -18px rgba(18,60,77,.5)" : "none",
      }}
    >
      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 15, color: palette.accent, letterSpacing: ".1em" }}>{s.n}</div>
      <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 23, margin: "10px 0 12px", lineHeight: 1.15 }}>{s.t}</h3>
      <p style={{ fontSize: 15, lineHeight: 1.55, opacity: .88, flexGrow: 1 }}>{s.d}</p>
    </div>
  );
}

function MarcasCinta({ go }) {
  // Cinta transportadora: dos mitades iguales que se deslizan en loop.
  // Cada "logo" es un placeholder; en Lovable van las imágenes reales.
  const row = (dir) => (
    <div className={`marquee-track ${dir}`} style={{ display: "flex", gap: 24, width: "max-content" }}>
      {[...CLIENTS, ...CLIENTS].map((c, i) => (
        <div key={dir + i} style={{
          flexShrink: 0, width: 170, height: 90, borderRadius: 14,
          background: "#FFFFFF", border: "1.5px solid rgba(18,60,77,.12)",
          display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
          padding: "0 16px", color: "#123C4D",
          fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14,
        }}>{c}</div>
      ))}
    </div>
  );
  return (
    <section id="clientes" style={{ background: "#123C4D", color: "#EDE5D8", padding: "clamp(70px,10vw,120px) 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(18px,6vw,90px)" }}>
        <RevealTitle color="#EDE5D8" eyebrowText="confían en nosotras" eyebrowColor="#F0743A">
          Marcas con las que trabajamos
        </RevealTitle>
        <p style={{ fontSize: 18, lineHeight: 1.6, marginTop: 20, maxWidth: 540, opacity: .85 }}>
          Más de 20 marcas de San Juan y la región ya hicieron clic con nosotras.
        </p>
      </div>
      {/* cintas */}
      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="marquee" style={{ overflow: "hidden" }}>{row("to-right")}</div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(18px,6vw,90px)", marginTop: 50 }}>
        <button onClick={() => go("clientes")} style={{ ...btnPrimary, cursor: "pointer" }}>Ver todos los clientes y testimonios</button>
      </div>
    </section>
  );
}

function Resultados() {
  return (
    <section id="resultados" style={{ background: "#F0743A", color: "#EDE5D8", padding: "clamp(70px,10vw,130px) clamp(18px,6vw,90px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <RevealTitle color="#EDE5D8" eyebrowText="resultados y testimonios" eyebrowColor="#123C4D">
          Lo que dicen las marcas que ya hicieron clic
        </RevealTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22, marginTop: 50 }}>
          {TESTIMONIALS.map((t, i) => <Testimonial key={i} t={t} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function Testimonial({ t, i }) {
  const [ref, seen] = useInView({ threshold: 0.15 });
  // entran deslizando alternado: impares desde la derecha, pares desde la izquierda
  const fromX = i % 2 === 0 ? -40 : 40;
  return (
    <div ref={ref} style={{
      background: "#EDE5D8", color: "#123C4D", borderRadius: 22, padding: "30px 28px",
      opacity: seen ? 1 : 0, transform: seen ? "none" : `translateX(${fromX}px)`,
      transition: `opacity .6s ease ${i * 0.12}s, transform .6s cubic-bezier(.22,1,.36,1) ${i * 0.12}s`,
    }}>
      <div style={{ display: "inline-block", background: "#F0743A", color: "#EDE5D8", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 999, marginBottom: 16 }}>{t.tag}</div>
      <p style={{ fontSize: 16, lineHeight: 1.6, fontStyle: "italic" }}>“{t.txt}”</p>
      <p style={{ fontSize: 13, fontWeight: 600, marginTop: 16, color: "#F0743A" }}>{t.who}</p>
    </div>
  );
}

function Contacto() {
  return (
    <section id="contacto" style={{ background: "#123C4D", color: "#EDE5D8", padding: "clamp(80px,12vw,150px) clamp(18px,6vw,90px)", textAlign: "center" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "inline-block", marginBottom: 26 }}>
          <ClickLogo size={80} split={0} colorL="#EDE5D8" colorR="#F0743A" />
        </div>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(34px,6vw,64px)", lineHeight: 1, letterSpacing: "-.02em", margin: 0 }}>
          Potenciá tu marca<br />en el mundo digital
        </h2>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
          <a href={waLink("Hola Click Creativo, quiero impulsar mi marca")} target="_blank" rel="noreferrer" style={btnPrimary}>Escribinos por WhatsApp</a>
          <a href="mailto:clickcreativo.cm@gmail.com" style={btnGhostLight}>clickcreativo.cm@gmail.com</a>
        </div>
      </div>
    </section>
  );
}

/* ===================== PÁGINA: SERVICIOS ===================== */
function ServiciosPage({ go }) {
  return (
    <div>
      {/* hero de la página */}
      <section style={{ background: "#123C4D", color: "#EDE5D8", padding: "clamp(120px,16vw,190px) clamp(18px,6vw,90px) clamp(50px,7vw,80px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={eyebrow("#F0743A")}>nuestros servicios</p>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(38px,7vw,80px)", lineHeight: 1, letterSpacing: "-.03em", margin: 0, maxWidth: 800 }}>
            Todo lo que tu marca necesita para hacer clic
          </h1>
          <p style={{ fontSize: "clamp(16px,2.2vw,20px)", lineHeight: 1.6, maxWidth: 560, marginTop: 24, opacity: .85 }}>
            Ocho servicios integrales que combinamos según lo que tu marca necesita. Estrategia, contenido y producción, todo en un mismo equipo.
          </p>
        </div>
      </section>

      {/* franjas de servicios alternadas */}
      {SERVICES.map((s, i) => <ServiceStripe key={s.n} s={s} i={i} />)}

      {/* cierre */}
      <section style={{ background: "#F0743A", color: "#EDE5D8", padding: "clamp(70px,10vw,120px) clamp(18px,6vw,90px)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(28px,5vw,52px)", lineHeight: 1.05, letterSpacing: "-.02em", margin: 0 }}>
          ¿No sabés cuál necesitás?
        </h2>
        <p style={{ fontSize: 18, marginTop: 18, opacity: .9, maxWidth: 520, margin: "18px auto 0" }}>
          Escribinos y armamos juntos el combo que mejor se adapta a tu marca.
        </p>
        <a href={waLink("Hola Click Creativo, quiero que me asesoren sobre qué servicios necesito para mi marca")} target="_blank" rel="noreferrer"
          style={{ ...btnPrimary, background: "#123C4D", marginTop: 30 }}>Hablar por WhatsApp</a>
      </section>
    </div>
  );
}

function ServiceStripe({ s, i }) {
  const [ref, seen] = useInView({ threshold: 0.25 });
  const reversed = i % 2 === 1;
  const bg = i % 2 === 0 ? "#EDE5D8" : "#FFFFFF";
  const fg = "#123C4D";
  return (
    <section ref={ref} style={{ background: bg, color: fg, padding: "clamp(50px,8vw,90px) clamp(18px,6vw,90px)" }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", display: "grid",
        gridTemplateColumns: "1fr 1fr", gap: "clamp(30px,5vw,70px)", alignItems: "center",
        direction: reversed ? "rtl" : "ltr",
      }} className="grid-2">
        {/* texto */}
        <div style={{
          direction: "ltr",
          opacity: seen ? 1 : 0, transform: seen ? "none" : `translateX(${reversed ? 30 : -30}px)`,
          transition: "opacity .6s ease, transform .6s cubic-bezier(.22,1,.36,1)",
        }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 60, color: "#F0743A", lineHeight: 1, opacity: .25 }}>{s.n}</div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(26px,3.5vw,40px)", lineHeight: 1.1, letterSpacing: "-.01em", margin: "6px 0 18px" }}>{s.t}</h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: 480, opacity: .88 }}>{s.d}</p>
          <a href={waLink(`Hola Click Creativo, me interesa el servicio de ${s.t}`)} target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 26, textDecoration: "none", color: "#F0743A", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16 }}>
            Consultar por WhatsApp
            <span style={{ fontSize: 20 }}>→</span>
          </a>
        </div>
        {/* imagen (placeholder que indica qué va) */}
        <div style={{
          direction: "ltr",
          opacity: seen ? 1 : 0, transform: seen ? "none" : "scale(.96)",
          transition: "opacity .7s ease .1s, transform .7s cubic-bezier(.22,1,.36,1) .1s",
        }}>
          <ImgPlaceholder s={s} />
        </div>
      </div>
    </section>
  );
}

function ImgPlaceholder({ s }) {
  const vertical = s.kind === "photo" || s.kind === "grid";
  const isVideo = s.kind === "video";
  const none = s.kind === "none";
  return (
    <div style={{
      width: "100%", aspectRatio: vertical ? "4 / 5" : "16 / 10",
      borderRadius: 20, overflow: "hidden", position: "relative",
      background: none ? "repeating-linear-gradient(45deg, #EDE5D8, #EDE5D8 12px, #e4dccd 12px, #e4dccd 24px)" : "#123C4D",
      border: "1.5px solid rgba(18,60,77,.15)",
      display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24,
    }}>
      {isVideo && (
        <div style={{ position: "absolute", top: 14, left: 14, background: "#F0743A", color: "#EDE5D8", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 999 }}>▶ VIDEO</div>
      )}
      <div style={{ color: none ? "#123C4D" : "#EDE5D8", opacity: none ? .6 : .9 }}>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15 }}>{none ? "Imagen pendiente" : "IMAGEN"}</div>
        <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>{s.img}</div>
      </div>
    </div>
  );
}


/* ===================== PÁGINA: CLIENTES ===================== */
function ClientesPage({ go }) {
  return (
    <div>
      {/* hero */}
      <section style={{ background: "#F0743A", color: "#EDE5D8", padding: "clamp(120px,16vw,190px) clamp(18px,6vw,90px) clamp(50px,7vw,80px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={eyebrow("#123C4D")}>nuestros clientes</p>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(38px,7vw,80px)", lineHeight: 1, letterSpacing: "-.03em", margin: 0, maxWidth: 820 }}>
            Marcas que ya hicieron clic
          </h1>
          <p style={{ fontSize: "clamp(16px,2.2vw,20px)", lineHeight: 1.6, maxWidth: 560, marginTop: 24, opacity: .9 }}>
            Más de 20 empresas de distintos rubros de San Juan y la región confían en nosotras. Hacé clic en cada marca para ver su perfil.
          </p>
        </div>
      </section>

      {/* grilla de logos */}
      <ClientesGrid />

      {/* testimonios */}
      <section style={{ background: "#123C4D", color: "#EDE5D8", padding: "clamp(70px,10vw,120px) clamp(18px,6vw,90px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <RevealTitle color="#EDE5D8" eyebrowText="resultados y testimonios" eyebrowColor="#F0743A">
            Lo que dicen las marcas que ya hicieron clic
          </RevealTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22, marginTop: 50 }}>
            {TESTIMONIALS.map((t, i) => <Testimonial key={i} t={t} i={i} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#EDE5D8", color: "#123C4D", padding: "clamp(70px,10vw,120px) clamp(18px,6vw,90px)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(28px,5vw,52px)", lineHeight: 1.05, letterSpacing: "-.02em", margin: 0 }}>
          ¿Tu marca es la próxima?
        </h2>
        <a href={waLink("Hola Click Creativo, quiero sumar mi marca")} target="_blank" rel="noreferrer" style={{ ...btnPrimary, marginTop: 30 }}>Escribinos por WhatsApp</a>
      </section>
    </div>
  );
}

function ClientesGrid() {
  return (
    <section style={{ background: "#EDE5D8", padding: "clamp(60px,9vw,100px) clamp(18px,6vw,90px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 18 }}>
          {CLIENTS.map((c, i) => <ClientLogo key={c} c={c} i={i} />)}
        </div>
        <p style={{ marginTop: 26, fontSize: 14, color: "#123C4D", opacity: .55 }}>* Cada recuadro es el lugar del logo real; en Lovable se sube la imagen y se enlaza al Instagram de cada marca.</p>
      </div>
    </section>
  );
}

function ClientLogo({ c, i }) {
  const [ref, seen] = useInView({ threshold: 0.1 });
  const [hov, setHov] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={`Ver perfil de ${c}`}
      style={{
        aspectRatio: "1 / 1", borderRadius: 16, background: "#FFFFFF",
        border: "1.5px solid rgba(18,60,77,.12)", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 14,
        color: "#123C4D", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14,
        opacity: seen ? 1 : 0,
        transform: seen ? (hov ? "translateY(-4px)" : "none") : "scale(.94)",
        transition: `opacity .5s ease ${(i % 6) * 0.05}s, transform .3s ease`,
        boxShadow: hov ? "0 14px 30px -14px rgba(18,60,77,.4)" : "none",
      }}
    >{c}</div>
  );
}


/* ===================== PÁGINA: NOSOTROS ===================== */
function NosotrosPage({ go }) {
  return (
    <div>
      {/* hero */}
      <section style={{ background: "#EDE5D8", color: "#123C4D", padding: "clamp(120px,16vw,190px) clamp(18px,6vw,90px) clamp(50px,7vw,80px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-8%", top: "20%", opacity: .05 }}>
          <ClickLogo size={560} split={0} mono="#123C4D" />
        </div>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <p style={eyebrow("#F0743A")}>quiénes somos</p>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(38px,7vw,82px)", lineHeight: 1, letterSpacing: "-.03em", margin: 0, maxWidth: 860 }}>
            Detrás de cada clic hay una estrategia
          </h1>
        </div>
      </section>

      {/* historia */}
      <NosotrosHistoria />

      {/* fundadoras */}
      <NosotrosFundadoras />

      {/* misión */}
      <section style={{ background: "#F0743A", color: "#EDE5D8", padding: "clamp(70px,10vw,120px) clamp(18px,6vw,90px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={eyebrow("#123C4D")}>nuestra misión</p>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(24px,3.6vw,40px)", lineHeight: 1.3, letterSpacing: "-.01em", marginTop: 10 }}>
            {MISION}
          </p>
        </div>
      </section>

      {/* valores */}
      <NosotrosValores />

      {/* CTA cierre */}
      <section style={{ background: "#123C4D", color: "#EDE5D8", padding: "clamp(70px,10vw,120px) clamp(18px,6vw,90px)", textAlign: "center" }}>
        <div style={{ display: "inline-block", marginBottom: 24 }}>
          <ClickLogo size={70} split={0} colorL="#EDE5D8" colorR="#F0743A" />
        </div>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(28px,5vw,52px)", lineHeight: 1.05, letterSpacing: "-.02em", margin: 0 }}>
          Hagamos que tu marca haga clic
        </h2>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          <a href={waLink("Hola Click Creativo, quiero trabajar con ustedes")} target="_blank" rel="noreferrer" style={btnPrimary}>Escribinos por WhatsApp</a>
          <button onClick={() => go("servicios")} style={{ ...btnGhostLight, cursor: "pointer" }}>Ver servicios</button>
        </div>
      </section>
    </div>
  );
}

function NosotrosHistoria() {
  const [ref, seen] = useInView({ threshold: 0.25 });
  return (
    <section ref={ref} style={{ background: "#FFFFFF", color: "#123C4D", padding: "clamp(60px,9vw,110px) clamp(18px,6vw,90px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "clamp(30px,5vw,70px)", alignItems: "start" }} className="grid-2">
        <div style={{ opacity: seen ? 1 : 0, transform: seen ? "none" : "translateY(20px)", transition: "opacity .6s ease, transform .6s ease" }}>
          <RevealTitle color="#123C4D" eyebrowText="nuestra historia" eyebrowColor="#F0743A">
            Empezamos con una idea simple
          </RevealTitle>
        </div>
        <div style={{ opacity: seen ? 1 : 0, transform: seen ? "none" : "translateY(20px)", transition: "opacity .6s ease .15s, transform .6s ease .15s" }}>
          <p style={{ fontSize: 18, lineHeight: 1.7 }}>
            Somos dos estudiantes de Comunicación especializadas en comunicación digital, creación
            de contenido y estrategias para marcas. Hace más de tres años trabajamos ayudando a
            empresas y negocios a mejorar su presencia digital, creando contenido estratégico y
            desarrollando una comunicación más profesional, cercana y efectiva.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.7, marginTop: 20 }}>
            Contamos con experiencia junto a más de 20 empresas de distintos rubros, adaptando cada
            estrategia a las necesidades y objetivos de cada marca. En Click Creativo buscamos que
            cada empresa pueda diferenciarse, conectar con su público y crecer a través de una
            comunicación auténtica y estratégica.
          </p>
        </div>
      </div>
    </section>
  );
}

function NosotrosFundadoras() {
  return (
    <section style={{ background: "#EDE5D8", color: "#123C4D", padding: "clamp(60px,9vw,110px) clamp(18px,6vw,90px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <RevealTitle color="#123C4D" eyebrowText="las fundadoras" eyebrowColor="#F0743A">
          Las que hacen que todo conecte
        </RevealTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 50 }} className="grid-2">
          {FOUNDERS.map((f, i) => <FounderCard key={f.name} f={f} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function FounderCard({ f, i }) {
  const [ref, seen] = useInView({ threshold: 0.2 });
  return (
    <div ref={ref} style={{
      display: "flex", gap: 22, alignItems: "center",
      opacity: seen ? 1 : 0, transform: seen ? "none" : "translateY(24px)",
      transition: `opacity .6s ease ${i * 0.12}s, transform .6s cubic-bezier(.22,1,.36,1) ${i * 0.12}s`,
    }}>
            {/* foto redonda: si img es una ruta muestra la foto; si no, el texto */}
      <div style={{
        width: 120, height: 120, borderRadius: 999, flexShrink: 0, overflow: "hidden",
        background: "#123C4D", color: "#EDE5D8", border: "3px solid #F0743A",
        display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
        fontSize: 11, fontWeight: 600, lineHeight: 1.3,
      }}>
        {f.img && f.img.startsWith("/")
          ? <img src={f.img} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <span style={{ padding: 12 }}>{f.img}</span>}
      </div>
      <div>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 24, margin: 0 }}>{f.name}</h3>
        <p style={{ fontSize: 15, color: "#F0743A", fontWeight: 600, marginTop: 6 }}>{f.role}</p>
      </div>
    </div>
  );
}

function NosotrosValores() {
  return (
    <section style={{ background: "#FFFFFF", color: "#123C4D", padding: "clamp(60px,9vw,110px) clamp(18px,6vw,90px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <RevealTitle color="#123C4D" eyebrowText="lo que nos guía" eyebrowColor="#F0743A">
          Nuestros valores
        </RevealTitle>
        <div style={{ marginTop: 40 }}>
          {VALORES.map((v, i) => <ValorRow key={v.t} v={v} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function ValorRow({ v, i }) {
  const [ref, seen] = useInView({ threshold: 0.4 });
  return (
    <div ref={ref} style={{
      display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(20px,4vw,50px)", alignItems: "baseline",
      padding: "26px 0", borderTop: "1.5px solid rgba(18,60,77,.14)",
      opacity: seen ? 1 : 0, transform: seen ? "none" : "translateX(-24px)",
      transition: "opacity .55s ease, transform .55s cubic-bezier(.22,1,.36,1)",
    }} className="valor-row">
      <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(20px,2.6vw,28px)", margin: 0, color: "#F0743A", minWidth: 260 }}>{v.t}</h3>
      <p style={{ fontSize: 17, lineHeight: 1.6, opacity: .88 }}>{v.d}</p>
    </div>
  );
}


function Footer({ go }) {
  return (
    <footer style={{ background: "#1A1A1A", color: "#EDE5D8", padding: "34px clamp(18px,6vw,90px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
      <div onClick={() => go && go("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <ClickLogo size={28} split={0} colorL="#EDE5D8" colorR="#F0743A" />
        <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700 }}>click creativo</span>
      </div>
      <p style={{ fontSize: 13, opacity: .6 }}>Estás a un clic de impulsar tu marca · San Juan, Argentina</p>
    </footer>
  );
}

/* ===================== estilos compartidos ===================== */
const h2 = { fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4.5vw,46px)", lineHeight: 1.05, letterSpacing: "-.02em", margin: 0 };
const eyebrow = (c) => ({ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: ".2em", textTransform: "uppercase", color: c, marginBottom: 16 });
const btnPrimary = { background: "#F0743A", color: "#EDE5D8", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, padding: "16px 34px", borderRadius: 999, textDecoration: "none", display: "inline-block" };
const btnGhost = { background: "transparent", color: "#123C4D", border: "1.5px solid #123C4D", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, padding: "16px 34px", borderRadius: 999, textDecoration: "none", display: "inline-block" };
const btnGhostLight = { background: "transparent", color: "#EDE5D8", border: "1.5px solid rgba(237,229,216,.5)", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, padding: "16px 34px", borderRadius: 999, textDecoration: "none", display: "inline-block" };

function StyleTag() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; }
      html { scroll-behavior: smooth; }
      @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      @keyframes marqueeRight {
        0% { transform: translateX(-50%); }
        100% { transform: translateX(0); }
      }
      .marquee-track.to-right { animation: marqueeRight 40s linear infinite; }
      .marquee:hover .marquee-track { animation-play-state: paused; }
      .pulse { animation: pulse 2s infinite; }
      @keyframes pulse {
        0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(240,116,58,.4); }
        50% { transform: scale(1.03); box-shadow: 0 0 0 14px rgba(240,116,58,0); }
      }
      a { transition: opacity .2s; }
      a:hover { opacity: .82; }
      @media (max-width: 760px) {
        .grid-2 { grid-template-columns: 1fr !important; }
        .nav-desktop { display: none !important; }
        .valor-row { grid-template-columns: 1fr !important; gap: 6px !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; transition: none !important; }
      }
    `}</style>
  );
}
