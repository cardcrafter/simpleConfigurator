import { useMemo, memo } from 'react'
import { useDraggable } from '@/store/useDraggable'
import { useShallow } from 'zustand/shallow'
import BattenDimension from '@/assets/BattenDimesion.json'
import * as THREE from 'three'
import ExtrudeSettings from '@/assets/ExtrudeSetting.json'

interface BoundObjectProps {
  label: string;
  length: number;
}

interface boundFuncProps {
  posX: number;
  moduleColumnThick: number;
  boundPanelThick: number;
  modelWidth: number;
  modelHeight: number;
  moduleWidth: number;
  bound: THREE.Shape;
  modelType: string;
}

const BoundObject = ({ label, length }: BoundObjectProps) => {
  const [alignModelList] = useDraggable(useShallow((state) => [state.alignModelList]))
  const { moduleColumnThick, boundPanelThick, moduleColumnWidth } = BattenDimension

  const modelPos: [number, number, number][] = []
  const rotY: [number] = [0]
  const posX: [number] = [0]
  const posZ: [number] = [0]
  const modelList = alignModelList.filter((item) => item.label === label)

  modelList.map((item) => {
    rotY.push(item.label === "front" ? 0 : (item.label === "back" ? Math.PI : (item.label === "left" ? Math.PI / 2 : -Math.PI / 2)))
    posX.push(item.label === "left" ? length / 2 : (item.label === "right" ? -length / 2 : 0))
    posZ.push(item.label === "front" ? length / 2 : (item.label === "back" ? -length / 2 : 0))
    modelPos.push([item.position[0], 2.1 - item.height / 2, item.position[2]])
  })


  const boundFunc = ({ bound, posX, moduleColumnThick, boundPanelThick, modelWidth, modelHeight, moduleWidth, modelType }: boundFuncProps) => {
    if (modelHeight !== 2.1) {
      const hole: THREE.Shape = new THREE.Shape()

      bound.moveTo(posX + (moduleWidth / 2 - moduleColumnThick ), 2.1 + boundPanelThick)
      bound.lineTo(posX + (moduleWidth / 2 - moduleColumnThick ), 2.1)
      bound.lineTo(posX + (modelWidth / 2 + boundPanelThick), 2.1)
      bound.lineTo(posX + (modelWidth / 2 + boundPanelThick), 2.1)
      bound.lineTo(posX + (modelWidth / 2 + boundPanelThick), 2.1 - modelHeight)
      bound.lineTo(posX + (moduleWidth / 2 - moduleColumnThick  ), 2.1 - modelHeight)
      bound.lineTo(posX + (moduleWidth / 2 - moduleColumnThick  ), 2.1 - modelHeight - boundPanelThick)
      bound.lineTo(posX + boundPanelThick / 2, 2.1 - modelHeight - boundPanelThick)
      bound.lineTo(posX + boundPanelThick / 2, moduleColumnThick)
      bound.lineTo(posX - boundPanelThick / 2, moduleColumnThick)
      bound.lineTo(posX - boundPanelThick / 2, 2.1 - modelHeight - boundPanelThick)
      bound.lineTo(posX - (moduleWidth / 2 - moduleColumnThick  ), 2.1 - modelHeight - boundPanelThick)
      bound.lineTo(posX - (moduleWidth / 2 - moduleColumnThick  ), 2.1 - modelHeight)
      bound.lineTo(posX - (modelWidth / 2 + boundPanelThick), 2.1 - modelHeight)
      bound.lineTo(posX - (modelWidth / 2 + boundPanelThick), 2.1)
      bound.lineTo(posX - (moduleWidth / 2 - moduleColumnThick  ), 2.1)
      bound.lineTo(posX - (moduleWidth / 2 - moduleColumnThick  ), 2.1 + boundPanelThick)
      bound.lineTo(posX + (moduleWidth / 2 - moduleColumnThick  ), 2.1 + boundPanelThick)
      bound.closePath()

      hole.moveTo(posX + modelWidth / 2, 2.1 - modelHeight)
      hole.lineTo(posX - modelWidth / 2, 2.1 - modelHeight)
      hole.lineTo(posX - modelWidth / 2, 2.1)
      hole.lineTo(posX + modelWidth / 2, 2.1)
      hole.lineTo(posX + modelWidth / 2, 2.1 - modelHeight)
      hole.closePath()
      bound.holes = [hole]
    } else if (modelType === "doorM12") {
      bound.moveTo(posX + (moduleWidth / 2 - moduleColumnThick  ), 2.1 + boundPanelThick)
      bound.lineTo(posX + (moduleWidth / 2 - moduleColumnThick  ), 2.1)
      bound.lineTo(posX + (modelWidth / 2 + boundPanelThick), 2.1)
      bound.lineTo(posX + (modelWidth / 2 + boundPanelThick), 0)
      bound.lineTo(posX + modelWidth / 2, 0)
      bound.lineTo(posX + modelWidth / 2, 2.1)
      bound.lineTo(posX - modelWidth / 2, 2.1)
      bound.lineTo(posX - modelWidth / 2, 0)
      bound.lineTo(posX - (modelWidth / 2 + boundPanelThick), 0)
      bound.lineTo(posX - (modelWidth / 2 + boundPanelThick), 2.1)
      bound.lineTo(posX - (moduleWidth / 2 - moduleColumnThick  ), 2.1)
      bound.lineTo(posX - (moduleWidth / 2 - moduleColumnThick  ), 2.1 + boundPanelThick)
      bound.lineTo(posX + (moduleWidth / 2 - moduleColumnThick  ), 2.1 + boundPanelThick)
      bound.closePath()
    } else if( modelType ==="doorM25"){
      moduleWidth = 2.5
      bound.moveTo(posX + (moduleWidth / 2 - moduleColumnThick ), 2.1 + boundPanelThick)
      bound.lineTo(posX + (moduleWidth / 2 - moduleColumnThick ), 2.1)
      bound.lineTo(posX - (moduleWidth / 2 - moduleColumnThick ), 2.1)
      bound.lineTo(posX - (moduleWidth / 2 - moduleColumnThick ), 2.1 + boundPanelThick)
      bound.lineTo(posX + (moduleWidth / 2 - moduleColumnThick ), 2.1 + boundPanelThick)
      bound.closePath()
    }
  }

  const boundSahpe = useMemo(() => {
    const bounds: THREE.Shape[] = modelList.map((model, index) => {
      const boundShape: THREE.Shape = new THREE.Shape()
      // const holeShape: THREE.Shape = new THREE.Shape()
      if (model.label === 'left') {
        boundFunc({
          bound: boundShape,
          posX: -modelPos[index][2],
          moduleColumnThick: moduleColumnThick,
          boundPanelThick: boundPanelThick,
          modelWidth: model.width,
          modelHeight: model.height,
          moduleWidth: 1.2,
          modelType: model.type
        })
        // boundShape.holes = [holeShape]
      } else if (model.label === 'right') {
        boundFunc({
          bound: boundShape,
          posX: modelPos[index][2],
          moduleColumnThick: moduleColumnThick,
          boundPanelThick: boundPanelThick,
          modelWidth: model.width,
          modelHeight: model.height,
          moduleWidth: 1.2,
          modelType: model.type

        })
        // boundShape.holes = [holeShape]
      } else if (model.label === 'front') {
        boundFunc({
          bound: boundShape,
          posX: modelPos[index][0],
          moduleColumnThick: moduleColumnThick,
          boundPanelThick: boundPanelThick,
          modelWidth: model.width,
          modelHeight: model.height,
          modelType: model.type,
          moduleWidth: 1.2
        })
        // boundShape.holes = [holeShape]
      } else if (model.label === 'back') {
        boundFunc({
          bound: boundShape,
          posX: -modelPos[index][0],
          moduleColumnThick: moduleColumnThick,
          boundPanelThick: boundPanelThick,
          modelWidth: model.width,
          modelType: model.type,
          modelHeight: model.height,
          moduleWidth: 1.2
        })
        // boundShape.holes = [holeShape]
      }
      return boundShape
    })
    return bounds
  }, [alignModelList])

  return (
    <>
      {boundSahpe.map((bound, index) => {

        return (
          <mesh key={index} rotation={[0, rotY[index + 1], 0]} position={[posX[index + 1], 0, posZ[index + 1]]}>
            <extrudeGeometry args={[bound, { ...ExtrudeSettings, depth: -moduleColumnWidth }]} />
            <meshStandardMaterial color={'#FBDBBC'} side={2} />
          </mesh>)
      })}
    </>
  )
}

export default memo(BoundObject);
// export default BoundObject;