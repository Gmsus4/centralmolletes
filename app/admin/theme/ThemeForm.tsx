"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ThemeSchema, ThemeFormValues } from "@/lib/validators/theme"
import { AdminFormLayout } from "../components/AdminFormLayout"
import { useDuplicate } from "@/hooks/useDuplicate"
import { useFormOverlay } from "@/hooks/useFormOverlay"
import { SavingOverlay } from "@/components/ui/saving-overlay"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

// ─── Types ────────────────────────────────────────────────────────────────────

type Theme = {
  id: string
  name: string
  bgBody: string
  bgDark: string
  textMain: string
  textTitles: string
  textMuted: string
  textInvert: string
  brandPrimary: string
  brandPrimaryHover: string
  brandContrast: string
  brandContrastHover: string
  borderColor: string
  statusError: string
  shadowColor: string
  radius: string
  radiusFull: string
  fontTitle: string
  fontBody: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RADIUS_PRESETS = ["0px", "4px", "8px", "12px", "16px", "9999px"]

const FONT_TITLE_OPTIONS = [
  { value: "serif", label: "Serif" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Playfair Display, serif", label: "Playfair Display" },
  { value: "Lobster Two, cursive", label: "Lobster Two" },
  { value: "Merriweather, serif", label: "Merriweather" },
]

const FONT_BODY_OPTIONS = [
  { value: "sans-serif", label: "Sans-serif" },
  { value: "system-ui, sans-serif", label: "System UI" },
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Onest Variable, sans-serif", label: "Onest" },
  { value: "monospace", label: "Monospace" },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{children}</span>
    <Separator className="flex-1" />
  </div>
)

function ColorInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
}) {
  return (
    <div className="flex flex-col gap-2 p-3 border border-border bg-muted/30">
      <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 border border-border cursor-pointer flex-shrink-0 bg-background"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 px-2 text-xs font-mono"
        />
      </div>
      {error && <span className="text-destructive text-[10px]">{error}</span>}
    </div>
  )
}

function RadiusInput({
  label,
  value,
  presets,
  onChange,
  error,
}: {
  label: string
  value: string
  presets: string[]
  onChange: (v: string) => void
  error?: string
}) {
  return (
    <div className="flex flex-col gap-2 p-3 border border-border bg-muted/30">
      <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="8px"
        className="h-7 px-2 text-xs font-mono"
      />
      <div className="flex gap-1 flex-wrap">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`text-[9px] px-1.5 py-0.5 border transition-colors cursor-pointer ${
              value === p
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/40"
            }`}
            style={{ borderRadius: p === "9999px" ? "9999px" : "3px" }}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 bg-muted border border-border"
          style={{ borderRadius: value }}
        />
        <span className="text-[9px] text-muted-foreground">preview</span>
      </div>
      {error && <span className="text-destructive text-[10px]">{error}</span>}
    </div>
  )
}

