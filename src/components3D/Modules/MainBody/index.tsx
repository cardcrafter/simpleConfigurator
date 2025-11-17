import EndWall from "@/components3D/Models/Wall/EndWall"
import SideWall from "@/components3D/Models/Wall/SideWall"
import Bottom from "@/components3D/Models/Wall/Bottom";

import DraggableModel from "@/components3D/Models/Draggable/DraggableModel"

import { useShallow } from "zustand/react/shallow";
import { useSize } from "@/store/useSize"
import { memo } from "react";

const MainBody = () => {
  const { width, length, height } = useSize(useShallow((state) => ({
    width: state.width,
    length: state.length,
    height: state.height
  })));
  return (
    <>
      <Bottom />
      <DraggableModel />
      <EndWall
        flag={true}
        wallWidth={width}
        height={height}
        distance={length}
        label="front"
      />
      <EndWall
        flag={false}
        wallWidth={width}
        height={height}
        distance={length}
        label="back"
      />
      <SideWall
        flag={true}
        wallWidth={length}
        height={height}
        distance={width}
        label="left"
      />
      <SideWall
        flag={false}
        wallWidth={length}
        height={height}
        distance={width}
        label="right"
      />
    </>
  )
}

export default memo(MainBody)