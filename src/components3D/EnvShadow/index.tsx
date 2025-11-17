/* eslint-disable @typescript-eslint/no-explicit-any */
import { Environment } from "@react-three/drei"

const Env = () => {
  return (
    <>
      <Environment
        preset="city"
        backgroundIntensity={0.5}
        backgroundBlurriness={0.2}
        resolution={512}
      />

      {/* Main key light with improved shadows */}
      <directionalLight
        position={[5, 12, 5]}
        intensity={1.8}
        castShadow
        shadow-mapSize-height={4096}
        shadow-mapSize-width={4096}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0001}
        shadow-intensity={2}
      />

      {/* Secondary fill light to enhance shadows */}
      <directionalLight
        position={[-3, 10, -5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
        shadow-intensity={1.5}
      />

      {/* Rim light to create separation between objects and background */}
      <directionalLight
        position={[-5, 8, -10]}
        intensity={0.4}
        castShadow={false}
      />

      {/* Post-processing effects for enhanced visual quality */}
      {/* <EffectComposer>
                <Bloom intensity={0.15} luminanceThreshold={0.8} />
                <SSAO radius={0.05} intensity={15} luminanceInfluence={0.5} />
                <ToneMapping />
            </EffectComposer> */}
    </>
  )
}

export default Env