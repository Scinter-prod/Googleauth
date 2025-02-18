"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { loading, user } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  if (loading) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}

