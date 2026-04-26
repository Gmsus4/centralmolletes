import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { BlogSection } from "@/lib/validators/blog"

// ─── Prose wrapper para Markdown ──────────────────────────────────────────────

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      opacity-90
      flex flex-col gap-2
      prose max-w-none
      prose-p:text-stone-700 prose-p:leading-relaxed prose-p:text-base
      prose-a:text-stone-900 prose-a:underline prose-a:underline-offset-2
      prose-a:decoration-stone-400 hover:prose-a:decoration-stone-900
      prose-strong:text-stone-900 prose-strong:font-semibold
      prose-em:text-stone-600
      prose-headings:text-stone-900
      [&_p]:
    ">
      {children}
    </div>
  )
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ text }: { text: string }) {
  return (
    <h2 className="text-2xl sm:text-3xl leading-tight mb-4">
      {text}
    </h2>
  )
}

// ─── Renderers por tipo ───────────────────────────────────────────────────────

function TextSection({ section }: { section: Extract<BlogSection, { type: "text" }> }) {
  return (
    <div>
      {section.heading && <SectionHeading text={section.heading} />}
      {section.body && (
        <Prose>
          <ReactMarkdown>{section.body}</ReactMarkdown>
        </Prose>
      )}
    </div>
  )
}

function ImageSection({ section }: { section: Extract<BlogSection, { type: "image" }> }) {
  if (!section.image) return null
  return (
    <figure className="my-2">
      <img
        src={section.image}
        alt={section.heading ?? ""}
        className="w-full object-cover rounded-radius "
      />
      {section.heading && (
        <figcaption className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-stone-400">
          {section.heading}
        </figcaption> 
      )}
    </figure>
  )
}

function QuoteSection({ section }: { section: Extract<BlogSection, { type: "quote" }> }) {
  return (
    <blockquote className="border-l-2 border-stone-300 pl-6 py-1 my-2">
      {section.heading && (
        <p className="text-[10px] uppercase tracking-[0.25em] mb-3">
          {section.heading}
        </p>
      )}
      {section.body && (
        <p className="text-stone-600 dark:text-stone-300 text-lg sm:text-xl leading-relaxed italic">
          {section.body}
        </p>
      )}
    </blockquote>
  )
}

function CtaSection({ section }: { section: Extract<BlogSection, { type: "cta" }> }) {
  return (
    <div className="border bg-background rounded-radius p-8 flex flex-col items-center text-center gap-4">
      {section.heading && (
        <h3 className="font-titleText text-stone-900 uppercase text-2xl sm:text-3xl leading-tight">
          {section.heading}
        </h3>
      )}
      {section.body && (
        <p className="text-sm max-w-sm leading-relaxed">
          {section.body}
        </p>
      )}
      {section.buttonLabel && section.buttonUrl && (
        <Link
          href={section.buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            rounded-radius
            inline-block mt-2
            bg-stone-900 text-white
            px-8 py-3
            text-[11px] uppercase tracking-[0.3em] font-semibold
            hover:opacity-90 active:opacity-75
            transition-opacity duration-200
          "
        >
          {section.buttonLabel}
        </Link>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SectionRenderer({ sections }: { sections: BlogSection[] }) {
  return (
    <div className="flex flex-col gap-10">
      {sections.map((section, idx) => {
        switch (section.type) {
          case "text":
            return <TextSection  key={idx} section={section} />
          case "image":
            return <ImageSection key={idx} section={section} />
          case "quote":
            return <QuoteSection key={idx} section={section} />
          case "cta":
            return <CtaSection   key={idx} section={section} />
          default:
            return null
        }
      })}
    </div>
  )
}