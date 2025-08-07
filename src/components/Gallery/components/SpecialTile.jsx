import { Image } from "@react-three/drei"

export default function SpecialTile({
  position = [1, 1, 1],
  scale = [1, 1],
  image,
}) {
  return <Image url={image} position={position} scale={scale} />
}