function FontSelect({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
  error?: string
}) {
  return (
    <div className="flex flex-col gap-2 p-3 border border-border bg-muted/30">
      <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border focus:border-foreground/40 px-2 py-1.5 text-xs w-full outline-none bg-background text-foreground transition-colors cursor-pointer rounded-none"
        style={{ fontFamily: value }}
      >
        {options.map((f) => (
          <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
            {f.label}
          </option>
        ))}
      </select>
      <span className="text-sm text-foreground" style={{ fontFamily: value }}>
        The quick brown fox
      </span>
      {error && <span className="text-destructive text-[10px]">{error}</span>}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ThemeForm({ theme }: { theme?: Theme }) {
  const router = useRouter()
  const isEditing = !!theme?.id
  const [submitError, setSubmitError] = useState("")
  const [activating, setActivating] = useState(false)
  const { overlayMode, setOverlayMode, isVisible } = useFormOverlay()

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ThemeFormValues>({
    resolver: zodResolver(ThemeSchema),
    defaultValues: {
      name: theme?.name ?? "",
      bgBody: theme?.bgBody ?? "#FDFBF0",
      bgDark: theme?.bgDark ?? "#1A1600",
      textMain: theme?.textMain ?? "#2D2410",
      textTitles: theme?.textTitles ?? "#1A1200",
      textMuted: theme?.textMuted ?? "#726B5A",
      textInvert: theme?.textInvert ?? "#FDFBF0",
      brandPrimary: theme?.brandPrimary ?? "#DDBB02",
      brandPrimaryHover: theme?.brandPrimaryHover ?? "#F5CF03",
      brandContrast: theme?.brandContrast ?? "#3D3200",
      brandContrastHover: theme?.brandContrastHover ?? "#5C4B00",
      borderColor: theme?.borderColor ?? "#000000",
      statusError: theme?.statusError ?? "#000000",
      shadowColor: theme?.shadowColor ?? "#000000",
      radius: theme?.radius ?? "8px",
      radiusFull: theme?.radiusFull ?? "9999px",
      fontTitle: theme?.fontTitle ?? "serif",
      fontBody: theme?.fontBody ?? "sans-serif",
    },
  })

  const colors = watch()

  const handleDuplicate = useDuplicate({
    apiPath: "/api/theme",
    redirectPath: "/admin/theme",
    getValues,
    setOverlayMode,
    setSubmitError,
    nameField: "name",
  })

  const onSubmit = async (data: ThemeFormValues) => {
    setOverlayMode("saving")
    setSubmitError("")

    try {
      const url = isEditing ? `/api/theme/${theme!.id}` : "/api/theme"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setSubmitError(json.error ?? "Hubo un error al guardar")
        return
      }

      setOverlayMode(null)
      router.push(isEditing ? "/admin/theme?edit=true" : "/admin/theme?add=true")
      router.refresh()
    } catch {
      setSubmitError("Error de conexión. Intenta de nuevo.")
    }
  }

  const handleDelete = useCallback(async () => {
    setOverlayMode("deleting")
    await fetch(`/api/theme/${theme!.id}`, { method: "DELETE" })
    router.push("/admin/theme?deleted=true")
    router.refresh()
  }, [theme, router])

  const handleActivate = useCallback(async () => {
    setOverlayMode("saving")
    if (!theme?.id) return
    setActivating(true)
    await fetch(`/api/theme/${theme.id}/activate`, { method: "POST" })
    setActivating(false)
    setOverlayMode(null)
    router.push("/admin/theme?activated=true")
    router.refresh()
  }, [theme, router])

  return (
    <AdminFormLayout
      section="Tema"
      title={isEditing ? "Editar" : "Nuevo"}
      backHref="/admin/theme"
      formId="theme-form"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onDelete={isEditing ? handleDelete : undefined}
      deleteTitle="¿Eliminar tema?"
      deleteDescription="Esta acción no se puede deshacer. El tema será eliminado permanentemente."
      onDuplicate={isEditing ? handleDuplicate : undefined}
      onActivate={isEditing ? handleActivate : undefined}
    >
      <SavingOverlay isVisible={isVisible} mode={overlayMode ?? "saving"} />
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 lg:items-start">
        {/* ── Left: Form ── */}
        <form id="theme-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 flex-1 min-w-0">
          {/* Nombre */}
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Nombre del tema</FieldLabel>
            <Input id="name" {...register("name")} placeholder="Mi tema oscuro…" />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          {/* Colores */}
          <div>
            <SectionTitle>Colores</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["bgBody", "Fondo general"],
                  ["bgDark", "Fondo oscuro"],
                  ["textMain", "Texto base"],
                  ["textTitles", "Títulos"],
                  ["textMuted", "Texto muted"],
                  ["textInvert", "Texto invertido"],
                  ["brandPrimary", "Brand primary"],
                  ["brandPrimaryHover", "Primary hover"],
                  ["brandContrast", "Brand contrast"],
                  ["brandContrastHover", "Contrast hover"],
                  ["borderColor", "Border"],
                  ["statusError", "Error"],
                  ["shadowColor", "Sombra"],
                ] as [keyof ThemeFormValues, string][]
              ).map(([field, label]) => (
                <Controller
                  key={field}
                  control={control}
                  name={field}
                  render={({ field: f }) => (
                    <ColorInput
                      label={label}
                      value={f.value as string}
                      onChange={f.onChange}
                      error={errors[field]?.message}
                    />
                  )}
                />
              ))}
            </div>
          </div>

          {/* Radius */}
          <div>
            <SectionTitle>Radius</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                control={control}
                name="radius"
                render={({ field: f }) => (
                  <RadiusInput label="Radio base" value={f.value} presets={RADIUS_PRESETS} onChange={f.onChange} error={errors.radius?.message} />
                )}
              />
              <Controller
                control={control}
                name="radiusFull"
                render={({ field: f }) => (
                  <RadiusInput label="Radio full" value={f.value} presets={["0px", "9999px"]} onChange={f.onChange} error={errors.radiusFull?.message} />
                )}
              />
            </div>
          </div>

          {/* Tipografía */}
          <div>
            <SectionTitle>Tipografía</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                control={control}
                name="fontTitle"
                render={({ field: f }) => (
                  <FontSelect label="Título" value={f.value} options={FONT_TITLE_OPTIONS} onChange={f.onChange} error={errors.fontTitle?.message} />
                )}
              />
              <Controller
                control={control}
                name="fontBody"
                render={({ field: f }) => (
                  <FontSelect label="Cuerpo" value={f.value} options={FONT_BODY_OPTIONS} onChange={f.onChange} error={errors.fontBody?.message} />
                )}
              />
            </div>
          </div>

          {/* Mobile preview */}
          <div className="lg:hidden">
            <SectionTitle>Preview</SectionTitle>
            <ThemePreview colors={colors} />
          </div>
        </form>

        {/* ── Right: Sticky preview ── */}
        <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0 sticky top-8 self-start">
          <SectionTitle>Preview</SectionTitle>
          <ThemePreview colors={colors} />
        </div>
      </div>
    </AdminFormLayout>
  )
}

