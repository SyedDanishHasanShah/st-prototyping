import { Text, Line, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Fragment, useEffect, useMemo, useState } from "react";
import { LineGeometry } from "three/examples/jsm/Addons.js";

type Point = [number, number, number];

function length(point1: Point, point2: Point): number {
  const deltaX = point2[0] - point1[0];
  const deltaY = point2[1] - point1[1];
  const deltaZ = point2[2] - point1[2];
  return Math.round((Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ) + Number.EPSILON) * 100) / 100;
}

export default function Experience() {
  const [isPressed, setIsPressed] = useState(false);
  const { viewport, pointer, gl } = useThree();
  const [lines, setLines] = useState<Array<Array<[number, number, number]>>>([]);
  const geometry = useMemo(() => new LineGeometry(), []);


  const x = () => pointer.width * viewport.getCurrentViewport().width * 0.5;
  const y = () => -pointer.height * viewport.getCurrentViewport().height * 0.5;

  useEffect(() => {
    const handlePointerDown = (_: PointerEvent) => {
      setIsPressed(true);
      // const x = pointer.width * viewport.width * 0.5;
      // const y = -pointer.height * viewport.height * 0.5;
      setLines(prevState => [...prevState, [[x(), 0, y()], [x(), 0, y()]]]);
    };
    const handlePointerMove = () => {
      if (!isPressed) return;
      const newLines = [...lines];
      const mostRecentLine = newLines[newLines.length - 1];
      newLines[newLines.length - 1] = [mostRecentLine[0], [x(), 0, y()]];
      setLines(newLines);
    }
    const handlePointerUp = (_: PointerEvent) => {
      if (!isPressed) return;
      const newLines = [...lines];
      const mostRecentLine = newLines[newLines.length - 1];
      newLines[newLines.length - 1] = [mostRecentLine[0], [x(), 0, y()]];
      setLines(newLines)

      setIsPressed(false);
    }

    gl.domElement.addEventListener('pointerdown', handlePointerDown);
    gl.domElement.addEventListener('pointermove', handlePointerMove);
    gl.domElement.addEventListener('pointerup', handlePointerUp);

    return () => {
      gl.domElement.removeEventListener('pointerdown', handlePointerDown);
      gl.domElement.removeEventListener('pointermove', handlePointerMove);
      gl.domElement.removeEventListener('pointerup', handlePointerUp);
    }
  }, [lines]);

  return (
    <>
      <OrbitControls
        makeDefault
        maxPolarAngle={0}
        minZoom={10}
        maxZoom={10}
        enableRotate={false}
        enablePan={false}
      />

      <mesh position-y={-1.99999} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshBasicMaterial color="greenyellow" />
      </mesh>
      {lines.map(val => {
        return (
          <Fragment key={JSON.stringify(val)}>
            <Line points={val} key={JSON.stringify(val)} geometry={geometry} />
            <Text rotation-x={-Math.PI * 0.5} scale={0.02} color="red" position={[(val[0][0] + val[1][0]) / 2, 0, (val[0][2] + val[1][2]) / 2]}>{length(val[0], val[1])}</Text>
          </Fragment>
        )
      })}
    </>
  );
}
