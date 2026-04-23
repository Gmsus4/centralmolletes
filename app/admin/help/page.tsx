"use client"

import { useState } from "react"
import {
  IconBowlChopsticks, IconTag, IconDiscount2, IconArticle,
  IconSpeakerphone, IconAddressBook, IconMapPin, IconCalendarWeek,
  IconPaint, IconBrandGithub, IconBrandVercel, IconDatabase,
  IconPhoto, IconChevronDown, IconChevronRight, IconShieldCheck,
  IconAlertTriangle, IconCheck, IconX, IconExternalLink,
  IconBook, IconTool, IconLock, IconInfoCircle,
} from "@tabler/icons-react"

/* ─── Types ─────────────────────────────────────────────── */
interface Step { text: string; detail?: string }
interface Section {
  icon: React.ElementType
  title: string
  color: string
  iconColor: string
  desc: string
  steps: Step[]
  tips?: string[]
}
interface Tool {
  name: string
  role: string
  icon: React.ElementType
  color: string
  iconColor: string
  url: string
  desc: string
  howToAccess: string[]
  shareAs: string
}

/* ─── Data ───────────────────────────────────────────────── */
const ADMIN_SECTIONS: Section[] = [
  {
    icon: IconBowlChopsticks,
    title: "Productos",
    color: "#EAF3DE",
    iconColor: "#3B6D11",
    desc: "Gestiona todos los platillos del menú: nombre, precio, descripción, categoría e imagen. Cada producto se muestra automáticamente en el menú público al guardarse.",
    steps: [
      { text: "Entra a Productos desde el menú lateral.", detail: "Verás la lista de todos los platillos ordenados por categoría." },
      { text: 'Haz clic en "Nuevo producto" (botón superior derecho).', detail: "Se abrirá el formulario de creación." },
      { text: "Llena nombre, precio y descripción.", detail: "El precio debe ir en formato numérico sin símbolos. Ejemplo: 120 (no $120)." },
      { text: "Selecciona la categoría del platillo.", detail: "Si la categoría aún no existe, créala primero en la sección Categorías." },
      { text: "Sube la imagen desde el botón de Cloudinary.", detail: "Se abrirá el widget de Cloudinary. Arrastra o selecciona la imagen. Formatos recomendados: JPG o PNG, mínimo 800×600 px." },
      { text: "Haz clic en Guardar.", detail: "El platillo aparece al instante en el menú público sin necesidad de redesplegar el sitio." },
    ],
    tips: [
      "Para editar un producto existente, haz clic en su nombre o en el ícono de edición.",
      "Puedes reordenar los productos dentro de una categoría arrastrándolos.",
    ],
  },
  {
    icon: IconTag,
    title: "Categorías",
    color: "#E6F1FB",
    iconColor: "#185FA5",
    desc: "Organiza el menú en secciones como Entradas, Platos fuertes, Postres o Bebidas. El orden de las categorías controla cómo se muestra el menú al cliente.",
    steps: [
      { text: 'Entra a Categorías y haz clic en "Nueva categoría".', detail: "Cada categoría tiene un nombre y un número de orden." },
      { text: "Escribe el nombre de la categoría.", detail: 'Ejemplos: "Entradas", "Platos fuertes", "Bebidas", "Postres".' },
      { text: "Asigna un número de orden.", detail: "El número 1 aparece primero. Puedes usar 10, 20, 30... para dejar espacio entre categorías y poder insertar nuevas en el futuro." },
      { text: "Guarda la categoría.", detail: "Ahora podrás asignar productos a ella." },
    ],
    tips: [
      "Eliminar una categoría que tiene productos asignados puede causar errores. Reasigna los productos primero.",
      "Puedes renombrar una categoría en cualquier momento sin afectar los productos.",
    ],
  },
  {
    icon: IconDiscount2,
    title: "Promociones",
    color: "#FAEEDA",
    iconColor: "#854F0B",
    desc: "Crea ofertas, descuentos o combos especiales con fechas de vigencia. Las promociones activas aparecen destacadas en el sitio.",
    steps: [
      { text: 'Entra a Promociones y haz clic en "Nueva promoción".', detail: "El formulario incluye título, descripción, imagen y fechas." },
      { text: "Escribe un título llamativo y una descripción clara.", detail: 'Ejemplo: "2x1 en tacos los martes" con la descripción del descuento.' },
      { text: "Sube una imagen representativa (opcional pero recomendado).", detail: "Usa el widget de Cloudinary. Tamaño ideal: 800×400 px en formato horizontal." },
      { text: "Define la fecha de inicio y fin de la promoción.", detail: "Si no defines fecha de fin, la promoción permanece activa hasta que la desactives manualmente." },
      { text: "Activa la promoción con el toggle.", detail: "Solo las promociones activas se muestran en el sitio. Puedes tener varias activas al mismo tiempo." },
    ],
    tips: [
      "Las promociones con fecha de fin vencida se desactivan automáticamente.",
      "Puedes programar una promoción futura dejándola inactiva y activándola el día que inicie.",
    ],
  },
  {
    icon: IconArticle,
    title: "Blog",
    color: "#EEEDFE",
    iconColor: "#534AB7",
    desc: "Publica artículos, recetas, historias del restaurante o noticias. El blog ayuda al SEO y mantiene al cliente informado sobre novedades.",
    steps: [
      { text: 'Entra a Blog y haz clic en "Nuevo artículo".', detail: "El editor incluye texto enriquecido con formatos básicos." },
      { text: "Escribe el título del artículo.", detail: "El título también se usa para generar la URL del artículo automáticamente." },
      { text: "Redacta el contenido en el editor.", detail: "Puedes usar negritas, listas, encabezados y párrafos. El contenido se guarda con formato." },
      { text: "Sube una imagen de portada.", detail: "Se muestra en la lista de artículos y al inicio del post. Tamaño recomendado: 1200×630 px." },
      { text: 'Publica o guarda como borrador.', detail: "Los borradores solo son visibles para ti en el admin. Los artículos publicados son visibles para todos." },
    ],
    tips: [
      "Un artículo de blog por semana mejora significativamente el posicionamiento en Google.",
      "Las imágenes con texto alternativo (alt) ayudan al SEO. Agrégalo al subir la imagen.",
    ],
  },
  {
    icon: IconSpeakerphone,
    title: "Anuncios",
    color: "#FAECE7",
    iconColor: "#993C1D",
    desc: "Mensajes destacados que aparecen en la barra inferior del sitio. Útiles para avisar cierres temporales, cambios de horario o eventos especiales.",
    steps: [
      { text: 'Entra a Anuncios y crea uno nuevo.', detail: "El formulario tiene título, mensaje, tipo y fechas opcionales." },
      { text: "Escribe el mensaje que verán los visitantes.", detail: 'Ejemplo: "Cerrados el 15 de septiembre por día festivo" o "¡Nueva sucursal abierta en Polanco!"' },
      { text: "Elige el tipo de anuncio.", detail: "Info (azul), Éxito (verde), Alerta (amarillo) o Error (rojo). El color ayuda al visitante a identificar la urgencia." },
      { text: "Define fechas de vigencia si aplica.", detail: "Si es un aviso permanente, deja las fechas vacías." },
      { text: "Activa el anuncio.", detail: "Recomendamos tener máximo un anuncio activo a la vez para no saturar la interfaz." },
    ],
    tips: [
      "Desactiva el anuncio inmediatamente cuando ya no sea relevante.",
      "Los anuncios de alerta (amarillo) o error (rojo) llaman más la atención para avisos urgentes.",
    ],
  },
  {
    icon: IconMapPin,
    title: "Ubicación / Sucursales",
    color: "#E1F5EE",
    iconColor: "#0F6E56",
    desc: "Administra cada sucursal del restaurante con su dirección completa, mapa embebido y horarios específicos. Cada sucursal puede tener información diferente.",
    steps: [
      { text: 'Entra a Ubicación y haz clic en "Nueva sucursal".', detail: "Puedes tener múltiples sucursales, cada una con su propia información." },
      { text: "Escribe el nombre y la dirección completa.", detail: 'Ejemplo: "Sucursal Centro – Av. Juárez 123, Col. Centro, CDMX".' },
      { text: "Pega el enlace de Google Maps.", detail: 'En Google Maps, busca tu dirección → haz clic en "Compartir" → "Incorporar mapa" → copia el iframe o la URL.' },
      { text: "Agrega los horarios de esa sucursal.", detail: "Puedes especificar horarios diferentes por día de la semana." },
      { text: "Guarda la sucursal.", detail: "Aparecerá en la página de contacto/ubicación del sitio." },
    ],
    tips: [
      "Si tienes una sola sucursal, igual puedes usar esta sección para mostrar el mapa en el sitio.",
      "Actualiza los horarios en fechas especiales como días festivos o temporadas altas.",
    ],
  },
  {
    icon: IconCalendarWeek,
    title: "Horarios",
    color: "#F1EFE8",
    iconColor: "#5F5E5A",
    desc: "Configura los horarios generales de atención del restaurante. Si tienes múltiples sucursales, los horarios específicos se configuran en cada sucursal.",
    steps: [
      { text: "Entra a Horarios desde el menú lateral.", detail: "Verás los días de la semana con campos de apertura y cierre." },
      { text: "Para cada día activo, configura la hora de apertura y cierre.", detail: 'Usa formato de 24 horas. Ejemplo: apertura 13:00, cierre 22:00.' },
      { text: "Marca los días de descanso (sin servicio).", detail: "Los días cerrados se muestran como 'Cerrado' en el sitio." },
      { text: "Guarda los cambios.", detail: "Los horarios se muestran en la página de contacto y en la ficha de cada sucursal." },
    ],
    tips: [
      "Si tienes horario de corrido (sin cerrar al mediodía) déjalo como un solo rango.",
      "Para horarios partidos (comida y cena), consulta con tu desarrollador cómo configurarlo.",
    ],
  },
  {
    icon: IconPaint,
    title: "Tema visual",
    color: "#FBEAF0",
    iconColor: "#993556",
    desc: "Personaliza la apariencia del sitio: colores, tipografía y estilo general. Puedes crear múltiples temas y activar el que prefieras.",
    steps: [
      { text: "Entra a Tema desde el menú lateral.", detail: "Verás los temas disponibles y el que está actualmente activo." },
      { text: 'Para crear uno nuevo, haz clic en "Nuevo tema".', detail: "Ponle un nombre descriptivo como 'Navidad 2025' o 'Verano'." },
      { text: "Configura el color primario de la marca.", detail: "Este color se usa en botones, enlaces y elementos destacados del sitio." },
      { text: "Elige los colores de fondo y texto.", detail: "Asegúrate de que el contraste entre fondo y texto sea suficiente para buena legibilidad." },
      { text: "Guarda y activa el tema.", detail: "El cambio se refleja en el sitio de inmediato sin necesidad de redesplegar." },
    ],
    tips: [
      "Guarda el tema actual antes de experimentar con uno nuevo para poder revertir fácilmente.",
      "Usa temas temporales para fechas especiales (Navidad, Halloween, San Valentín).",
    ],
  },
  {
    icon: IconAddressBook,
    title: "Contacto",
    color: "#F3F0FF",
    iconColor: "#6D4AB7",
    desc: "Configura los datos de contacto del restaurante: teléfono, email, redes sociales y cualquier otro medio por el que los clientes puedan comunicarse.",
    steps: [
      { text: "Entra a Contacto desde el menú lateral.", detail: "Encontrarás un formulario con todos los campos de contacto." },
      { text: "Llena el teléfono principal.", detail: "Incluye el código de país y área. Ejemplo: +52 55 1234 5678." },
      { text: "Agrega el email de contacto.", detail: "Puede ser el email general del restaurante o uno específico para reservaciones." },
      { text: "Configura las redes sociales.", detail: "Pega la URL completa de cada perfil. Ejemplo: https://instagram.com/mirestaurante." },
      { text: "Guarda los cambios.", detail: "Los datos de contacto se muestran en el footer y en la página de contacto." },
    ],
    tips: [
      "Asegúrate de que el teléfono tenga habilitado WhatsApp si lo usas para pedidos.",
      "Revisa que los links de redes sociales funcionen antes de guardar.",
    ],
  },
]

