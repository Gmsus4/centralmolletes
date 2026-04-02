import { PrismaClient, DayOfWeek } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcryptjs from "bcryptjs"
import "dotenv/config"
import { menu } from "../data/menu"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

const categories = [
  { name: "Panadería",   emoji: "🥐", order: 1  },
  { name: "Molletes",    emoji: "🫓", order: 2  },
  { name: "Chilaquiles", emoji: "🌮", order: 3  },
  { name: "Huevos",      emoji: "🍳", order: 4  },
  { name: "Hotcakes",    emoji: "🥞", order: 5  },
  { name: "Waffles",     emoji: "🧇", order: 6  },
  { name: "Café",        emoji: "☕", order: 7  },
  { name: "Cacao",       emoji: "🍫", order: 8  },
  { name: "Brebajes",    emoji: "🧋", order: 9  },
  { name: "Té",          emoji: "🍵", order: 10 },
  { name: "Bebidas",     emoji: "🥤", order: 11 },
  { name: "Alcohólicas", emoji: "🍹", order: 12 },
]

const schedules = [
  { dayOfWeek: DayOfWeek.LUNES,     shifts: [{ name: "Matutino", openTime: "08:00", closeTime: "16:00" }] },
  { dayOfWeek: DayOfWeek.MARTES,    shifts: [{ name: "Matutino", openTime: "08:00", closeTime: "16:00" }] },
  { dayOfWeek: DayOfWeek.MIERCOLES, shifts: [{ name: "Matutino", openTime: "08:00", closeTime: "16:00" }] },
  { dayOfWeek: DayOfWeek.JUEVES,    shifts: [{ name: "Matutino", openTime: "08:00", closeTime: "16:00" }] },
  { dayOfWeek: DayOfWeek.VIERNES,   shifts: [{ name: "Matutino", openTime: "08:00", closeTime: "16:00" }] },
  { dayOfWeek: DayOfWeek.SABADO,    shifts: [{ name: "Matutino", openTime: "09:00", closeTime: "15:00" }] },
  { dayOfWeek: DayOfWeek.DOMINGO,   shifts: [{ name: "Matutino", openTime: "09:00", closeTime: "15:00" }] },
]

