"use client"

import { useState } from "react"
import { IconBrandWhatsapp, IconChevronLeft, IconChevronRight, IconClock, IconMapPin, IconPhone, IconX } from "@tabler/icons-react"
import { TitlePage } from "../ui/TitlePage"

interface locationProps {
  gallery: string[]
  id: string
  slug: string
  city: string
  name: string
  address: string
  addressMin: string
  phone: string
  hours: string
  image: string
  mapUrl: string
  embedUrl: string
  createdAt: Date
  updatedAt: Date
}

export default function LocationDetailClient({ location }: { location: locationProps }) {
  const [isOpen, setIsOpen] = useState(false)
  const [galleryIdx, setGalleryIdx] = useState(0)

  const prevImage = () => {
    setGalleryIdx((prev) => (prev - 1 + location.gallery.length) % location.gallery.length)
  }

  const nextImage = () => {
    setGalleryIdx((prev) => (prev + 1) % location.gallery.length)
  }

  return (
    <>
      <section className={`w-full relative overflow-hidden min-h-70 pt-14 grid place-items-center px-10`}     
          style={{
            backgroundImage: `url(${location.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            // backgroundRepeat: "no-repeat"
          }}>
        <div className="absolute inset-0 bg-bg-dark/80 group-hover:bg-bg-dark/70 transition" />
        <div className="flex flex-col gap-4">
          <h1 className={`title-enter font-title xs:text-6xl text-5xl text-center text-brand-primary transition-all duration-700 ease-out"}`}>
            {location.name}
          </h1>
          <p className={`subtitle-enter text-center text-base transition-all text-brand-primary/90 duration-700 delay-200 ease-out}`}>
            {location.city}
          </p>
        </div>
      </section>
      <div className="bg-bg-body px-4 py-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lado izquierdo — mapa */}
            <div className="relative w-full h-96 lg:h-[500px] overflow-hidden rounded-radius shadow-lg">
              <iframe src={location.embedUrl} className="absolute inset-0 w-full h-full border-0" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-4 right-4 z-20 bg-brand-primary text-text-main text-xs font-bold px-3 py-1.5 rounded-radius shadow flex items-center gap-1 cursor-pointer"
              >
                {isOpen ? "Cerrar" : "Ver más"}
                {isOpen ? <IconX size={12} /> : <IconMapPin size={12} />}
              </button>

              {isOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                  <div className="absolute bottom-0 left-0 right-0 z-20 m-4">
                    <div className="relative bg-brand-primary/95 backdrop-blur-sm p-5 rounded-radius shadow-xl flex flex-col sm:flex-row gap-4">
                      <div className="flex flex-col gap-2 flex-1">
                        <h3 className="text-2xl font-bold text-text-titles">{location.name}</h3>
                        <div className="flex items-start gap-2 text-sm">
                          <IconMapPin size={16} className="mt-1 shrink-0 text-text-main" />
                          <span className="text-text-main">{location.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <IconPhone size={16} className="shrink-0 text-text-main" />
                          <span className="text-text-main">{location.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <IconClock size={16} className="shrink-0 text-text-main" />
                          <span className="text-text-main">{location.hours}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <a
                            href={`tel:${location.phone.replace(/\D/g, "")}`}
                            className="flex items-center gap-1.5 text-xs font-semibold bg-bg-dark text-text-invert px-4 py-2 rounded-radius hover:opacity-90"
                          >
                            <IconPhone size={14} /> Llamar
                          </a>
                          <a
                            href={`https://wa.me/${location.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold border border-border-color text-text-main px-4 py-2 rounded-radius hover:bg-bg-dark/10"
                          >
                            <IconBrandWhatsapp size={14} /> WhatsApp
                          </a>
                          <a
                            href={location.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold border border-border-color text-text-main px-4 py-2 rounded-radius hover:bg-bg-dark/10"
                          >
                            <IconMapPin size={14} /> Google Maps
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Lado derecho — galería */}
            <div className="flex flex-col gap-3 h-96 lg:h-[500px]">
              <div className="relative flex-1 rounded-radius overflow-hidden">
                <img src={location.gallery[galleryIdx]} alt={`${location.name} - imagen ${galleryIdx + 1}`} className="w-full h-full object-cover" />

                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-primary backdrop-blur-sm grid place-items-center hover:bg-brand-primary/90 shadow-md transition-colors cursor-pointer"
                >
                  <IconChevronLeft size={20} className="text-text-titles" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-primary backdrop-blur-sm grid place-items-center hover:bg-brand-primary/90 shadow-md transition-colors cursor-pointer"
                >
                  <IconChevronRight size={20} className="text-text-titles" />
                </button>

                <div className="absolute bottom-3 right-3 bg-bg-dark text-brand-primary text-xs px-3 py-1 rounded-full">
                  {galleryIdx + 1} / {location.gallery.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 pb-1">
                {location.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGalleryIdx(idx)}
                    className={`flex-1 cursor-pointer h-16 rounded-radius overflow-hidden transition-all duration-200 ${
                      idx === galleryIdx ? "ring-2 ring-brand-primary ring-offset-2 ring-offset-brand-primary-hover" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Miniatura ${idx + 1} de ${location.name}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
