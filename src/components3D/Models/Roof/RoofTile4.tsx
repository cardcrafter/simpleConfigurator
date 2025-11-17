/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import * as THREE from "three"
import { memo, useMemo, useRef } from "react"
import ColorSetting from "@/assets/ColorsSetting.json"
import { useMaterialStore } from '@/store/useMaterialStore'
import { Instances, Instance } from '@react-three/drei'
import { useShallow } from 'zustand/shallow'
import RoofDimensions from "@/assets/RoofDimensions.json"
import { useFrame } from "@react-three/fiber"
import { useGltfStore } from "@/store/gltfStore"

interface RoofProps {
  roofWidth: number,
  roofLength: number,
  degree: number,
  rotY: number,
  flag: boolean
}

interface TileProps extends RoofProps {
  tileType: string,
}

interface ModuleProps {
  model: string,
  width: number,
  length: number,
}

const RoofTile2 = ({ roofWidth, roofLength, degree, rotY, flag }: RoofProps) => {
  const roof = ColorSetting.roof
  const tileType = useMaterialStore(useShallow((state) => state.roofTexture))
  const tileName = roof.find((item) => item.texture === tileType)?.name as string

  return (
    <>
      {tileName === "Plegel" ? (
        <PlegelTiles
          roofWidth={roofWidth + 0.02}
          roofLength={roofLength}
          degree={degree}
          rotY={rotY}
          tileType={tileType}
          flag={flag}
        />
      ) : (
        <PlateTiles
          roofWidth={roofWidth + 0.02}
          roofLength={roofLength}
          degree={degree}
          rotY={rotY}
          tileType={tileType}
          flag={flag}
        />
      )}
    </>
  );
}

export default memo(RoofTile2)

const PlegelTiles = ({ roofWidth, roofLength, degree, rotY, tileType, flag }: TileProps) => {
  const { boundPanelThick, edgePanelThick } = RoofDimensions
  const roof = ColorSetting.roof
  const roofColor = useMaterialStore(useShallow((state) => state.roofColor))

  const tileModel = roof.find((item) => item.texture === tileType)
  const tileModules = tileModel?.modules as ModuleProps[]
  const getModel = useGltfStore((state) => state.getModel);

  const { scene: tileScene } = useMemo(() => {
    const cachedGltf = getModel(tileModules[0].model);
    return cachedGltf as any;
  }, [tileModules[0].model]);

  const tileMesh = tileScene.getObjectByProperty('type', 'Mesh') as THREE.Mesh
  const tileGeometry = tileMesh.geometry.clone()
  const tileMaterial = Array.isArray(tileMesh.material)
    ? tileMesh.material[0]
    : tileMesh.material
  const tileMaterialRef = useRef<THREE.MeshStandardMaterial>(
    tileMaterial instanceof THREE.MeshStandardMaterial
      ? tileMaterial.clone()
      : new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
  )

  const tileLength = tileModules[0].length as number
  const tileWidth = tileModules[0].width
  const deviation = 0.0;

  const { scene: crestScene } = useMemo(() => {
    const cachedGltf = getModel(tileModules[1].model);
    return cachedGltf as any;
  }, [tileModules[1].model]);

  const crestMesh = crestScene.getObjectByProperty('type', 'Mesh') as THREE.Mesh
  const crest = crestMesh.geometry.clone()
  const crestMaterial = Array.isArray(crestMesh.material)
    ? crestMesh.material[0]
    : crestMesh.material
  const crestMaterialRef = useRef<THREE.MeshStandardMaterial>(
    crestMaterial instanceof THREE.MeshStandardMaterial
      ? crestMaterial.clone()
      : new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
  )
  const crestLength = tileModules[1].length as number

  const tileCountX = Math.trunc(roofWidth / (tileLength + deviation))
  const tileCountZ = Math.ceil(roofLength / tileWidth)
  const roofWidthDeltaX = roofWidth - tileCountX * (tileLength + deviation)
  const roofDeltaZ = roofLength - (tileCountZ - 1) * tileWidth

  const crestCount = Math.trunc((roofLength + (boundPanelThick + edgePanelThick) * 2) / crestLength)
  const crestDelta = (roofLength + (boundPanelThick + edgePanelThick) * 2) - crestCount * crestLength

  const tilePositions: [number, number, number][] = []
  const tileScales: [number, number, number][] = []

  for (let i = 0; i <= tileCountX; i++) {
    for (let j = 0; j < tileCountZ; j++) {
      const posX = i * (tileLength + deviation)
      const posZ = j * tileWidth
      const scaleX = i === tileCountX ? roofWidthDeltaX / tileLength : 1
      const scaleZ = j === tileCountZ - 1 ? roofDeltaZ / tileWidth : 1
      tilePositions.push([posX, 0, posZ])
      tileScales.push([scaleX, 1, scaleZ])
    }
  }

  const crestPositions: [number, number, number][] = []
  const crestScales: [number, number, number][] = []

  for (let i = 0; i <= crestCount; i++) {
    const posZ = i * crestLength - (boundPanelThick + edgePanelThick)
    crestPositions.push([0, 0.05, posZ])
    crestScales.push([1, 1, i === crestCount ? crestDelta / crestLength : 1])
  }

  const targetColor = useMemo(() => new THREE.Color(roofColor), [roofColor])

  useFrame(() => {
    if (tileMaterialRef.current) {
      tileMaterialRef.current.color.lerp(targetColor, 0.1)
    }
    if (crestMaterialRef.current) {
      crestMaterialRef.current.color.lerp(targetColor, 0.1)
    }
  })

  return (
    <>
      <group rotation={[0, rotY, degree]} position={[0, 0, 0]}>
        <Instances
          geometry={tileGeometry}
          material={tileMaterialRef.current}
          limit={3940}
          castShadow // Enable casting shadows
          receiveShadow // Enable receiving shadows
        >
          {tilePositions.map((pos, index) => (
            <Instance
              key={index}
              position={pos}
              scale={tileScales[index]}
            />
          ))}
        </Instances>
      </group>
      <group>
        {flag && (
          <Instances
            geometry={crest}
            material={crestMaterialRef.current}
            limit={103}
            castShadow // Enable casting shadows
            receiveShadow // Enable receiving shadows
          >
            {crestPositions.map((pos, index) => (
              <Instance
                key={index}
                position={pos}
                scale={crestScales[index]}
              />
            ))}
          </Instances>
        )}
      </group>
    </>
  );
}

