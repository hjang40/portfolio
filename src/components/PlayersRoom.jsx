import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import room from "../assets/3d/players_room.glb";

// "Pokemon FireRed - Player's Room" by Wesai, CC-BY-4.0:
// https://sketchfab.com/3d-models/pokemon-firered-players-room-b23b6b253207463c97db2a7092adff74

const PlayersRoom = () => {
  const { scene, materials } = useGLTF(room);

  // Unlit + nearest filtering keeps the 128px pixel-art texture crisp, like the GBA game.
  const roomScene = useMemo(() => {
    const map = materials.fireRed_material.map.clone();
    map.magFilter = THREE.NearestFilter;
    map.minFilter = THREE.NearestFilter;
    map.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({ map });
    const clone = scene.clone();
    clone.traverse((obj) => {
      if (obj.isMesh) obj.material = material;
    });
    return clone;
  }, [scene, materials]);

  return <primitive object={roomScene} />;
};

export default PlayersRoom;
