import { Metadata } from "next"
import { AdminSidebar } from "./components/AdminSidebar"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-stone-50 min-h-screen flex overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-1 lg:ml-56 pt-16 lg:pt-0 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}