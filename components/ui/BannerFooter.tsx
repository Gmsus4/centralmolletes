import { contactData } from "@/data/contactData"
export const BannerFooter = () => {
    const email = contactData[1].items[0].label;
    return (
        <div className="mt-6 p-6 rounded-2xl border border-darkMid/15 bg-cream flex flex-col gap-2">
            <p className="text-base tracking-widest uppercase text-darkWarm font-semibold">Contacto</p>
            <p className="text-sm text-darkMid leading-relaxed">
            Si tienes dudas sobre estos términos, escríbenos a{" "}
            <a href={`mailto:${email}`} className="text-darkMid underline underline-offset-2 hover:opacity-70 transition-opacity">
                {email}
            </a>{" "}
            o visítanos en cualquiera de nuestras sucursales.
            </p>
        </div>
    )
}