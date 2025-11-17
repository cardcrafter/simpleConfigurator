import { useMemo, memo } from 'react'
import * as THREE from 'three'
import { useSize } from '@/store/useSize'
import { useShallow } from 'zustand/shallow'
import BattenDimension from '@/assets/BattenDimesion.json'
import ExtrudeSettings from '@/assets/ExtrudeSetting.json'

interface WallModuleProps {
  moduleData: [number, number, string][]
}

interface ModuleShapeProps {
  shape: THREE.Shape
  pos: number
  width: number
}

interface ModuleShapingProps {
  module: THREE.Shape
  label: string
}

const WallModules = ({ moduleData }: WallModuleProps) => {

  const {height, width,length} = useSize(useShallow((state) => ({height:state.height, width : state.width,length: state.length})))
  const { moduleColumnThick, moduleColumnWidth } = BattenDimension

  const ModuleShape = ({ shape, pos, width }: ModuleShapeProps) => {
    shape.moveTo(pos - width/2, height)
    shape.lineTo(pos - width/2, 0)
    shape.lineTo(pos - (width/2 - moduleColumnThick), 0)
    shape.lineTo(pos - (width/2 - moduleColumnThick), height - moduleColumnThick)
    shape.lineTo(pos + (width/2 - moduleColumnThick), height - moduleColumnThick)
    shape.lineTo(pos + (width/2 - moduleColumnThick), 0)
    shape.lineTo(pos + width/2, 0)
    shape.lineTo(pos + width/2, height)
    shape.moveTo(pos - width/2, height)
    shape.closePath()
    return shape
  }

  const moduleShaping = useMemo(() => {
    const moduleShapes: ModuleShapingProps[] = moduleData.slice(1).map((data) => {
      const shape = new THREE.Shape()
      ModuleShape({ shape: shape, pos: data[0], width: data[1] })
      return ({ module: shape, label: data[2] })
    })
    return moduleShapes
  }, [moduleData])

  const rotY: [number] = [0]
  const posX: [number] = [0]
  const posZ: [number] = [0]

  moduleData.slice(1).map((data)=>{
    rotY.push(data[2] === "front" ? 0 : (data[2] === "back" ? Math.PI : (data[2] === "left" ? Math.PI / 2 : -Math.PI / 2)))
    posX.push(data[2] === "left" ? width / 2 : (data[2] === "right" ? -width / 2 : 0))
    posZ.push(data[2] === "front" ? length / 2 : (data[2] === "back" ? -length / 2 : 0))
  })

  return (
    <>
      {moduleShaping.map((item, index) => {
        return (
          <mesh key={index} rotation-y={rotY[index+1]} position={[posX[index +1],0,posZ[index +1]]}>
            <extrudeGeometry args={[item.module, { ...ExtrudeSettings, depth:- moduleColumnWidth }]} />
            <meshStandardMaterial color="#FBDBBC" side={2} />
          </mesh>
          )
      })}
    </>
  )
}

export default memo(WallModules)