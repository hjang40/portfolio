/* eslint-disable react-hooks/immutability -- R3F: the camera is a mutable three.js object, mutating it is the intended API */
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CameraIntro = ({ 
  startPosition = [0, 8, 50], 
  endPosition = [0, 8, 5], 
  startRotation = [-0.4, 0, 0], 
  endRotation = [-0.4, 0, 0], 
  duration = 2.5, 
  onComplete 
}) => {
  const { camera } = useThree();
  const animationRef = useRef();

  useEffect(() => {
    // Ensure camera far plane can handle the distance
    camera.far = Math.max(camera.far, Math.max(...startPosition.map(Math.abs)) * 2);
    camera.updateProjectionMatrix();
    
    // Set initial camera position and rotation
    camera.position.set(...startPosition);
    camera.rotation.set(...startRotation);
    
    // Force a render update
    camera.updateMatrixWorld();

    const startTime = Date.now();
    
    // Create vectors for smooth interpolation
    const startPos = new THREE.Vector3(...startPosition);
    const endPos = new THREE.Vector3(...endPosition);
    const startRot = new THREE.Euler(...startRotation);
    const endRot = new THREE.Euler(...endRotation);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Create a curved path: go down first (Y), then forward (Z)
      // Using different easing for each axis to create the log curve effect
      
      // Y movement: Slower, more gradual drop that lasts longer
      // Normalize the exponential curve to ensure it reaches exactly 1.0
      const rawYProgress = 1 - Math.exp(-2 * progress);
      const maxYProgress = 1 - Math.exp(-2); // Maximum value when progress = 1
      const yProgress = rawYProgress / maxYProgress; // Normalize to 0-1 range
      
      // Z movement: Smooth acceleration with no sudden jumps
      const zProgress = Math.pow(progress, 2.5); // Smooth curve, slow start then gradual acceleration
      
      // X movement: Simple linear interpolation
      const xProgress = progress;
      
      // Rotation: smooth transition throughout
      const rotProgress = progress < 0.5 
        ? 4 * progress ** 3 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Calculate current position with curved path
      const currentPos = new THREE.Vector3(
        THREE.MathUtils.lerp(startPos.x, endPos.x, xProgress),
        THREE.MathUtils.lerp(startPos.y, endPos.y, yProgress),
        THREE.MathUtils.lerp(startPos.z, endPos.z, zProgress)
      );
      camera.position.copy(currentPos);

      // Interpolate rotation
      const currentRot = new THREE.Euler(
        THREE.MathUtils.lerp(startRot.x, endRot.x, rotProgress),
        THREE.MathUtils.lerp(startRot.y, endRot.y, rotProgress),
        THREE.MathUtils.lerp(startRot.z, endRot.z, rotProgress)
      );
      camera.rotation.copy(currentRot);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure we end exactly at the target position and rotation
        camera.position.set(...endPosition);
        camera.rotation.set(...endRotation);
        if (onComplete) onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [camera, startPosition, endPosition, startRotation, endRotation, duration, onComplete]);

  return null; // This component doesn't render anything visible
};

export default CameraIntro;