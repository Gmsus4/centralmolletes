import { Suspense } from "react"
import SiteContentForm from "../SiteContentForm"

export default function NewSiteContentPage() {
  return (
    <Suspense >
      <SiteContentForm />
    </Suspense>
  )
}