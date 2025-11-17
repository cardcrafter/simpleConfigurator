import React, { memo } from 'react'
import { Subtraction } from '@react-three/csg'

interface SubProps {
  pos: Array<number>;
  rot: Array<number>;
  args: Array<number>;
  scale: Array<number>;
}

const SliceObject = ({ pos, rot, args, scale }: SubProps) => {
  return (
    <Subtraction position={[pos[0], pos[1], pos[2]]} rotation={[rot[0] + Math.PI / 2, rot[1], rot[2]]} scale={[scale[0], scale[1], scale[2]]}>
      <boxGeometry args={[args[0], args[1], args[2]]} />
      <meshStandardMaterial color={"white"} side={2} />
    </Subtraction>
  )
}

export default memo(SliceObject)