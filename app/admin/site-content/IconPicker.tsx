"use client"

import { useState } from "react"
import * as LucideIcons from "lucide-react"
import { Input } from "@/components/ui/input"

const ICON_CATALOG: { key: string; label: string; cat: string }[] = [
  // ── comida & bebidas ──
  { key: "Coffee",           label: "Café",                  cat: "comida" },
  { key: "CoffeeIcon",       label: "Café 2",                cat: "comida" },
  { key: "Flame",            label: "Hecho al momento",      cat: "comida" },
  { key: "Utensils",         label: "Cubiertos",             cat: "comida" },
  { key: "UtensilsCrossed",  label: "Sin servicio",          cat: "comida" },
  { key: "ChefHat",          label: "Chef / cocina",         cat: "comida" },
  { key: "Sandwich",         label: "Mollete / sandwich",    cat: "comida" },
  { key: "Cookie",           label: "Pan / repostería",      cat: "comida" },
  { key: "Croissant",        label: "Croissant",             cat: "comida" },
  { key: "Cake",             label: "Pastel",                cat: "comida" },
  { key: "IceCream",         label: "Postre frío",           cat: "comida" },
  { key: "IceCream2",        label: "Helado",                cat: "comida" },
  { key: "Soup",             label: "Sopa / caldo",          cat: "comida" },
  { key: "Salad",            label: "Ensalada",              cat: "comida" },
  { key: "Pizza",            label: "Pizza",                 cat: "comida" },
  { key: "Beef",             label: "Carne",                 cat: "comida" },
  { key: "Egg",              label: "Huevo",                 cat: "comida" },
  { key: "EggFried",         label: "Huevo estrellado",      cat: "comida" },
  { key: "Fish",             label: "Pescado",               cat: "comida" },
  { key: "Milk",             label: "Leche",                 cat: "comida" },
  { key: "Wine",             label: "Bebida / copa",         cat: "comida" },
  { key: "Beer",             label: "Cerveza",               cat: "comida" },
  { key: "GlassWater",       label: "Agua",                  cat: "comida" },
  { key: "Citrus",           label: "Cítrico / naranja",     cat: "comida" },
  { key: "Apple",            label: "Fruta",                 cat: "comida" },
  { key: "Banana",           label: "Plátano",               cat: "comida" },
  { key: "Grape",            label: "Uva",                   cat: "comida" },
  { key: "Cherry",           label: "Cereza",                cat: "comida" },
  { key: "Popcorn",          label: "Snack",                 cat: "comida" },
  { key: "Candy",            label: "Dulce",                 cat: "comida" },
  { key: "Lollipop",         label: "Paleta",                cat: "comida" },
  { key: "Sun",              label: "Mañana / desayuno",     cat: "comida" },

  // ── naturaleza ──
  { key: "Leaf",             label: "Natural / orgánico",    cat: "naturaleza" },
  { key: "Sprout",           label: "Fresco / brote",        cat: "naturaleza" },
  { key: "Flower",           label: "Flor",                  cat: "naturaleza" },
  { key: "Flower2",          label: "Flor decorativa",       cat: "naturaleza" },
  { key: "TreePine",         label: "Árbol / pino",          cat: "naturaleza" },
  { key: "TreeDeciduous",    label: "Árbol frondoso",        cat: "naturaleza" },
  { key: "Trees",            label: "Bosque",                cat: "naturaleza" },
  { key: "Mountain",         label: "Montaña",               cat: "naturaleza" },
  { key: "Waves",            label: "Agua / olas",           cat: "naturaleza" },
  { key: "Wind",             label: "Viento / frescura",     cat: "naturaleza" },
  { key: "Cloud",            label: "Nube",                  cat: "naturaleza" },
  { key: "CloudSun",         label: "Buen clima",            cat: "naturaleza" },
  { key: "Sunrise",          label: "Amanecer",              cat: "naturaleza" },
  { key: "Sunset",           label: "Atardecer",             cat: "naturaleza" },
  { key: "Moon",             label: "Noche / luna",          cat: "naturaleza" },
  { key: "Stars",            label: "Estrellas",             cat: "naturaleza" },
  { key: "Snowflake",        label: "Frío / nieve",          cat: "naturaleza" },
  { key: "Thermometer",      label: "Temperatura",           cat: "naturaleza" },
  { key: "Droplets",         label: "Gotas / humedad",       cat: "naturaleza" },
  { key: "Seedling",         label: "Semilla / crecimiento", cat: "naturaleza" },

  // ── lugar & espacio ──
  { key: "MapPin",           label: "Ubicación",             cat: "lugar" },
  { key: "Map",              label: "Mapa",                  cat: "lugar" },
  { key: "Navigation",       label: "Navegación",            cat: "lugar" },
  { key: "Home",             label: "Casa / local",          cat: "lugar" },
  { key: "Store",            label: "Tienda",                cat: "lugar" },
  { key: "Building",         label: "Edificio",              cat: "lugar" },
  { key: "Building2",        label: "Negocio",               cat: "lugar" },
  { key: "Warehouse",        label: "Bodega",                cat: "lugar" },
  { key: "Hotel",            label: "Hotel",                 cat: "lugar" },
  { key: "Landmark",         label: "Punto de referencia",   cat: "lugar" },
  { key: "Globe",            label: "Global / mundo",        cat: "lugar" },
  { key: "Globe2",           label: "Mundo 2",               cat: "lugar" },
  { key: "Car",              label: "Auto / transporte",     cat: "lugar" },
  { key: "Truck",            label: "Entrega / envío",       cat: "lugar" },
  { key: "Bike",             label: "Bicicleta",             cat: "lugar" },
  { key: "Bus",              label: "Transporte público",    cat: "lugar" },
  { key: "ParkingCircle",    label: "Estacionamiento",       cat: "lugar" },
  { key: "DoorOpen",         label: "Entrada abierta",       cat: "lugar" },
  { key: "DoorClosed",       label: "Cerrado",               cat: "lugar" },

  // ── personas & servicio ──
  { key: "Heart",            label: "Amor / cariño",         cat: "personas" },
  { key: "HeartHandshake",   label: "Compromiso",            cat: "personas" },
  { key: "HandHeart",        label: "Atención con cariño",   cat: "personas" },
  { key: "Smile",            label: "Felicidad",             cat: "personas" },
  { key: "SmilePlus",        label: "Muy feliz",             cat: "personas" },
  { key: "Users",            label: "Clientes / equipo",     cat: "personas" },
  { key: "User",             label: "Persona",               cat: "personas" },
  { key: "UserCheck",        label: "Cliente verificado",    cat: "personas" },
  { key: "UserHeart",        label: "Cliente fiel",          cat: "personas" },
  { key: "Users2",           label: "Grupo",                 cat: "personas" },
  { key: "Baby",             label: "Familia / niños",       cat: "personas" },
  { key: "Star",             label: "Favorito / estrella",   cat: "personas" },
  { key: "StarHalf",         label: "Calificación",          cat: "personas" },
  { key: "Award",            label: "Premio / calidad",      cat: "personas" },
  { key: "Trophy",           label: "Trofeo / logro",        cat: "personas" },
  { key: "Medal",            label: "Medalla",               cat: "personas" },
  { key: "ThumbsUp",         label: "Aprobación",            cat: "personas" },
  { key: "ThumbsDown",       label: "Desaprobación",         cat: "personas" },
  { key: "HandshakeIcon",    label: "Acuerdo / trato",       cat: "personas" },
  { key: "Handshake",        label: "Colaboración",          cat: "personas" },
  { key: "MessageCircle",    label: "Comentario / reseña",   cat: "personas" },
  { key: "MessageSquare",    label: "Mensaje",               cat: "personas" },
  { key: "Quote",            label: "Cita / testimonial",    cat: "personas" },

  // ── negocio & general ──
  { key: "Sparkles",         label: "Especial / único",      cat: "negocio" },
  { key: "Zap",              label: "Rápido / energía",      cat: "negocio" },
  { key: "Clock",            label: "Puntualidad / horario", cat: "negocio" },
  { key: "Clock3",           label: "Horario 2",             cat: "negocio" },
  { key: "CalendarDays",     label: "Calendario / fecha",    cat: "negocio" },
  { key: "CheckCircle",      label: "Verificado / listo",    cat: "negocio" },
  { key: "CheckCircle2",     label: "Completado",            cat: "negocio" },
  { key: "ShieldCheck",      label: "Confianza / seguro",    cat: "negocio" },
  { key: "Shield",           label: "Protección",            cat: "negocio" },
  { key: "BadgeCheck",       label: "Certificado",           cat: "negocio" },
  { key: "Badge",            label: "Insignia",              cat: "negocio" },
  { key: "Tag",              label: "Precio / etiqueta",     cat: "negocio" },
  { key: "Tags",             label: "Categorías",            cat: "negocio" },
  { key: "Gift",             label: "Regalo / especial",     cat: "negocio" },
  { key: "Package",          label: "Paquete / producto",    cat: "negocio" },
  { key: "ShoppingBag",      label: "Compra / pedido",       cat: "negocio" },
  { key: "ShoppingCart",     label: "Carrito",               cat: "negocio" },
  { key: "Wallet",           label: "Pago / billetera",      cat: "negocio" },
  { key: "CreditCard",       label: "Tarjeta de pago",       cat: "negocio" },
  { key: "Banknote",         label: "Efectivo",              cat: "negocio" },
  { key: "Receipt",          label: "Recibo / ticket",       cat: "negocio" },
  { key: "Percent",          label: "Descuento / porcentaje",cat: "negocio" },
  { key: "TrendingUp",       label: "Crecimiento",           cat: "negocio" },
  { key: "BarChart2",        label: "Estadísticas",          cat: "negocio" },
  { key: "LineChart",        label: "Tendencia",             cat: "negocio" },
  { key: "Phone",            label: "Teléfono / contacto",   cat: "negocio" },
  { key: "PhoneCall",        label: "Llamada",               cat: "negocio" },
  { key: "Mail",             label: "Correo",                cat: "negocio" },
  { key: "Instagram",        label: "Instagram",             cat: "negocio" },
  { key: "Facebook",         label: "Facebook",              cat: "negocio" },
  { key: "Twitter",          label: "Twitter / X",           cat: "negocio" },
  { key: "Share2",           label: "Compartir",             cat: "negocio" },
  { key: "Bell",             label: "Notificación / alerta", cat: "negocio" },
  { key: "Info",             label: "Información",           cat: "negocio" },
  { key: "HelpCircle",       label: "Ayuda / pregunta",      cat: "negocio" },
  { key: "Settings",         label: "Configuración",         cat: "negocio" },
  { key: "Wrench",           label: "Herramienta",           cat: "negocio" },
  { key: "Lightbulb",        label: "Idea / innovación",     cat: "negocio" },
  { key: "Megaphone",        label: "Anuncio / promoción",   cat: "negocio" },
  { key: "Newspaper",        label: "Noticias / blog",       cat: "negocio" },
  { key: "BookOpen",         label: "Menú / carta",          cat: "negocio" },
  { key: "ClipboardList",    label: "Lista / pedido",        cat: "negocio" },
  { key: "CircleDollarSign", label: "Precio / costo",        cat: "negocio" },
]