const TOOLS: Tool[] = [
  {
    name: "GitHub",
    role: "Código fuente",
    icon: IconBrandGithub,
    color: "#F1EFE8",
    iconColor: "#2C2C2A",
    url: "https://github.com",
    desc: "GitHub es donde vive el código del sitio. Cada cambio que hace el desarrollador se sube aquí. GitHub actúa como historial de versiones: si algo se rompe, se puede regresar a una versión anterior.",
    howToAccess: [
      "El desarrollador te invita por email al repositorio del proyecto.",
      'Acepta la invitación y crea una cuenta en github.com si no tienes.',
      'En el repositorio puedes ver el historial de cambios, reportar problemas en "Issues" y en casos especiales descargar el código completo.',
    ],
    shareAs: "Colaborador con rol Write (no Admin, no Owner)",
  },
  {
    name: "Vercel",
    role: "Hosting y despliegue",
    icon: IconBrandVercel,
    color: "#2C2C2A",
    iconColor: "#FFFFFF",
    url: "https://vercel.com",
    desc: "Vercel publica el sitio en internet. Cada vez que el desarrollador actualiza el código en GitHub, Vercel automáticamente construye y publica la nueva versión. También es donde se configuran las variables de entorno (claves secretas).",
    howToAccess: [
      "Ve a vercel.com e inicia sesión o crea una cuenta.",
      'En el proyecto, ve a Settings → Members → Invite.',
      "Ingresa tu email y asigna el rol Member.",
      "Desde aquí puedes ver el estado del sitio, los deploys recientes y acceder a los logs si hay errores.",
    ],
    shareAs: "Miembro con rol Member (no Owner)",
  },
  {
    name: "Neon",
    role: "Base de datos",
    icon: IconDatabase,
    color: "#E1F5EE",
    iconColor: "#0F6E56",
    url: "https://neon.tech",
    desc: "Neon es la base de datos PostgreSQL donde se guardan todos los datos del sitio: productos, categorías, artículos del blog, promociones, configuraciones. Sin la base de datos, el sitio no funciona.",
    howToAccess: [
      "Ve a neon.tech e inicia sesión con la cuenta del proyecto.",
      "Selecciona el proyecto correspondiente al sitio.",
      'En "Tables" puedes ver todos los datos almacenados.',
      "Normalmente el cliente no necesita acceder directamente a Neon salvo para revisiones.",
    ],
    shareAs: "Colaborador de proyecto (solo lectura si no edita la BD)",
  },
  {
    name: "Cloudinary",
    role: "Almacenamiento de imágenes",
    icon: IconPhoto,
    color: "#E6F1FB",
    iconColor: "#185FA5",
    url: "https://cloudinary.com",
    desc: "Cloudinary almacena y optimiza todas las imágenes del sitio. Cuando subes una foto desde el admin (producto, blog, promoción), la imagen va a Cloudinary y el sitio la carga desde ahí de forma optimizada.",
    howToAccess: [
      "Ve a cloudinary.com e inicia sesión.",
      'En Settings → Access Keys puedes ver las credenciales del proyecto.',
      'Para dar acceso a alguien, ve a Settings → Users → Invite User.',
      "El widget de carga de imágenes en el admin ya está conectado, no necesitas abrir Cloudinary para subir fotos.",
    ],
    shareAs: "Usuario con rol Media Library User",
  },
]

