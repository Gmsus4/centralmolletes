"use client"

import { signIn } from "next-auth/react"
import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import Toast from "@/components/ui/Toast"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    })

    if (result?.error) {
      setError("Email o contraseña incorrectos")

      setLoading(false)
      return 
    }

    // router.push("/admin")
    router.push("/admin?success=true")
  }

  return (
    <div className="bg-bg-dark relative w-full flex flex-col min-h-dvh overflow-hidden items-center justify-center">
      <Suspense>
        <Toast message="Has cerrado sesión correctamente" type="success"/>
      </Suspense>
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Central gold glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[480px] h-[480px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(212,170,0,0.14) 0%, transparent 70%)" }}
        />
      </div>

      {/* Animated SVG ring */}
      <div className="anim-draw absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg className="absolute w-[420px] h-[420px] sm:w-[520px] sm:h-[520px]" viewBox="0 0 600 600">
          <circle
            cx="300" cy="300" r="240"
            fill="none"
            stroke="rgba(212,170,0,0.15)"
            strokeWidth="1"
            strokeDasharray="1600"
          />
        </svg>
      </div>

      {/* Outer rings */}
      <div className="anim-ring absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[680px] h-[680px] rounded-full border border-brand-primary/10" />
      </div>
      <div
        className="anim-ring absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ animationDelay: "0.15s" }}
      >
        <div className="w-[880px] h-[880px] rounded-full border border-brand-primary/[0.06]" />
      </div>

      {/* Top-left tag */}
      <div className="anim-eyebrow absolute top-8 left-8 hidden lg:flex items-center gap-2">
        <span className="w-6 h-px bg-brand-primary/80" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary">Etzatlán, Jalisco</span>
      </div>

      {/* Top-right tag */}
      <div
        className="anim-eyebrow absolute top-8 right-8 hidden lg:flex items-center gap-2"
        style={{ animationDelay: "0.2s" }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary">Desde 2020</span>
        <span className="w-6 h-px bg-brand-primary/80" />
      </div>

      {/* Card */}
      <div
        className="relative z-10 flex flex-col items-center gap-8 px-8 py-10 w-full max-w-sm"
        style={{ animation: "fadeIn 0.8s ease 0.1s both" }}
      >

        {/* Eyebrow */}
        <div className="anim-eyebrow flex items-center gap-3">
          <span className="w-8 h-px bg-brand-primary/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary/70 font-medium">Cafetería</span>
          <span className="w-8 h-px bg-brand-primary/40" />
        </div>

        {/* Brand title */}
        <div className="title-glow flex flex-col items-center leading-none -mt-2">
          <h1 className="flex flex-col items-center">
            <span
              className="anim-title-1 font-title leading-none text-brand-primary text-3xl"
              style={{ textShadow: "2px 3px 0px rgba(0,0,0,0.4)" }}
            >
              Central
            </span>
            <span
              className="anim-title-2 font-title leading-none text-brand-primary text-7xl sm:text-8xl"
              style={{ textShadow: "3px 5px 0px rgba(0,0,0,0.5)", marginTop: "-0.05em" }}
            >
              molletes
            </span>
          </h1>
        </div>

        {/* Divider */}
        <div className="anim-divider flex items-center gap-3 w-full">
          <span className="flex-1 h-px bg-brand-primary/30" />
          <span className="w-1 h-1 rounded-full bg-brand-primary/50" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-brand-primary/60">Acceso</span>
          <span className="w-1 h-1 rounded-full bg-brand-primary/50" />
          <span className="flex-1 h-px bg-brand-primary/30" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-[0.25em] text-brand-primary/60">
              Correo electrónico
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="tu@correo.com"
              className="
                w-full bg-transparent border border-brand-primary/20
                px-4 py-3
                text-brand-primary text-sm placeholder:text-brand-primary/30
                outline-none focus:border-brand-primary/60
                transition-colors duration-300 rounded-radius
              "
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-[0.25em] text-brand-primary/60">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="
                w-full bg-transparent border border-brand-primary/20
                px-4 py-3
                text-brand-primary text-sm placeholder:text-brand-primary/30
                outline-none focus:border-brand-primary/60
                transition-colors duration-300 rounded-radius
              "
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-[11px] tracking-wide text-red-400/80 text-center -mt-1">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
              type="submit"
              disabled={loading}
              className={`
                relative mt-2 w-full
                bg-brand-primary text-text-main
                px-6 py-3.5
                text-[11px] uppercase tracking-[0.3em] font-semibold
                transition-opacity duration-300
                hover:opacity-90 active:opacity-75
                disabled:opacity-50 rounded-radius hover:bg-brand-primary-hover
                ${loading ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border border-border-color/40 border-t-bordborder-border-color"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
                Entrando…
              </span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>

      {/* Rotary badge */}
      <div className="float-badge absolute bottom-12 right-10 hidden lg:block">
        <svg width="110" height="110" viewBox="0 0 110 110" className="text-brand-primary/40">
          <path id="circle-path-login" d="M 55,55 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
          <text className="arc-text badge-spin">
            <textPath href="#circle-path-login">CENTRAL MOLLETES · CAFETERÍA · ETZATLÁN ·</textPath>
          </text>
          <circle cx="55" cy="55" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="55" cy="55" r="4" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}