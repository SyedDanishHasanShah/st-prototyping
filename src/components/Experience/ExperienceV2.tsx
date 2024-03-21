import { Line, Text, Grid, Html } from "@react-three/drei";
import { ThreeElements, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { RefObject, Suspense, createRef, useRef, useState } from "react";
import { type Line2 } from "three/examples/jsm/Addons.js";
import Floor from "./Floor";
import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from "three";

type Point = [number, number, number];

const FT_TO_THREE = 20;

function length(point1: Point, point2: Point): number {
  const deltaX = point2[0] - point1[0];
  const deltaY = point2[1] - point1[1];
  const deltaZ = point2[2] - point1[2];
  return Math.round(((Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)) + Number.EPSILON) * 100) / 100;
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

const Experience = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isLineToolSelected, setIsLineToolSelected] = useState(true);
  const { viewport, pointer, camera, raycaster } = useThree();
  const [lines, setLines] = useState<Array<Array<Point>>>([]);
  const linesRef = useRef<Array<RefObject<Line2>>>([]);
  const labelsRef = useRef<Array<RefObject<Text>>>([]);
  const floorRef = useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>(null!);

  const x = () => (pointer.width * viewport.getCurrentViewport().width * 0.5);

  const y = () => -(pointer.height * viewport.getCurrentViewport().height * 0.5);

  useFrame(({ pointer, size, viewport, camera }) => {
    // console.log({ x: pointer.x, y: pointer.y, width: pointer.width, height: pointer.height });
    // console.log(camera);
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isLineToolSelected) return;

    setIsPressed(true);
    linesRef.current.push(createRef<Line2>());
    labelsRef.current.push(createRef<Text>());
    const point: [number, number, number] = [e.point.x, 0, e.point.z];
    const pointWithUv: [number, number, number] = [e.point.x - pointer.x, 0, e.point.z + (pointer.y + mapRange(pointer.y, -1, 1, 0, 0.5))];
    console.log(point, pointWithUv);
    setLines(prevState => [...prevState, [pointWithUv, pointWithUv]]);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isPressed || !isLineToolSelected) return;

    const mostRecentLine = linesRef.current[linesRef.current.length - 1];
    const mostRecentLabel = labelsRef.current[labelsRef.current.length - 1];
    if (!mostRecentLine.current) return;
    const starting = { x: mostRecentLine.current.geometry.attributes.instanceStart.getX(0), y: mostRecentLine.current.geometry.attributes.instanceStart.getZ(0) };
    const ending = { x: e.point.x, y: e.point.z, };
    const endingUv = { x: e.point.x - pointer.x, y: e.point.z + (pointer.y + mapRange(pointer.y, -1, 1, 0, 0.5)) };
    console.log(pointer, endingUv);
    mostRecentLine.current.geometry.attributes.instanceEnd.setZ(0, endingUv.y);
    mostRecentLine.current.geometry.attributes.instanceEnd.setX(0, endingUv.x);
    mostRecentLine.current.geometry.attributes.instanceEnd.needsUpdate = true;
    // mostRecentLabel.current.position.set((starting.x + ending.x) / 2, 0, (starting.y + ending.y) / 2);
    // mostRecentLabel.current.text = length([starting.x, 0, starting.y], [ending.x, 0, ending.y]);
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isPressed || !isLineToolSelected) return;
    const newLines = [...lines];
    const mostRecentLine = newLines[newLines.length - 1];
    newLines[newLines.length - 1] = [mostRecentLine[0], [e.point.x - pointer.x, 0, e.point.z + (pointer.y + mapRange(pointer.y, -1, 1, 0, 0.5))]];
    setLines(newLines);
    setIsPressed(false);
  }

  return (
    <>
      {/* <Html>
        <button onClick={() => setIsLineToolSelected(!isLineToolSelected)}>{String(isLineToolSelected)}</button>
      </Html> */}
      <Grid
        infiniteGrid
        cellColor="blue"
        sectionColor="red"
        cellSize={FT_TO_THREE / 12}
        sectionSize={FT_TO_THREE}
        cellThickness={1}
        sectionThickness={1}
      />
      <mesh ref={floorRef} position-y={-1.99999} rotation-x={-Math.PI * 0.5} scale={100} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        <planeGeometry />
        <meshBasicMaterial color="greenyellow" />
      </mesh>
      <group>
        {lines.map((line, index) => {
          return (
            <group key={index}>
              <Line points={line} ref={linesRef.current[index]} />
              {/* <Suspense>
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
              </Suspense> */}
            </group>
          )
        })}
      </group>
    </>
  );
}

export default Experience;