import { Line, Text, Grid, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { RefObject, Suspense, createRef, useRef, useState } from "react";
import { type Line2 } from "three/examples/jsm/Addons.js";
import Floor from "./Floor";

type Point = [number, number, number];

const FT_TO_THREE = 20;

function length(point1: Point, point2: Point): number {
  const deltaX = point2[0] - point1[0];
  const deltaY = point2[1] - point1[1];
  const deltaZ = point2[2] - point1[2];
  return Math.round(((Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)) + Number.EPSILON) * 100) / 100;
}

const Experience = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isLineToolSelected, setIsLineToolSelected] = useState(false);
  const { viewport, pointer } = useThree();
  const [lines, setLines] = useState<Array<Array<Point>>>([]);
  const linesRef = useRef<Array<RefObject<Line2>>>([]);
  const labelsRef = useRef<Array<RefObject<Text>>>([]);

  const x = () => pointer.width * viewport.getCurrentViewport().width * 0.5;
  const y = () => -pointer.height * viewport.getCurrentViewport().height * 0.5;

  const handlePointerDown = () => {
    if (!isLineToolSelected) return;
    setIsPressed(true);
    linesRef.current.push(createRef<Line2>());
    labelsRef.current.push(createRef<Text>());
    setLines(prevState => [...prevState, [[x(), 0, y()], [x() + Number.EPSILON, 0, y() + Number.EPSILON]]]);
  };

  const handlePointerMove = () => {
    if (!isPressed || !isLineToolSelected) return;
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

  const handlePointerUp = () => {
    if (!isPressed || !isLineToolSelected) return;
    const newLines = [...lines];
    const mostRecentLine = newLines[newLines.length - 1];
    newLines[newLines.length - 1] = [mostRecentLine[0], [x(), 0, y()]];
    setLines(newLines);
    setIsPressed(false);
  }

  return (
    <>
      <Html>
        <button onClick={() => setIsLineToolSelected(!isLineToolSelected)}>{String(isLineToolSelected)}</button>
      </Html>
      <Grid
        infiniteGrid
        cellColor="blue"
        sectionColor="red"
        cellSize={FT_TO_THREE / 12}
        sectionSize={FT_TO_THREE}
        cellThickness={1}
        sectionThickness={1}
      />
      <group>
        <Floor handlePointerDown={handlePointerDown} handlePointerMove={handlePointerMove} handlePointerUp={handlePointerUp} />
        {lines.map((line, index) => {
          return (
            <group key={index}>
              <Line points={line} ref={linesRef.current[index]} />
              <Suspense>
                <Text
                  ref={labelsRef.current[index]}
                  scale={5}
                  rotation-x={-Math.PI * 0.5}
                  color="red"
                  position={[(line[0][0] + line[1][0]) / 2, 0, (line[0][2] + line[1][2]) / 2]}
                  characters="0123456789."
                >
                  {'0'}
                </Text>
              </Suspense>
            </group>
          )
        })}
      </group>
    </>
  );
}

export default Experience;