interface Extra {
  label: string
  price: number
}

interface ExtrasBadgeProps {
  title: string
  note?: string
  extras: Extra[]
}

export default function ExtrasBadge({ title, note, extras }: ExtrasBadgeProps) {
  return (
    <div className="mb-6 px-4 w-auto py-3 border-b border-darkWarm/40 bg-creamMid/5 inline-flex flex-wrap gap-x-6 gap-y-1 items-baseline">
      <span className="text-xs font-bold uppercase tracking-widest text-darkWarm shrink-0">
        {title}
      </span>
      {note && (
        <span className="text-xs text-darkWarm/60 italic">{note}</span>
      )}
      {extras.map((e, j) => (
        <span key={j} className="text-xs text-darkWarm/80">
          {e.label} <span className="text-secundaryColor font-semibold">+${e.price}</span>
        </span>
      ))}
    </div>
  )
}