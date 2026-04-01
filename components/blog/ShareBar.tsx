"use client"

import { useState } from "react"
import { IconBrandX, IconBrandWhatsapp, IconLink, IconCheck } from "@tabler/icons-react"

type Props = {
  title: string
  url:   string
}

export default function ShareBar({ title, url }: Props) {
  const [copied, setCopied] = useState(false)

  const encoded = {
    url:   encodeURIComponent(url),
    title: encodeURIComponent(title),
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback silencioso
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400">Compartir</span>
      <span className="flex-1 h-px bg-stone-200" />

      {/* X / Twitter */}
      <a
        href={`https://x.com/intent/tweet?text=${encoded.title}&url=${encoded.url}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en X"
        className="p-2 text-stone-400 hover:text-stone-900 transition-colors duration-150"
      >
        <IconBrandX size={16} />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encoded.title}%20${encoded.url}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en WhatsApp"
        className="p-2 text-stone-400 hover:text-stone-900 transition-colors duration-150"
      >
        <IconBrandWhatsapp size={16} />
      </a>

      {/* Copiar link */}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copiar enlace"
        className="p-2 text-stone-400 hover:text-stone-900 transition-colors duration-150 cursor-pointer"
      >
        {copied ? <IconCheck size={16} className="text-emerald-500" /> : <IconLink size={16} />}
      </button>
    </div>
  )
}