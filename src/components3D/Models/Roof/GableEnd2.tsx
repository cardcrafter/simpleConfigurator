/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import * as THREE from "three"
import { memo, useMemo, useRef } from "react"
import ExtrudeSettings from "@/assets/ExtrudeSetting.json"
import PanelDimensions from "@/assets/PanelDimension.json"
import RoofDimenssions from "@/assets/RoofDimensions.json"
import { useMaterialStore } from "@/store/useMaterialStore"
import { useShallow } from "zustand/shallow"
import BattenDimension from "@/assets/BattenDimesion.json"
import { useFrame } from "@react-three/fiber"

interface GableEndProps {
    endWallWidth: number,
    deg: number,
    eaveHeight: number,
    sideWallWidth: number,
    flag: boolean

}

const GableEnd = ({ flag, sideWallWidth, endWallWidth, deg, eaveHeight }: GableEndProps) => {

    const { rafterThick, eaveWidth, purlinWidth, soffitThick } = RoofDimenssions
    const radians = THREE.MathUtils.degToRad(deg)
    const { panelDepth } = PanelDimensions

    const panelColor = useMaterialStore(useShallow((state) => state.panelColor))

    const { battenThick } = BattenDimension


    const ceilingJoistLength = endWallWidth + eaveWidth * 2
    const roofHeight = (ceilingJoistLength / 2 + (purlinWidth + rafterThick) / Math.sin(radians)) * Math.tan(radians)
    const heightGable = roofHeight + eaveHeight - purlinWidth / Math.cos(radians)

    const Gable = useMemo(() => {
        const board = new THREE.Shape()
        board.moveTo(-ceilingJoistLength / 2, eaveHeight - soffitThick)
        board.lineTo(-ceilingJoistLength / 2 - rafterThick * Math.sin(radians), eaveHeight + rafterThick * Math.cos(radians))
        board.lineTo(0, heightGable)
        board.lineTo(ceilingJoistLength / 2 + rafterThick * Math.sin(radians), eaveHeight + rafterThick * Math.cos(radians))
        board.lineTo(ceilingJoistLength / 2, eaveHeight - soffitThick)
        board.lineTo(-ceilingJoistLength / 2, eaveHeight - soffitThick)
        board.closePath()
        const geometry = new THREE.ExtrudeGeometry(board, { ...ExtrudeSettings, depth: panelDepth * 2 })
        return geometry
    }, [deg, endWallWidth, eaveHeight])

    const posZ: number = flag ? sideWallWidth / 2 + battenThick : -(sideWallWidth / 2 + battenThick + panelDepth * 2)

    const basicMap = useMemo(() => {
        const texture = new THREE.TextureLoader().load("/assets/Texture/ambientOcclusionMap.png")
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(0.5, 0.5)
        texture.offset = new THREE.Vector2(0, 0)
        return texture
    }, [])

    const bumpMap = useMemo(() => {
        const texture = new THREE.TextureLoader().load("/assets/Texture/normalMap.png")
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(0.5, 0.5)
        texture.offset = new THREE.Vector2(0, 0)
        return texture
    }, [])
    const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

    const color = useMemo(() => new THREE.Color(panelColor), [panelColor]);
    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.color.lerp(color, 0.05);
        }
    });

    return (
        <mesh geometry={Gable} position-z={posZ}>
            <meshStandardMaterial ref={materialRef} map={basicMap} bumpMap={bumpMap} />
        </mesh>
    )

}

export default memo(GableEnd)