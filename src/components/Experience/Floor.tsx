type Props = {
  handlePointerDown: () => void;
  handlePointerMove: () => void;
  handlePointerUp: () => void;
}

const Floor = ({ handlePointerDown, handlePointerMove, handlePointerUp }: Props) => {
  return (
    <mesh position-y={-1.99999} rotation-x={-Math.PI * 0.5} scale={100} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <planeGeometry />
      <meshBasicMaterial color="greenyellow" />
    </mesh>
  )
}

export default Floor