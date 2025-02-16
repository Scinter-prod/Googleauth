import type React from "react"

import { useState, useRef, useEffect } from "react"

import { getAuthUrl } from "../utils/googleDocsApi"
import { Button } from "@/components/ui/button"

const GoogleSignIn: React.FC = () => {

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const handleSignIn = () => {
    window.location.href = getAuthUrl()
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("access_token")
    if (token) {
      setAccessToken(token)
      // setIsSignedIn(true)
    }
  }, [])
  const handleCreateGoogleDoc = async () => {
    if (accessToken) {
      try {
        const response = await fetch("/api/docs/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: accessToken, title: "New Document" }),
        })
        const doc = await response.json()
        console.log("Created document:", doc)
      } catch (error) {
        console.error("Error creating document:", error)
      }
    }
  }
  return (
    <div>
    <Button onClick={handleCreateGoogleDoc} variant="outline" size="sm">
                 Create Google Doc
                </Button>
    <Button onClick={handleSignIn} variant="outline">
      Sign in with Google
      </Button>
    </div>
  )
}

export default GoogleSignIn

