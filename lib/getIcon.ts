import * as LucideIcons from "lucide-react"
import { ComponentType } from "react"

export function getIcon(name: string): ComponentType<{ className?: string; size?: number }> {
  return (LucideIcons as any)[name] ?? LucideIcons.Circle
}