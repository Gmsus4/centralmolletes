import { PrismaClient } from "../app/generated/prisma/client"
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

async function main() {
  console.log("Sembrando base de datos...\n")

  // ── ADMIN USER ─────────────────────────────────────────
  const hashedPassword = await bcryptjs.hash("admin123", 10)
  await prisma.user.upsert({
    where: { email: "admin@centralmolletes.com" },
    update: {},
    create: {
      email: "admin@centralmolletes.com",
      password: hashedPassword,
    },
  })
  console.log("✓ Admin creado")

  // ── CATEGORÍAS ─────────────────────────────────────────
  console.log("\nInsertando categorías...")
  const categoryMap: Record<string, string> = {} // name → id

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
      where: { slug: product.slug },
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
  console.log("\n✅ Seed completado")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())