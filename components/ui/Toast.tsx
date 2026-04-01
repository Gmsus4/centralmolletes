"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Toast({
  message,
  type = "success",
  duration = 5000,
  triggerParam = "success", // <--- NUEVA PROP
}: {
  message: string
  type?: "success" | "error" | "info" | "warning"
  duration?: number
  triggerParam?: string    // <--- TIPO DE LA NUEVA PROP
}) {
  const [visible, setVisible] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Ahora solo se activa si el parámetro específico está en "true"
  const isTriggered = searchParams.get(triggerParam) === "true"

  useEffect(() => {
    if (isTriggered) {
      setVisible(true)
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isTriggered, duration])

  const handleClose = () => {
    setVisible(false)
    const params = new URLSearchParams(searchParams.toString())
    params.delete(triggerParam) // Solo borra SU parámetro
    
    const query = params.toString() ? `?${params.toString()}` : ""
    router.replace(`${pathname}${query}`) 
  }

  if (!visible) return null

  const alertStyles = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
    warning: "alert-warning",
  }

  return (
    <div className="fixed toast toast-end z-[100] animate-in fade-in slide-in-from-top-5 toast-top right-10">
      <div className={`alert ${alertStyles[type]} shadow-lg flex items-center gap-3`}>
        <span className="font-bold">{message}</span>
        <button onClick={handleClose} className="btn btn-ghost btn-xs text-xl">✕</button>
      </div>
    </div>
  )
}