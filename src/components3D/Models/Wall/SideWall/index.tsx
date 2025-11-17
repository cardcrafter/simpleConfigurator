import { memo } from "react"

import Insulation from "@/components3D/Models/Panel/Insulation"
import Panel from "@/components3D/Models/Panel/Panel2"
import BoundObject from "@/components3D/Models/WallModule/BoundObject"

import { useInsulation } from "@/store/useInsulation"
import { useShallow } from "zustand/shallow"

import PanelDimensions from "@/assets/PanelDimension.json"
import BattenDimensions from "@/assets/BattenDimesion.json"

interface SideWallProps {
  flag: boolean,
  wallWidth: number,
  height: number,
  distance: number,
  label: string
}

const delta = 0.0001

const SideWall = ({ flag, wallWidth, height, distance, label }: SideWallProps) => {

  const wallInsulation = useInsulation(useShallow((state) => state.wallInsulation))

  const { panelDepth } = PanelDimensions
  const { battenThick } = BattenDimensions


  const rotX = 0
  const rotY = flag ? Math.PI / 2 : -Math.PI / 2
  const rotZ = 0
  const posX = flag ? distance / 2 + battenThick : -distance / 2 - battenThick
  const posY = 0
  const posZ = 0

  const planePosX = flag ? distance / 2 + panelDepth + delta : -distance / 2 - panelDepth - delta
  const planePosY = height / 2
  const planeRotY = flag ? Math.PI / 2 : -Math.PI / 2

  const insulationPosX = flag ? distance / 2 : -distance / 2
  return (<>
    <Panel
      wallWidth={wallWidth}
      eaveHeight={height}
      position={[posX, posY, posZ]}
      rotation={[rotX, rotY, rotZ]}
      planePos={[planePosX, planePosY, 0]}
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
      planePos={[insulationPosX, 0, 0]}
      planeRotY={planeRotY}
      label={label}

    /> : null}</>
  )
}

export default memo(SideWall)