import { Line, OrbitControls, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Fragment, RefObject, createRef, useEffect, useRef, useState } from "react";
import { type Line2 } from "three/examples/jsm/Addons.js";

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
  const [lines, setLines] = useState<Array<Array<Point>>>([]);
  const linesRef = useRef<Array<RefObject<Line2>>>([]);
  const labelsRef = useRef<Array<RefObject<Text>>>([]);

  console.log('lines', lines);

  const x = () => pointer.width * viewport.getCurrentViewport().width * 0.5;
  const y = () => -pointer.height * viewport.getCurrentViewport().height * 0.5;

  useEffect(() => {
    const handlePointerDown = (_: PointerEvent) => {
      setIsPressed(true);
      linesRef.current.push(createRef<Line2>());
      labelsRef.current.push(createRef<Text>());
      setLines(prevState => [...prevState, [[x(), 0, y()], [x(), 0, y()]]]);
    };

    const handlePointerMove = () => {
      if (!isPressed) return;
      const mostRecentLine = linesRef.current[linesRef.current.length - 1];
      const mostRecentLabel = labelsRef.current[labelsRef.current.length - 1];
      if (!mostRecentLine.current || !mostRecentLabel.current) return;
      const starting = { x: mostRecentLine.current.geometry.attributes.instanceStart.getX(0), y: mostRecentLine.current.geometry.attributes.instanceStart.getZ(0) };
      const ending = { x: x(), y: y() };
      mostRecentLine.current.geometry.attributes.instanceEnd.setZ(0, ending.y);
      mostRecentLine.current.geometry.attributes.instanceEnd.setX(0, ending.x);
      mostRecentLine.current.geometry.attributes.instanceEnd.needsUpdate = true;
      mostRecentLabel.current.position.set((starting.x + ending.x) / 2, 0, (starting.y + ending.y) / 2);
      mostRecentLabel.current.text = length([starting.x, 0, starting.y], [ending.x, 0, ending.y]);
    }

    const handlePointerUp = (_: PointerEvent) => {
      if (!isPressed) return;
      const newLines = [...lines];
      const mostRecentLine = newLines[newLines.length - 1];
      newLines[newLines.length - 1] = [mostRecentLine[0], [x(), 0, y()]];
      setLines(newLines);
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
  }, [isPressed]);

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
      {lines.map((line, index) => {
        return (
          <Fragment key={index}>
            <Line points={line} ref={linesRef.current[index]} />
            <Text
              ref={labelsRef.current[index]}
              rotation-x={-Math.PI * 0.5}
              scale={0.02}
              color="red"
              position={[(line[0][0] + line[1][0]) / 2, 0, (line[0][2] + line[1][2]) / 2]}
            >
              {'0'}
            </Text>
          </Fragment>
        )
      })}
    </>
  );
}
