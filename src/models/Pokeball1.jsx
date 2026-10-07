import React, {
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";

import pokeball from "../assets/3d/pokeball1.glb";

// Draco decoder served from public/draco/ instead of Google's CDN
const DRACO_PATH = `${import.meta.env.BASE_URL}draco/`;

// 3 flat light bands (shadow / mid / lit) for the cel-shaded look
const TOON_GRADIENT = new THREE.DataTexture(
  new Uint8Array([90, 170, 255]),
  3,
  1,
  THREE.RedFormat
);
TOON_GRADIENT.minFilter = TOON_GRADIENT.magFilter = THREE.NearestFilter;
TOON_GRADIENT.needsUpdate = true;

const Pokeball1 = forwardRef(({ toon = false, ...props }, ref) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(pokeball, DRACO_PATH);
  const { actions } = useAnimations(animations, group);

  const material = useMemo(() => {
    const base = materials["08_-_Default"];
    if (!toon) return base;
    return new THREE.MeshToonMaterial({
      map: base.map,
      emissive: base.emissive,
      emissiveMap: base.emissiveMap,
      gradientMap: TOON_GRADIENT,
    });
  }, [materials, toon]);

  

  // 1. Set a constant rotation for the Pokeball pointing to the origin (0, 0, 0)
  const { rotation } = useSpring({
    rotation: [0, 0, 0], // Adjust the fixed rotation angle to your preference
    config: { duration: 1000 },
  });

  // Expose animation trigger method to parent
  useImperativeHandle(ref, () => ({
    triggerAnimation: () => {
      Object.values(actions).forEach((action) => {
        action.stop();
        action.reset();
        action.setLoop(2201, 1); // THREE.LoopOnce
        action.clampWhenFinished = true;
        action.play();
      });
    },
  }));

  return (
    <a.group
      ref={group}
      {...props}
      dispose={null}
      rotation={rotation}
    >
      {/* Removed the animated position group - now using static positioning */}
      <group position={[0.431, -0.069, 8.617]}>
        <group name="Scene">
          <group name="Sketchfab_model">
            <group name="74a458567a634d269e7923d64d27cb7dfbx">
              <group name="RootNode">
                <group name="BlackLower_Lowpoly">
                  <group name="Object_13" />
                </group>
                <group name="BlackUpper_Lowpoly">
                  <group name="Object_16" />
                </group>
                <group name="BodyLower_Lowpoly">
                  <group name="Object_7" />
                </group>
                <group name="BodyUpper_Lowpoly">
                  <group name="Object_4" />
                </group>
                <group name="Button_Lowpoly">
                  <group name="Object_10" />
                </group>
                <group name="EngineLower_Lowpoly">
                  <group name="Object_22" />
                </group>
                <group name="EngineUpper_Lowpoly">
                  <group name="Object_19" />
                </group>
                <group name="MirrorLower_Lowpoly">
                  <group name="Object_28" />
                </group>
                <group name="MirrorUpper_Lowpoly">
                  <group name="Object_25" />
                </group>
                <group name="Tubes_Lowpoly">
                  <group name="Object_31" />
                </group>
              </group>
            </group>
          </group>
          <group name="Empty" position={[-0.431, 0.069, -8.617]}>
            <mesh
              name="BlackLower_Lowpoly_08_-_Default_0"
              castShadow
              receiveShadow
              geometry={nodes["BlackLower_Lowpoly_08_-_Default_0"].geometry}
              material={material}
            />
            <mesh
              name="Button_Lowpoly_08_-_Default_0"
              castShadow
              receiveShadow
              geometry={nodes["Button_Lowpoly_08_-_Default_0"].geometry}
              material={material}
            />
          </group>
        </group>
      </group>
    </a.group>
  );
});

export default Pokeball1;
