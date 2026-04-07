"use client"

import * as React from "react"
import { format, addDays, nextSaturday, nextSunday, isSameDay, startOfDay, endOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toTimeString(date: Date | undefined): string {
  if (!date) return "00:00"
  const h = date.getHours().toString().padStart(2, "0")
  const m = date.getMinutes().toString().padStart(2, "0")
  return `${h}:${m}`
}

function applyTime(date: Date, timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number)
  const result = new Date(date)
  result.setHours(h ?? 0, m ?? 0, 0, 0)
  return result
}

// ─── Shortcuts ────────────────────────────────────────────────────────────────

function getShortcuts(now: Date) {
  const today = startOfDay(now)
  const tomorrow = addDays(today, 1)
  const sat = nextSaturday(today)
  const sun = nextSunday(sat)
  const weekEnd = addDays(today, 6)

  return [
    { label: "Hoy",              from: today,    to: today    },
    { label: "Mañana",           from: tomorrow, to: tomorrow },
    { label: "Este fin de sem.", from: sat,      to: sun      },
    { label: "7 días",           from: today,    to: weekEnd  },
  ]
}

// ─── TimeInput ────────────────────────────────────────────────────────────────

function TimeInput({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (v: string) => void
  label: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-28 rounded-md border border-input  [color-scheme:light] bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  )
}

// ─── DateRangeField ───────────────────────────────────────────────────────────

export function DateRangeField() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext()

  const startsAt = watch("startsAt")
  const endsAt = watch("endsAt")

  const fromDate = startsAt ? new Date(startsAt) : undefined
  const toDate = endsAt ? new Date(endsAt) : undefined

  // Single-day mode: both dates are the same calendar day
  const [singleDay, setSingleDay] = React.useState<boolean>(() => {
    if (!fromDate || !toDate) return false
    return isSameDay(fromDate, toDate)
  })

  const [startTime, setStartTime] = React.useState<string>(() => toTimeString(fromDate))
  const [endTime, setEndTime] = React.useState<string>(() => toTimeString(toDate))

  const range: DateRange = {
    from: fromDate,
    to: toDate,
  }

  // ── Write back to form ──────────────────────────────────────────────────────

  const commit = React.useCallback(
    (from: Date | undefined, to: Date | undefined, sTime: string, eTime: string) => {
      setValue("startsAt", from ? applyTime(from, sTime).toISOString() : "")
      setValue("endsAt", to ? applyTime(to, eTime).toISOString() : "")
    },
    [setValue],
  )

  // ── Calendar selection ──────────────────────────────────────────────────────

  const handleSelect = (value: DateRange | undefined) => {
    if (singleDay) {
      const day = value?.from ?? value?.to
      commit(day, day, startTime, endTime)
    } else {
      commit(value?.from, value?.to, startTime, endTime)
    }
  }

  // ── Single-day toggle ───────────────────────────────────────────────────────

  const handleSingleDayToggle = (pressed: boolean) => {
    setSingleDay(pressed)
    if (pressed && fromDate) {
      // Snap endsAt to the same day as startsAt
      commit(fromDate, fromDate, startTime, endTime)
    }
  }

  // ── Time changes ────────────────────────────────────────────────────────────

  const handleStartTimeChange = (v: string) => {
    setStartTime(v)
    commit(fromDate, singleDay ? fromDate : toDate, v, endTime)
  }

  const handleEndTimeChange = (v: string) => {
    setEndTime(v)
    commit(fromDate, singleDay ? fromDate : toDate, startTime, v)
  }

  // ── Shortcuts ───────────────────────────────────────────────────────────────

  const shortcuts = React.useMemo(() => getShortcuts(new Date()), [])

  const handleShortcut = (from: Date, to: Date) => {
    const isOne = isSameDay(from, to)
    setSingleDay(isOne)
    const sT = isOne ? startTime : "00:00"
    const eT = isOne ? endTime : "23:59"
    if (!isOne) {
      setStartTime("00:00")
      setEndTime("23:59")
    }
    commit(from, to, sT, eT)
  }

  // ── Label ───────────────────────────────────────────────────────────────────

  const label = React.useMemo(() => {
    if (!fromDate) return "Selecciona una fecha"
    const fmtDate = (d: Date) => format(d, "dd MMM yyyy", { locale: es })
    const fmtTime = (t: string) => t

    if (singleDay) {
      return `${fmtDate(fromDate)}  ·  ${fmtTime(startTime)} – ${fmtTime(endTime)}`
    }

    if (toDate) {
      return `${fmtDate(fromDate)}  —  ${fmtDate(toDate)}`
    }

    return fmtDate(fromDate)
  }, [fromDate, toDate, singleDay, startTime, endTime])

  const hasError = !!(errors.startsAt || errors.endsAt)

  return (
    <Field data-invalid={hasError}>
      <FieldLabel>Vigencia</FieldLabel>
      <FieldError>
        {(errors.startsAt?.message as string) ?? (errors.endsAt?.message as string)}
      </FieldError>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!fromDate}
            className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            {label}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          {/* ── Shortcuts ── */}
          <div className="flex flex-wrap gap-1.5 px-3 pt-3 pb-2">
            {shortcuts.map((s) => (
              <Button
                key={s.label}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs cursor-pointer"
                onClick={() => handleShortcut(s.from, s.to)}
              >
                {s.label}
              </Button>
            ))}
          </div>

          <Separator />

          {/* ── Single-day toggle ── */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Toggle
              pressed={singleDay}
              onPressedChange={handleSingleDayToggle}
              size="sm"
              variant="outline"
              className="h-7 text-xs cursor-pointer"
            >
              Un solo día
            </Toggle>
            <span className="text-[11px] text-muted-foreground">
              {singleDay ? "Elige el día y las horas" : "Elige el rango de fechas"}
            </span>
          </div>

          <Separator />

          {/* ── Calendar ── */}
          <Calendar
            mode="range"
            selected={singleDay ? { from: fromDate, to: fromDate } : range}
            onSelect={handleSelect}
            numberOfMonths={singleDay ? 1 : 2}
            locale={es}
          />

          <Separator />

          {/* ── Time pickers ── */}
          <div className="flex items-end gap-4 px-3 py-3">
            <TimeInput label="Hora inicio" value={startTime} onChange={handleStartTimeChange} />
            <span className="text-muted-foreground mb-1.5">–</span>
            <TimeInput label="Hora fin" value={endTime} onChange={handleEndTimeChange}/>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  )
}