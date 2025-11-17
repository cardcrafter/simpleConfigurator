import { memo } from 'react'
import ColorSetting from "@/assets/ColorsSetting.json"
import { useMaterialStore } from '@/store/useMaterialStore'
import { useGLTF } from '@react-three/drei'
import { useShallow } from 'zustand/shallow'

interface RoofProps {
  roofWidth: number,
  roofLength: number,
  degree: number,
  rotY: number,
  flag: boolean
}

interface TileProps {
  roofWidth: number,
  roofLength: number,
  degree: number,
  rotY: number,
  tileType: string,
  flag: boolean
}
interface ModuleProps {
  model: string,
  width: number,
  length: number,
}



const RoofTile = ({ roofWidth, roofLength, degree, rotY, flag }: RoofProps) => {

  const roof = ColorSetting.roof
  const tileType = useMaterialStore(useShallow((state) => state.roofTexture))
  const tileName = roof.find((item) => item.texture === tileType)?.name as string

  return (
    <>
      {tileName === "Plegel" ? (
        <PlegelTiles
          roofWidth={roofWidth + 0.02}
          roofLength={roofLength}
          degree={degree}
          rotY={rotY}
          tileType={tileType}
          flag={flag}
        />
      ) : (
        <PlateTiles
          roofWidth={roofWidth + 0.02}
          roofLength={roofLength}
          degree={degree}
          rotY={rotY}
          tileType={tileType}
          flag={flag}
        />
      )}
    
    </>
  );

}

const PlegelTiles = ({ roofWidth, roofLength, degree, rotY, tileType, flag }: TileProps) => {

  const roof = ColorSetting.roof
  const roofColor = useMaterialStore(useShallow((state) => state.roofColor))

  const tileModel = roof.find((item) => item.texture === tileType)
  const tileModules = tileModel?.modules as ModuleProps[]

  const tiles = useGLTF(tileModules[0].model);
  const tileLength = tileModules[0].length as number
  const tileWidth = tileModules[0].width

  const crest = useGLTF(tileModules[1].model);
  const crestLength = tileModules[1].length as number;

  const deviation = 0.0025;

  const tileCountX = Math.trunc(roofWidth / (tileLength + deviation));
  const tileCountZ = Math.ceil(roofLength / tileWidth);
  const roofWidthDeltaX = roofWidth - tileCountX * (tileLength + deviation);
  // deal with deviation of roof length
  const roofDeltaZ = roofLength - (tileCountZ - 1) * tileWidth;
  const crestCount = Math.trunc(roofLength / crestLength);
  return (
    <>
      <group rotation={[0, rotY, degree]} position={[0, 0, 0]}>
        {
          Array.from({ length: tileCountX + 1 }, (_, i) => (
            Array.from({ length: tileCountZ }, (_, j) => {
              let scaleX = 1
              let scaleZ = 1
              if (j == tileCountZ - 1) scaleZ = roofDeltaZ / tileWidth
              if (i == tileCountX) scaleX = roofWidthDeltaX / tileLength
              return (
                <mesh key={`${i}-${j}`} position={[i * (tileLength + deviation), 0, j * tileWidth]} scale={[scaleX, 1, scaleZ]}>
                  <primitive object={tiles.scene.clone()} />
                  <meshStandardMaterial color={roofColor} />
                </mesh>)
            })
          ))
        }
      </group>
      <group>
        {
          flag && Array.from({ length: crestCount }, (_, k) => {
            return (
              <mesh key={k} position={[0, 0.05, k * crestLength]}>
                <primitive object={crest.scene.clone()} />
                <meshStandardMaterial color={roofColor} />
              </mesh>)
          })
        }
      </group>
    </>
  );
}

const PlateTiles = ({ roofWidth, roofLength, degree, rotY, tileType, flag }: TileProps) => {

  const roof = ColorSetting.roof

  const roofColor = useMaterialStore(useShallow((state) => state.roofColor))
  const tileModel = roof.find((item) => item.texture === tileType)
  const tileModules = tileModel?.modules as ModuleProps[]

  const tiles = useGLTF(tileModules[0].model);
  const tileLength = tileModules[0].length as number
  const tileWidth = tileModules[0].width

  const crest = useGLTF(tileModules[1].model);
  const crestLength = tileModules[1].length as number;

  const scaleX = roofWidth / tileLength
  const tileCountZ = Math.ceil(roofLength / tileWidth);

  // deal with deviation of roof length
  const roofDeltaZ = roofLength - (tileCountZ - 1) * tileWidth;

  return (
    <>
      <group rotation={[0, rotY, degree]} position={[0, 0.01, 0]}>
        {
          Array.from({ length: tileCountZ }, (_, j) => {
            let scaleZ = 1
            if (j == tileCountZ - 1) scaleZ = roofDeltaZ / tileWidth
            return (
              <mesh key={j} position={[0, 0, j * tileWidth]} scale={[scaleX, 1, scaleZ]}>
                <primitive object={tiles.scene.clone()} />
                <meshStandardMaterial color={roofColor} />
              </mesh>)
          })
        }
      </group>
      {flag && <mesh position={[0, 0.03, 0]} scale={[1, 1, roofLength / crestLength]}>
        <primitive object={crest.scene} />
      </mesh>}
    </>
  );
}

export default memo(RoofTile)