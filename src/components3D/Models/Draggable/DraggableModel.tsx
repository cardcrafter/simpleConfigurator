import * as THREE from 'three'
import ModelTemplate from './ModelTemplate'
import { useDraggable } from '@/store/useDraggable'
import { useShallow } from 'zustand/react/shallow'
import { memo } from 'react'

const DraggableModel = () => {
  const [dragItem, objectPosition, isOnWall, rotY] = useDraggable(
    useShallow((state) => [
      state.dragItem,
      state.objectPosition,
      state.isOnWall,
      state.rotY
    ])
  )
  if (!dragItem || !isOnWall || !objectPosition) return null

  let x = 0, z = 0

  if (objectPosition instanceof THREE.Vector3) {
    x = objectPosition.x
    z = objectPosition.z
  } else if (Array.isArray(objectPosition)) {
    [x, , z] = objectPosition
  }

  return (
    <ModelTemplate
      pos={[x, 0, z]}
      rot={[0, rotY - Math.PI / 2, 0]}
      scale={[1, 1, 1]}
      url={dragItem.url}
    />
  )
}

export default memo(DraggableModel)
