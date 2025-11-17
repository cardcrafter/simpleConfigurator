import RoofDimenssions from "@/assets/RoofDimensions.json"
import PanelDimensions from "@/assets/PanelDimension.json"
import * as THREE from "three"
import { useMaterialStore } from "@/store/useMaterialStore"
import { memo } from "react"

interface RoofTrussProps {
    deg: number,
    endWallWidth: number,
    eaveHeight: number,
    posZ: number
}

const RoofTruss = ({ endWallWidth, deg, eaveHeight, posZ }: RoofTrussProps) => {

    const { rafterThick, rafterWidth, ceilingJoistWidth, ceilingJoistThick, eaveWidth } = RoofDimenssions
    const { panelWidth } = PanelDimensions
    const { trusColor } = useMaterialStore()

    endWallWidth = Math.ceil(endWallWidth / panelWidth) * panelWidth

    const radians = THREE.MathUtils.degToRad(deg)

    const ceilingJoistLength: number = endWallWidth + eaveWidth * 2
    const rafterLength: number = ceilingJoistLength / (2 * Math.cos(radians)) + rafterThick * Math.tan(radians)

    const posRafterX = (rafterThick / (Math.tan(radians) * 2) + rafterLength) * Math.cos(radians) - (rafterThick * Math.sin(radians) + (rafterLength + rafterThick / Math.sin(radians)) * Math.cos(radians)) / 2
    const posRafterY = (rafterLength + rafterThick / Math.tan(radians)) * Math.sin(radians) / 2 + eaveHeight

    const rotRightZ = -radians
    const rotLeftZ = radians

    const rafterArgs: [number, number, number] = [rafterLength, rafterThick, rafterWidth]
    const JoistArgs: [number, number, number] = [ceilingJoistLength, ceilingJoistThick, ceilingJoistWidth]

    const rightRafterPosition: [number, number, number] = [posRafterX, posRafterY, posZ]
    const leftRafterPosition: [number, number, number] = [-posRafterX, posRafterY, posZ]
    const joistPosition: [number, number, number] = [0, eaveHeight + rafterThick / 2, posZ]

    return (
        <>
            <mesh position={rightRafterPosition} rotation={[0, 0, rotRightZ]} >
                <boxGeometry args={rafterArgs} />
                <meshStandardMaterial color={trusColor} />
            </mesh>
            <mesh position={leftRafterPosition} rotation={[0, 0, rotLeftZ]} >
                <boxGeometry args={rafterArgs} />
                <meshStandardMaterial color={trusColor} />
            </mesh>
            <mesh position={joistPosition}>
                <boxGeometry args={JoistArgs} />
                <meshStandardMaterial color={trusColor} />
            </mesh>
        </>
    )
}

export default memo(RoofTruss)
