/* eslint-disable react/no-unknown-property */
export default function SpecialTile({ position = [1, 1, 1], scale = [1, 1] }) {
  return (
    <mesh position={position}>
      <planeGeometry args={scale} />
      <meshBasicMaterial color="red" />
    </mesh>
  )
}
