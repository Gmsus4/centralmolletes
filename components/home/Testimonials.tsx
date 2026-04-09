import { getTopReviews } from "@/lib/reviews"
import { getSiteImages } from "@/lib/siteImages"
import { IconQuote } from "@tabler/icons-react"
import Image from "next/image"

// const decorativeImages = [
//   { src: images.testimonials[0].src, imageFirst: false },
//   { src: images.testimonials[1].src, imageFirst: true },
//   { src: images.testimonials[2].src, imageFirst: false },
// ]

export const Testimonials = async () => {
  const [testimonials, decorativeImages] = await Promise.all([
    getTopReviews(),
    getSiteImages("testimonials"),
  ])
  
  // const testimonials = await getTopReviews()
  const imageFirstByIndex = [false, true, false]

  return (
    <section
      aria-labelledby="testimonials-title"
      className="w-full bg-bg-body/95 xs:min-h-[calc(100dvh-4rem)] md:py-26 py-16 flex flex-col items-center justify-center md:gap-16 gap-12 px-6"
    >
      <h2 className="text-text-titles font-title text-3xl md:text-6xl leading-tight text-center">
        Nos alegra <br /> el día leerlos
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => {
          const dbImage = decorativeImages[i]
          const src = dbImage?.src ?? ""
          const imageFirst = imageFirstByIndex[i] ?? []
          return (
            <div
              key={t.id}
              className={`flex gap-4 ${imageFirst ? "lg:flex-col md:flex-row flex-col-reverse" : "lg:flex-col md:flex-row flex-col"}`}
            >
              {imageFirst && dbImage?.src &&(
                <div className="rounded-radius overflow-hidden flex-1 lg:min-h-96 min-h-60">
                  <Image
                    loading="lazy"
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="border-1 border-border-color/20 rounded-radius bg-bg-body/15 md:flex-1 lg:flex-none">
                <blockquote className="text-darkWarm font-light text-base p-7 flex flex-col h-full justify-between gap-4">
                  <IconQuote size={30} className="text-text-main" />
                  <p className="text-text-main">{t.body}</p>
                  <footer className="flex items-center gap-3 mt-4">
                    {t.photo && (
                      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={t.photo}
                          alt={t.author}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <cite className="text-text-main font-semibold font-titleText">{t.author}</cite>
                      <span className="text-text-main">—</span>
                      <span className="text-text-muted font-semibold font-titleText">{t.role}</span>
                    </div>
                  </footer>
                </blockquote>
              </div>

              {!imageFirst && dbImage?.src && (
                <div className="rounded-radius overflow-hidden lg:min-h-96 min-h-60 flex-1">
                  <Image
                    loading="lazy"
                    width={1920}
                    height={1080}
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}