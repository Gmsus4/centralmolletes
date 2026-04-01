export type Extra = {
  label: string
  price: number
}

export type CategoryExtra = {
  title: string
  note?: string
  extras: Extra[]
}

export const categoryExtras: Partial<Record<string, CategoryExtra[]>> = {

  "Molletes": [
    {
      title: "Extras",
      extras: [
        { label: "Huevo estrellado", price: 12 },
        { label: "Pollo",            price: 17 },
      ],
    },
  ],

  "Chilaquiles": [
    {
      title: "¿No traes tanta hambre?",
      note: "Media porción disponible",
      extras: [
        { label: "Media porción de chilaquiles", price: 50 },
      ],
    },
  ],

  "Huevos": [
    {
      title: "Agrega a tu plato",
      extras: [
        { label: "Chilaquiles sencillos",  price: 20 },
        { label: "Chilaquiles gratinados", price: 30 },
        { label: "Ingrediente extra",      price: 10 },
        { label: "Salsa roja o verde",     price: 10 },
      ],
    },
  ],

  "Waffles": [
    {
      title: "Untables extra",
      extras: [
        { label: "Nutella",  price: 12 },
        { label: "Lechera",  price: 10 },
      ],
    },
  ],

  "Café": [
    {
      title: "Agrega una esencia",
      note: "Caramelo salado · Vainilla · Caramelo · Crema Irlandesa · Avellana · Amaretto",
      extras: [
        { label: "Esencia a elegir", price: 15 },
      ],
    },
  ],

  "Cacao": [
    {
      title: "Personaliza tu bebida",
      extras: [
        { label: "Leche deslactosada", price: 3  },
        { label: "Leche vegetal",      price: 10 },
        { label: "Carga de espresso",  price: 15 },
      ],
    },
  ],

}

/** Helper: devuelve los extras de una categoría o undefined si no tiene. */
export const getCategoryExtras = (category: string) =>
  categoryExtras[category]