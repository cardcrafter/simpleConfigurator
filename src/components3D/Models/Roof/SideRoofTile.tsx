import * as THREE from "three"
import { memo, useMemo } from "react"

import RoofDimensions from "@/assets/RoofDimensions.json"
import PanelDimensions from "@/assets/PanelDimension.json"
import RoofTile2 from "@/components3D/Models/Roof/RoofTile4"
// import RoofTile2 from "@/components3D/Models/Roof/RoofTile2"

import ExtrudeSettings from "@/assets/ExtrudeSetting.json"
import { useMaterialStore } from "@/store/useMaterialStore"
import { useShallow } from "zustand/shallow"

interface RoofDecProps {
  flag: boolean,
  deg: number,
  height: number,
  width: number,
  length: number,
}

interface RoofTileEdgeProps {
  flag: boolean,
  deg: number,
  eaveHeight: number,
  width: number,
  length: number,
}

const SideRoofTile = ({ deg, width, length, height, flag }: RoofDecProps) => {

  const { eaveWidth, eaveLength, roofThick, purlinThick, rafterThick } = RoofDimensions
  const radians = THREE.MathUtils.degToRad(deg)

  const sideWallWidth = Math.ceil(length / PanelDimensions.panelWidth) * PanelDimensions.panelWidth
  const endWallWidth = Math.ceil(width / PanelDimensions.panelWidth) * PanelDimensions.panelWidth

  const ceilingJoistLength = endWallWidth + eaveWidth * 2

  const endRoofWidth = (ceilingJoistLength / 2 + (purlinThick + rafterThick) / Math.sin(radians)) / Math.cos(radians) - (purlinThick + rafterThick) / Math.tan(radians)
  const sideRoofLength = sideWallWidth + eaveLength * 2
  const roofHeight = (ceilingJoistLength / 2 + (purlinThick + rafterThick) / Math.sin(radians)) * Math.tan(radians)

  const args: Array<number> = []
  const pos: Array<number> = []
  args[0] = endRoofWidth
  args[1] = roofThick
  args[2] = sideRoofLength

  pos[0] = flag ? endRoofWidth * Math.cos(radians) / 2 : -endRoofWidth * Math.cos(radians) / 2
  pos[1] = (roofHeight + height)
  pos[2] = flag ? -sideRoofLength / 2 : sideRoofLength / 2

  const rotY = flag ? 0 : Math.PI
  return (
    <>
      <group position={[0, pos[1], pos[2]]}>
        <RoofTile2 roofWidth={endRoofWidth} roofLength={sideRoofLength} degree={-radians} rotY={rotY} flag={flag} />
      </group>
      <group>
        <RoofTileSideEdge flag={flag} deg={deg} eaveHeight={height} width={width} length={length} />
        <RoofTileEdgePanel flag={flag} deg={deg} eaveHeight={height} width={width} length={length} />
        <RoofTileEdgeMetal flag={flag} deg={deg} eaveHeight={height} width={width} length={length} />
      </group>

    </>
  )
}


const RoofTileSideEdge = ({ flag, deg, eaveHeight, width, length }: RoofTileEdgeProps) => {
  const { eaveWidth, eaveLength, tileEdgeThick, tileEdgeWidth, purlinThick, rafterThick, boundPanelThick } = RoofDimensions
  const radians = THREE.MathUtils.degToRad(deg)
  const roofLength = length + eaveLength * 2

  const sideEdgePosY = eaveHeight + (rafterThick + purlinThick) * Math.cos(radians) - boundPanelThick * Math.sin(radians)
  const sideEdgePosX = flag ? (width / 2 + eaveWidth) + (rafterThick + purlinThick) * Math.sin(radians) + boundPanelThick * Math.cos(radians) : -((width / 2 + eaveWidth) + (rafterThick + purlinThick) * Math.sin(radians) + boundPanelThick * Math.cos(radians))

  // const sideEdgePosX = flag ? (width / 2 + eaveWidth) : -(width / 2 + eaveWidth)
  const sideEdgePosZ = flag ? -roofLength / 2 : roofLength / 2
  const sideEdgeRotY = flag ? 0 : Math.PI
  const sideEdgeRotZ = 0

  const roofColor = useMaterialStore(useShallow((state) => state.roofColor))


  const edgeShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0, -tileEdgeWidth)
    shape.lineTo(tileEdgeThick, -tileEdgeWidth)
    shape.lineTo(tileEdgeThick, tileEdgeThick)
    shape.lineTo(-2 * tileEdgeWidth, tileEdgeThick)
    shape.lineTo(-2 * tileEdgeWidth, 0)
    shape.lineTo(0, 0)
    shape.closePath()

    return shape
  }, [])

  return (
    <mesh position={[sideEdgePosX, sideEdgePosY, sideEdgePosZ]} rotation={[0, sideEdgeRotY, sideEdgeRotZ]}>
      <extrudeGeometry args={[edgeShape, { ...ExtrudeSettings, depth: roofLength }]} />
      <meshStandardMaterial color={roofColor} side={2} />
    </mesh>
  )
}

