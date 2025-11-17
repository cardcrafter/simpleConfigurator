/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useMemo } from 'react'
import RoofDimensions from "@/assets/RoofDimensions.json"
import * as THREE from "three"
import ExtrudeSettings from "@/assets/ExtrudeSetting.json"

interface RoofBoundPanelProps {
  flag: boolean,
  deg: number,
  eaveHeight: number,
  width: number,
  length: number,
}

const RoofBoundSidePanel = ({ flag, deg, eaveHeight, width, length }: RoofBoundPanelProps) => {
  const { eaveWidth, eaveLength, boundPanelThick, boundPanelWidth, purlinThick, rafterThick } = RoofDimensions
  const radians = THREE.MathUtils.degToRad(deg)
  const roofLength = length + eaveLength * 2

  const sidePanelPosY = eaveHeight + (rafterThick + purlinThick) * Math.cos(radians)
  const sidePanelPosX = flag ? (width / 2 + eaveWidth) + (rafterThick + purlinThick) * Math.sin(radians) : -((width / 2 + eaveWidth) + (rafterThick + purlinThick) * Math.sin(radians))

  const sidePanelRotY = flag ? -Math.PI / 2 : Math.PI / 2
  const sidePanelRotX = flag ? -radians : radians

  const shapeSideBoundPanel = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(-roofLength / 2, 0)
    shape.lineTo(-roofLength / 2, -boundPanelWidth)
    shape.lineTo(roofLength / 2, -boundPanelWidth)
    shape.lineTo(roofLength / 2, 0)
    shape.lineTo(0, 0)
    shape.closePath()
    return shape
  }, [roofLength])
  return (
    <group position={[sidePanelPosX, sidePanelPosY, 0]} rotation={[0, 0, sidePanelRotX]}>
      <mesh rotation={[0, sidePanelRotY, 0]}>
        <extrudeGeometry args={[shapeSideBoundPanel, { ...ExtrudeSettings, depth: -boundPanelThick }]} />
        <meshStandardMaterial color={"white"} side={2} />
      </mesh>
    </group>
  )
}

export const RoofBoundSidePanels = memo(RoofBoundSidePanel)

const RoofBoundEndPanel = ({ flag, deg, eaveHeight, width, length }: RoofBoundPanelProps) => {
  const { eaveWidth, eaveLength, boundPanelThick, boundPanelWidth, purlinThick, rafterThick } = RoofDimensions
  const radians = THREE.MathUtils.degToRad(deg)
  const roofLength = length + eaveLength * 2
  const roofHeight = ((width + eaveWidth * 2) / 2 + (purlinThick + rafterThick) / Math.sin(radians)) * Math.tan(radians)
  const delta = 0.05

  const statndardPosx = width / 2 + eaveWidth + (rafterThick + purlinThick) * Math.sin(radians)
  const standaradPosY = eaveHeight + (rafterThick + purlinThick) * Math.cos(radians)

  const posFirstX = statndardPosx - boundPanelWidth * Math.sin(radians) + delta * Math.cos(radians)
  const posFirstY = standaradPosY - boundPanelWidth * Math.cos(radians) - delta * Math.sin(radians)

  const posSecondX = statndardPosx + delta * Math.cos(radians)
  const posSecondY = standaradPosY - delta * Math.sin(radians)

  const posThird = [0, roofHeight + eaveHeight]
  const posLast = [0, roofHeight - boundPanelWidth / Math.cos(radians) + eaveHeight]

  const posZ = flag ? roofLength / 2 : -roofLength / 2 - boundPanelThick

  const shapeEndBoundPanel = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(posFirstX, posFirstY)
    shape.lineTo(posSecondX, posSecondY)
    shape.lineTo(posThird[0], posThird[1])
    shape.lineTo(-posSecondX, posSecondY)
    shape.moveTo(-posFirstX, posFirstY)
    shape.lineTo(posLast[0], posLast[1])
    shape.lineTo(posFirstX, posFirstY)
    shape.closePath()
    return shape
  }, [eaveHeight, width, length, deg])
  return (
    <group position={[0, 0, posZ]}>
      <mesh>
        <extrudeGeometry args={[shapeEndBoundPanel, { ...ExtrudeSettings, depth: boundPanelThick }]} />
        <meshStandardMaterial color={"white"} side={2} />
      </mesh>
    </group>
  )
}
export const RoofBoundEndPanels = memo(RoofBoundEndPanel)