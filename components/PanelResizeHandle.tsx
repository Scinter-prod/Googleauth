import { PanelResizeHandle } from "react-resizable-panels"

export function CustomPanelResizeHandle({ className = "", ...props }: any) {
  return (
    <PanelResizeHandle className={`w-2 bg-zinc-800 hover:bg-zinc-700 transition-colors ${className}`} {...props}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg width="8" height="24" viewBox="0 0 8 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="4" r="1.5" fill="#71717A" />
          <circle cx="4" cy="12" r="1.5" fill="#71717A" />
          <circle cx="4" cy="20" r="1.5" fill="#71717A" />
        </svg>
      </div>
    </PanelResizeHandle>
  )
}

