"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

export function DateRangeField() {
  const { watch, setValue, formState: { errors } } = useFormContext()

  const startsAt = watch("startsAt")
  const endsAt   = watch("endsAt")

  const range: DateRange = {
    from: startsAt ? new Date(startsAt) : undefined,
    to:   endsAt   ? new Date(endsAt)   : undefined,
  }

  const handleSelect = (value: DateRange | undefined) => {
    setValue("startsAt", value?.from ? value.from.toISOString() : "")
    setValue("endsAt",   value?.to   ? value.to.toISOString()   : "")
  }

  return (
    <Field data-invalid={!!(errors.startsAt || errors.endsAt)}>
      <FieldLabel>Vigencia</FieldLabel>
      <FieldError>{errors.startsAt?.message as string ?? errors.endsAt?.message as string}</FieldError>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!range.from}
            className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range.from ? (
              range.to ? (
                <>
                  {format(range.from, "dd MMM yyyy", { locale: es })}
                  {" — "}
                  {format(range.to, "dd MMM yyyy", { locale: es })}
                </>
              ) : (
                format(range.from, "dd MMM yyyy", { locale: es })
              )
            ) : (
              "Selecciona un rango de fechas"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}