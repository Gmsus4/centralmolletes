import Image from "next/image"
import { MarqueeStrip } from "./MarqueeStrip"

interface TitleProps {
  title?: string
  subtitle?: string
  isBgprimaryColor?: boolean
  isMarquee?: boolean
  className?: string
}

export const TitlePage = ({ title, isBgprimaryColor = true, className = "", isMarquee = true, subtitle }: TitleProps) => {
  return (
    <>
      <section className={`${isBgprimaryColor ? "bg-bg-dark" : "bg-bg-body"} min-h-70 pt-14 w-full overflow-hidden ${className} grid place-items-center px-10 relative`}>
        <Image
          src="/hero.webp"
          alt="Hero background"
          fill
          priority
          className="object-cover object-[70%_center] sm:object-center absolute"
          style={{ opacity: 0.25 }}
        />
        <div className="flex flex-col gap-4">
          <h1
            className={`title-enter font-title xs:text-6xl text-5xl ${isBgprimaryColor ? "text-brand-primary" : "text-bg-body"} text-center transition-all duration-700 ease-out"
            }`}
          >
            {title}
          </h1>
          <p
            className={`text-center text-sm ${isBgprimaryColor ? "text-brand-primary" : "text-bg-body"} transition-all duration-700 delay-200 ease-out
            }`}
          >
            {subtitle}
          </p>
        </div>
      </section>
      {isMarquee && <MarqueeStrip />}
    </>
  )
}
