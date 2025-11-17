import React, { memo } from 'react'
import RoofDimensions from "@/assets/RoofDimensions.json"
import * as THREE from "three"

interface RoofSoffitProps {
  wallWidth: number,
  wallLength: number,
  degree: number,
  height: number,
  flag: boolean
}

const { soffitThick, eaveWidth, eaveLength, rafterThick } = RoofDimensions

const RoofSoffitSide = ({ wallLength, wallWidth, flag, height }: RoofSoffitProps) => {
  const soffitLength = wallLength
  const soffitWidth = (eaveWidth - 0.02) / 3

  const posY = height - soffitThick / 2
  const defaultPosX = wallWidth / 2 + soffitWidth / 2

  return (
    <>
      {
        Array.from({ length: 3 }).map((_, i) => {
          const posX = flag ? defaultPosX + i * (soffitWidth + 0.01) : -(defaultPosX + i * (soffitWidth + 0.01))
          return (
            <group key={i}>
              <mesh position={[posX, posY, 0]}>
                <boxGeometry args={[soffitWidth, soffitThick, soffitLength]} />
                <meshStandardMaterial color={"white"} />
              </mesh>
            </group>)
        })
      }
    </>
  )
}

export const RoofSoffitSides = memo(RoofSoffitSide)

const RoofSoffitEnd = ({ wallLength, wallWidth, degree, flag, height }: RoofSoffitProps) => {
  const radians = THREE.MathUtils.degToRad(degree)
  const soffitLength = (wallWidth + eaveWidth * 2) / (2 * Math.cos(radians)) + rafterThick * Math.tan(radians)
  const soffitHeight = (soffitLength + rafterThick / Math.tan(radians)) * Math.sin(radians)
  const soffitWidth = (eaveLength - 0.02) / 3

  const posY = height + soffitHeight - (soffitLength * Math.sin(radians) / 2 + soffitThick * Math.cos(radians) / 2)
  const posX = soffitLength * Math.cos(radians) / 2 - soffitThick * Math.sin(radians) / 2
  const defaultPosZ = wallLength / 2 + soffitWidth / 2

  return (
    <>
      {
        Array.from({ length: 3 }).map((_, i) => {
          const posZ = flag ? defaultPosZ + i * (soffitWidth + 0.01) : -(defaultPosZ + i * (soffitWidth + 0.01))
          return (
            <group key={i} >
              <mesh position={[posX, posY, posZ]} rotation={[0, 0, -radians]}>
                <boxGeometry args={[soffitLength, soffitThick, soffitWidth]} />
                <meshBasicMaterial color={"white"} />
              </mesh>
              <mesh position={[-posX, posY, posZ]} rotation={[0, 0, radians]}>
                <boxGeometry args={[soffitLength, soffitThick, soffitWidth]} />
                <meshBasicMaterial color={"white"} />
              </mesh>
            </group>
          )
        })
      }
    </>
  )
}

export const RoofSoffitEnds = memo(RoofSoffitEnd)