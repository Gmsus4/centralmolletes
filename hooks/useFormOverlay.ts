// hooks/useFormOverlay.ts
import { useState } from "react"

type OverlayMode = "saving" | "deleting" | "duplicating"

export function useFormOverlay() {
  const [overlayMode, setOverlayMode] = useState<OverlayMode | null>(null)

  return {
    overlayMode,
    setOverlayMode,
    isVisible: overlayMode !== null,
  }
}