import Image from "next/image"

interface ImageViewerProps {
  src: string
  alt: string
}

export function ImageViewer({ src, alt }: ImageViewerProps) {
  return (
    <div className="mb-4">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={500}
        height={300}
        layout="responsive"
        objectFit="contain"
      />
    </div>
  )
}

