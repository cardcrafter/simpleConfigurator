/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useDraggable } from '@/store/useDraggable'
import { useShallow } from 'zustand/react/shallow'
import { useSize } from '@/store/useSize'
import { useWallModuleCalculator } from '@/utils/useWallModuleCalculator'
import ModelTemplate from './ModelTemplate'
import { ThreeEvent, useThree } from '@react-three/fiber'
import BattenDimension from "@/assets/BattenDimesion.json"
// ModuleAlign
import WallModule from '@/components3D/Models/WallModule/WallModule'

type CategorizedModel = {
  key: number;
  position: number;
};
// Data related with ModuleAlign
type moduleDataProps = [number, number, string]

const types = ['window', 'doorM12', 'doorM25', 'doorM30', 'doorM50'];

const initCategorizedModels = (): Record<string, CategorizedModel[]> =>
  Object.fromEntries(types.map(type => [type, []])) as Record<string, CategorizedModel[]>;

const AlignModelList = () => {
  const calculateModules = useWallModuleCalculator();
  const { scene } = useThree();

  const { battenThick } = BattenDimension;

  const [alignModelList, updateAllAlignModels, setDragItemOnWall, setDragPosition] = useDraggable(
    useShallow(state => [state.alignModelList, state.updateAllAlignModels, state.setDragItemOnWall, state.setDragPosition])
  );

  const [length, width, height] = useSize(
    useShallow(state => [state.length, state.width, state.height])
  );

  const roundTo = useCallback((num: number, decimals = 2) => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }, []);

  const roundPosition = useCallback((pos: number[]): number[] => {
    return pos.map(coord => roundTo(coord));
  }, [roundTo]);

  // ModuleAlign
  const [moduleData, setModuleData] = useState<moduleDataProps[]>([]);

  const processCategorizedModels = (
    list: Record<string, CategorizedModel[]>,
    isVertical: boolean,
    offset: number,
    dim: number,
    label: string,
    collector: moduleDataProps[] // ModuleAlign
  ) => {

    const result = calculateModules(dim, isVertical, 0, "", list as any, true);
    console.log('result', result)
    if (!result.success) return [];

    //savinig data position array
    result.data.map((item) => {
      const pos = (label === "front" || label === "back") ? item.Pos - width / 2 : ((label === "right") ? item.Pos - length / 2 : -item.Pos + length / 2)
      collector.push([pos, item.Size, label])
      console.log("position - origin", item.Pos, ":", pos)
    })
    return result.data
      .filter(ele => ele.Contain !== '')
      .map(ele => ({
        type: label,
        pos: label === 'front' ? [roundPosition([ele.Pos - offset])[0], 0, length / 2] : (label === 'back') ? [roundPosition([ele.Pos - offset])[0], 0, -length / 2] : (label === 'left') ? [width / 2, 0, roundPosition([ele.Pos - offset])[0]] : [-width / 2, 0, roundPosition([ele.Pos - offset])[0]],
        index: ele.key ?? 0,
      }));
  };

  useLayoutEffect(() => {
    const categorized = {
      front: initCategorizedModels(),
      back: initCategorizedModels(),
      left: initCategorizedModels(),
      right: initCategorizedModels(),
    };

    let originModelList = [...alignModelList];
    if (height < 2.7)
      originModelList = originModelList.filter((item) => (item.type !== 'doorM25' && item.type !== 'doorM30' && item.type !== 'doorM50'))

    originModelList.forEach((item, i) => {
      const axis = (item.label === 'front' || item.label === 'back') ? item.position[0] : item.position[2];
      const dim = (item.label === 'front' || item.label === 'back') ? width : length;
      const modelList = categorized[item.label as keyof typeof categorized];
      modelList?.[item.type]?.push({ key: i, position: dim / 2 + axis });
    });

    // ModuleAlign
    const newModuleData: moduleDataProps[] = [];

    const updatedModels = [
      ...processCategorizedModels(categorized.front, false, width / 2, width, 'front', newModuleData),
      ...processCategorizedModels(categorized.back, false, width / 2, width, 'back', newModuleData),
      ...processCategorizedModels(categorized.left, true, length / 2, length, 'left', newModuleData),
      ...processCategorizedModels(categorized.right, true, length / 2, length, 'right', newModuleData),
    ];


    setModuleData([[0, 0, ''], ...newModuleData]);


    updateAllAlignModels(updatedModels);
  }, [length, width, height]);

  useEffect(() => {
    if (scene) {
      scene.traverseVisible((mesh: any) => {
        if (mesh.isMesh) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>, item: {
      type: string;
      category: number;
      url: string;
      src: string;
      width: number;
      height: number;
      key: number;
    }) => {
      e.stopPropagation();
      setDragItemOnWall({
        src: item.src,
        category: item.category,
        type: item.type,
        url: item.url,
        height: item.height,
        width: item.width,
        key: item.key
      });

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [setDragItemOnWall]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      // const parentRect = parentRef.current?.getBoundingClientRect();
      // if (!parentRect) return;

      setDragPosition({
        x: e.clientX - 50,
        y: e.clientY + scrollY - 50
      });
    },
    [setDragPosition]
  );

  const handlePointerUp = useCallback(() => {
    setDragPosition(null);
    setDragItemOnWall(null);
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  }, [setDragItemOnWall, setDragPosition, handlePointerMove]);

    return (
      <>
        <WallModule moduleData={moduleData} />

        {alignModelList.map((item, index) => {
          const pos: [number, number, number] = [item.position[0], 0, item.position[2]];

          switch (item.label) {
            case 'front':
              pos[2] = length / 2 + battenThick;
              break;
            case 'back':
              pos[2] = -length / 2 - battenThick;
              break;
            case 'left':
              pos[0] = width / 2 + battenThick;
              break;
            case 'right':
              pos[0] = -width / 2 - battenThick;
              break;
          }

          return (
            <group key={index} onPointerDown={(e) => handlePointerDown(e, {
              src: item.src,
              category: item.category,
              height: item.height,
              type: item.type,
              url: item.url,
              width: item.width,
              key: index
            })}>
              <ModelTemplate
                pos={[pos[0], 0, pos[2]]}
                rot={[item.rotation[0], item.rotation[1], item.rotation[2]]}
                scale={[item.scale[0], item.scale[1], item.scale[2]]}
                url={item.url}
              />
            </group>
          );
        })}
      </>)
  
};

export default memo(AlignModelList);
