// ─── Assets base ───────────────────────────────────────────────
// Fuente única de verdad para todas las imágenes del proyecto.
// Las secciones referencian estos assets, no rutas directas.

const assets = {
  /* aboutDetails */
  interiorCafeteria: {
    src: "/images/interior-cafeteria-central-molletes.webp",
    alt: ""
  },
  molleteQuejeta: {
    src: "/menu/molletes/molletes.webp",
    alt: ""
  },
  chilaquilesChipotles: {
    src: "/menu/chilaquiles/chilaquiles.webp",
    alt: ""
  },

  /* testimonials */
  espressoMaquina: {
    src: "/images/espresso-maquina.webp",
    alt: "Extracción de espresso en máquina profesional de café",
  },
  cappuccinoPan: {
    src: "/images/cappuccino-pan.webp",
    alt: "Cappuccino con arte latte junto a pan artesanal sobre mesa de madera",
  },
  latteArtVertido: {
    src: "/images/latte-art-vertido.webp",
    alt: "Barista vertiendo leche para crear arte latte en taza blanca",
  },

  /* statsGrid */
  chilaquiles: {
    src: "https://images.pexels.com/photos/31843919/pexels-photo-31843919.jpeg",
    alt: "Chilaquiles",
  },
  hotcakes: {
    src: "https://images.pexels.com/photos/30892986/pexels-photo-30892986.jpeg",
    alt: "Hotcakes",
  },
  cafe: {
    src: "https://images.pexels.com/photos/2068296/pexels-photo-2068296.jpeg",
    alt: "Café",
  },

  // ── Locations ────────────────────────────────────────────────
  map: {
    src: "/locations/mapa-sucursales.webp",
    alt: "Mapa con ubicaciones de las sucursales Couronne en Jalisco",
  },

} as const

// ─── Secciones ─────────────────────────────────────────────────
// Cada sección referencia assets del objeto de arriba.
// Si una imagen cambia de sección, solo se actualiza aquí.

export const images = {
  aboutDetails: [
    assets.interiorCafeteria,
    assets.molleteQuejeta,
    assets.chilaquilesChipotles,
  ],

  testimonials: [
    assets.espressoMaquina,
    assets.cappuccinoPan,
    assets.latteArtVertido,
  ],
  
/*   about: 
    assets.brownieDecoradoCerezas,
    assets.cupcakeRedVelvet,
    assets.cookiesChocolateNavidad,
  ], */

  statsGrid: [
    assets.chilaquiles,
    assets.hotcakes,
    assets.cafe,
  ],

  benefitsPanel: [
    assets.cafe,
  ],

  map: [
    assets.map
  ]

} as const