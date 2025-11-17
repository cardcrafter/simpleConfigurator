import { create } from 'zustand';

type State = {
    isCollaps: boolean;
    showOption: string;
    exterior: boolean;
};

type Actions = {
    setCollaps: (value: boolean) => void;
    setShowOption: (value: string) => void;
    setExterior: (value: boolean) => void;
};

export const useCollaps = create<State & Actions>((set) => ({
    isCollaps: false,
    exterior: true,
    showOption: "None",
    setCollaps: (value) => set(() => ({ isCollaps: value })),
    setShowOption: (value) => set(() => ({ showOption: value })),
    setExterior: (value) => set(() => ({ exterior: value })),

}));
