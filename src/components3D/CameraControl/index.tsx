/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCollaps } from '@/store/useCollaps'
import { useDraggable } from '@/store/useDraggable';
import { CameraControls } from '@react-three/drei'
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

export default function CameraControl() {
  const exterior = useCollaps(useShallow((state) => state.exterior))
  const dragItem = useDraggable(useShallow((state) => state.dragItem))
  const cameraRef = useRef<any>(null);
  useEffect(() => {
    if (!cameraRef.current) return

    const position = exterior ? [10, 8, 10] : [1, 1, 1]
    const target = exterior ? [0, 1, 0] : [0, 1.2, 0]
    cameraRef.current.setPosition(...position, true)
    cameraRef.current.setTarget(...target, true)
    // 

  }, [exterior])

  return (
    <CameraControls
      ref={cameraRef}
      enabled={dragItem !== null ? false : true}
      minPolarAngle={0}
      maxPolarAngle={!exterior ? Math.PI : Math.PI / 2}
      dampingFactor={1}
      makeDefault
      minDistance={exterior ? 20 : 0}
      maxDistance={exterior ? 50 : 0.5}
    />)
}
