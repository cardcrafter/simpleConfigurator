/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useMemo } from 'react';
import { useGltfStore } from '@/store/gltfStore';
import { useEffect, useRef } from 'react';
import { Group } from 'three';

interface ObjectProps {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: [number, number, number];
  url: string;
}

const ModelTemplate = ({ pos, rot, url, scale }: ObjectProps) => {
  const getModel = useGltfStore((state) => state.getModel);
  const groupRef = useRef<Group>(null);

  const gltf = useMemo(() => {
    const cachedGltf = getModel(url);
    if (cachedGltf) return cachedGltf;
  }, [url]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [gltf]);

  if (!gltf?.scene) return null;

  return (
    <primitive
      ref={groupRef}
      object={gltf.scene.clone()}
      position={pos}
      rotation={rot}
      scale={scale}
    />
  );
};

export default memo(ModelTemplate);
