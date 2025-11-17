/* eslint-disable prefer-const */
import { memo, useMemo } from "react"
import * as THREE from "three"
import { useShallow } from "zustand/react/shallow"
import { useMaterialStore } from "@/store/useMaterialStore"
import { useInsulation } from "@/store/useInsulation"
import ExtrudeSettings from "@/assets/ExtrudeSetting.json"
import { useDraggable } from "@/store/useDraggable"


interface InsulationProps {
  width: number
  height: number
  planePos: Array<number>
  planeRotY: number
  label: string
}

const Insulation = ({
  width,
  height,
  planePos,
  planeRotY,
  label
}: InsulationProps) => {

  const wallInsulation = useInsulation(useShallow((state) => state.wallInsulation))

  const insulationColor = useMaterialStore(useShallow((state) => state.insulationColor))

  const [
    alignModelList
  ] = useDraggable(useShallow((state) => [
    state.alignModelList
  ]))


  const sliceObject: [number, number, number][] = []
  const sliceList = alignModelList.filter(item => (item.label === label));
  sliceList.map(item => {
    sliceObject.push([
      item.position[0],
      item.position[1] - item.height / 2,
      item.position[2]
    ])
  })


  const insulataionShape = useMemo(() => {
    const board = new THREE.Shape()
    board.moveTo(0, 0)
    board.lineTo(width / 2, 0)
    board.lineTo(width / 2, height)
    board.lineTo(-width / 2, height)
    board.lineTo(-width / 2, 0)
    board.lineTo(0, 0)

    const holes: THREE.Shape[] = sliceList.map((model, index) => {
      const hole = new THREE.Shape()
      if (model.label === 'left') {
        hole.moveTo(-sliceObject[index][2] + model.width / 2, 2.1 - model.height)
        hole.lineTo(-sliceObject[index][2] - model.width / 2, 2.1 - model.height)
        hole.lineTo(-sliceObject[index][2] - model.width / 2, 2.1)
        hole.lineTo(-sliceObject[index][2] + model.width / 2, 2.1)
        hole.lineTo(-sliceObject[index][2] + model.width / 2, 2.1 - model.height)
        hole.closePath()
      } else if (model.label === 'right') {
        hole.moveTo(sliceObject[index][2] + model.width / 2, 2.1 - model.height)
        hole.lineTo(sliceObject[index][2] - model.width / 2, 2.1 - model.height)
        hole.lineTo(sliceObject[index][2] - model.width / 2, 2.1)
        hole.lineTo(sliceObject[index][2] + model.width / 2, 2.1)
        hole.lineTo(sliceObject[index][2] + model.width / 2, 2.1 - model.height)
        hole.closePath()

      } else if (model.label === 'front') {

        hole.moveTo(sliceObject[index][0] - model.width / 2, 2.1 - model.height)
        hole.lineTo(sliceObject[index][0] + model.width / 2, 2.1 - model.height)
        hole.lineTo(sliceObject[index][0] + model.width / 2, 2.1)
        hole.lineTo(sliceObject[index][0] - model.width / 2, 2.1)
        hole.lineTo(sliceObject[index][0] - model.width / 2, 2.1 - model.height)
        hole.closePath()
      } else if (model.label === 'back') {
        hole.moveTo(-sliceObject[index][0] - model.width / 2, 2.1 - model.height)
        hole.lineTo(-sliceObject[index][0] + model.width / 2, 2.1 - model.height)
        hole.lineTo(-sliceObject[index][0] + model.width / 2, 2.1)
        hole.lineTo(-sliceObject[index][0] - model.width / 2, 2.1)
        hole.lineTo(-sliceObject[index][0] - model.width / 2, 2.1 - model.height)
        hole.closePath()
      }
      return hole
    })
    board.holes = holes

    return board
  }, [width, height, alignModelList])

  return wallInsulation && (
    <group>
      <group rotation={[0, planeRotY, 0]} position={[planePos[0], planePos[1], planePos[2]]}>
        <mesh >
          <extrudeGeometry args={[insulataionShape, { ...ExtrudeSettings, depth: -wallInsulation }]} />

          <meshStandardMaterial color={insulationColor} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}


export default memo(Insulation)