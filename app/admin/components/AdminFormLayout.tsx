"use client"

import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminFormLayoutProps {
  // Header
  section: string // "Productos", "Horarios", etc.
  title: string // "Nuevo", "Editar", etc.
  backHref: string // "/admin/products"
  formId: string // "product-form"

  // Estado
  isEditing: boolean
  isSubmitting: boolean
  submitError?: string

  // Delete
  onDelete?: () => void
  deleteTitle?: string
  deleteDescription?: string

  // Preview
  previewHref?: string

  // OnActive
  onActivate?: () => Promise<void>

  // Duplicate
  onDuplicate?: () => Promise<void>

  children: React.ReactNode
}

// ─── Delete Button ────────────────────────────────────────────────────────────

function DeleteButton({ onConfirm, title = "¿Eliminar?", description = "Esta acción no se puede deshacer." }: { onConfirm: () => void; title?: string; description?: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" className="cursor-pointer flex-1">
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AdminFormLayout({
  section,
  title,
  backHref,
  formId,
  isEditing,
  isSubmitting,
  submitError,
  onDelete,
  deleteTitle,
  deleteDescription,
  previewHref,
  onDuplicate,
  onActivate,
  children,
}: AdminFormLayoutProps) {
  const router = useRouter()
  const [isDuplicating, setIsDuplicating] = useState(false)

  const handleDuplicate = async () => {
    setIsDuplicating(true)
    await onDuplicate?.()
    setIsDuplicating(false)
  }

  // 4. Extraer los botones extra a una variable reutilizable
  const ExtraActions = () => (
    <>
      {onActivate && (
        <Button type="button" variant="outline" onClick={onActivate} className="cursor-pointer">
          Activar
        </Button>
      )}
      {previewHref && (
        <Button type="button" variant="outline" onClick={() => window.open(previewHref, "_blank")} className="cursor-pointer">
          Ver
        </Button>
      )}
      {onDuplicate && (
        <Button type="button" variant="outline" onClick={handleDuplicate} disabled={isDuplicating} className="cursor-pointer">
          {isDuplicating ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> Duplicando…
            </>
          ) : (
            "Duplicar"
          )}
        </Button>
      )}
    </>
  )

  const SaveButton = ({ className }: { className?: string }) => (
    <Button type="submit" form={formId} disabled={isSubmitting} className={`cursor-pointer ${className}`}>
      {isSubmitting ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          Guardando…
        </>
      ) : (
        "Guardar"
      )}
    </Button>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-6 py-4 sm:py-10 pb-36 sm:pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{section}</span>
          </div>
          <h1 className="font-titleText text-foreground uppercase text-3xl sm:text-5xl leading-none">{title}</h1>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-3">
          {submitError && <p className="text-sm text-destructive">{submitError}</p>}
          <ExtraActions />
          <Button type="button" variant="outline" onClick={() => router.push(backHref)} className="cursor-pointer">
            Cancelar
          </Button>
          {isEditing && onDelete && <DeleteButton onConfirm={onDelete} title={deleteTitle} description={deleteDescription} />}
          <SaveButton />
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Separator className="flex-1" />
        <span className="w-1 h-1 rounded-full bg-border" />
        <Separator className="flex-1" />
      </div>

      {/* Content */}
      {children}

      {/* ── Mobile actions ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-20 flex flex-col gap-3 p-4 bg-background border-t shadow-lg">
        {submitError && <p className="text-sm text-destructive text-center">{submitError}</p>}
        <SaveButton className="w-full" />
        <div className="flex gap-2">
          <ExtraActions />     
          <Button type="button" variant="outline" onClick={() => router.push(backHref)} className="flex-1">
            Cancelar
          </Button>
          {isEditing && onDelete && <DeleteButton onConfirm={onDelete} title={deleteTitle} description={deleteDescription} />}
        </div>
      </div>
    </div>
  )
}
