import { Titles } from "@/data/titles"
import { ButtonCustom } from "../ui/ButtonCustom"
import Image from "next/image"

export const Hero = () => {
  return (
    <div className="bg-bg-dark relative w-full flex flex-col h-dvh overflow-hidden items-center justify-center">
      <div className="grain-overlay" />

      <Image
        src="/hero.webp"
        alt="Hero background"
        fill
        priority
        className="object-cover object-[70%_center] sm:object-center"
        style={{ opacity: 0.25 }}
      />

      {/* Glow amarillo central */}
      <div className="glow absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[420px] h-[420px] rounded-full" style={{ background: "radial-gradient(circle, rgba(212,170,0,0.18) 0%, transparent 70%)" }} />
      </div>

      {/* Círculo SVG que se dibuja */}
      <div className="anim-draw absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg className="absolute w-[420px] h-[420px] sm:w-[520px] sm:h-[520px]" viewBox="0 0 600 600">
          <circle cx="300" cy="300" r="240" fill="none" stroke="rgba(212,170,0,0.2)" strokeWidth="1" strokeDasharray="1600" />
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
        <span className="w-6 h-px bg-brand-primary/80" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary">Etzatlán, Jalisco</span>
      </div>

      {/* Top right tag */}
      <div className="anim-eyebrow absolute top-26 right-8 hidden lg:flex items-center gap-2" style={{ animationDelay: "0.2s" }}>
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary">Desde 2020</span>
        <span className="w-6 h-px bg-brand-primary/80" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
        {/* Eyebrow */}
        <div className="anim-eyebrow flex items-center gap-3">
          <span className="w-8 h-px bg-brand-primary/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary/70 font-medium">Cafetería</span>
          <span className="w-8 h-px bg-brand-primary/40" />
        </div>

        {/* Título dos líneas */}
        <div className=" flex flex-col items-center leading-none"> {/* s */}
          <h1 className="flex flex-col">
            <span
              className={`anim-title-1 font-title leading-none text-brand-primary
              text-4xl sm:text-4xl md:text-5xl lg:text-6xl
              ${Titles.home.isUppercase ? "uppercase" : ""}`}
              style={{ textShadow: "2px 3px 0px rgba(0,0,0,0.4)" }}
            >
              Central
            </span>
            <span
              className={`anim-title-2 font-title leading-none text-brand-primary
              text-8xl sm:text-9xl md:text-[8rem] lg:text-[11rem]
              ${Titles.home.isUppercase ? "uppercase" : ""}`}
              style={{ textShadow: "3px 5px 0px rgba(0,0,0,0.5)", marginTop: "-0.05em" }}
            >
              molletes
            </span>
          </h1>
        </div>

        {/* Divider */}
        <div className="anim-divider flex items-center gap-3 w-full max-w-xs">
          <span className="flex-1 h-px bg-brand-primary/30" />
          <span className="w-1 h-1 rounded-full bg-brand-primary/50" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-brand-primary/60">{Titles.home.subtitle}</span>
          <span className="w-1 h-1 rounded-full bg-brand-primary/50" />
          <span className="flex-1 h-px bg-brand-primary/30" />
        </div>

        {/* Buttons */}
        <div className="anim-buttons flex flex-col xs:flex-row gap-3 pt-2">
          <ButtonCustom title="Explorar menú" url="/menu" isFilled={true} className="!outline-brand-primary !text-brand-primary" />
          <ButtonCustom title="Ubicaciones" url="/locations" isFilled={false} className="text-bg-dark" />
        </div>
      </div>

      {/* Badge rotatorio */}
      <div className="anim-badge float-badge absolute bottom-12 right-10 hidden lg:block">
        <svg width="110" height="110" viewBox="0 0 110 110" className="text-primary/40">
          <path id="circle-path" d="M 55,55 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
          <text className="arc-text badge-spin">
            <textPath href="#circle-path">CENTRAL MOLLETES · CAFETERÍA · ETZATLÁN ·</textPath>
          </text>
          <circle cx="55" cy="55" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="55" cy="55" r="4" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5" style={{ animation: "fadeIn 1s ease 1.2s both", opacity: 0 }}>
        <span className="text-[9px] uppercase tracking-[0.3em] text-brand-primary/80">Scroll</span>
        <div className="w-px h-8 bg-brand-primary/80" />
      </div>
    </div>
  )
}
