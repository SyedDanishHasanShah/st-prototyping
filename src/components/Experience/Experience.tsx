import { Html, Line, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Fragment, useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { Line2 } from "three/examples/jsm/Addons.js";

const SIZE = 1;

// let texture = null;

// const textureLoader = new THREE.TextureLoader();
// textureLoader.load('https://img.freepik.com/premium-vector/8-bit-pixel-wooden-chair-vector-illustration-game-assets_614713-961.jpg', (data) => {
//   texture = data;
// });

type Point = [number, number, number,];

function length(point1: Point, point2: Point): number {
  const deltaX = point2[0] - point1[0];
  const deltaY = point2[1] - point1[1];
  const deltaZ = point2[2] - point1[2];
  return Math.round((Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ) + Number.EPSILON) * 100) / 100;
}


const points: Array<Array<[number, number, number]>> = [];
let isPressed = false;


export default function Experience() {
  const lineRef = useRef<Line2>(null);

  // const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  console.count('rendered');
  const [startingPosition, setStartingPosition] = useState<{ x: number; y: number } | null>(null);
  const { viewport, pointer, gl, scene } = useThree();
  // const [points, setPoints] = useState<Array<Array<[number, number, number]>>>([]);

  useEffect(() => {
    scene.add(<Line points={[[0, 0, 0], [0.25, 0, 0.25]]} />);
    const handlePointerDown = (_: PointerEvent) => {
      // isPressed = true;
      setIsPressed(true);
      // startingPosition.current.x = e.clientX * viewport.width * 0.5;
      // startingPosition.current.y = -e.clientY * viewport.height * 0.5;

      const x = pointer.width * viewport.width * 0.5;
      const y = -pointer.height * viewport.height * 0.5;
      // setStartingPosition({ x: pointer.width * viewport.width * 0.5, y: -pointer.height * viewport.height * 0.5 });
      // setPoints(prevState => [...prevState, [[x, 0, y], [x, 0, y]]])
      points.push([[x, 0, y], [x, 0, y]]);
    };
    const handlePointerMove = () => {
      if (!isPressed) return;
      // setPoints(prevState => {
      //   const newPoints = { ...prevState };
      //   const mostRecentPoint = newPoints[newPoints.length - 1];
      //   newPoints[newPoints.length - 1] = [mostRecentPoint[0], [pointer.width * viewport.width * 0.5, 0, -pointer.height * viewport.height * 0.5]];
      //   return newPoints;
      // });
      setIsPressed(true);
      const mostRecentPoint = points[points.length - 1];
      points[points.length - 1] = [mostRecentPoint[0], [pointer.width * viewport.width * 0.5, 0, -pointer.height * viewport.height * 0.5]];
    }
    const handlePointerUp = (_: PointerEvent) => {
      if (!isPressed) return;
      // setPoints(prevState => {
      //   const newPoints = { ...prevState };
      //   const mostRecentPoint = newPoints[newPoints.length - 1];
      //   newPoints[newPoints.length - 1] = [mostRecentPoint[0], [pointer.width * viewport.width * 0.5, 0, -pointer.height * viewport.height * 0.5]];
      //   return newPoints;
      // });
      const mostRecentPoint = points[points.length - 1];
      points[points.length - 1] = [mostRecentPoint[0], [pointer.width * viewport.width * 0.5, 0, -pointer.height * viewport.height * 0.5]];

      setIsPressed(false);
      // isPressed = false;
      // setStartingPosition(null);
    }

    gl.domElement.addEventListener('pointerdown', handlePointerDown);
    gl.domElement.addEventListener('pointermove', handlePointerMove);
    gl.domElement.addEventListener('pointerup', handlePointerUp);

    return () => {
      gl.domElement.removeEventListener('pointerdown', handlePointerDown);
      gl.domElement.removeEventListener('pointermove', handlePointerMove);
      gl.domElement.removeEventListener('pointerup', handlePointerUp);
    }
  }, []);

  return (
    <>
      <OrbitControls
        makeDefault
        minZoom={10}
        maxZoom={10}
        maxPolarAngle={0}
        enableRotate={false}
      />

      <axesHelper args={[100]} />
      <gridHelper args={[SIZE, SIZE * 12 * 6]} />
      <mesh position-y={-1.99999} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshBasicMaterial color="greenyellow" />
      </mesh>
      {/* <Html position={[-0.25, 0, 0.25]}>
        <img
          src="https://img.freepik.com/premium-vector/8-bit-pixel-wooden-chair-vector-illustration-game-assets_614713-961.jpg"
          width="20"
          height="20"
          onClick={(e) => {
            const rotation = e.currentTarget.style.rotate;
            e.currentTarget.style.rotate =
              ((parseInt(rotation.length ? rotation : "0") + 90) % 360) + "deg";
          }}
        />
      </Html> */}
      {/* <mesh position={[-0.25, 0, 0.25]} rotation-x={-Math.PI * 0.5} scale={0.01}>
        <planeGeometry />
        <meshBasicMaterial map={texture} />
      </mesh> */}
      {/* <Html position={[(mouse.x + 0.1) / 2, 0, (mouse.y + 0.1) / 2]}>
        {distanceVector(
          new THREE.Vector3(mouse.x, 0, mouse.y),
          new THREE.Vector3(0, 0, 0)
        )}
      </Html> */}
      <Html>
        <button onClick={() => setShouldUpdate(!shouldUpdate)}>render</button>
      </Html>
      {/* <Line
        ref={lineRef}
        points={[
          [0, 0, 0],
          [mouse.x, 0, mouse.y],
        ]}
      ></Line> */}
      {points.map(val => {
        return (
          <Fragment key={JSON.stringify(val)}>
            <Line points={val} key={JSON.stringify(val)} />
            <Html position={[(val[0][0] + val[1][0]) / 2, 0, (val[0][2] + val[1][2]) / 2]}>{length(val[0], val[1])}</Html>
          </Fragment>
        )
      })}
    </>
  );
}
