// components/ui/saving-overlay.tsx

type SavingOverlayProps = {
  isVisible: boolean
  mode?: "saving" | "deleting" | "duplicating"
}

const MESSAGES = {
  saving: "Guardando",
  deleting: "Eliminando",
  duplicating: "Duplicando"
}

export const SavingOverlay = ({ isVisible, mode = "saving" }: SavingOverlayProps) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin h-5 w-5 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {MESSAGES[mode]}
        </span>
      </div>
    </div>
  )
}