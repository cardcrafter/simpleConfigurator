import {create} from "zustand"

interface ConfiguratorState {
    roofDeg : number;
    setRoofDeg : (num : number) => void;
    endWallWidth : number,
    setEndWallWidth : (num : number) => void;
    eaveHeight : number,
    setEaveHeight : (num : number) => void;
    sideWallWidth : number,
    setSideWallWidth : (num : number) => void;
    wallColor : string,
    setWallColor : (col : string) => void;
}

const useConfiguratorStore = create<ConfiguratorState>((set)=>({
    roofDeg : 22,
    setRoofDeg : (num)=>set({roofDeg : num}),
    endWallWidth : 3.9,
    setEndWallWidth : (num)=>set({endWallWidth : num}),
    eaveHeight : 2.4,
    setEaveHeight : (num) => set({eaveHeight : num}),
    sideWallWidth : 4.9,
    setSideWallWidth : (num) => set({sideWallWidth : num}),
    wallColor : "orange",
    setWallColor : (col) => set({wallColor : col})
}))

export default useConfiguratorStore