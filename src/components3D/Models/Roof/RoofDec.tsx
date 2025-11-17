import * as THREE from "three"
import RoofDimensions from "@/assets/RoofDimensions.json"
import PanelDimensions from "@/assets/PanelDimension.json"
import { memo } from "react"

interface RoofDecProps {
    flag: boolean,
    deg: number,
    height: number,
    width: number,
    length: number,
}

const SideRoofDec = ({ deg, width, length, height, flag }: RoofDecProps) => {

    const { eaveWidth, eaveLength, roofThick, purlinThick, rafterThick } = RoofDimensions
    let radians = THREE.MathUtils.degToRad(deg)

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
    pos[1] = (roofHeight + height) - endRoofWidth * Math.sin(radians) / 2 + roofThick / 2
    pos[2] = 0

    radians = flag ? (Math.PI - radians) : radians

    return (
        <mesh position={[pos[0], pos[1], pos[2]]} rotation={[0, 0, radians]}>
            <boxGeometry args={[args[0], args[1], args[2]]} />
            <meshStandardMaterial color="black" roughness={0} />
        </mesh>
    )
}
export default memo(SideRoofDec)