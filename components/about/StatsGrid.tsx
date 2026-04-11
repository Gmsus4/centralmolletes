import { getIcon } from "@/lib/getIcon"
import { getSectionContentWithIds } from "@/lib/siteContent"
import { getSiteImages } from "@/lib/siteImages"
import Image from "next/image"
import { AdminEditWrapper } from "../shared/AdminEditWrapper"
import { AdminImageWrapper } from "../shared/AdminImageWrapper"

export const revalidate = 3600

type StatItem = {
  type: "stat" | "image"
  colSpan?: string
  order: string
  height?: string
  stat?: {
    value: string
    valueId?: string
    label: string
    labelId?: string
    iconTop: React.ComponentType<{ className?: string; size?: number }>
    iconTopId?: string
    iconBottom: React.ComponentType<{ className?: string; size?: number }>
    iconBottomId?: string
  }
  image?: { src: string; alt: string }
}

export const StatsGrid = async () => {
  const statsImages = await getSiteImages("stats")
  const stats = await getSectionContentWithIds("stats")

  const items: StatItem[] = [
    {
      type: "stat",
      colSpan: "lg:col-span-2",
      order: "order-1 lg:order-1",
      stat: {
        value: stats["stats.one.value"]?.value ?? "2500+",
        valueId: stats["stats.one.value"]?.id,
        label: stats["stats.one.label"]?.value ?? "Clientes satisfechos",
        labelId: stats["stats.one.label"]?.id,
        iconTop: getIcon(stats["stats.one.icon.top-right"]?.value ?? "Users"),
        iconTopId: stats["stats.one.icon.top-right"]?.id,
        iconBottom: getIcon(stats["stats.one.icon.bottom-left"]?.value ?? "Sparkles"),
        iconBottomId: stats["stats.one.icon.bottom-left"]?.id,
      },
    },
    { type: "image", colSpan: "lg:col-span-1", order: "order-2 lg:order-2", height: "lg:h-84", image: { src: statsImages[0]?.src, alt: statsImages[0]?.alt } },
    {
      type: "stat",
      colSpan: "lg:col-span-1",
      order: "order-3 md:order-4 lg:order-3",
      height: "lg:h-84",
      stat: {
        value: stats["stats.two.value"]?.value ?? "2500+",
        valueId: stats["stats.two.value"]?.id,
        label: stats["stats.two.label"]?.value ?? "Clientes satisfechos",
        labelId: stats["stats.two.label"]?.id,
        iconTop: getIcon(stats["stats.two.icon.top-right"]?.value ?? "Users"),
        iconTopId: stats["stats.two.icon.top-right"]?.id,
        iconBottom: getIcon(stats["stats.two.icon.bottom-left"]?.value ?? "Sparkles"),
        iconBottomId: stats["stats.two.icon.bottom-left"]?.id,
      },
    },
    { type: "image", colSpan: "lg:col-span-1", order: "order-3 lg:order-4", height: "lg:h-84", image: { src: statsImages[1]?.src, alt: statsImages[1]?.alt } },
    {
      type: "stat",
      colSpan: "lg:col-span-1",
      order: "order-5 lg:order-5",
      height: "lg:h-84",
      stat: {
        value: stats["stats.three.value"]?.value ?? "2500+",
        valueId: stats["stats.three.value"]?.id,
        label: stats["stats.three.label"]?.value ?? "Clientes satisfechos",
        labelId: stats["stats.three.label"]?.id,
        iconTop: getIcon(stats["stats.three.icon.top-right"]?.value ?? "Users"),
        iconTopId: stats["stats.three.icon.top-right"]?.id,
        iconBottom: getIcon(stats["stats.three.icon.bottom-left"]?.value ?? "Sparkles"),
        iconBottomId: stats["stats.three.icon.bottom-left"]?.id,
      },
    },
    { type: "image", colSpan: "lg:col-span-2", order: "order-6 lg:order-6", height: "lg:h-84", image: { src: statsImages[2]?.src, alt: statsImages[2]?.alt } },
  ]

  return (
    <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 blocks">
      {items.map((item, index) => (
        <div
          key={index}
          className={`bg-brand-primary rounded-radius overflow-hidden aspect-auto lg:aspect-auto md:aspect-square ${item.colSpan ?? ""} ${item.order} ${item.height ?? ""} ${item.type === "stat" ? "relative p-6 py-14 grid place-items-center" : ""}`}
        >
          {item.type === "stat" && item.stat ? (
            <>
              <AdminEditWrapper href={`/admin/site-content/${item.stat.iconTopId}`} tooltip="Editar icono" className="absolute top-4 right-4">
                <item.stat.iconTop className="text-brand-contrast hover:opacity-60 transition-opacity" size={32} />
              </AdminEditWrapper>
              <AdminEditWrapper href={`/admin/site-content/${item.stat.iconBottomId}`} tooltip="Editar icono" className="absolute bottom-4 left-4">
                <item.stat.iconBottom className="text-brand-contrast hover:opacity-60 transition-opacity" size={32} />
              </AdminEditWrapper>
              <div className="grid gap-1">
                <AdminEditWrapper href={`/admin/site-content/${item.stat.valueId}`} tooltip="Editar valor">
                  <span className="block text-center text-5xl md:text-7xl font-medium text-text-main hover:opacity-60 transition-opacity">
                    {item.stat.value}
                  </span>
                </AdminEditWrapper>
                <AdminEditWrapper href={`/admin/site-content/${item.stat.labelId}`} tooltip="Editar texto">
                  <h3 className="text-center lg:text-2xl text-xl text-text-titles font-title font-bold hover:opacity-60 transition-opacity">
                    {item.stat.label}
                  </h3>
                </AdminEditWrapper>
              </div>
            </>
          ) : item.image?.src ? (
            <AdminImageWrapper href={`/admin/site-images/${statsImages.find((i) => i.src === item.image?.src)?.id}`}>
              <Image width={1920} height={1080} src={item.image.src} alt={item.image.alt} className="w-full h-80 md:h-full object-cover overflow-hidden" />
            </AdminImageWrapper>
          ) : null}
        </div>
      ))}
    </div>
  )
}