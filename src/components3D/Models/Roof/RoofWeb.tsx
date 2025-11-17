import * as THREE from "three"
import RoofDimenssions from "@/assets/RoofDimensions.json"
import PanelDimensions from "@/assets/PanelDimension.json"
import { useMaterialStore } from "@/store/useMaterialStore"

interface RoofTimberProps {
  flag: boolean,
  endWallWidth: number,
  deg: number,
  posZ: number,
  eaveHeight: number
}

const { eaveWidth, ceilingJoistThick, rafterThick, webTimberWidth } = RoofDimenssions
const { panelWidth } = PanelDimensions

export function WebOne({ endWallWidth, deg, posZ, eaveHeight, flag }: RoofTimberProps) {

  const { trusColor } = useMaterialStore()

  endWallWidth = Math.ceil(endWallWidth / panelWidth) * panelWidth
  const radians: number = THREE.MathUtils.degToRad(deg)

  const ceilingJoistLength: number = endWallWidth + eaveWidth * 2

  const innerEndRoofWidth: number = ceilingJoistLength / (2 * Math.cos(radians)) - rafterThick * Math.tan(radians)

  const webTimberOneLength: number = innerEndRoofWidth * Math.tan(radians) / 2
  const webTimberTwoLength: number = innerEndRoofWidth / (Math.cos(radians) * 2)

  const radThree: number = Math.PI / 2 - radians * 2

  const posOneX: number = webTimberTwoLength * Math.sin(radThree) + webTimberOneLength * Math.sin(radians) / 2
  const posOneY: number = innerEndRoofWidth * Math.sin(radians) / 4 + ceilingJoistThick + eaveHeight

  const posTwoX: number = webTimberTwoLength * Math.sin(radThree) / 2
  const posTwoY: number = webTimberTwoLength * Math.cos(radThree) / 2 + ceilingJoistThick + eaveHeight

  const radOneZ: number = radians
  const radTwoZ: number = radThree

  return (
    <>
      <mesh position={[flag ? posOneX : -posOneX, posOneY, posZ]} rotation={[0, 0, flag ? -radOneZ : radOneZ]}>
        <boxGeometry args={[webTimberWidth, webTimberOneLength, webTimberWidth]} />
        <meshStandardMaterial color={trusColor} />
      </mesh>
      <mesh position={[flag ? posTwoX : -posTwoX, posTwoY, posZ]} rotation={[0, 0, flag ? radTwoZ : -radTwoZ]}>
        <boxGeometry args={[webTimberWidth, webTimberTwoLength, webTimberWidth]} />
        <meshStandardMaterial color={trusColor} />
      </mesh>
    </>
  )
}

export function WebTwo({ endWallWidth, deg, posZ, eaveHeight }: RoofTimberProps) {

  const { trusColor } = useMaterialStore()

  endWallWidth = Math.ceil(endWallWidth / panelWidth) * panelWidth

  const ceilingJoistLength: number = endWallWidth + eaveWidth * 2
  const radians: number = THREE.MathUtils.degToRad(deg)

  const webTimberThreeLength = ceilingJoistLength * Math.tan(radians) / 2 - ceilingJoistThick

  const posThreeX = 0
  const posThreeY = eaveHeight + ceilingJoistThick + webTimberThreeLength / 2

  return (
    <>
      <mesh position={[posThreeX, posThreeY, posZ]}>
        <boxGeometry args={[webTimberWidth, webTimberThreeLength, webTimberWidth]} />
        <meshStandardMaterial color={trusColor} />
      </mesh>
    </>
  )
}