/* ─── Sub-components ─────────────────────────────────────── */
function SectionAccordion({ section }: { section: Section }) {
  const [open, setOpen] = useState(false)
  const [openStep, setOpenStep] = useState<number | null>(null)
  const Icon = section.icon

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center cursor-pointer gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
      >
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
          style={{ background: section.color }}
        >
          <Icon size={17} color={section.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{section.title}</p>
          <p className="text-xs text-muted-foreground truncate">{section.desc.slice(0, 70)}…</p>
        </div>
        <IconChevronDown
          size={16}
          className={`text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">{section.desc}</p>

          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-2">Paso a paso</p>
          <div className="flex flex-col gap-1.5 mb-4">
            {section.steps.map((step, i) => (
              <div key={i} className="border border-border rounded-md overflow-hidden">
                <button
                  onClick={() => setOpenStep(openStep === i ? null : i)}
                  className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="text-[10px] font-medium min-w-[20px] h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs text-foreground flex-1">{step.text}</span>
                  {step.detail && (
                    <IconChevronRight
                      size={13}
                      className={`text-muted-foreground shrink-0 transition-transform ${openStep === i ? "rotate-90" : ""}`}
                    />
                  )}
                </button>
                {openStep === i && step.detail && (
                  <div className="px-3 pb-2.5 pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed pl-8 border-l-2 border-border ml-2.5">
                      {step.detail}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {section.tips && section.tips.length > 0 && (
            <>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-2">Consejos</p>
              <div className="flex flex-col gap-1.5">
                {section.tips.map((tip, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div className="mt-1 shrink-0 w-4 h-4 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                      <IconCheck size={9} className="text-green-700 dark:text-green-400" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function ToolCard({ tool }: { tool: Tool }) {
  const [open, setOpen] = useState(false)
  const Icon = tool.icon

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full cursor-pointer flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
      >
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
          style={{ background: tool.color }}
        >
          <Icon size={17} color={tool.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-medium text-foreground">{tool.name}</p>
            <span className="text-[10px] bg-muted text-muted-foreground rounded-full px-2 py-0.5">{tool.role}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{tool.desc.slice(0, 65)}…</p>
        </div>
        <IconChevronDown
          size={16}
          className={`text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tool.desc}</p>

          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-2">Cómo acceder</p>
          <div className="flex flex-col gap-1.5 mb-4">
            {tool.howToAccess.map((step, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <span className="text-[10px] font-medium min-w-[18px] h-[18px] rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-muted/60 rounded-md px-2.5 py-1.5">
              <IconShieldCheck size={13} className="text-green-700 dark:text-green-400" />
              <p className="text-[11px] text-muted-foreground">
                Compartir como: <span className="font-medium text-foreground">{tool.shareAs}</span>
              </p>
            </div>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-foreground hover:text-muted-foreground underline underline-offset-2 transition-colors"
            >
              Abrir <IconExternalLink size={11} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────── */
type Tab = "sections" | "tools" | "credentials"

export default function AdminHelpPage() {
  const [activeTab, setActiveTab] = useState<Tab>("sections")

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "sections", label: "Secciones del admin", icon: IconBook },
    { id: "tools", label: "Herramientas", icon: IconTool },
    { id: "credentials", label: "Accesos y credenciales", icon: IconLock },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Centro de ayuda</p>
        <h1 className="text-2xl font-medium text-foreground mb-2">Guía del panel de administración</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Aquí encontrarás todo lo necesario para gestionar el sitio de forma autónoma:
          cómo usar cada sección, para qué sirven las herramientas externas y cómo
          manejar los accesos de forma segura.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6 w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-background text-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab: Secciones */}
      {activeTab === "sections" && (
        <div>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Haz clic en cualquier sección para ver su descripción completa, los pasos a seguir y consejos de uso.
            Cada paso tiene un detalle adicional que puedes expandir.
          </p>
          <div className="flex flex-col gap-2">
            {ADMIN_SECTIONS.map((section) => (
              <SectionAccordion key={section.title} section={section} />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Herramientas */}
      {activeTab === "tools" && (
        <div>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            El sitio depende de cuatro servicios externos. Aquí se explica para qué sirve cada uno,
            cómo acceder y con qué nivel de permisos es seguro compartir el acceso.
          </p>

          {/* Architecture overview */}
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
            <p className="text-xs font-medium text-foreground mb-3">Cómo se conectan entre sí</p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { name: "Tú", desc: "editas en el admin" },
                { name: "Neon", desc: "guarda los datos" },
                { name: "Cloudinary", desc: "guarda las imágenes" },
                { name: "GitHub", desc: "guarda el código" },
                { name: "Vercel", desc: "publica el sitio" },
              ].map((node, i, arr) => (
                <div key={node.name} className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="bg-background border border-border rounded-md px-3 py-1.5 text-xs font-medium text-foreground">
                      {node.name}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{node.desc}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <IconChevronRight size={14} className="text-muted-foreground shrink-0 mb-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {TOOLS.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Credenciales */}
      {activeTab === "credentials" && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Cómo compartir accesos de forma segura sin exponer las claves del proyecto.
            La regla es simple: invita personas a través de las plataformas, nunca compartas las variables de entorno directamente.
          </p>

          {/* Regla de oro */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 dark:bg-amber-950 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <IconInfoCircle size={18} className="text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">La regla de oro</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Nunca compartes el archivo <code className="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded text-[11px]">.env</code> ni
                  las variables de entorno por chat, email o WhatsApp. En su lugar, invitas a las personas
                  directamente desde cada plataforma con el rol adecuado. Así puedes revocar el acceso en
                  cualquier momento sin cambiar ninguna clave.
                </p>
              </div>
            </div>
          </div>

          {/* Qué SÍ compartir */}
          <div className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center shrink-0">
                <IconCheck size={13} className="text-green-700 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-foreground">Qué sí puedes compartir</p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                {
                  title: "Credenciales del panel admin",
                  desc: "El email y contraseña del admin del sitio son seguros de compartir con el cliente. Solo dan acceso al panel de gestión, no a las plataformas externas.",
                  how: "Compártelos por un canal seguro (no WhatsApp). Recomienda al cliente cambiar la contraseña al recibirla.",
                },
                {
                  title: "Invitación de colaborador en Vercel",
                  desc: "Permite al cliente ver el estado del sitio, los deploys y los logs.",
                  how: "Vercel → Settings → Members → Invite → ingresa el email → rol: Member (no Owner).",
                },
                {
                  title: "Acceso al repositorio en GitHub",
                  desc: "Permite ver el código fuente, el historial de cambios y reportar problemas.",
                  how: "Repo → Settings → Collaborators → Add people → rol: Write o Triage (no Admin).",
                },
                {
                  title: "Invitación en Neon",
                  desc: "Permite al cliente ver la base de datos si necesita revisarla.",
                  how: "Neon → Project → Settings → Collaborators → Invite → rol: Member (solo lectura si no edita).",
                },
                {
                  title: "Acceso a Cloudinary",
                  desc: "Permite gestionar imágenes directamente desde Cloudinary si el widget del admin no es suficiente.",
                  how: "Cloudinary → Settings → Users → Invite User → rol: Media Library User.",
                },
              ].map((item) => (
                <div key={item.title} className="border border-border rounded-md p-3">
                  <div className="flex items-start gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500 mt-1.5 shrink-0" />
                    <p className="text-xs font-medium text-foreground">{item.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-1.5 pl-3.5">{item.desc}</p>
                  <div className="ml-3.5 bg-muted/60 rounded px-2.5 py-1.5">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">Cómo hacerlo: </span>{item.how}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qué NO compartir */}
          <div className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center shrink-0">
                <IconX size={13} className="text-red-700 dark:text-red-400" />
              </div>
              <p className="text-sm font-medium text-foreground">Qué nunca debes compartir</p>
            </div>
            <div className="flex flex-col gap-2">
              {[
                {
                  key: "DATABASE_URL",
                  risk: "Da acceso total a la base de datos. Quien la tenga puede leer, modificar o borrar todos los datos del sitio.",
                },
                {
                  key: "CLOUDINARY_API_SECRET",
                  risk: "Da acceso completo a Cloudinary: subir, editar y borrar todas las imágenes del sitio.",
                },
                {
                  key: "NEXTAUTH_SECRET",
                  risk: "Permite falsificar sesiones de usuario en el admin, accediendo sin contraseña.",
                },
                {
                  key: "Tokens de acceso personal de GitHub",
                  risk: "Dan acceso al código fuente con todos tus permisos personales, incluyendo otros proyectos.",
                },
                {
                  key: "Archivo .env completo",
                  risk: "Contiene todas las claves anteriores juntas. Nunca debe subirse a GitHub ni enviarse por ningún medio.",
                },
              ].map((item) => (
                <div key={item.key} className="flex gap-3 items-start border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 rounded-md px-3 py-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground mb-0.5">
                      <code className="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded text-[11px]">{item.key}</code>
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.risk}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Si se filtra una clave */}
          <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <IconAlertTriangle size={17} className="text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1.5">¿Qué hacer si se filtró una clave?</p>
                <div className="flex flex-col gap-1.5">
                  {[
                    "Neon: ve a Settings → Connection string → Regenerate password. La URL anterior deja de funcionar.",
                    "Cloudinary: ve a Settings → Access Keys → Regenerate API Secret.",
                    "Vercel: ve a Settings → Environment Variables → elimina y vuelve a crear la variable afectada. Redespliega el sitio.",
                    "NextAuth: genera un nuevo secret con el comando openssl rand -base64 32 y actualízalo en Vercel.",
                    "GitHub token: ve a Settings → Developer settings → Personal access tokens → revoca el token comprometido.",
                  ].map((step, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <span className="text-[10px] font-medium min-w-[18px] h-[18px] rounded-full bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Buenas prácticas */}
          <div className="border border-border rounded-lg p-4 bg-card">
            <p className="text-sm font-medium text-foreground mb-3">Buenas prácticas generales</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Usa contraseñas únicas para cada plataforma, nunca repitas la misma.",
                "Activa la autenticación de dos factores (2FA) en GitHub y Vercel.",
                "Revoca el acceso a colaboradores cuando termine el proyecto o la relación de trabajo.",
                "Nunca guardes claves en documentos de Google Drive o Notion sin cifrar.",
                "Usa un gestor de contraseñas como 1Password o Bitwarden para guardar las credenciales.",
                "Revisa periódicamente quién tiene acceso a cada plataforma y elimina accesos innecesarios.",
              ].map((tip, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center shrink-0 mt-0.5">
                    <IconCheck size={9} className="text-green-700 dark:text-green-400" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}