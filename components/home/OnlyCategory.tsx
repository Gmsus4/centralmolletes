import { menu } from "@/data/menu"
import { IconSparkles } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"

const tag = "Popular";
const tagProductos = menu.filter(p => p.tag === tag).slice(0, 4); /* Filtra los primeros 4 productos que coincidan con el tag */

export const OnlyCategory = () => {
  return (
    <div className="bg-bg-dark xs:min-h-[calc(100dvh-4rem)] md:py-26 py-16 flex flex-col items-center justify-center md:gap-16 gap-12 px-6 relative"
      style={{
        backgroundImage: "url('/hero.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "repeat"
      }}
    >

      {/* Overlay */}
      <div className="absolute inset-0 bg-bg-dark" style={{ opacity: 0.75 }} />

      {/* Header */}
      <div className="z-10 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px bg-bg-dark/25" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-brand-primary/90">Productos {tag}</span>
          <span className="w-8 h-px bg-bg-dark/25" />
        </div>
        <h2 className="text-brand-primary font-title text-center text-3xl md:text-6xl leading-tight">
          Solo en Central
        </h2>
      </div>

      {/* Grid */}
      <div className="z-10 lg:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 xs:grid-cols-2 gap-6 lg:gap-10 px-0 xs:px-4 lg:px-0 w-full">
        {tagProductos.map((item, idx) => (
          <Link href={`/menu/${item.slug}`} className="grid grid-cols-2 xs:grid-cols-1 gap-2 xs:gap-1 group" key={item.slug}>
            <div className="relative w-full rounded-radius aspect-square overflow-hidden shrink-0 bg-brand-primary grid place-items-center col-span-2">
              <Image
                width={600} height={600}
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading={idx === 0 ? "eager" : "lazy"}
                priority={idx === 0}
                src={item.img}
                className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-130"
                alt={item.desc}
              />
              {/* Badge firma */}
              <div aria-hidden="true" className="absolute top-3 left-3 flex items-center gap-1 bg-brand-primary text-[9px] uppercase tracking-widest px-2 py-1 rounded-full">
                <IconSparkles size={10} className="text-brand-contrast"/>
                <span className="pt-px text-brand-contrast font-bold">{tag}</span>
              </div>
            </div>
            <div className="flex w-full justify-between items-center col-span-2 pt-2 px-1">
              <h3 className="text-brand-primary text-xl lg:text-base">{item.name}</h3>
              <span className="text-brand-primary font-bold text-xl">${item.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}