// ─── ThemePreview ─────────────────────────────────────────────────────────────
// El preview usa inline styles deliberadamente ya que renderiza
// el tema del cliente (colores arbitrarios), no el tema del admin.
// No aplicar variables semánticas aquí.

type PreviewColors = {
  bgBody: string
  bgDark: string
  textMain: string
  textTitles: string
  textMuted: string
  textInvert: string
  brandPrimary: string
  brandPrimaryHover: string
  brandContrast: string
  brandContrastHover: string
  borderColor: string
  radius: string
  radiusFull: string
  fontTitle: string
  fontBody: string
}

function ThemePreview({ colors }: { colors: PreviewColors }) {
  const { bgBody, bgDark, textMain, textTitles, textMuted, textInvert, brandPrimary, brandContrast, borderColor, radius, radiusFull, fontTitle, fontBody } = colors

  return (
    <div
      style={{
        fontFamily: fontBody,
        fontSize: 13,
        borderRadius: radius,
        overflow: "hidden",
        border: `1px solid ${borderColor}20`,
      }}
    >
      {/* ── NAVBAR ── */}
      <div style={{ background: brandPrimary, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: brandPrimary, borderRadius: radiusFull, padding: "4px 12px", height: 32 }}>
          <span style={{ fontSize: 9, color: brandContrast, fontWeight: 700, letterSpacing: "0.05em" }}>Inicio</span>
          <span style={{ width: 1, height: 12, background: `${brandContrast}30`, margin: "0 2px" }} />
          <span style={{ fontSize: 9, color: brandContrast, fontWeight: 700, opacity: 0.6 }}>Menú</span>
          <span style={{ width: 1, height: 12, background: `${brandContrast}30`, margin: "0 2px" }} />
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: brandContrast, display: "inline-block", margin: "0 4px" }} />
          <span style={{ width: 1, height: 12, background: `${brandContrast}30`, margin: "0 2px" }} />
          <span style={{ fontSize: 9, color: brandContrast, fontWeight: 700, opacity: 0.6 }}>Nosotros</span>
          <span style={{ width: 1, height: 12, background: `${brandContrast}30`, margin: "0 2px" }} />
          <span style={{ fontSize: 9, color: brandContrast, fontWeight: 700, opacity: 0.6 }}>Contacto</span>
        </div>
      </div>

      {/* ── HERO ── */}
      <div style={{ background: bgDark, padding: "22px 16px 18px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8 }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 190, height: 190, borderRadius: "50%", border: `1px solid ${brandPrimary}18`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 270, height: 270, borderRadius: "50%", border: `1px solid ${brandPrimary}0c`, pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 5, position: "relative" }}>
          <span style={{ width: 12, height: 1, background: `${brandPrimary}70` }} />
          <span style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.3em", color: `${brandPrimary}90` }}>Cafetería</span>
          <span style={{ width: 12, height: 1, background: `${brandPrimary}70` }} />
        </div>
        <div style={{ position: "relative", lineHeight: 1 }}>
          <div style={{ fontFamily: fontTitle, color: brandPrimary, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textShadow: `1px 1px 0 rgba(0,0,0,0.5)` }}>Central</div>
          <div style={{ fontFamily: fontTitle, color: brandPrimary, fontSize: 30, fontWeight: 700, lineHeight: 0.88, textShadow: `2px 3px 0 rgba(0,0,0,0.55)`, marginTop: "-0.02em" }}>molletes</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, width: "75%", position: "relative" }}>
          <span style={{ flex: 1, height: 1, background: `${brandPrimary}25` }} />
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: `${brandPrimary}50` }} />
          <span style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.2em", color: `${brandPrimary}60` }}>desde 2020</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: `${brandPrimary}50` }} />
          <span style={{ flex: 1, height: 1, background: `${brandPrimary}25` }} />
        </div>
        <div style={{ display: "flex", gap: 6, position: "relative" }}>
          <span style={{ border: `1px solid ${brandPrimary}`, color: brandPrimary, borderRadius: radiusFull, fontSize: 8, padding: "3px 9px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Explorar menú</span>
          <span style={{ backgroundColor: brandPrimary, border: `1px solid ${textInvert}25`, color: bgDark, borderRadius: radiusFull, fontSize: 8, padding: "3px 9px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Ubicaciones</span>
        </div>
      </div>

      {/* ── MENU ROW ── */}
      <div style={{ background: bgBody, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["Día", "Noche"].map((t, i) => (
            <span key={t} style={{ fontSize: 8, padding: "3px 8px", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, border: `1px solid ${i === 0 ? borderColor : `${borderColor}30`}`, borderRadius: radius, background: i === 0 ? brandContrast : "transparent", color: i === 0 ? brandPrimary : `${textMain}60` }}>
              {t}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.25em", color: textMain, fontWeight: 600 }}>Molletes</span>
          <span style={{ flex: 1, height: 1, background: `${borderColor}25` }} />
          <span style={{ fontSize: 9, color: `${textMain}70`, letterSpacing: "0.1em" }}>3</span>
        </div>
        {[
          { name: "Mollete clásico", desc: "Frijoles, queso, pico de gallo", price: 65 },
          { name: "Mollete especial", desc: "Chorizo, jalapeño, crema", price: 85 },
        ].map((p, i) => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: i === 0 ? 7 : 0, borderBottom: i === 0 ? `1px solid ${borderColor}12` : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: radius, background: `${brandPrimary}15`, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: textMain, fontWeight: 500 }}>{p.name}</div>
              <div style={{ fontSize: 9, color: textMuted, marginTop: 1 }}>{p.desc}</div>
            </div>
            <span style={{ fontSize: 12, color: textTitles, fontFamily: fontTitle, fontWeight: 700, flexShrink: 0 }}>${p.price}</span>
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: bgDark, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${borderColor}20` }}>
        <span style={{ fontSize: 9, color: textInvert, opacity: 0.45 }}>© 2025 Central Molletes</span>
        <span style={{ fontSize: 9, color: brandPrimary, fontWeight: 600, letterSpacing: "0.06em" }}>Ver menú →</span>
      </div>
    </div>
  )
}