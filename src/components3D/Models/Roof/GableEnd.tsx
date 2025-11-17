'use client'
import * as THREE from "three"
import { memo, useMemo } from "react"
import ExtrudeSettings from "@/assets/ExtrudeSetting.json"
import PanelDimensions from "@/assets/PanelDimension.json"
import RoofDimensions from "@/assets/RoofDimensions.json"
import { useMaterialStore } from "@/store/useMaterialStore"
import { useShallow } from "zustand/shallow"
import { Addition, Subtraction, Geometry } from "@react-three/csg"

interface GableEndProps {
  endWallWidth: number
  deg: number
  eaveHeight: number
  sideWallWidth: number
  flag: boolean
}

const GableEnd = ({ flag, sideWallWidth, endWallWidth, deg, eaveHeight }: GableEndProps) => {
  const { rafterThick, eaveWidth, purlinThick, soffitThick } = RoofDimensions
  const { panelWidth, panelBackDepth, panelBackWidth, panelDepth } = PanelDimensions
  const panelColor = useMaterialStore(useShallow(state => state.panelColor))

  const radians = THREE.MathUtils.degToRad(deg)

  const snappedEndWallWidth = Math.ceil(endWallWidth / panelWidth) * panelWidth

  const ceilingJoistLength = snappedEndWallWidth + eaveWidth * 2
  const roofHeight = (ceilingJoistLength / 2 + (purlinThick + rafterThick) / Math.sin(radians)) * Math.tan(radians)
  const heightGable = roofHeight - purlinThick / Math.cos(radians)

  const virtualWidth = ceilingJoistLength + eaveWidth * 2 + 1 // 0.5 * 2
  const virtualHeight = heightGable + 0.5

  const crossSection = useMemo(() => {
    const wallShape = new THREE.Shape()
    const numPanels = Math.ceil(virtualWidth / panelWidth)

    wallShape.moveTo(-virtualWidth / 2, 0)
    wallShape.lineTo(-virtualWidth / 2, panelBackDepth * 2)

    for (let i = 0; i < numPanels; i++) {
      const startX = i * panelWidth - virtualWidth / 2
      wallShape.lineTo(panelBackWidth + startX, panelBackDepth * 2)
      wallShape.lineTo(panelBackWidth + startX, panelDepth * 1.5)
      wallShape.lineTo(panelWidth + startX, panelDepth * 1.5)
      wallShape.lineTo(panelWidth + startX, panelBackDepth * 2)
    }

    wallShape.lineTo(panelWidth * numPanels - virtualWidth / 2, 0)
    wallShape.lineTo(-virtualWidth / 2, 0)
    wallShape.closePath()

    return wallShape
  }, [endWallWidth, panelWidth, panelDepth, panelBackDepth, panelBackWidth])

  const sliceGable = useMemo(() => {
    const sliceShape = new THREE.Shape()
    sliceShape.moveTo(-ceilingJoistLength / 2,  - soffitThick)
    sliceShape.lineTo(-ceilingJoistLength / 2 - rafterThick * Math.sin(radians),  rafterThick * Math.cos(radians)+soffitThick)
    sliceShape.lineTo(0, heightGable)
    sliceShape.lineTo(ceilingJoistLength / 2 + rafterThick * Math.sin(radians),  rafterThick * Math.cos(radians)+soffitThick)
    sliceShape.lineTo(ceilingJoistLength / 2,  - soffitThick)
    sliceShape.lineTo(virtualWidth / 2,  - soffitThick)
    sliceShape.lineTo(virtualWidth / 2,  + virtualHeight + soffitThick)
    sliceShape.lineTo(-virtualWidth / 2,  + virtualHeight + soffitThick)
    sliceShape.lineTo(-virtualWidth / 2,  - soffitThick)
    sliceShape.moveTo(-ceilingJoistLength / 2,  - soffitThick)
    sliceShape.closePath()
    return sliceShape
  }, [deg, endWallWidth, eaveHeight])

  const posZ: number = flag ? sideWallWidth / 2 : -(sideWallWidth / 2 + panelBackDepth)
  const posY:number = eaveHeight - soffitThick
  const rotX = flag? Math.PI/2 : -Math.PI/2
  const rotY = flag ?  Math.PI: 0
  return (
    <mesh position={[0,posY,posZ]}>
      <Geometry>
        <Addition rotation={[rotX, rotY, 0]}>
          <extrudeGeometry args={[crossSection, { ...ExtrudeSettings, depth: virtualHeight + soffitThick }]} />
        </Addition>
        <Subtraction position={[0, 0, -panelDepth * 3]}>
          <extrudeGeometry args={[sliceGable, { ...ExtrudeSettings, depth: panelDepth * 6 }]} />
        </Subtraction>
      </Geometry>
      <meshStandardMaterial color={panelColor} />
    </mesh>
  )
}

export default memo(GableEnd)
