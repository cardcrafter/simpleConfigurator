import { create } from "zustand";

type State = {
    wallInsulation: number;
    roofInsulation: number;
}

type Action = {
    setWallInsulation: (value: number) => void;
    setRoofInsulation: (value: number) => void;
}

export const useInsulation = create<State & Action>((set) => ({
    wallInsulation: 0,
    roofInsulation: 0,
    setRoofInsulation: (value) => set(() => ({ roofInsulation: value })),
    setWallInsulation: (value) => set(() => ({ wallInsulation: value }))
}))