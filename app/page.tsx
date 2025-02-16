import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { StatusBar } from "@/components/status-bar"
import { AuthWrapper } from "@/components/AuthWrapper"
import dynamic from "next/dynamic"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const DynamicMainContent = dynamic(() => import("@/components/main-content"), { ssr: false })

export default function Page() {
  return (
    <ErrorBoundary>
      <AuthWrapper>
        <div className="flex h-screen flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <DynamicMainContent />
          </div>
          <StatusBar />
        </div>
      </AuthWrapper>
    </ErrorBoundary>
  )
}

