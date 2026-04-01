// data/privacy.ts

export interface PrivacySection {
  title: string
  items: string[]
}

export const privacy: PrivacySection[] = [
  {
    title: "Responsable de los Datos",
    items: [
      "La empresa responsable del tratamiento de tus datos personales es Central Molletes, con domicilio en Etzatlán, Jalisco, México.",
      "Para cualquier consulta relacionada con tus datos personales puedes contactarnos a través de nuestros canales oficiales en redes sociales.",
    ],
  },
  {
    title: "Datos que Recopilamos",
    items: [
      "Nombre, únicamente cuando realizas un pedido anticipado o reservación de grupo.",
      "Número de teléfono, para coordinar pedidos para llevar o aclaraciones sobre tu orden.",
      "Dirección, únicamente cuando solicitas servicio a domicilio.",
    ],
  },
  {
    title: "Finalidad del Tratamiento",
    items: [
      "Confirmar y coordinar pedidos anticipados o de grupos.",
      "Gestionar la entrega a domicilio cuando aplique.",
      "Atender dudas, quejas o aclaraciones relacionadas con nuestros productos y servicios.",
      "Cumplir con obligaciones legales y fiscales derivadas de la relación comercial.",
    ],
  },
  {
    title: "Uso Secundario de los Datos",
    items: [
      "Con tu consentimiento, podemos enviarte promociones, novedades de temporada y nuevos productos.",
      "Puedes retirar tu consentimiento en cualquier momento contactándonos por nuestros canales oficiales.",
      "No utilizaremos tus datos para ninguna finalidad distinta a las descritas sin informarte previamente.",
    ],
  },
  {
    title: "Compartición de Datos",
    items: [
      "No vendemos, rentamos ni cedemos tus datos personales a terceros con fines comerciales.",
      "Tus datos pueden compartirse con servicios de entrega únicamente para coordinar la logística de tu pedido a domicilio.",
      "En caso de requerimiento legal, podemos divulgar información a autoridades competentes.",
    ],
  },
  {
    title: "Conservación de los Datos",
    items: [
      "Conservamos tus datos durante el tiempo necesario para cumplir con las finalidades descritas.",
      "Los datos fiscales se conservan por el tiempo que establece la legislación mexicana vigente (5 años).",
      "Una vez concluida la relación comercial, tus datos serán eliminados de forma segura.",
    ],
  },
  {
    title: "Derechos Derechos ARCO",
    items: [
      "Tienes derecho a Acceder a tus datos personales que conservamos.",
      "Tienes derecho a Rectificar tus datos si son incorrectos o están desactualizados.",
      "Tienes derecho a Cancelar tus datos cuando consideres que no son necesarios para la finalidad del tratamiento.",
      "Tienes derecho a Oponerte al tratamiento de tus datos para fines secundarios.",
      "Para ejercer tus derechos TAGB contáctanos por nuestros canales oficiales indicando tu nombre y la descripción de tu solicitud.",
      "Responderemos tu solicitud en un plazo máximo de 20 días hábiles.",
    ],
  },
  {
    title: "Seguridad de los Datos",
    items: [
      "Implementamos medidas para proteger tus datos contra acceso no autorizado, pérdida o alteración.",
      "El acceso a tus datos está restringido únicamente al personal necesario para atender tu pedido.",
      "En caso de una brecha de seguridad que afecte tus datos, te notificaremos de inmediato.",
    ],
  },
  {
    title: "Cambios a este Aviso",
    items: [
      "Podemos actualizar este Aviso de Privacidad en cualquier momento.",
      "Te notificaremos cualquier cambio relevante a través de nuestros canales oficiales.",
      "La fecha de última actualización siempre estará visible al inicio de este documento.",
    ],
  },
]