"use client"

import { useRef, useState, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import {
  IconBold,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
} from "@tabler/icons-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  value:       string
  onChange:    (val: string) => void
  rows?:       number
  placeholder?: string
}

// ─── Toolbar actions ──────────────────────────────────────────────────────────

type WrapConfig = {
  before: string
  after:  string
  placeholder: string
}

type LineConfig = {
  prefix: string
  placeholder: string
}

type ToolbarItem =
  | { type: "wrap"; icon: React.ReactNode; label: string; config: WrapConfig }
  | { type: "line"; icon: React.ReactNode; label: string; config: LineConfig }
  | { type: "link"; icon: React.ReactNode; label: string }

const TOOLS: ToolbarItem[] = [
  {
    type:   "wrap",
    icon:   <IconBold size={13} strokeWidth={2.5} />,
    label:  "Negrita",
    config: { before: "**", after: "**", placeholder: "texto en negrita" },
  },
  {
    type:   "wrap",
    icon:   <IconItalic size={13} strokeWidth={2.5} />,
    label:  "Itálica",
    config: { before: "*", after: "*", placeholder: "texto en itálica" },
  },
  {
    type:  "link",
    icon:  <IconLink size={13} strokeWidth={2.5} />,
    label: "Enlace",
  },
  {
    type:   "line",
    icon:   <IconList size={13} strokeWidth={2.5} />,
    label:  "Lista",
    config: { prefix: "- ", placeholder: "elemento de lista" },
  },
  {
    type:   "line",
    icon:   <IconListNumbers size={13} strokeWidth={2.5} />,
    label:  "Lista numerada",
    config: { prefix: "1. ", placeholder: "elemento de lista" },
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function insert(
  textarea: HTMLTextAreaElement,
  value:    string,
  action:   ToolbarItem
): { newValue: string; selStart: number; selEnd: number } {
  const start = textarea.selectionStart
  const end   = textarea.selectionEnd
  const selected = value.slice(start, end)

  if (action.type === "wrap") {
    const { before, after, placeholder } = action.config
    const text    = selected || placeholder
    const newValue =
      value.slice(0, start) + before + text + after + value.slice(end)
    const selStart = start + before.length
    const selEnd   = selStart + text.length
    return { newValue, selStart, selEnd }
  }

  if (action.type === "line") {
    const { prefix, placeholder } = action.config
    // Encuentra el inicio de la línea actual
    const lineStart = value.lastIndexOf("\n", start - 1) + 1
    const lineEnd   = value.indexOf("\n", start)
    const line      = value.slice(lineStart, lineEnd === -1 ? undefined : lineEnd)

    // Si ya tiene el prefix, lo quita (toggle)
    if (line.startsWith(prefix)) {
      const newValue =
        value.slice(0, lineStart) +
        line.slice(prefix.length) +
        value.slice(lineEnd === -1 ? value.length : lineEnd)
      return { newValue, selStart: start - prefix.length, selEnd: start - prefix.length }
    }

    const text = selected || placeholder
    const newValue =
      value.slice(0, lineStart) + prefix + text + value.slice(lineEnd === -1 ? value.length : lineEnd)
    const selStart = lineStart + prefix.length
    const selEnd   = selStart + text.length
    return { newValue, selStart, selEnd }
  }

  // link
  const text    = selected || "texto del enlace"
  const url     = "https://"
  const snippet = `[${text}](${url})`
  const newValue = value.slice(0, start) + snippet + value.slice(end)
  // Selecciona la URL para que el usuario la reemplace
  const selStart = start + text.length + 3
  const selEnd   = selStart + url.length
  return { newValue, selStart, selEnd }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MarkdownEditor({ value, onChange, rows = 8, placeholder }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [preview, setPreview] = useState(false)

  const applyTool = useCallback((action: ToolbarItem) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { newValue, selStart, selEnd } = insert(textarea, value, action)
    onChange(newValue)

    // Restaura selección después del re-render
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(selStart, selEnd)
    })
  }, [value, onChange])

  return (
    <div className="flex flex-col border border-stone-300 focus-within:border-stone-700 transition-colors duration-200 bg-white">

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-stone-200 bg-stone-50">
        {TOOLS.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            onClick={() => applyTool(tool)}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors duration-150 cursor-pointer"
          >
            {tool.icon}
          </button>
        ))}

        {/* Divider */}
        <span className="flex-1" />

        {/* Preview toggle */}
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className={`px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] transition-colors duration-150 cursor-pointer ${
            preview
              ? "bg-stone-900 text-white"
              : "text-stone-400 hover:text-stone-700"
          }`}
        >
          Vista previa
        </button>
      </div>

      {/* Editor + Preview */}
      <div className={`grid ${preview ? "grid-cols-2 divide-x divide-stone-200" : "grid-cols-1"}`}>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="
            w-full px-4 py-3
            text-stone-900 text-sm font-mono
            placeholder:text-stone-400
            outline-none resize-none bg-white
          "
        />

        {/* Preview panel */}
        {preview && (
          <div className="px-4 py-3 overflow-y-auto" style={{ maxHeight: `${rows * 1.625}rem` }}>
            {value.trim() ? (
              <div className="
                prose max-w-none text-sm
                prose-p:text-stone-700 prose-p:leading-relaxed prose-p:my-1
                prose-a:text-stone-900 prose-a:underline prose-a:underline-offset-2
                prose-a:decoration-stone-400
                prose-strong:text-stone-900 prose-strong:font-semibold
                prose-em:text-stone-600
                prose-ul:text-stone-700 prose-ol:text-stone-700
                prose-li:my-0.5
                [&_p]:text-stone-700
                [&_li]:text-stone-700
              ">
                <ReactMarkdown>{value}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-stone-300 text-xs italic">El texto aparecerá aquí…</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}