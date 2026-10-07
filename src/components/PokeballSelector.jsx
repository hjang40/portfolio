import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import Pokeball1 from "../models/Pokeball1";

const PokeballSelector = ({
  scale,
  basePosition,
  rotation,
  onPokeballClick,
  onSelectionChange,
  radius = 0.5,
  toon = false,
  locked = false, // ignore all input (e.g. once a ball has been chosen)
  canChoose = true, // whether Enter/Space picks the front ball
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringPokeball, setIsHoveringPokeball] = useState(false);
  const [carouselRotation, setCarouselRotation] = useState(0);
  const pokeballRefs = useRef([]);
  const wobbleRefs = useRef([]);
  const ballRadius = scale[1] * 10; // Pokeball model is ~20 units wide
  const lastMouseX = useRef(0);

  const pokeballs = [Pokeball1, Pokeball1, Pokeball1];

  const getFrontPokeballPosition = () => {
    let closestIndex = 0;
    let maxZ = -Infinity;

    pokeballs.forEach((_, index) => {
      const angle = (index / pokeballs.length) * Math.PI * 2 + carouselRotation;
      const pos = [Math.sin(angle) * radius, 0, Math.cos(angle) * radius];
      if (pos[2] > maxZ) {
        maxZ = pos[2];
        closestIndex = index;
      }
    });

    const angle = (closestIndex / pokeballs.length) * Math.PI * 2 + carouselRotation;
    const pos = [Math.sin(angle) * radius, 0, Math.cos(angle) * radius];

    return [
      pos[0] + basePosition[0],
      pos[1] + basePosition[1],
      pos[2] + basePosition[2],
    ];
  };

  const animateToRotation = (startRotation, targetRotation, duration = 300) => {
    let startTime = null;
    const animate = (timestamp) => {
      startTime ??= timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation =
        startRotation + (targetRotation - startRotation) * easeOut;
      setCarouselRotation(currentRotation);
      if (progress < 1) requestAnimationFrame(animate);
      else setCarouselRotation(targetRotation);
    };
    requestAnimationFrame(animate);
  };

  const getPokeballPosition = (index, totalCount) => {
    const angle = (index / totalCount) * Math.PI * 2;
    return [Math.sin(angle) * radius, 0, Math.cos(angle) * radius];
  };

  // The selected ball wobbles side to side like a ball mid-catch:
  // three rocks on its base, then a pause, repeating.
  useFrame(({ clock }) => {
    const phase = clock.elapsedTime % 1.8;
    const wobble = phase < 0.9 ? Math.sin((phase / 0.9) * Math.PI * 3) * 0.3 : 0;
    wobbleRefs.current.forEach((group, index) => {
      if (!group) return;
      const isWobbling = index === selectedIndex && !isDragging && !locked;
      group.rotation.z = isWobbling ? wobble : 0;
    });
  });

  const handlePointerDown = (event) => {
    event.stopPropagation();
    if (locked) return;
    setIsDragging(true);
    lastMouseX.current = event.clientX;
  };

  const handlePointerMove = (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - lastMouseX.current;
    const rotationSpeed = 0.01;
    setCarouselRotation((prev) => prev + deltaX * rotationSpeed);
    lastMouseX.current = event.clientX;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    let closestIndex = 0;
    let maxZ = -Infinity;

    pokeballs.forEach((_, index) => {
      const angle = (index / pokeballs.length) * Math.PI * 2 + carouselRotation;
      const pos = [Math.sin(angle) * radius, 0, Math.cos(angle) * radius];
      if (pos[2] > maxZ) {
        maxZ = pos[2];
        closestIndex = index;
      }
    });

    const segmentSize = (Math.PI * 2) / pokeballs.length;
    const baseTargetRotation = -closestIndex * segmentSize;

    let bestRotation = baseTargetRotation;
    let minDistance = Math.abs(carouselRotation - baseTargetRotation);

    for (let offset = -3; offset <= 3; offset++) {
      const candidateRotation = baseTargetRotation + offset * Math.PI * 2;
      const distance = Math.abs(carouselRotation - candidateRotation);
      if (distance < minDistance) {
        minDistance = distance;
        bestRotation = candidateRotation;
      }
    }

    animateToRotation(carouselRotation, bestRotation);
    setSelectedIndex(closestIndex);
    if (onSelectionChange) onSelectionChange(closestIndex);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (locked) return;
      if ((event.key === "Enter" || event.key === " ") && canChoose) {
        event.preventDefault();
        chooseFront();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        const segmentSize = (Math.PI * 2) / pokeballs.length;
        const newRotation = carouselRotation + segmentSize;
        const newIndex =
          (selectedIndex + pokeballs.length - 1) % pokeballs.length;
        animateToRotation(carouselRotation, newRotation);
        setSelectedIndex(newIndex);
        if (onSelectionChange) onSelectionChange(newIndex);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        const segmentSize = (Math.PI * 2) / pokeballs.length;
        const newRotation = carouselRotation - segmentSize;
        const newIndex = (selectedIndex + 1) % pokeballs.length;
        animateToRotation(carouselRotation, newRotation);
        setSelectedIndex(newIndex);
        if (onSelectionChange) onSelectionChange(newIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, carouselRotation, locked, canChoose]);

  useEffect(() => {
    const handleGlobalPointerMove = (event) => handlePointerMove(event);
    const handleGlobalPointerUp = () => handlePointerUp();

    if (isDragging) {
      document.addEventListener("pointermove", handleGlobalPointerMove);
      document.addEventListener("pointerup", handleGlobalPointerUp);
    }

    return () => {
      document.removeEventListener("pointermove", handleGlobalPointerMove);
      document.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [isDragging, carouselRotation]);

  useEffect(() => {
    document.body.style.cursor = isDragging
      ? "grabbing"
      : isHoveringPokeball
      ? "grab"
      : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [isDragging, isHoveringPokeball]);

  function chooseFront() {
    pokeballRefs.current[selectedIndex]?.triggerAnimation?.();
    onPokeballClick?.(getFrontPokeballPosition(), selectedIndex);
  }

  const handlePokeballClick = (index, event) => {
    event.stopPropagation();
    if (!locked && index === selectedIndex) chooseFront();
  };

  return (
    <group position={basePosition}>
      <group onPointerDown={handlePointerDown}>
        {pokeballs.map((PokeballComponent, index) => {
          const basePos = getPokeballPosition(index, pokeballs.length);
          const angle =
            (index / pokeballs.length) * Math.PI * 2 + carouselRotation;
          // Pivot sits at the ball's base so the wobble rocks it in place
          const pivotPosition = [
            Math.sin(angle) * radius,
            basePos[1] - ballRadius,
            Math.cos(angle) * radius,
          ];

          return (
            <group
              key={index}
              ref={(el) => (wobbleRefs.current[index] = el)}
              position={pivotPosition}
            >
              <PokeballComponent
                ref={(el) => (pokeballRefs.current[index] = el)}
                position={[0, ballRadius, 0]}
                scale={scale}
                rotation={rotation}
                toon={toon}
                onClick={(event) => handlePokeballClick(index, event)}
                onPointerOver={() => setIsHoveringPokeball(true)}
                onPointerOut={() => setIsHoveringPokeball(false)}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
};

export default PokeballSelector;
