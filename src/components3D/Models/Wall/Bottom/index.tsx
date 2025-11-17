import React, { useMemo } from 'react'
import { bottom } from "@/assets/ColorsSetting.json"
import { useSize } from '@/store/useSize'
import { useShallow } from 'zustand/shallow'
import ExtrudeSettings from "@/assets/ExtrudeSetting.json"
import * as THREE from 'three'

export default function Bottom() {

  const { width, length } = useSize(useShallow((state) => ({ width: state.width, length: state.length })))
  const { thickness, color } = bottom

  const bottomShape = useMemo(() => {
    const board = new THREE.Shape()
    board.moveTo(0, 0)
    board.lineTo(width / 2, 0)
    board.lineTo(width / 2, -thickness)
    board.lineTo(-width / 2, -thickness)
    board.lineTo(-width / 2, 0)
    board.lineTo(0, 0)
    board.closePath()
    const geometry = new THREE.ExtrudeGeometry(board, { ...ExtrudeSettings, depth: length })
    return geometry
  }, [width, length])

  return (
    <mesh geometry={bottomShape} position={[0, 0, -length / 2]}>
      <meshStandardMaterial side={2} color={color} />
    </mesh>
  )
}
