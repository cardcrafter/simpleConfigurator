import { memo, useMemo } from 'react'
import { useShallow } from 'zustand/shallow'

import ExtrudeSetting from "@/assets/ExtrudeSetting.json"
import RoofDimensions from '@/assets/RoofDimensions.json'
import * as THREE from "three"

import { useMaterialStore } from '@/store/useMaterialStore'
import { useInsulation } from '@/store/useInsulation'

interface InsulationProps {
  wallLength: number,
  wallWidth: number,
  degree: number,
  eaveHelight: number
}

const RoofInsullation = ({ wallLength, wallWidth, degree, eaveHelight }: InsulationProps) => {

  const { rafterThick, eaveWidth } = RoofDimensions
  const insulationColor = useMaterialStore(useShallow((state) => state.insulationColor))
  const roofInsulation = useInsulation(useShallow((state) => state.roofInsulation))
  const gableWidth = wallWidth + eaveWidth * 2
  const radians = THREE.MathUtils.degToRad(degree)

  const posA = [gableWidth / 2, 0]
  const posB = [rafterThick * Math.sin(radians) + gableWidth / 2, rafterThick * Math.cos(radians)]
  let posC = [0, 0]
  if (roofInsulation > rafterThick) {
    posC = [posB[0] - (roofInsulation - rafterThick) / Math.tan(radians), roofInsulation]
  }

  const crossSection = useMemo(() => {
    const shape = new THREE.Shape()
    if (roofInsulation > 0) {
      shape.moveTo(posA[0], posA[1])
      shape.lineTo(posB[0], posB[1])
      if (roofInsulation > rafterThick) {
        shape.lineTo(posC[0], posC[1])
        shape.lineTo(-posC[0], posC[1])
      }
      shape.lineTo(-posB[0], posB[1])
      shape.lineTo(-posA[0], posA[1])
      shape.lineTo(posA[0], posA[1])
    }
    return shape
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallWidth, roofInsulation])

  const insulationGeometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(crossSection, { ...ExtrudeSetting, depth: wallLength })
  }, [crossSection, wallLength])

  return (
    <group rotation={[0, 0, 0]}>
      <mesh castShadow geometry={insulationGeometry} position={[0, eaveHelight - 0.01, -wallLength / 2]}>
        <meshBasicMaterial color={insulationColor} />
      </mesh>
    </group>
  )
}

export default memo(RoofInsullation)