import { memo } from 'react'
import RoofTruss from "@/components3D/Models/Roof/RoofTruss";
import { WebOne, WebTwo } from "@/components3D/Models/Roof/RoofWeb"

interface TrussProps {
  degree: number,
  width: number,
  height: number,
  length: number
}

const RoofTrussWeb = ({ degree, width, height, length }: TrussProps) => {

  const trussCount = length / 1.2 + 1
  const posZ = -(length - 0.1) / 2
  return (
    <>
      {
        Array.from({ length: trussCount }, (_, i) => (
          <group key={i}>
            <RoofTruss
              deg={degree}
              endWallWidth={width}
              eaveHeight={height}
              posZ={i * 1.2 + posZ}

            />
            {
              width > 4.8 ?
                <>
                  <WebOne
                    flag={true}
                    deg={degree}
                    endWallWidth={width}
                    eaveHeight={height}
                    posZ={i * 1.2 + posZ}
                  />
                  <WebOne
                    flag={false}
                    deg={degree}
                    endWallWidth={width}
                    eaveHeight={height}
                    posZ={i * 1.2 + posZ}
                  />
                </>
                : <>
                  <WebTwo
                    flag={false}
                    deg={degree}
                    eaveHeight={height}
                    endWallWidth={width}
                    posZ={i * 1.2 + posZ}
                  />
                </>
            }
          </group>)
        )
      }
    </>
  )
}

export default memo(RoofTrussWeb)