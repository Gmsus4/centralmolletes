export interface Location {
  id: number
  slug: string
  city: string
  name: string
  address: string,
  addressMin: string,
  phone: string
  hours: string
  image: string
  gallery: string[]
  mapUrl: string
  embedUrl: string
}

export const locations: Location[] = [
  {
    id: 1,
    slug: "etzatlan",
    city: "Etzatlán",
    name: "Central Molletes Cafetería",
    address: "Ocampo 63, Centro, 46500 Etzatlán, Jal.",
    addressMin: "Ocampo 63, Centro",
    phone: "+52 (386) 105-4528",
    hours: "Matutino 8:30 am a 1:00 pm | Vespertino 7:00 pm a 10:30 pm",
    image: "",
    gallery: ["https://foodandpleasure.com/wp-content/uploads/2025/01/etzatlan1.jpg", "https://www.zonadocs.mx/wp-content/uploads/2023/01/51958918075_349f09704e_c.jpg", "https://cdn.milenio.com/uploads/media/2019/06/15/etzatlan-jalisco-cortesia.jpg", "https://i0.wp.com/foodandpleasure.com/wp-content/uploads/2025/01/etzatlan9.jpg?resize=600%2C338&ssl=1"],
    mapUrl: "https://maps.app.goo.gl/FuV4CUvvDCx4QiwV8",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3730.7028650788993!2d-104.07968!3d20.7628341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84266f58f9aadc49%3A0x25e79d33308c5fc!2sCentral%20Molletes%20Cafeter%C3%ADa!5e0!3m2!1ses!2smx!4v1773169531749!5m2!1ses!2smx",
  },
]