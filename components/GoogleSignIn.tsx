import type React from "react"
import { getAuthUrl } from "../utils/googleDocsApi"
import { Button } from "@/components/ui/button"

const GoogleSignIn: React.FC = () => {
  const handleSignIn = () => {
    window.location.href = getAuthUrl()
  }

  return (
    <Button onClick={handleSignIn} variant="outline">
      Sign in with Google
    </Button>
  )
}

export default GoogleSignIn

