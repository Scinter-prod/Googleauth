import { type NextRequest, NextResponse } from "next/server"
import { getAuthUrl } from "@/utils/googleDocsApi"

export async function GET(request: NextRequest) {
  const authUrl = getAuthUrl()
  return NextResponse.redirect(authUrl)
}

