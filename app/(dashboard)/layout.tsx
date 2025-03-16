import { BreadcrumbHeader } from "@/components/breadcrumb-header"
import { DesktopSidebar } from "@/components/side-bar"
import { Separator } from "@/components/ui/separator"

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <DesktopSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
          <BreadcrumbHeader />
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="flex-1 container py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
