import { create } from 'zustand';

type State = {
    panelColor: string;
    roofTexture: string;
    roofColor: string;
    gutterColor: string;
    isGutter: string;
    insulationColor: string;
    trusColor: string;
}

type Actions = {
    setPanelColor: (value: string) => void;
    setRoofTexture: (value: string) => void;
    setRoofColor: (value: string) => void;
    setGutterColor: (value: string) => void;
    setGutter: (value: string) => void;
}

export const useMaterialStore = create<State & Actions>((set) => ({
    panelColor: "#FBDBBC",
    roofColor: "#191919",
    roofTexture: "",
    gutterColor: "#1A1B1A",
    isGutter: "",
    insulationColor: "#B5B88D",
    trusColor:"#FBDBBC",
    setGutterColor: (value) =>  set(() => ({gutterColor: value})),
    setPanelColor: (value) => set(() => ({panelColor: value})),
    setRoofColor: (value) => set(() => ({roofColor: value})),
    setRoofTexture: (value) => set(() => ({roofTexture: value})),
    setGutter: (value) => set(() => ({isGutter: value})),
}))