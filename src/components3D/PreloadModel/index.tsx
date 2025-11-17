import { memo, useEffect } from 'react';
import { useGltfStore } from '@/store/gltfStore';

const PreloadModel = () => {
    const preloadModels = useGltfStore((state) => state.preloadModels);

    useEffect(() => {
        preloadModels();
    }, [preloadModels]);

    return null;
};

export default memo(PreloadModel);