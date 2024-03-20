import Experience from "@components/Experience/ExperienceV2";
import { Center, OrbitControls } from '@react-three/drei';

import Canvas from "@components/Canvas";
import { Perf } from "r3f-perf";

const App = () => {
  return (
    <>
      <Canvas>
        <Perf />
        <OrbitControls
          makeDefault
          maxPolarAngle={0}
          enableRotate={false}
          enablePan={false}
        />
        <Center>
          <Experience />
        </Center>
      </Canvas>
    </>
  );
};

export default App;
