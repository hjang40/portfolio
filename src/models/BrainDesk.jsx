import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

import desk from "../assets/3d/pc_desk.glb";
import brainJar from "../assets/3d/brain_jar.glb";
import { DRACO_PATH } from "./draco";

// "pc desk" by Joele segreto and "Brain in a Jar" by Citron Vert (both CC-BY-4.0, credited on the About page).
// Desk units: the desk top is at y ≈ 0.95 and spans x -1..1, z -0.63..0.63; the PC tower sits back-right.
const DESK_TOP_Y = 0.95;
// The jar model is ~11.7 units tall with its base at y = 1.58; scale it to ~0.53 tall
// so the brain reads clearly next to the monitor.
const JAR_SCALE = 0.045;
const JAR_BASE_Y = 1.58;

const BrainDesk = (props) => {
  const group = useRef();
  const { scene: deskScene, animations } = useGLTF(desk, DRACO_PATH);
  const { scene: jarScene } = useGLTF(brainJar, DRACO_PATH);
  const { actions } = useAnimations(animations, group);

  // The PC's case fans spin on a loop
  useEffect(() => {
    actions["Take 001"]?.play();
  }, [actions]);

  return (
    <group ref={group} {...props}>
      <primitive object={deskScene} />
      <primitive
        object={jarScene}
        scale={JAR_SCALE}
        position={[-0.5, DESK_TOP_Y - JAR_BASE_Y * JAR_SCALE, 0.2]}
      />
    </group>
  );
};

export default BrainDesk;
