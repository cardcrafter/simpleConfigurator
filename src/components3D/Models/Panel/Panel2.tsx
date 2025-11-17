/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useCallback, useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import PanelDimensions from "@/assets/PanelDimension.json"
import ExtrudeSettings from "@/assets/ExtrudeSetting.json"
import { useDraggable } from "@/store/useDraggable"
import { useShallow } from "zustand/react/shallow"
import { ThreeEvent, useFrame } from "@react-three/fiber"
import { useMaterialStore } from "@/store/useMaterialStore"
import { throttle } from 'lodash'
import { useWallModuleCalculator } from "@/utils/useWallModuleCalculator"

import BattenDimension from "@/assets/BattenDimesion.json"

interface PanelProps {
  wallWidth: number
  eaveHeight: number
  rotation: number[]
  position: number[]
  planePos: number[]
  planeRotY: number,
  label: string
}

type CategorizedModel = {
  key: number;
  position: number;
};

const Panel = ({
  wallWidth,
  rotation,
  position,
  eaveHeight,
  planePos,
  planeRotY,
  label
}: PanelProps) => {
  const { panelDepth } = PanelDimensions
  const sideWall = (label === 'left' || label === 'right')
  const modelList = useRef<any>({
    window: [],
    doorM12: [],
    doorM25: [],
    doorM30: [],
    doorM50: [],
  });
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  const calculateModules = useWallModuleCalculator();

  const { battenThick } = BattenDimension
  const [
    dragItem,
    objectPosition,
    isOnWall,
    alignModelList,
    updateDrag,
    addAlignModel,
    setObjectPosition,
    setIsOnWall,
    setRotY,
  ] = useDraggable(useShallow((state) => [
    state.dragItem,
    state.objectPosition,
    state.isOnWall,
    state.alignModelList,
    state.updateDrag,
    state.addAlignModel,
    state.setObjectPosition,
    state.setIsOnWall,
    state.setRotY,
  ]))

  const panelColor = useMaterialStore(useShallow((state) =>
    state.panelColor
  ));

  const sliceObject: [number, number, number][] = []

  const sliceList = alignModelList.filter(item => (item.label === label));

  sliceList.map(item => {
    sliceObject.push([
      item.position[0],
      item.position[1] - item.height / 2,
      item.position[2]
    ])
  })


  const crossSection = useMemo(() => {
    const shape: THREE.Shape = new THREE.Shape()

    shape.moveTo(0, 0)
    shape.lineTo((wallWidth + battenThick * 2) / 2, 0)
    shape.lineTo((wallWidth + battenThick * 2) / 2, eaveHeight)
    shape.lineTo(-(wallWidth + battenThick * 2) / 2, eaveHeight)
    shape.lineTo(-(wallWidth + battenThick * 2) / 2, 0)
    shape.lineTo(0, 0)

    const holes: THREE.Shape[] = sliceList.map((model, index) => {

      const hole = new THREE.Shape()
      if (model.label === 'left') {
        hole.moveTo(-sliceObject[index][2] + model.width / 2, 2.1 - model.height)
        hole.lineTo(-sliceObject[index][2] - model.width / 2, 2.1 - model.height)
        hole.lineTo(-sliceObject[index][2] - model.width / 2, 2.1)
        hole.lineTo(-sliceObject[index][2] + model.width / 2, 2.1)
        hole.lineTo(-sliceObject[index][2] + model.width / 2, 2.1 - model.height)
        hole.closePath()
      } else if (model.label === 'right') {
        hole.moveTo(sliceObject[index][2] + model.width / 2, 2.1 - model.height)
        hole.lineTo(sliceObject[index][2] - model.width / 2, 2.1 - model.height)
        hole.lineTo(sliceObject[index][2] - model.width / 2, 2.1)
        hole.lineTo(sliceObject[index][2] + model.width / 2, 2.1)
        hole.lineTo(sliceObject[index][2] + model.width / 2, 2.1 - model.height)
        hole.closePath()

      } else if (model.label === 'front') {

        hole.moveTo(sliceObject[index][0] - model.width / 2, 2.1 - model.height)
        hole.lineTo(sliceObject[index][0] + model.width / 2, 2.1 - model.height)
        hole.lineTo(sliceObject[index][0] + model.width / 2, 2.1)
        hole.lineTo(sliceObject[index][0] - model.width / 2, 2.1)
        hole.lineTo(sliceObject[index][0] - model.width / 2, 2.1 - model.height)
        hole.closePath()
      } else if (model.label === 'back') {
        hole.moveTo(-sliceObject[index][0] - model.width / 2, 2.1 - model.height)
        hole.lineTo(-sliceObject[index][0] + model.width / 2, 2.1 - model.height)
        hole.lineTo(-sliceObject[index][0] + model.width / 2, 2.1)
        hole.lineTo(-sliceObject[index][0] - model.width / 2, 2.1)
        hole.lineTo(-sliceObject[index][0] - model.width / 2, 2.1 - model.height)
        hole.closePath()
      }
      return hole
    })
    shape.holes = holes

    return shape
  }, [wallWidth, eaveHeight, alignModelList])

  const meshRef = useRef<THREE.Mesh>(null)
  const arePositionsEqual = useCallback((
    pos1: number[],
    pos2: number[],
    epsilon = 0.2
  ): boolean => {
    if (pos1.length !== 3 || pos2.length !== 3) return false;

    return (
      Math.abs(pos1[0] - pos2[0]) < epsilon &&
      Math.abs(pos1[2] - pos2[2]) < epsilon
    );
  }, []);

  const roundTo = useCallback((num: number, decimals = 2) => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }, []);

  const roundPosition = useCallback((pos: number[]): number[] => {
    return pos.map(coord => roundTo(coord));
  }, [roundTo]);

  const throttledUpdate = useMemo(() =>
    throttle((e: ThreeEvent<PointerEvent>) => {
      if (!dragItem) return

      const { x, y, z } = e.point
      const pos = (label === 'front' || label === 'back') ? x : z
      const result = calculateModules(wallWidth, sideWall, wallWidth / 2 + pos, dragItem.type, modelList.current, false, sideWall && eaveHeight === 2.4 ? true : false)

      if (result.success) {
        const delta = (label === 'front' || label === 'left') ? 0.2 : -0.3;
        const rawResultPos = (label === 'front' || label === 'back')
          ? [(result.dragModelPosition ?? 0) - wallWidth / 2, y, z + delta]
          : [x + delta, y, (result.dragModelPosition ?? 0) - wallWidth / 2];

        const resultPos = roundPosition(rawResultPos);
        if (!objectPosition || !arePositionsEqual(resultPos, objectPosition)) {
          setObjectPosition(resultPos)
          // const updates = result.data
          //   .filter(ele => ele.Contain !== '')
          //   .map(ele => ({
          //     type: label,
          //     pos: ele.Pos - wallWidth / 2,
          //     index: ele.key ?? 0,
          //   }));
          // if (label === 'front' || label === 'back')
          //   updateAlignModels(updates)
        }
      }
    }, 200), [wallWidth, sideWall, dragItem, objectPosition]
  )

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    throttledUpdate(e)
  }

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (!dragItem) return

    setRotY(planeRotY)
    setIsOnWall(true)
  }

  useEffect(() => {
    if (!dragItem) return;
    const categorizedModels: Record<string, CategorizedModel[]> = {
      window: [],
      doorM12: [],
      doorM25: [],
      doorM30: [],
      doorM50: [],
    }
    let tempList = [...alignModelList]
    if (updateDrag > -1)
      tempList = tempList.filter((_, index) => (index !== updateDrag))
    tempList.forEach((item, i) => {
      if (item.label !== label) return

      const pos = (label === 'front' || label === 'back') ? item.position[0] : item.position[2]
      categorizedModels[item.type]?.push({
        key: i,
        position: wallWidth / 2 + pos
      })
    })
    modelList.current = categorizedModels
  })

  const handlePointerLeave = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setIsOnWall(false)
    if (dragItem) {
      setObjectPosition(null)
    }
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (dragItem && isOnWall && objectPosition) {
      addAlignModel({
        ...dragItem,
        position: objectPosition,
        rotation: [0, planeRotY - Math.PI / 2, 0],
        scale: [1, 1, 1],
        label: label
      })
    } else
      setIsOnWall(false)
  }

  const basicMap = useMemo(() => {
    const texture = new THREE.TextureLoader().load("/assets/Texture/ambientOcclusionMap.png")
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(0.5, 0.1)
    texture.offset = new THREE.Vector2(0.01, 0.01)
    return texture
  }, []);

  const bumpMap = useMemo(() => {
    const texture = new THREE.TextureLoader().load("/assets/Texture/normalMap.png")
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(0.5, 1)
    texture.offset = new THREE.Vector2(0.01, 0.01)
    return texture
  }, []);
  const color = useMemo(() => new THREE.Color(panelColor), [panelColor]);
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.color.lerp(color, 0.05); // 0.1 = lerp speed, adjust as needed
    }
  });

  return (
    <group>
      <group rotation={[rotation[0], rotation[1], rotation[2]]} position={[position[0], position[1], position[2]]}>
        <mesh >
          <extrudeGeometry args={[crossSection, { ...ExtrudeSettings, depth: panelDepth }]} />
          <meshStandardMaterial ref={materialRef} side={THREE.FrontSide} map={basicMap} bumpMap={bumpMap} />
        </mesh>
        <mesh position={[0, 0, -0.001]} >
          <extrudeGeometry args={[crossSection, { ...ExtrudeSettings, depth: panelDepth }]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      <mesh
        ref={meshRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerOut={handlePointerLeave}
        onPointerUp={handlePointerUp}
        rotation={[0, planeRotY, 0]}
        position={[planePos[0], planePos[1], planePos[2]]}
      >
        <planeGeometry args={[wallWidth, eaveHeight]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

export default memo(Panel)