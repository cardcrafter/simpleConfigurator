/* eslint-disable @next/next/no-img-element */
import React, { memo } from 'react';

export interface WindowItem {
    name: string;
    image: string;
    model: string;
    height: number;
    width: number;
}

interface WindowImageProps {
    item: WindowItem;
    index: number;
    onPointerDown: (e: React.PointerEvent<HTMLImageElement>, index: number, item: WindowItem) => void;
    setRef: (el: HTMLImageElement | null) => void;
}

const WindowImage: React.FC<WindowImageProps> = ({ item, index, onPointerDown, setRef }) => (
    <img
        ref={setRef}
        draggable={false}
        src={item.image}
        alt={item.name}
        onPointerDown={(e) => onPointerDown(e, index, item)}
    />
);

export default memo(WindowImage);
