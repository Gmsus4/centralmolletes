export interface TitleProps {
    title: string;
    subtitle: string;
    isUppercase?: boolean
}

export const Titles: Record<string, TitleProps> = {
    aboutUs: {
        title: "Central Molletes",
        subtitle: "Una cafetería que nació del amor por el buen café y los molletes bien hechos."
    },
    locations: {
        title: "Dónde encontrarnos",
        subtitle: "Ven a visitarnos en Etzatlán, Jalisco."
    },
    menu: {
        title: "Nuestro Menú",
        subtitle: "Molletes, chilaquiles, café y más — todo hecho al momento."
    },
    contact: {
        title: "Contáctanos",
        subtitle: "Estamos aquí para ayudarte con tu pedido o resolver cualquier duda."
    },
    home: {
        title: "Central molletes",
        isUppercase: false,
        subtitle: "Cafetería"
    }
}