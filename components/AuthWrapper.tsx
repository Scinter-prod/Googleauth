"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
// import { useAuth } from "@/hooks/useAuth"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  // const { loading, initializeAuth } = useAuth()

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const token = params.get("token")
        if (token) {
          localStorage.setItem("token", token)
          await router.replace("/")
        }
        // await initializeAuth()
      } catch (error) {
        console.error("Error in AuthWrapper:", error)
      }
    }

    handleAuth()
  }, [router])

  // if (loading) {
  //   return <div>Loading...</div>
  // }

  return <>{children}</>
}