const PlateTiles = ({ roofWidth, roofLength, degree, rotY, tileType, flag }: TileProps) => {
  const { roof } = ColorSetting
  const roofColor = useMaterialStore(useShallow((state) => state.roofColor))
  const tileModel = roof.find((item) => item.texture === tileType)
  const tileModules = tileModel?.modules as ModuleProps[]

  const getModel = useGltfStore((state) => state.getModel);

  const { scene: tiles } = useMemo(() => {
    const cachedGltf = getModel(tileModules[0].model);
    return cachedGltf as any;
  }, [tileModules[0].model]);

  const tileMesh = tiles.getObjectByProperty('type', 'Mesh') as THREE.Mesh
  const tileGeometry = tileMesh.geometry.clone()
  const tileMaterial = Array.isArray(tileMesh.material)
    ? tileMesh.material[0]
    : tileMesh.material
  const tileMaterialRef = useRef<THREE.MeshStandardMaterial>(
    tileMaterial instanceof THREE.MeshStandardMaterial
      ? tileMaterial.clone()
      : new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
  )
  const tileLength = tileModules[0].length as number
  const tileWidth = tileModules[0].width

  const { scene: crestScene } = useMemo(() => {
    const cachedGltf = getModel(tileModules[1].model);
    return cachedGltf as any;
  }, [tileModules[1].model]);

  const crestMesh = crestScene.getObjectByProperty('type', 'Mesh') as THREE.Mesh
  const crest = crestMesh.geometry.clone()
  const crestMaterial = Array.isArray(crestMesh.material)
    ? crestMesh.material[0]
    : crestMesh.material
  const crestMaterialRef = useRef<THREE.MeshStandardMaterial>(
    crestMaterial instanceof THREE.MeshStandardMaterial
      ? crestMaterial.clone()
      : new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
  )
  const crestLength = tileModules[1].length as number

  const { tileCountZ, roofDeltaZ, scaleX, scaleCrest } = useMemo(() => {
    const tileCountZ = Math.ceil(roofLength / tileWidth)
    const scaleX = roofWidth / tileLength
    const roofDeltaZ = roofLength - (tileCountZ - 1) * tileWidth
    const scaleCrest = roofLength / crestLength
    return { tileCountZ, roofDeltaZ, scaleX, scaleCrest }
  }, [roofLength, roofWidth, tileLength, tileWidth, crestLength])

  const tilePositions: [number, number, number][] = []
  const tileScales: [number, number, number][] = []

  for (let i = 0; i < tileCountZ; i++) {
    const scaleZ = i === tileCountZ - 1 ? roofDeltaZ / tileWidth : 1
    tilePositions.push([0, 0, i * tileWidth])
    tileScales.push([scaleX, 1, scaleZ])
  }

  const targetColor = useMemo(() => new THREE.Color(roofColor), [roofColor])

  useFrame(() => {
    if (tileMaterialRef.current) {
      tileMaterialRef.current.color.lerp(targetColor, 0.1)
    }
    if (crestMaterialRef.current) {
      crestMaterialRef.current.color.lerp(targetColor, 0.1)
    }
  })

  return (
    <>
      <group rotation={[0, rotY, degree]} position={[0, 0.01, 0]}>
        <Instances
          geometry={tileGeometry}
          material={tileMaterialRef.current}
          limit={103}
          castShadow // Enable casting shadows
          receiveShadow // Enable receiving shadows
        >
          {tilePositions.map((pos, index) => (
            <Instance
              key={index}
              position={pos}
              scale={tileScales[index]}
            />
          ))}
        </Instances>
      </group>
      {flag && (
        <Instances
          geometry={crest}
          material={crestMaterialRef.current}
          limit={1}
          castShadow // Enable casting shadows
          receiveShadow // Enable receiving shadows
        >
          <Instance
            position={[0, 0, roofLength / 2]}
            scale={[1, 1, scaleCrest]}
          />
        </Instances>
      )}
    </>
  );
}