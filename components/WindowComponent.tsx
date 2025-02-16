"use client"

import { useEffect, useState } from "react"

export default function WindowComponent() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, []) // Empty array ensures that effect is only run on mount

  return (
    <div className="fixed bottom-0 right-0 m-4 p-2 bg-zinc-800 text-zinc-200 rounded">
      Window size: {windowSize.width} x {windowSize.height}
    </div>
  )
}

