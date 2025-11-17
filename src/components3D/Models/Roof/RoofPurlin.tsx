import { memo } from 'react'
import RoofDimensions from "@/assets/RoofDimensions.json"
import * as THREE from "three"
import { useMaterialStore } from '@/store/useMaterialStore'

interface RoofPurlinProps {
  flag: boolean,
  deg: number,
  eaveHeight: number,
  width: number,
  length: number,
}

const RoofPurlin = ({ flag, deg, eaveHeight, width, length }: RoofPurlinProps) => {

  const {trusColor} = useMaterialStore()
  const radians = THREE.MathUtils.degToRad(deg)
  const { rafterThick, purlinThick, purlinWidth,eaveWidth, eaveLength } = RoofDimensions

  const roofLength = length + eaveLength*2
  const roofWidth = ((width + eaveWidth*2) / 2 + (rafterThick) / Math.sin(radians)) / Math.cos(radians) - (rafterThick) / Math.tan(radians)

  const defaultPosX = (width/2 + eaveWidth ) + (rafterThick + purlinThick / 2) * Math.sin(radians) - purlinWidth*Math.cos(radians)/2

  const defaultPosY = eaveHeight + (rafterThick + purlinThick / 2) * Math.cos(radians) + purlinWidth*Math.sin(radians)/2

  const num = Math.trunc((roofWidth - purlinWidth) / 0.3)

  const rotY = flag ? -radians : radians

  return (
    <>
      {
        Array.from({ length: num + 2 }).map((_, index) => {
          let posX = flag ? defaultPosX - Math.cos(radians) * 0.3 * index : -(defaultPosX - Math.cos(radians) * 0.3 * index)
          let posY = defaultPosY + Math.sin(radians) * 0.3 * index
          if (index == num +1) {
            const delta = ((roofWidth - purlinWidth) - index * 0.3)
            posX = flag ? (defaultPosX - Math.cos(radians) * 0.3 * index - Math.cos(radians) * delta) : -(defaultPosX - Math.cos(radians) * 0.3 * index - Math.cos(radians) * delta)
            posY = defaultPosY + Math.sin(radians) * 0.3 * index + delta * Math.sin(radians)
          }
          return (
            <group key={index}>
              <mesh position={[posX, posY, 0]} rotation={[0,0,rotY]}>
                <boxGeometry args={[purlinWidth, purlinThick, roofLength]} />
                <meshStandardMaterial color={ trusColor } />
              </mesh>
            </group>
          )
        })
      }
    </>
  )
}
export default memo(RoofPurlin)