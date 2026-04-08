import { useRouter } from "next/navigation"
import { useCallback } from "react"

type Options = {
  apiPath:        string
  redirectPath:   string
  nameField?:     string
  slugField?:     string | null
  imageField?:    string
  galleryField?:  string
  sectionsField?: string
  getValues:      () => Record<string, unknown>
  setOverlayMode: (mode: "duplicating" | null) => void
  setSubmitError: (msg: string) => void
}

export function useDuplicate({
  apiPath,
  redirectPath,
  nameField     = "name",
  slugField     = "slug",
  imageField,
  galleryField,
  sectionsField,
  getValues,
  setOverlayMode,
  setSubmitError,
}: Options) {
  const router = useRouter()

  return useCallback(async () => {
    setOverlayMode("duplicating")
    const values = getValues()

    // ── Nuevo nombre ──────────────────────────────────────────────────────────
    const currentName = (values[nameField] as string) ?? ""
    const baseName    = currentName.replace(/\s*\(\d+\)$/, "")

    const searchRes = await fetch(`${apiPath}?name=${encodeURIComponent(baseName)}`)
    const existing: Record<string, string>[] = searchRes.ok ? await searchRes.json() : []

    const usedNumbers = new Set(
      existing
        .map((p) => {
          const match = (p[nameField] ?? "").match(/^(.+?)\s*\((\d+)\)$/)
          if (!match) return null
          const [, base, num] = match
          return base.trim() === baseName.trim() ? parseInt(num) : null
        })
        .filter((n): n is number => n !== null)
    )

    let nextNumber = 1
    while (usedNumbers.has(nextNumber)) nextNumber++

    const newName = `${baseName} (${nextNumber})`

    // ── Nuevo slug ────────────────────────────────────────────────────────────
    const slugUpdate =
      slugField && values[slugField]
        ? {
            [slugField]: (values[slugField] as string)
              .replace(/-\(\d+\)$/, "")
              .replace(/-\d+$/, "") + `-copia-${nextNumber}`,
          }
        : {}

    // ── Imágenes vacías ───────────────────────────────────────────────────────
    const imageUpdates: Record<string, unknown> = {
      ...(imageField    && { [imageField]:   "" }),
      ...(galleryField  && { [galleryField]: [] }),
      ...(sectionsField && Array.isArray(values[sectionsField]) && {
        [sectionsField]: (values[sectionsField] as Record<string, unknown>[]).map((section) =>
          section.type === "image" ? { ...section, image: "" } : section
        ),
      }),
    }

    // ── POST ──────────────────────────────────────────────────────────────────
    const res = await fetch(apiPath, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...values, [nameField]: newName, ...slugUpdate, ...imageUpdates }),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setSubmitError(json.error ?? "Error al duplicar")
      setOverlayMode(null)
      return
    }

    router.push(redirectPath)
    router.refresh()
  }, [getValues, router])
}