export interface ContactItem {
  label: string
  href?: string
  value?: string
}

export interface ContactInfo {
  title: string
  prefix?: string  // para tel: y mailto:
  items: ContactItem[]
}

export const contactData: ContactInfo[] = [
  {
    title: "Teléfono",
    prefix: "tel:",
    items: [
      { label: "+52 (386) 105-4528", value: "3861054528" },
    ],
  },
  {
    title: "Email",
    prefix: "mailto:",
    items: [
      { label: "centralmolletes@gmail.com" },
    ],
  },
  {
    title: "Ubicaciones",
    items: [
      { label: "Ocampo #63, Centro", href: "https://maps.app.goo.gl/FuV4CUvvDCx4QiwV8" },
    ],
  },
]