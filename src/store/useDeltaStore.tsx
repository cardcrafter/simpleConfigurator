import { create } from "zustand";

type States = {
  roofDeltaZ : number
}

type Actions = {
  setRoofDeltaZ : (value : number) => void
}

export const useDeltaStore = create<States & Actions > ((set) => ({
  roofDeltaZ : 0,
  setRoofDeltaZ : (value) => set(() => ({roofDeltaZ: value}))
}))