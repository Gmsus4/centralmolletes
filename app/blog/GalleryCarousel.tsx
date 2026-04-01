"use client"

import { useState } from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

type Props = {
  images: string[]
  title:  string
}

export default function GalleryCarousel({ images, title }: Props) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) return null

  function prev() {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  }

  function next() {
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))
  }

  return (
    <>
      {/* Separador con label */}
      <div className="flex items-center gap-3 mt-12 sm:mt-14 mb-6">
        <span className="flex-1 h-px bg-stone-200" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400">Galería</span>
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      {/* Carrusel */}
      <div className="relative select-none">

        {/* Imagen principal */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          {images.map((url, idx) => (
            <img
              key={url}
              src={url}
              alt={`${title} — foto ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${
                idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          ))}

          {/* Botones — solo si hay más de una imagen */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white text-stone-800 transition-colors duration-150 cursor-pointer"
              >
                <IconChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                aria-label="Siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white text-stone-800 transition-colors duration-150 cursor-pointer"
              >
                <IconChevronRight size={16} />
              </button>
            </>
          )}

          {/* Contador */}
          {images.length > 1 && (
            <span className="absolute bottom-3 right-3 text-[10px] font-mono text-white/70 bg-stone-900/50 px-2 py-0.5">
              {current + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
            {images.map((url, idx) => (
              <button
                key={url}
                onClick={() => setCurrent(idx)}
                aria-label={`Foto ${idx + 1}`}
                className={`shrink-0 w-14 h-14 overflow-hidden transition-opacity duration-150 cursor-pointer ${
                  idx === current
                    ? "ring-2 ring-stone-900 ring-offset-1 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}