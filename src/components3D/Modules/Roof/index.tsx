import SideRoofTile from "@/components3D/Models/Roof/SideRoofTile";
import RoofTrussWeb from "@/components3D/Models/Roof/RoofTrussWeb";
import RoofInsullation from "@/components3D/Models/Roof/RoofInsullation";
import Gutter from "@/components3D/Models/Roof/Gutter";
import { RoofSoffitEnds, RoofSoffitSides } from "@/components3D/Models/Roof/RoofSoffit";
import GableEnd from "@/components3D/Models/Roof/GableEnd2";
import RoofPurlin from "@/components3D/Models/Roof/RoofPurlin";
import { RoofBoundSidePanels, RoofBoundEndPanels } from "@/components3D/Models/Roof/RoofBoundPanel";

import { useSize } from "@/store/useSize";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useMaterialStore } from "@/store/useMaterialStore";
import { useInsulation } from "@/store/useInsulation";


const Roof = () => {

  const { width, length, height, degree } = useSize(
    useShallow((state) => ({
      width: state.width,
      length: state.length,
      height: state.height,
      degree: state.degree,
    }))
  );

  const roofInsulation = useInsulation(useShallow((state) => state.roofInsulation))

  const roofTexture = useMaterialStore(useShallow((state) => state.roofTexture))
  const isGutter = useMaterialStore(useShallow((state) => state.isGutter))
  return (
    <>
      {roofTexture ?
        <group>
          <SideRoofTile
            flag={true}
            deg={degree}
            height={height}
            width={width}
            length={length}
          />
          <SideRoofTile
            flag={false}
            deg={degree}
            height={height}
            width={width}
            length={length}
          />
        </group> : null
      }
      {roofInsulation ?
        <RoofInsullation
          wallLength={length}
          wallWidth={width}
          degree={degree}
          eaveHelight={height}
        />
        : null
      }
      <group>

        <RoofSoffitEnds
          wallLength={length}
          wallWidth={width}
          degree={degree}
          flag={true}
          height={height}
        />
        <RoofSoffitEnds
          wallLength={length}
          wallWidth={width}
          degree={degree}
          flag={false}
          height={height}
        />
        <RoofSoffitSides
          wallLength={length}
          wallWidth={width}
          degree={degree}
          flag={true}
          height={height}
        />
        <RoofSoffitSides
          wallLength={length}
          wallWidth={width}
          degree={degree}
          flag={false}
          height={height}
        />
      </group>
      <group>
        <GableEnd
          flag={true}
          endWallWidth={width}
          sideWallWidth={length}
          deg={degree}
          eaveHeight={height}
        />
        <GableEnd
          flag={false}
          endWallWidth={width}
          sideWallWidth={length}
          deg={degree}
          eaveHeight={height}
        />
      </group>
      <group>
        <RoofPurlin
          flag={true}
          deg={degree}
          eaveHeight={height}
          width={width}
          length={length}
        />
        <RoofPurlin
          flag={false}
          deg={degree}
          eaveHeight={height}
          width={width}
          length={length}
        />
      </group>
      <RoofTrussWeb
        degree={degree}
        width={width}
        height={height}
        length={length}
      />
      {isGutter ? <group>
        <Gutter
          eaveHeight={height}
          wallLength={length}
          wallWidth={width}
          flag={true} />
        <Gutter
          eaveHeight={height}
          wallLength={length}
          wallWidth={width}
          flag={false} />
      </group> : null}
      <group>
        <RoofBoundSidePanels
          flag={true}
          deg={degree}
          eaveHeight={height}
          width={width}
          length={length}
        />
        <RoofBoundSidePanels
          flag={false}
          deg={degree}
          eaveHeight={height}
          width={width}
          length={length}
        />
        <RoofBoundEndPanels
          flag={true}
          deg={degree}
          eaveHeight={height}
          width={width}
          length={length} />
        <RoofBoundEndPanels
          flag={false}
          deg={degree}
          eaveHeight={height}
          width={width}
          length={length} />
      </group>
    </>
  )
}

export default memo(Roof)