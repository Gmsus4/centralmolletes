"use client"

import { useState } from "react"
import { Controller, Control, FieldErrors } from "react-hook-form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { ProductFormValues } from "@/lib/validators/products"
import { Button } from "@/components/ui/button"

interface ComboFieldProps {
  control: Control<ProductFormValues>
  name: "category" | "tag"
  label: string
  description: string
  placeholder: string
  options: string[]
  error?: string
}

export function ComboField({
  control,
  name,
  label,
  description,
  placeholder,
  options,
  error,
}: ComboFieldProps) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const [open, setOpen] = useState(false)
          const [query, setQuery] = useState("")

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between font-normal"
                >
                  {field.value || placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder={placeholder}
                    value={query}
                    onValueChange={setQuery}
                  />
                  <CommandList>
                    {query && !options.includes(query) && (
                      <CommandEmpty
                        className="py-2 px-3 text-sm cursor-pointer hover:bg-accent"
                        onClick={() => {
                          field.onChange(query)
                          setOpen(false)
                          setQuery("")
                        }}
                      >
                        Crear "{query}"
                      </CommandEmpty>
                    )}
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          key={opt}
                          value={opt}
                          onSelect={() => {
                            field.onChange(opt)
                            setOpen(false)
                            setQuery("")
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              field.value === opt ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {opt}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )
        }}
      />
      <FieldDescription>{description}</FieldDescription>
      <FieldError>{error}</FieldError>
    </Field>
  )
}