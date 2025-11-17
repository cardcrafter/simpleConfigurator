import * as THREE from 'three'
import { useGLTF, Instances, Instance } from '@react-three/drei'
import { useMaterialStore } from '@/store/useMaterialStore'
import { useShallow } from 'zustand/shallow'
import ColorSetting from '@/assets/ColorsSetting.json'

interface RoofProps {
  roofWidth: number
  roofLength: number
  degree: number
  rotY: number
  flag: boolean
}

interface TileProps extends RoofProps {
  tileType: string
}

interface ModuleProps {
  model: string
  width: number
  length: number
}

export default function RoofTile2Instanced(props: RoofProps) {
  const tileType = useMaterialStore(useShallow((s) => s.roofTexture))
  const roof = ColorSetting.roof
  const tileName = roof.find((item) => item.texture === tileType)?.name as string

  if (tileName === 'Plegel') {
    return <PlegelInstanced {...props} tileType={tileType} />
  }

  // TODO: Add PlateTiles instanced variant
  return null
}

function PlegelInstanced({ roofWidth, roofLength, degree, rotY, tileType }: TileProps) {
  const roof = ColorSetting.roof
  const roofColor = useMaterialStore(useShallow((s) => s.roofColor))

  const tileModel = roof.find((item) => item.texture === tileType)
  const tileModules = tileModel?.modules as ModuleProps[]

  const { scene: tileScene } = useGLTF(tileModules[0].model)
  const tileMesh = tileScene.getObjectByProperty('type', 'Mesh') as THREE.Mesh
  const tileGeometry = tileMesh.geometry.clone()
  const material = tileMesh.material as THREE.MeshStandardMaterial

  const tileLength = tileModules[0].length
  const tileWidth = tileModules[0].width
  const deviation = 0.0025

  const tileCountX = Math.trunc(roofWidth / (tileLength + deviation))
  const tileCountZ = Math.ceil(roofLength / tileWidth)
  const roofWidthDeltaX = roofWidth - tileCountX * (tileLength + deviation)
  const roofDeltaZ = roofLength - (tileCountZ - 1) * tileWidth

  const positions: [number, number, number][] = []
  const scales: [number, number, number][] = []

  // const { nodes } = useGLTF(tileModules[0].model)
  // const geometry = useMemo(() => {
  //   // cast nodes.MyMesh to Mesh to access geometry
  //   const mesh = nodes.MyMesh as THREE.Mesh;
  //   const geo = mesh.geometry.clone();
  //   geo.rotateY(Math.PI / 2); // rotate geometry 90 degrees before instancing
  //   return geo;
  // }, [nodes]);

  for (let i = 0; i <= tileCountX; i++) {
    for (let j = 0; j < tileCountZ; j++) {
      const posX = i * (tileLength + deviation)
      const posZ = - j * tileWidth
      const scaleZ = i === tileCountX ? roofWidthDeltaX / tileLength : 1
      const scaleX = j === tileCountZ - 1 ? roofDeltaZ / tileWidth : 1
      positions.push([posX, 0, posZ])
      scales.push([scaleX, 1, scaleZ])
    }
  }

  return (
    <group rotation={[0, rotY, degree]} position={[0, 0, 0]}>
      <Instances geometry={tileGeometry} material={material.clone()} limit={positions.length}>
        {positions.map((pos, index) => (
          <Instance
            key={index}
            position={pos}
            scale={scales[index]}
            color={roofColor}
          // rotation={[0, Math.PI / 2, 0]}
          />
        ))}
      </Instances>
    </group>
  )
}