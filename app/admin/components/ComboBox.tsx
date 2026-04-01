"use client"

import { useState, useRef, useEffect } from "react"

type Props = {
  value: string
  onChange: (val: string) => void
  options: string[]
  placeholder?: string
  required?: boolean
}

export function ComboBox({ value, onChange, options, placeholder, required }: Props) {
  const [open, setOpen] = useState(false)
  const [inputVal, setInputVal] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)

  // Keep input in sync if parent resets value
  useEffect(() => { setInputVal(value) }, [value])

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(inputVal.toLowerCase())
  )

  const showNew =
    inputVal.trim() !== "" &&
    !options.some((o) => o.toLowerCase() === inputVal.toLowerCase())

  function select(val: string) {
    setInputVal(val)
    onChange(val)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        value={inputVal}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => {
          setInputVal(e.target.value)
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        className="
          w-full bg-white
          border border-stone-300 focus:border-stone-700
          px-4 py-2.5
          text-stone-900 text-sm placeholder:text-stone-400
          outline-none transition-colors duration-200
        "
      />

      {open && (filtered.length > 0 || showNew) && (
        <ul className="absolute z-50 top-full left-0 right-0 bg-white border border-stone-200 border-t-0 shadow-sm max-h-48 overflow-y-auto">
          {filtered.map((opt) => (
            <li
              key={opt}
              onMouseDown={() => select(opt)}
              className={`
                px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100
                ${opt === value
                  ? "bg-stone-100 text-stone-900"
                  : "text-stone-700 hover:bg-stone-50"}
              `}
            >
              {opt}
            </li>
          ))}
          {showNew && (
            <li
              onMouseDown={() => select(inputVal.trim())}
              className="px-4 py-2.5 text-sm cursor-pointer text-stone-400 hover:bg-stone-50 border-t border-stone-100 flex items-center gap-2"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] border border-stone-300 px-1.5 py-0.5 text-stone-400">nuevo</span>
              <span className="text-stone-700">{inputVal.trim()}</span>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}