/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useCallback, useMemo, useRef } from "react"
import * as THREE from "three"
import PanelDimensions from "@/assets/PanelDimension.json"
import ExtrudeSettings from "@/assets/ExtrudeSetting.json"
import { Addition, Geometry } from "@react-three/csg"
import { useDraggable } from "@/store/useDraggable"
import { useShallow } from "zustand/react/shallow"
import SliceObject from "@/components3D/Models/Panel/SliceObject"
import { ThreeEvent } from "@react-three/fiber"
import { useMaterialStore } from "@/store/useMaterialStore"
import { useWallModuleCalculator } from "@/utils/useWallModuleCalculator"
import { throttle } from 'lodash'


type CategorizedModel = {
  key: number;
  position: number;
};

interface PanelProps {
  wallWidth: number
  eaveHeight: number
  rotation: number[]
  position: number[]
  planePos: number[]
  planeRotY: number,
  label: string
}

interface ObjectModel {
  type: string
  category: number
  position: number[]
  rotation: number[]
  scale: number[]
  url: string
  src: string
  width: number
  height: number
  label: string
}

const Panel = ({
  wallWidth,
  rotation,
  position,
  eaveHeight,
  planePos,
  planeRotY,
  label
}: PanelProps) => {
  const {
    panelWidth,
    panelDepth,
    panelBackDepth,
    panelBackWidth
  } = PanelDimensions
  const sideWall = (label === 'left' || label === 'right')
  const modelList = useRef<any>({
    window: [],
    doorM12: [],
    doorM25: [],
    doorM30: [],
    doorM50: [],
  });

  const calculateModules = useWallModuleCalculator();


  const [
    dragItem,
    objectPosition,
    isOnWall,
    alignModelList,
    addAlignModel,
    setObjectPosition,
    setIsOnWall,
    setRotY,
  ] = useDraggable(useShallow((state) => [
    state.dragItem,
    state.objectPosition,
    state.isOnWall,
    state.alignModelList,
    state.addAlignModel,
    state.setObjectPosition,
    state.setIsOnWall,
    state.setRotY,
    state.updateAlignModels,
  ]))

  const panelColor = useMaterialStore(useShallow((state) =>
    state.panelColor
  ));

  const crossSection = useMemo(() => {
    const num = Math.ceil(wallWidth / panelWidth)
    const shape = new THREE.Shape()

    if (num > 0) {
      shape.moveTo(0, 0)
      shape.lineTo(0, panelBackDepth)
      for (let i = 0; i < num; i++) {
        shape.lineTo(panelBackWidth + i * panelWidth, panelBackDepth)
        shape.lineTo(panelBackWidth + i * panelWidth, panelDepth)
        shape.lineTo(panelWidth + i * panelWidth, panelDepth)
        shape.lineTo(panelWidth + i * panelWidth, panelBackDepth)
      }
      shape.lineTo(panelWidth * num, 0)
      shape.lineTo(0, 0)
    }

    return shape
  }, [wallWidth, panelWidth, panelDepth, panelBackDepth, panelBackWidth])

  const meshRef = useRef<THREE.Mesh>(null)
  const csg = useRef<THREE.Mesh>(null)

  const worldToLocal = useMemo(() => {
    return (item: ObjectModel): number[] => {
      if (!csg.current) return [0, 0, 0]

      const inverseMatrix = new THREE.Matrix4().copy(csg.current.matrixWorld).invert()
      const worldVec = new THREE.Vector3(item.position[0], 2.1 - item.height / 2, item.position[2])
      worldVec.applyMatrix4(inverseMatrix)
      return [worldVec.x, worldVec.y, worldVec.z]
    }
  }, [])

  const arePositionsEqual = useCallback((
    pos1: number[],
    pos2: number[],
    epsilon = 0.1
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
      const result = calculateModules(wallWidth, sideWall, wallWidth / 2 + pos, dragItem.type, modelList.current)

      if (result.success) {
        const rawResultPos = (label === 'front' || label === 'back')
          ? [(result.dragModelPosition ?? 0) - wallWidth / 2, y, z]
          : [x, y, (result.dragModelPosition ?? 0) - wallWidth / 2];

        const resultPos = roundPosition(rawResultPos);
        if (!objectPosition || !arePositionsEqual(resultPos, objectPosition)) {
          setObjectPosition(resultPos)
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

    const categorizedModels: Record<string, CategorizedModel[]> = {
      window: [],
      doorM12: [],
      doorM25: [],
      doorM30: [],
      doorM50: [],
    }

    alignModelList.forEach((item, i) => {
      if (item.label !== label) return

      const pos = (label === 'front' || label === 'back') ? item.position[0] : item.position[2]
      categorizedModels[item.type]?.push({
        key: i,
        position: wallWidth / 2 + pos
      })
    })

    modelList.current = categorizedModels
  }

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

  return (
    <group>
      <group rotation={[rotation[0], rotation[1], rotation[2]]} position={[position[0], position[1], position[2]]}>
        <mesh ref={csg}>
          <Geometry>
            <Addition>
              <extrudeGeometry args={[crossSection, { ...ExtrudeSettings, depth: eaveHeight }]} />
            </Addition>
            {alignModelList.map((item, index) => {
              const localPos = worldToLocal(item)
              const isSameWall =
                Math.abs(item.position[0] - planePos[0]) < 0.01 ||
                Math.abs(item.position[2] - planePos[2]) < 0.01

              let rotY = item.rotation[1]
              if (Math.abs(item.position[2] - planePos[2]) < 0.01) {
                rotY += Math.PI / 2
              }

              return isSameWall && (
                <SliceObject
                  key={index}
                  pos={localPos}
                  rot={[item.rotation[0], rotY, item.rotation[2]]}
                  args={[item.width, item.height, 0.15]}
                  scale={item.scale}
                />
              )
            })}
          </Geometry>
          <meshStandardMaterial color={panelColor} side={THREE.DoubleSide} />
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
        <meshBasicMaterial color="white" side={THREE.DoubleSide} transparent opacity={0} />
      </mesh>
    </group>
  )
}

export default memo(Panel)