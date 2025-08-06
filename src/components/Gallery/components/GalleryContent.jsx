import { Image } from "@react-three/drei"

const images = [
  "https://picsum.photos/1200/2300",
  "https://picsum.photos/1200/2600",
]

export default function GalleryContent() {
  return (
    <>
      {images.map((img, index) => (
        <Image key={index} url={img} position={[index, 0, 0]} />
      ))}
    </>
  )
}
