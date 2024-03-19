import { OrbitControlsProps } from "./addOns";

declare module "@react-three/fiber" {
  interface ThreeElements {
    orbitControls: OrbitControlsProps;
  }
}
