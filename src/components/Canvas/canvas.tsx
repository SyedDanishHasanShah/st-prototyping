import {
  Canvas as ThreeCanvas,
  CanvasProps,
} from "@react-three/fiber";

const Canvas = (props: CanvasProps) => {
  return (
    <ThreeCanvas
      camera={{
        near: 0.1,
        far: 1000,
        position: [0, 75, 0],
      }}
      {...props}
    >
      {props.children}
    </ThreeCanvas>
  );
};

export default Canvas;
