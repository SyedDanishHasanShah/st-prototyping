import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Object3DNode } from "@react-three/fiber";

export type OrbitControlsProps = Object3DNode<
  OrbitControls,
  typeof OrbitControls
>;
