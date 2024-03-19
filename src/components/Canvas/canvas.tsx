import {
  Canvas as ThreeCanvas,
  CanvasProps,
} from "@react-three/fiber";
import { Perf } from "r3f-perf";

const Canvas = (props: CanvasProps) => {
  return (
    <ThreeCanvas
      camera={{
        near: 0.1,
        far: 100,
        position: [0, 0.5, 0],
      }}
      {...props}
    >
      <Perf />
      {props.children}
    </ThreeCanvas>
  );
};

export default Canvas;
