/* eslint-disable react-hooks/exhaustive-deps */
import { useShallow } from 'zustand/shallow';
import { useMaterialStore } from '@/store/useMaterialStore';
import ColorsSetting from '@/assets/ColorsSetting.json';
import { Mesh, MeshStandardMaterial, Group, Vector3, Color } from 'three';
import { useGltfStore } from '@/store/gltfStore';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface ModuleTypes {
  name: string;
  model: string;
  price: number;
  width: number;
  height: number;
  depth: number;
}

interface GutterModelTypes {
  name: string;
  colors: string[];
  map: string;
  price: number;
  modules: ModuleTypes[];
}

interface GutterTypes {
  wallWidth: number;
  wallLength: number;
  eaveHeight: number;
  flag: boolean;
}

export default function Gutter({ wallLength, wallWidth, eaveHeight, flag }: GutterTypes) {
  const { gutterColor } = useMaterialStore(
    useShallow((state) => ({
      gutterColor: state.gutterColor,
    }))
  );

  const { gutter } = ColorsSetting;
  const modules = (gutter[1] as GutterModelTypes).modules;
  const getModel = useGltfStore((state) => state.getModel);

  const models = modules.map((mod) => getModel(mod.model));

  // Position Constants
  const posElbow = new Vector3(wallWidth / 2 + 0.03, eaveHeight - 2.1, wallLength / 2 - 0.045);
  const posTube = new Vector3(wallWidth / 2 + 0.11, eaveHeight - 0.445, wallLength / 2 - 0.045);
  const posGutterLeft = new Vector3(wallWidth / 2 + 0.03, eaveHeight, wallLength / 2 - 0.045);
  const posUpper = new Vector3(wallWidth / 2 + 0.03, eaveHeight, 0);
  const rotY = flag ? 0 : Math.PI;

  // Ref to hold all materials that we want to update
  const materialsRef = useRef<MeshStandardMaterial[]>([]);

  // Helper: clone scene, collect materials, initialize colors
  const cloneWithCollectMaterials = (gltf: { scene: Group } | null): Group | null => {
    if (!gltf) return null;
    const sceneClone = gltf.scene.clone(true);
    const mats: MeshStandardMaterial[] = [];

    sceneClone.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const originalMaterial = mesh.material;

        if (Array.isArray(originalMaterial)) {
          mesh.material = originalMaterial.map((mat) => {
            const clonedMat = mat.clone();
            if (clonedMat instanceof MeshStandardMaterial) {
              mats.push(clonedMat);
            }
            return clonedMat;
          });
        } else {
          const clonedMat = originalMaterial.clone();
          if (clonedMat instanceof MeshStandardMaterial) {
            mats.push(clonedMat);
          }
          mesh.material = clonedMat;
        }
      }
    });
    // Append these mats to the global ref array
    materialsRef.current.push(...mats);

    return sceneClone;
  };
  const color = useMemo(() => new Color(gutterColor), [gutterColor]);

  useFrame(() => {
    materialsRef.current.forEach((mat) => {
      mat.color.lerp(color, 0.1); // 0.1 = lerp speed (adjust as you want)
    });
  });

  return (
    <group rotation={[0, rotY, 0]}>
      {/* Elbows */}
      {[posElbow.z, -posElbow.z].map((z, i) => {
        if (!models[0]) return null;
        const clonedElbow = cloneWithCollectMaterials(models[0]);
        if (!clonedElbow) return null;
        return (
          <mesh key={`elbow-${i}`} position={[posElbow.x, posElbow.y, z]}>
            <primitive object={clonedElbow} />
          </mesh>
        );
      })}

      {/* Tubes */}
      {[posTube.z, -posTube.z].map((z, i) => {
        if (!models[4]) return null;
        const clonedTube = cloneWithCollectMaterials(models[4]);
        if (!clonedTube) return null;
        return (
          <mesh key={`tube-${i}`} position={[posTube.x, posTube.y, z]}>
            <primitive object={clonedTube} />
          </mesh>
        );
      })}

      {/* Gutter Left */}
      {models[1] && (() => {
        const clonedLeft = cloneWithCollectMaterials(models[1]);
        if (!clonedLeft) return null;
        return (
          <mesh position={posGutterLeft}>
            <primitive object={clonedLeft} />
          </mesh>
        );
      })()}

      {/* Gutter Right */}
      {models[2] && (() => {
        const clonedRight = cloneWithCollectMaterials(models[2]);
        if (!clonedRight) return null;
        return (
          <mesh position={[posGutterLeft.x, posGutterLeft.y, -posGutterLeft.z]}>
            <primitive object={clonedRight} />
          </mesh>
        );
      })()}

      {/* Upper Front */}
      {models[3] && (() => {
        const clonedUpper = cloneWithCollectMaterials(models[3]);
        if (!clonedUpper) return null;
        return (
          <mesh position={posUpper} scale={[1, 1, wallLength]}>
            <primitive object={clonedUpper} />
          </mesh>
        );
      })()}
    </group>
  );
}
