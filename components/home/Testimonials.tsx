import { images } from "@/data/images"
import { IconQuote } from "@tabler/icons-react"
import Image from "next/image"

const testimonials = [
  {
    quote: "El Mollete Quejeta suena raro pero es lo mejor que he probado. Ahora lo pido cada vez que vengo.",
    author: "María G.",
    role: "Cliente frecuente",
    image: images.testimonials[0].src,
    imageFirst: false, // imagen abajo
  },
  {
    quote: "El café de olla me recuerda al de mi abuela. No hay otro lugar en Etzatlán donde lo hagan así.",
    author: "Roberto S.",
    role: "Cliente de siempre",
    image: images.testimonials[1].src,
    imageFirst: true, // imagen arriba
  },
  {
    quote: "Los Chipoquiles son únicos. Ese toque de chipotle los hace completamente diferentes.",
    author: "Jordan T.",
    role: "Fan de los chilaquiles",
    image: images.testimonials[2].src,
    imageFirst: false, // imagen abajo
  },
]

export const Testimonials = () => {
  return (
    <section aria-labelledby="testimonials-title" className="w-full bg-bg-body/95 xs:min-h-[calc(100dvh-4rem)] md:py-26 py-16 flex flex-col items-center justify-center md:gap-16 gap-12 px-6">
      <h2 className="text-text-titles font-title text-3xl md:text-6xl leading-tight text-center">
        Nos alegra <br /> el día leerlos
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={t.author} className={`flex gap-4 ${t.imageFirst ? "lg:flex-col md:flex-row flex-col-reverse" : "lg:flex-col md:flex-row flex-col"}`}>
            {t.imageFirst && (
              <div className="rounded-radius overflow-hidden flex-1 lg:min-h-96 min-h-60">
                <Image
                  loading="lazy"
                  width={600}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  src={t.image}
                  alt={`Foto relacionada con la reseña de ${t.author}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="border-1 border-border-color/20 rounded-radius bg-bg-body/15 md:flex-1 lg:flex-none">
              <blockquote className="text-darkWarm font-light text-base p-7 flex flex-col h-full justify-between gap-4">
                <IconQuote size={30} className="text-text-main" />
                <p className="text-text-main">{t.quote}</p>
                <footer className="flex gap-2 mt-4">
                  <cite className="text-text-main font-semibold font-titleText">{t.author}</cite>
                  <span className="text-text-main">—</span>
                  <span className="text-text-muted font-semibold font-titleText">{t.role}</span>
                </footer>
              </blockquote>
            </div>

            {!t.imageFirst && (
              <div className="rounded-radius overflow-hidden lg:min-h-96 min-h-60 flex-1">
                <Image loading="lazy" width={1920} height={1080} src={t.image} alt={`Foto relacionada con la reseña de ${t.author}`} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
