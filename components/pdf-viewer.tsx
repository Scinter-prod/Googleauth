interface PDFViewerProps {
  src: string
}

export function PDFViewer({ src }: PDFViewerProps) {
  return <embed src={src} type="application/pdf" width="100%" height="600px" className="mb-4" />
}

