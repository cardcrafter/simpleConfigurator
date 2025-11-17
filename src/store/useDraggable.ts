import { create } from "zustand";

interface ObjectModal {
  type: string;
  category: number;
  position: Array<number>;
  rotation: Array<number>;
  scale: Array<number>;
  url: string;
  src: string;
  width: number;
  height: number;
  label: string;
}

interface DragItem {
  type: string;
  category: number;
  url: string;
  src: string;
  width: number;
  height: number;
}

interface DragStore {
  dragItem: DragItem | null;
  setDragItem: (state: DragItem | null) => void;
  setDragItemOnWall: (state: (DragItem & { key: number }) | null) => void;

  dragModel: ObjectModal | null;
  setDragModel: (state: ObjectModal | null) => void;
  updateDrag: number;

  alignModelList: Array<ObjectModal>;
  addAlignModel: (model: ObjectModal) => void;
  
  removeAlignModelByIndex: (index: number) => void;
  clearAlignModels: () => void;
  updateAlignModel: (update: {model: ObjectModal; key: number}) => void;
  updateAlignModels: (updates: { type: string; index: number; pos: number }[]) => void;
  updateAllAlignModels: (updates: { type: string; index: number; pos: number[] }[]) => void;


  isOnWall: boolean;
  setIsOnWall: (state: boolean) => void;

  objectPosition: Array<number> | null;
  setObjectPosition: (array: Array<number> | null) => void;

  dragPosition: {
    x: number;
    y: number;
  } | null;
  setDragPosition: (array: { x: number; y: number } | null) => void;

  rotY: number;
  setRotY: (state: number) => void;
}

export const useDraggable = create<DragStore>((set) => ({
  dragItem: null,
  updateDrag: -1,
  setDragItem: (state) => set({ dragItem: state, updateDrag: -1 }),

  dragModel: null,
  setDragModel: (state) => set({ dragModel: state }),
  setDragItemOnWall: (state: (DragItem & { key: number }) | null) => 
    set((origin) => ({
      dragItem: state
        ? {
            category: state.category,
            height: state.height,
            src: state.src,
            type: state.type,
            url: state.url,
            width: state.width,
          }
        : null,
        alignModelList: origin.alignModelList.filter((_, index) => index !== (state?.key ?? -1)),
        isOnWall: state !== null,
      updateDrag: state ? state.key : -1,
    })),

  alignModelList: [],
  addAlignModel: (model) =>
    set((state) => ({
      alignModelList: [...state.alignModelList, model],
      objectPosition: null,
      isOnWall: false,
    })),
  removeAlignModelByIndex: (index) =>
    set((state) => ({
      alignModelList: state.alignModelList.filter((_, i) => i !== index),
    })),
  clearAlignModels: () => set({ alignModelList: [] }),
  updateAlignModel: (update) =>
    set((state) => {
      const updatedList = [...state.alignModelList];
      updatedList[update.key] = update.model
      return { alignModelList: updatedList };
    }),
  updateAlignModels: (updates) =>
    set((state) => {
      const updatedList = [...state.alignModelList];
      updates.forEach(({ type, pos, index }) => {
        if (index >= 0 && index < updatedList.length) {
          if(type ==='front' || type === 'back') {
            const tmp = state.alignModelList[index];
            const tempModel: ObjectModal = {
              ...tmp,
              position: [pos, tmp.position[1], tmp.position[2]]
            }
            updatedList[index] = {...tempModel}
          } else if(type ==='left' || type === 'right') {
            const tmp = state.alignModelList[index];
            const tempModel: ObjectModal = {
              ...tmp,
              position: [tmp.position[0], tmp.position[1], pos]
            }
            updatedList[index] = {...tempModel}
          }        
        }
      });
      return { alignModelList: updatedList };
    }),

  updateAllAlignModels: (updates) => 
    set((state) => {
      const updateModelList:Array<ObjectModal> = []
      updates.forEach(({ pos, index }) => {
          const tmp = state.alignModelList[index];
          const tempModel: ObjectModal = {
            ...tmp,
            position: [...pos]
          }
          updateModelList.push(tempModel)
       
      });
      return { alignModelList: updateModelList };
    }),

  isOnWall: false,
  setIsOnWall: (state) => set({ isOnWall: state }),

  objectPosition: null,
  setObjectPosition: (pos) => set({ objectPosition: pos }),

  dragPosition: null,
  setDragPosition: (array) => set({ dragPosition: array }),

  rotY: 0,
  setRotY: (state) => set({ rotY: state }),
}));
