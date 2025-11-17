import { create } from 'zustand';

type State = {
    degree: number;
    width: number;
    height: number;
    length: number;
};

type Actions = {
    setDegree: (value:number) => void;
    setWidth: (value: number) => void;
    setHeight: (value: number) => void;
    setLength: (value: number) => void;
};

export const useSize = create<State & Actions>((set) => ({
    degree:22,
    width: 3.9,
    height: 2.4,
    length: 2.5,
    setDegree: (value) => set(()=>({ degree: value})),
    setWidth: (value) => set(() => ({ width: value })),
    setHeight: (value) => set(() => ({ height: value })),
    setLength: (value) => set(() => ({ length: value })),
}));
