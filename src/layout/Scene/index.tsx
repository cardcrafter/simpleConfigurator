'use client'
import { memo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { GizmoHelper, GizmoViewport, Preload } from "@react-three/drei"

import Building from "@/components3D/Building/index"
import PreloadModel from '@/components3D/PreloadModel'
import Env from '@/components3D/EnvShadow'
import CameraControl from '@/components3D/CameraControl'

const Scene = () => {
  return (
    <Canvas shadows camera={{ position: [10, 8, 10], fov: 30, near: 1, far: 1000 }}
      className='max-h-110 md:max-h-full' >
      <GizmoHelper
        alignment="bottom-right" // widget alignment within scene
        margin={[80, 80]} // widget margins (X, Y)
      >
        <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
      </GizmoHelper>
      <Preload all />
      <Suspense fallback={null}>
        <Building />
        <CameraControl />
        <PreloadModel />
        <Env />
      </Suspense>
      <ambientLight intensity={0.3} />
    </Canvas>
  )
}

export default memo(Scene)
