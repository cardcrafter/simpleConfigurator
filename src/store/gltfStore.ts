import { create } from 'zustand';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';
import WindowMeta from '@/assets/3dObject/WindowMeta.json';
import DoorMeta from '@/assets/3dObject/DoorMeta.json';
import ColorSettings from '@/assets/ColorsSetting.json';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface GltfState {
  cache: Map<string, GLTF>;
  isLoading: boolean;
  error: string | null;
  preloadModels: () => Promise<void>;
  getModel: (url: string) => GLTF | null;
}

export const useGltfStore = create<GltfState>((set, get) => ({
  cache: new Map<string, GLTF>(),
  isLoading: false,
  error: null,
  preloadModels: async () => {
    set({ isLoading: true, error: null });
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    loader.setDRACOLoader(dracoLoader);

    try {
      const models = [...WindowMeta, ...DoorMeta].map((item) => (item.model));
      const gutter = [...ColorSettings.gutter[1].modules].map((item) => (item.model));
      const roof = [...ColorSettings.roof[1].modules, ...ColorSettings.roof[2].modules, ...ColorSettings.roof[3].modules].map((item) => (item.model));
      const loadPromises = [...models, ...gutter, ...roof].map((model) =>
        loader.loadAsync(model).then((gltf) => ({ url: model, gltf }))
      );
      const results = await Promise.all(loadPromises);
      const newCache = new Map<string, GLTF>(results.map(({ url, gltf }) => [url, gltf]));
      set({ cache: newCache, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ isLoading: false, error: errorMessage });
      console.error('Error preloading GLTF models:', error);
    } finally {
      dracoLoader.dispose();
    }
  },
  getModel: (url: string) => get().cache.get(url) || null,
}));