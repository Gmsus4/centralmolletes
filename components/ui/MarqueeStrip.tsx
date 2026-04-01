import { IconStar, IconBread, IconFlame, IconCoffee, IconMug, IconLeaf } from "@tabler/icons-react"

const items = [
  { icon: IconBread, text: "Molletes de la Casa" },
  { icon: IconFlame, text: "Chilaquiles al Momento" },
  { icon: IconCoffee, text: "Café de Especialidad" },
  { icon: IconMug, text: "Cacao Prehispánico" },
  { icon: IconLeaf, text: "Brebajes Únicos" },
  { icon: IconStar, text: "Sabor Etzatlense" },
]

export const MarqueeStrip = () => {
  return (
    <div className="w-full overflow-hidden bg-brand-contrast flex">
    <div className="marquee-track py-4" aria-hidden="true">
      {[0, 1].map((copyIdx) => (
        <div key={copyIdx} className="flex items-center">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.text}
                className="flex items-center gap-2 px-8 text-brand-primary whitespace-nowrap"
              >
                <Icon size={20} className="text-brand-primary" />
                <span className="font-title text-xl">{item.text}</span>
                <span className="ml-8 text-brand-primary/30">✦</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
    </div>
  )
}