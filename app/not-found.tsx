import { NavbarServer } from "@/components/shared/NavbarServer"
import { Metadata } from "next"
import { ButtonCustom } from "@/components/ui/ButtonCustom"

export const metadata: Metadata = {
  title: "404 — Página no encontrada",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <>
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideTag {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes drawCircle {
          from { stroke-dashoffset: 1600; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes floatCenter {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50%       { transform: rotate(3deg); }
        }

        .anim-eyebrow { animation: slideTag     0.6s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .anim-title-1 { animation: fadeSlideDown 0.7s cubic-bezier(.22,1,.36,1) 0.2s both; }
        .anim-title-2 { animation: fadeSlideDown 0.7s cubic-bezier(.22,1,.36,1) 0.32s both; }
        .anim-sub     { animation: fadeIn        0.5s ease 0.45s both; }
        .anim-buttons { animation: fadeSlideUp   0.6s cubic-bezier(.22,1,.36,1) 0.55s both; }
        .anim-badge   { animation: scaleUp       0.7s cubic-bezier(.34,1.56,.64,1) 0.6s both; }
        .anim-ring    { animation: fadeIn        1s ease 0.8s both; }
        .anim-draw    { animation: drawCircle    2s cubic-bezier(.22,1,.36,1) 0.5s both; }

        .badge-spin  { animation: spinSlow 18s linear infinite; transform-origin: center; }
        .float-badge { animation: floatCenter 5s ease-in-out infinite; }
        .glow        { animation: glowPulse 4s ease-in-out infinite; }
        .wiggle      { animation: wiggle 3s ease-in-out infinite; }

        .grain-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.06;
          pointer-events: none;
          z-index: 1;
        }

        .arc-text {
          font-size: 11px;
          letter-spacing: 3px;
          fill: currentColor;
          text-transform: uppercase;
        }

        .title-glow {
          filter: drop-shadow(0 0 30px rgba(212,170,0,0.35));
        }
      `}</style>
    
    <NavbarServer />
      <div className="bg-bg-dark relative w-full flex flex-col h-dvh overflow-hidden items-center justify-center">
        <div className="grain-overlay" />

        {/* Glow central */}
        <div className="glow absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[420px] h-[420px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(212,170,0,0.18) 0%, transparent 70%)" }} />
        </div>

        {/* Círculo SVG animado */}
        <div className="anim-draw absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="absolute w-[420px] h-[420px] sm:w-[520px] sm:h-[520px]" viewBox="0 0 600 600">
            <circle cx="300" cy="300" r="240" fill="none" stroke="rgba(212,170,0,0.2)"
              strokeWidth="1" strokeDasharray="1600" />
          </svg>
        </div>

        {/* Círculos exteriores */}
        <div className="anim-ring absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[680px] h-[680px] rounded-full border border-brand-primary/10" />
        </div>
        <div className="anim-ring absolute inset-0 flex items-center justify-center pointer-events-none" style={{ animationDelay: "0.15s" }}>
          <div className="w-[880px] h-[880px] rounded-full border border-brand-primary/[0.06]" />
        </div>

        {/* Top left tag */}
        <div className="anim-eyebrow absolute top-26 left-8 hidden lg:flex items-center gap-2">
          <span className="w-6 h-px bg-braborder-brand-primary/80" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary">Etzatlán, Jalisco</span>
        </div>

        {/* Top right tag */}
        <div className="anim-eyebrow absolute top-26 right-8 hidden lg:flex items-center gap-2" style={{ animationDelay: "0.2s" }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary">Desde 2020</span>
          <span className="w-6 h-px bg-brand-primary/80" />
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">

          {/* Eyebrow */}
          <div className="anim-eyebrow flex items-center gap-3">
            <span className="w-8 h-px bg-brand-primary/40" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary/70 font-medium">Error de navegación</span>
            <span className="w-8 h-px bg-brand-primary/40" />
          </div>

          {/* 404 como título principal */}
          <div className="title-glow flex flex-col items-center leading-none">
            <h1 className="anim-title-1 font-title leading-none text-brand-primary text-8xl sm:text-9xl md:text-[10rem] lg:text-[13rem]"
              style={{ textShadow: "3px 5px 0px rgba(0,0,0,0.5)" }}>
              404
            </h1>
          </div>

          {/* Mensaje con tono de la marca */}
          <div className="anim-sub flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 w-full max-w-sm">
              <span className="flex-1 h-px bg-brand-primary/30" />
              <span className="w-1 h-1 rounded-full bg-brand-primary/50" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-primary/60">página no encontrada</span>
              <span className="w-1 h-1 rounded-full bg-brand-primary/50" />
              <span className="flex-1 h-px bg-brand-primary/30" />
            </div>
            <p className="text-brand-primary/50 text-sm max-w-xs leading-relaxed mt-2">
              Esta página se perdió como los <span className="text-brand-primary/80 italic">panecitos del día</span> — a veces no hay.
            </p>
          </div>

          {/* Botones */}
          <div className="anim-buttons flex flex-col xs:flex-row gap-3 pt-2">
            <ButtonCustom title="Volver al inicio" url="/" isFilled={true} className="outline-brand-primary text-brand-primary" />
            <ButtonCustom title="Ver el menú" url="/menu" isFilled={false} className="text-text-main" />
          </div>
        </div>

        {/* Badge rotatorio */}
        <div className="anim-badge float-badge absolute bottom-12 right-10 hidden lg:block">
          <svg width="110" height="110" viewBox="0 0 110 110" className="text-brand-primary/40">
            <path id="circle-path-404" d="M 55,55 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
            <text className="arc-text badge-spin">
              <textPath href="#circle-path-404">CENTRAL MOLLETES · CAFETERÍA · ETZATLÁN ·</textPath>
            </text>
            <circle cx="55" cy="55" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="55" cy="55" r="4" fill="currentColor" opacity="0.3" />
          </svg>
        </div>

        {/* Scroll hint reemplazado por "volver" */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          style={{ animation: "fadeIn 1s ease 1.2s both", opacity: 0 }}>
          <span className="text-[9px] uppercase tracking-[0.3em] text-brand-primary/30">Central Molletes</span>
          <div className="w-px h-8 bg-brand-primary/20" />
        </div>

      </div>
    </>
  )
}