const RoofTileEdgePanel = ({ flag, deg, eaveHeight, width, length }: RoofTileEdgeProps) => {
  const { eaveWidth, eaveLength, edgePanelThick, boundPanelThick, edgePanelWidth, purlinThick, rafterThick } = RoofDimensions
  const radians = THREE.MathUtils.degToRad(deg)
  const roofLength = length + eaveLength * 2
  const roofHeight = ((width + eaveWidth * 2) / 2 + (purlinThick + rafterThick) / Math.sin(radians)) * Math.tan(radians)
  const delta = 0.05

  const statndardPosx = width / 2 + eaveWidth + (rafterThick + purlinThick) * Math.sin(radians)
  const standaradPosY = eaveHeight + (rafterThick + purlinThick) * Math.cos(radians)


  const posSecondX = statndardPosx + delta * Math.cos(radians)
  const posSecondY = standaradPosY - delta * Math.sin(radians)

  const posFirstX = posSecondX - edgePanelWidth * Math.sin(radians)
  const posFirstY = posSecondY - edgePanelWidth * Math.cos(radians)

  const posThird = [0, roofHeight + eaveHeight]
  const posLast = [0, roofHeight - edgePanelWidth / Math.cos(radians) + eaveHeight]

  const posZ = flag ? roofLength / 2 + boundPanelThick : -roofLength / 2 - edgePanelThick - boundPanelThick

  const shapeRoofTileEdge = useMemo(() => {
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
        <extrudeGeometry args={[shapeRoofTileEdge, { ...ExtrudeSettings, depth: edgePanelThick }]} />
        <meshStandardMaterial color={"white"} side={2} />
      </mesh>
    </group>
  )
}

const RoofTileEdgeMetal = ({ flag, deg, eaveHeight, width, length }: RoofTileEdgeProps) => {
  const { eaveWidth, eaveLength, edgePanelThick, boundPanelThick, tileEdgeMetalThick, tileEdgeMetalWidth, purlinThick, rafterThick } = RoofDimensions
  const radians = THREE.MathUtils.degToRad(deg)
  const roofLength = length + eaveLength * 2
  // const roofWidth = ((width + eaveWidth*2) / 2 + (purlinThick + rafterThick) / Math.sin(radians)) / Math.cos(radians) - (purlinThick + rafterThick) / Math.tan(radians)
  const roofHeight = ((width + eaveWidth * 2) / 2 + (purlinThick + rafterThick) / Math.sin(radians)) * Math.tan(radians)
  const delta = 0.05

  const statndardPosx = width / 2 + eaveWidth + (rafterThick + purlinThick) * Math.sin(radians)
  const standaradPosY = eaveHeight + (rafterThick + purlinThick) * Math.cos(radians)


  const posFirstX = statndardPosx + delta * Math.cos(radians)
  const posFirstY = standaradPosY - delta * Math.sin(radians)

  const posSecondX = posFirstX + tileEdgeMetalThick * Math.sin(radians)
  const posSecondY = posFirstY + tileEdgeMetalThick * Math.cos(radians)

  const posLast = [0, roofHeight + eaveHeight]
  const posThird = [0, roofHeight + tileEdgeMetalThick / Math.cos(radians) + eaveHeight]

  const posZ = flag ? roofLength / 2 - (tileEdgeMetalWidth - boundPanelThick - edgePanelThick) : -roofLength / 2 - (tileEdgeMetalWidth - boundPanelThick - edgePanelThick)

  const roofColor = useMaterialStore(useShallow((state) => state.roofColor))


  const shapeRoofTileEdgeMetal = useMemo(() => {
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
        <extrudeGeometry args={[shapeRoofTileEdgeMetal, { ...ExtrudeSettings, depth: tileEdgeMetalWidth }]} />
        <meshStandardMaterial color={roofColor} side={2} />
      </mesh>
    </group>
  )
}

export default memo(SideRoofTile)