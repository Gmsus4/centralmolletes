export interface TermSection {
  title: string
  items: string[]
}

export const terms: TermSection[] = [
  {
    title: "Horarios y Servicio",
    items: [
      "Nuestro horario de atención puede variar según el día; consulta nuestras redes sociales para horarios actualizados.",
      "El servicio en mesa está sujeto a disponibilidad de lugares.",
      "Nos reservamos el derecho de admisión.",
    ],
  },
  {
    title: "Pedidos y Pagos",
    items: [
      "Los pedidos se realizan directamente en caja o con tu mesero.",
      "Aceptamos efectivo y tarjeta de crédito/débito.",
      "Los precios incluyen IVA y están sujetos a cambio sin previo aviso.",
      "No se aceptan devoluciones de productos ya preparados salvo error de nuestra parte.",
    ],
  },
  {
    title: "Pedidos para Llevar",
    items: [
      "Los pedidos para llevar pueden solicitarse en caja o por nuestros canales de contacto.",
      "Pedidos anticipados de grupos de 10 o más personas requieren aviso previo de al menos 24 horas.",
      "No nos responsabilizamos por el estado del producto una vez que sale de nuestras instalaciones.",
    ],
  },
  {
    title: "Alérgenos e Ingredientes",
    items: [
      "Todos nuestros productos se elaboran en un espacio donde se manipulan gluten, lácteos, huevo y frutos secos.",
      "El cliente es responsable de informar alergias o restricciones alimentarias al momento de ordenar.",
      "Hacemos nuestro mejor esfuerzo para atender restricciones, pero no garantizamos la ausencia total de trazas.",
      "Consulta con nuestro personal si tienes dudas sobre los ingredientes de algún producto.",
    ],
  },
  {
    title: "Disponibilidad de Productos",
    items: [
      "Algunos productos como los Panecitos del Día o el Bowl de Fruta están sujetos a disponibilidad.",
      "Los productos de temporada pueden cambiar sin previo aviso.",
      "En caso de no contar con algún ingrediente, te informaremos y ofreceremos una alternativa.",
    ],
  },
  {
    title: "Personalización y Modificaciones",
    items: [
      "Aceptamos modificaciones sencillas a los platillos según disponibilidad.",
      "Cambios mayores en la preparación pueden tener un costo adicional.",
      "No garantizamos modificaciones en horarios de alta demanda.",
    ],
  },
  {
    title: "Comportamiento y Uso del Espacio",
    items: [
      "Pedimos a nuestros clientes mantener un ambiente agradable y respetuoso.",
      "Las mascotas son bienvenidas en áreas exteriores únicamente.",
      "Somos un espacio familiar; te pedimos consideración con el volumen de voz y dispositivos electrónicos.",
    ],
  },
]