const CATS = [
  { value: "all",         label: "Todos"      },
  { value: "comida",      label: "Comida"     },
  { value: "naturaleza",  label: "Naturaleza" },
  { value: "lugar",       label: "Lugar"      },
  { value: "personas",    label: "Personas"   },
  { value: "negocio",     label: "Negocio"    },
]

type Props = { value: string; onChange: (v: string) => void }

export function IconPicker({ value, onChange }: Props) {
  const [search, setSearch] = useState("")
  const [cat,    setCat]    = useState("all")

  const filtered = ICON_CATALOG.filter((i) => {
    const matchCat    = cat === "all" || i.cat === cat
    const q           = search.toLowerCase()
    const matchSearch = !q || i.label.toLowerCase().includes(q) || i.key.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const SelectedIcon = value ? (LucideIcons as any)[value] : null

  return (
    <div className="flex flex-col gap-3">
      {SelectedIcon && (
        <div className="flex items-center gap-3 px-4 py-3 border border-border bg-muted">
          <SelectedIcon size={22} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <p className="text-[12px] font-semibold text-foreground">
              {ICON_CATALOG.find((i) => i.key === value)?.label ?? value}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground">{value}</p>
          </div>
        </div>
      )}

      <Input
        placeholder="Buscar ícono... (café, corazón, mapa...)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-wrap gap-1.5">
        {CATS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCat(c.value)}
            className={`text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 border transition-colors cursor-pointer ${
              cat === c.value
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border hover:border-foreground/40"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-64 overflow-y-auto pr-1">
        {filtered.map((icon) => {
          const Icon = (LucideIcons as any)[icon.key]
          if (!Icon) return null
          const isSelected = value === icon.key
          return (
            <button
              key={icon.key}
              type="button"
              onClick={() => onChange(icon.key)}
              title={icon.label}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 border text-center transition-colors cursor-pointer ${
                isSelected
                  ? "bg-foreground border-foreground text-background"
                  : "bg-background border-border text-muted-foreground hover:border-foreground/40 hover:bg-accent"
              }`}
            >
              <Icon size={18} />
              <span
                className={`text-[9px] leading-tight truncate w-full text-center ${
                  isSelected ? "text-background/70" : "text-muted-foreground"
                }`}
              >
                {icon.label.split("/")[0].trim()}
              </span>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-[11px] text-muted-foreground italic text-center py-6">
            Sin resultados para &ldquo;{search}&rdquo;
          </p>
        )}
      </div>

      <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground text-right">
        {filtered.length} de {ICON_CATALOG.length} íconos
      </p>
    </div>
  )
}