/* eslint-disable react/no-unknown-property */
export default function SpecialTile({ position = [1, 1, 1], size = [1, 1] }) {
  return (
    <mesh position={position}>
      <planeGeometry args={size} /> {/* Width: 2, Height: 0.5 */}
      <meshBasicMaterial color="red" />
    </mesh>
  )
}
