import { memo } from "react"

import Panel from "@/components3D/Models/Panel/Panel2"
import Insulation from "@/components3D/Models/Panel/Insulation"
import BoundObject from "@/components3D/Models/WallModule/BoundObject"

import PanelDimensions from "@/assets/PanelDimension.json"
import BattenDimensions from "@/assets/BattenDimesion.json"

import { useInsulation } from "@/store/useInsulation"
import { useShallow } from "zustand/shallow"

interface EndWallProps {
  flag: boolean,
  wallWidth: number,
  height: number,
  distance: number,
  label: string
}

const delta = 0.0001

const EndWall = ({ flag, wallWidth, height, distance, label }: EndWallProps) => {

  const wallInsulation = useInsulation(useShallow((state) => state.wallInsulation))

  const { panelDepth } = PanelDimensions
  const { battenThick } = BattenDimensions

  const rotY = flag ? 0 : Math.PI
  const posX = 0
  const posZ = flag ? distance / 2 + battenThick : -distance / 2 - battenThick
  const posY = 0

  const planePosY = height / 2
  const planePosZ = flag ? (distance / 2 + panelDepth + delta) : (-distance / 2 - delta - panelDepth)
  const planeRotY = flag ? 0 : Math.PI

  const insulationPosZ = flag ? distance / 2 : -distance / 2

  return (
    <>
      <Panel
        wallWidth={wallWidth}
        eaveHeight={height}
        rotation={[0, rotY, 0]}
        position={[posX, posY, posZ]}
        planePos={[0, planePosY, planePosZ]}
        planeRotY={planeRotY}
        label={label}
      />
      <BoundObject
        label={label}
        length={distance}
      />
      {wallInsulation ? <Insulation
        width={wallWidth}
        height={height}
        planePos={[0, 0, insulationPosZ]}
        planeRotY={planeRotY}
        label={label}
      /> : null}
    </>
  )
}

export default memo(EndWall)