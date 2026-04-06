import { useRouter } from "next/navigation"
import { useCallback } from "react"

type Options = {
  apiPath:      string
  redirectPath: string
  nameField?:   string  // "name" por defecto
  slugField?:   string  // "slug" por defecto, null si no tiene
  getValues:    () => Record<string, unknown>
  setOverlayMode: (mode: "duplicating" | null) => void
  setSubmitError: (msg: string) => void
}

export function useDuplicate({
  apiPath,
  redirectPath,
  nameField  = "name",
  slugField  = "slug",
  getValues,
  setOverlayMode,
  setSubmitError,
}: Options) {
  const router = useRouter()

  return useCallback(async () => {
    setOverlayMode("duplicating")
    const values = getValues()

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

    // Solo genera nuevo slug si el modelo tiene slug
    const slugUpdate = slugField && values[slugField]
      ? {
          [slugField]: (values[slugField] as string)
            .replace(/-\(\d+\)$/, "")
            .replace(/-\d+$/, "") + `-copia-${nextNumber}`,
        }
      : {}

    const res = await fetch(apiPath, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...values, [nameField]: newName, ...slugUpdate }),
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