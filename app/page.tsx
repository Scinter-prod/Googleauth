import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { StatusBar } from "@/components/status-bar"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import dynamic from "next/dynamic"

const DynamicMainContent = dynamic(() => import("@/components/main-content"), { ssr: false })

export default function Page() {
  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <DynamicMainContent />
          </main>
        </div>
        <StatusBar />
      </div>
    </ErrorBoundary>
  )
}

