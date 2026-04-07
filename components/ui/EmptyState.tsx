import { Plus } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface EmptyStateProps {
  icon: React.ElementType
  label: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  label,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <Empty className={cn("rounded-2xl border bg-white", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{label}</EmptyTitle>
        {description ? (
          <EmptyDescription>{description}</EmptyDescription>
        ) : null}
      </EmptyHeader>

      {actionLabel && (actionHref || onAction) ? (
        <EmptyContent>
          <Button variant="outline" size="sm" asChild={!!actionHref} onClick={onAction}>
            {actionHref ? (
              <a href={actionHref}>
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                {actionLabel}
              </a>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                {actionLabel}
              </>
            )}
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  )
}