async function main() {
  console.log("Sembrando base de datos...\n")

  // ── ADMIN USER ─────────────────────────────────────────
  const hashedPassword = await bcryptjs.hash("admin123", 10)
  await prisma.user.upsert({
    where:  { email: "admin@centralmolletes.com" },
    update: {},
    create: { email: "admin@centralmolletes.com", password: hashedPassword }
  })
  console.log("✓ Admin creado")

  // ── CATEGORÍAS ─────────────────────────────────────────
  console.log("\nInsertando categorías...")
  const categoryMap: Record<string, string> = {}

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where:  { name: cat.name },
      update: { emoji: cat.emoji, order: cat.order },
      create: cat,
    })
    categoryMap[cat.name] = created.id
    process.stdout.write(`  · ${cat.emoji} ${cat.name}\n`)
  }
  console.log("✓ Categorías sincronizadas")

  // ── PRODUCTOS ──────────────────────────────────────────
  console.log(`\nInsertando ${menu.length} productos...`)

  for (const product of menu) {
    const categoryId = categoryMap[product.category]

    if (!categoryId) {
      console.warn(`  ⚠ Categoría no encontrada: "${product.category}" — saltando ${product.name}`)
      continue
    }

    await prisma.product.upsert({
      where:  { slug: product.slug },
      update: {
        name:        product.name,
        price:       product.price,
        categoryId,
        tag:         product.tag ?? null,
        img:         product.img,
        desc:        product.desc,
        descLong:    product.descLong,
        ingredients: JSON.stringify(product.ingredients),
        allergens:   JSON.stringify(product.allergens),
        weight:      product.weight,
        prepTime:    product.prepTime,
      },
      create: {
        slug:        product.slug,
        name:        product.name,
        price:       product.price,
        categoryId,
        tag:         product.tag ?? null,
        img:         product.img,
        desc:        product.desc,
        descLong:    product.descLong,
        ingredients: JSON.stringify(product.ingredients),
        allergens:   JSON.stringify(product.allergens),
        weight:      product.weight,
        prepTime:    product.prepTime,
      },
    })
    process.stdout.write(`  · ${product.name}\n`)
  }
  console.log(`\n✓ ${menu.length} productos sincronizados`)

  // ── CONTACT INFO + SOCIAL LINKS ────────────────────────
  console.log("\nInsertando ContactInfo...")

  // ContactInfo no tiene unique natural, así que tomamos el primero o creamos
  let contactInfo = await prisma.contactInfo.findFirst()

  if (!contactInfo) {
    contactInfo = await prisma.contactInfo.create({
      data: {
        address:       "Av. Central 123, Col. Centro, CDMX",
        email:         "hola@centralmolletes.com",
        phone:         "+52 55 1234 5678",
        whatsapp:      "+52 55 1234 5678",
        isOpenOverride: true,
        extraInfo:     "Estacionamiento disponible en la calle lateral",
        schedule: {
          lunes_viernes: "8:00 - 16:00",
          sabado_domingo: "9:00 - 15:00",
        },
      },
    })

    const socialLinks = [
      { platform: "instagram", url: "https://instagram.com/centralmolletes", username: "@centralmolletes", order: 1 },
      { platform: "facebook",  url: "https://facebook.com/centralmolletes",  username: "Central Molletes",  order: 2 },
      { platform: "tiktok",    url: "https://tiktok.com/@centralmolletes",   username: "@centralmolletes", order: 3 },
    ]

    for (const link of socialLinks) {
      await prisma.socialLink.create({
        data: { ...link, contactInfoId: contactInfo.id },
      })
      process.stdout.write(`  · ${link.platform}\n`)
    }
  } else {
    console.log("  · ContactInfo ya existe, omitiendo")
  }
  console.log("✓ ContactInfo sincronizado")

  // ── SCHEDULES + SHIFTS ─────────────────────────────────
  console.log("\nInsertando horarios...")

  for (const schedule of schedules) {
    const existing = await prisma.schedule.findUnique({
      where: { dayOfWeek: schedule.dayOfWeek },
    })

    if (!existing) {
      const created = await prisma.schedule.create({
        data: {
          dayOfWeek: schedule.dayOfWeek,
          isActive:  true,
          shifts: {
            create: schedule.shifts,
          },
        },
      })
      process.stdout.write(`  · ${created.dayOfWeek}\n`)
    } else {
      process.stdout.write(`  · ${schedule.dayOfWeek} (ya existe)\n`)
    }
  }
  console.log("✓ Horarios sincronizados")

  // ── THEME ──────────────────────────────────────────────
  console.log("\nInsertando tema base...")
  const existingTheme = await prisma.theme.findFirst({ where: { name: "Default" } })

  if (!existingTheme) {
    await prisma.theme.create({
      data: {
        name:     "Default",
        isActive: true,

        bgBody: "#ffffff",
        bgDark: "#1a1a1a",

        textMain:   "#1a1a1a",
        textTitles: "#111111",
        textMuted:  "#6b7280",
        textInvert: "#ffffff",

        brandPrimary:       "#d97706",
        brandPrimaryHover:  "#b45309",
        brandContrast:      "#ffffff",
        brandContrastHover: "#f3f4f6",

        borderColor: "#e5e7eb",
        statusError: "#ef4444",
        shadowColor: "rgba(0,0,0,0.1)",

        radius:     "0.5rem",
        radiusFull: "9999px",

        fontTitle: "Playfair Display",
        fontBody:  "Inter",
      },
    })
    console.log("✓ Tema creado")
  } else {
    console.log("  · Tema ya existe, omitiendo")
  }

  // ── LOCATION ───────────────────────────────────────────
  console.log("\nInsertando sucursal...")
  await prisma.location.upsert({
    where:  { slug: "central-cdmx" },
    update: {},
    create: {
      slug:       "central-cdmx",
      city:       "Ciudad de México",
      name:       "Central Molletes CDMX",
      address:    "Av. Central 123, Col. Centro, Ciudad de México, CP 06000",
      addressMin: "Av. Central 123, CDMX",
      phone:      "+52 55 1234 5678",
      hours:      "Lun–Vie 8:00–16:00 | Sáb–Dom 9:00–15:00",
      image:      "/images/locations/cdmx.jpg",
      gallery:    "[]",
      mapUrl:     "https://maps.google.com/?q=Central+Molletes+CDMX",
      embedUrl:   "https://www.google.com/maps/embed?pb=...",
    },
  })
  console.log("✓ Sucursal sincronizada")

  // ── ANNOUNCEMENT ───────────────────────────────────────
  console.log("\nInsertando anuncio de bienvenida...")
  const existingAnnouncement = await prisma.announcement.findFirst({
    where: { title: "¡Bienvenidos a Central Molletes!" },
  })

  if (!existingAnnouncement) {
    await prisma.announcement.create({
      data: {
        type:     "INFO",
        title:    "¡Bienvenidos a Central Molletes!",
        message:  "Descubre nuestro menú de desayunos y brunch. ¡Te esperamos!",
        isActive: true,
        startsAt: new Date(),
      },
    })
    console.log("✓ Anuncio creado")
  } else {
    console.log("  · Anuncio ya existe, omitiendo")
  }

  console.log("\n✅ Seed completado")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())