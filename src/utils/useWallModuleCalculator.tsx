import { useCallback } from 'react';

// Enum for module types
enum ModuleType {
    M3 = 'm3',
    M6 = 'm6',
    M10 = 'm10',
    M12 = 'm12',
    M25 = 'm25',
    M30 = 'm30',
    M50 = 'm50',
    H4V = 'h4v',
    H4H = 'h4h',
    H5V = 'h5v',
    H5H = 'h5h',
    H6V = 'h6v',
    H6H = 'h6h',
    H7V = 'h7v',
    H7H = 'h7h',
}

// Enum for drag model types
enum DragModelType {
    Window = 'window',
    DoorM12 = 'doorM12',
    DoorM25 = 'doorM25',
    DoorM30 = 'doorM30',
    DoorM50 = 'doorM50',
}

// Module sizes in meters
const modules: Record<ModuleType, number> = {
    [ModuleType.M3]: 0.3,
    [ModuleType.M6]: 0.6,
    [ModuleType.M10]: 1.0,
    [ModuleType.M12]: 1.2,
    [ModuleType.M25]: 2.5,
    [ModuleType.M30]: 3.0,
    [ModuleType.M50]: 5.0,
    [ModuleType.H4V]: 0.4,
    [ModuleType.H4H]: 0.4,
    [ModuleType.H5V]: 0.5,
    [ModuleType.H5H]: 0.5,
    [ModuleType.H6V]: 0.6,
    [ModuleType.H6H]: 0.6,
    [ModuleType.H7V]: 0.7,
    [ModuleType.H7H]: 0.7,
};

// Interface for model position with key
interface ModelPosition {
    key: number;
    position: number;
}

// Input interface for aligned model positions
interface AlignedModelsPositions {
    window: ModelPosition[];
    doorM12: ModelPosition[];
    doorM25: ModelPosition[];
    doorM30: ModelPosition[];
    doorM50: ModelPosition[];
}

// Internal interface for door data
interface DoorData {
    pos: number;
    module: ModuleType;
    index: number;
    key: number;
}

// Internal interface for configuration result
interface ConfigurationResult {
    configuration: ModuleType[];
    windowIndices: number[];
    doorIndices: number[];
    allDoors: DoorData[];
}

// Output interface for each module
interface ModuleOutput {
    Position: number;
    Pos: number;
    Module: ModuleType;
    Size: number;
    Contain: string;
    Label: { isDragModel: boolean };
    key: number | null;
}

// Output type for calculateModules
type CalculateModulesResult =
    | { success: true; data: ModuleOutput[]; dragModelPosition: number; dragModelModule: string }
    | { success: false; error: string };

// Hook to provide memoized calculateModules function
export function useWallModuleCalculator(): (
    wallLength: number,
    isSidewall: boolean,
    dragModelPosition: number,
    dragModelType: string,
    alignedModelsPositions: AlignedModelsPositions,
    onlyupdatemodel?: boolean,
    disablebigdoor?: boolean
) => CalculateModulesResult {
    const calculateModules = useCallback((
        wallLength: number,
        isSidewall: boolean,
        dragModelPosition: number,
        dragModelType: string,
        alignedModelsPositions: AlignedModelsPositions,
        onlyupdatemodel: boolean = false,
        disablebigdoor: boolean = false
    ): CalculateModulesResult => {
        // Validate inputs
        if (isNaN(wallLength) || wallLength < 0.6) {
            return { success: false, error: 'Invalid wall length. Must be >= 0.6 meters.' };
        }
        const wallLengthCm: number = Math.round(wallLength * 100);
        const dragPositionCm: number = Math.round(dragModelPosition * 100);

        // Validate drag position (only if onlyupdatemodel is false)
        if (!onlyupdatemodel && (dragPositionCm < 0 || dragPositionCm > wallLengthCm)) {
            return {
                success: false,
                error: `Invalid drag position (${(dragPositionCm / 100).toFixed(2)}m). Must be between 0 and ${wallLength.toFixed(2)} meters.`,
            };
        }

        // Validate drag model type when disablebigdoor is true
        if (!onlyupdatemodel && disablebigdoor && (
            dragModelType === DragModelType.DoorM25 ||
            dragModelType === DragModelType.DoorM30 ||
            dragModelType === DragModelType.DoorM50
        )) {
            return {
                success: false,
                error: `Cannot place ${dragModelType} when big doors are disabled.`,
            };
        }

        // Generate a unique key for the dragged model (only if onlyupdatemodel is false)
        const dragModelKey: number = onlyupdatemodel ? 0 : Date.now();

        // Combine drag model with aligned models, preserving keys (skip drag model if onlyupdatemodel is true)
        const windowPositions: ModelPosition[] = !onlyupdatemodel && dragModelType === DragModelType.Window
            ? [{ key: dragModelKey, position: dragModelPosition }, ...(alignedModelsPositions.window || [])]
            : (alignedModelsPositions.window || []);
        const doorM12Positions: ModelPosition[] = !onlyupdatemodel && dragModelType === DragModelType.DoorM12
            ? [{ key: dragModelKey, position: dragModelPosition }, ...(alignedModelsPositions.doorM12 || [])]
            : (alignedModelsPositions.doorM12 || []);
        // Filter out big doors if disablebigdoor is true
        const doorM25Positions: ModelPosition[] = disablebigdoor
            ? []
            : (!onlyupdatemodel && dragModelType === DragModelType.DoorM25
                ? [{ key: dragModelKey, position: dragModelPosition }, ...(alignedModelsPositions.doorM25 || [])]
                : (alignedModelsPositions.doorM25 || []));
        const doorM30Positions: ModelPosition[] = disablebigdoor
            ? []
            : (!onlyupdatemodel && dragModelType === DragModelType.DoorM30
                ? [{ key: dragModelKey, position: dragModelPosition }, ...(alignedModelsPositions.doorM30 || [])]
                : (alignedModelsPositions.doorM30 || []));
        const doorM50Positions: ModelPosition[] = disablebigdoor
            ? []
            : (!onlyupdatemodel && dragModelType === DragModelType.DoorM50
                ? [{ key: dragModelKey, position: dragModelPosition }, ...(alignedModelsPositions.doorM50 || [])]
                : (alignedModelsPositions.doorM50 || []));

        // Validate door overlaps
        const allDoorPositions: { pos: number; type: ModuleType; key: number }[] = [
            ...doorM12Positions.map((p) => ({ pos: Math.round(p.position * 100), type: ModuleType.M12, key: p.key })),
            ...doorM25Positions.map((p) => ({ pos: Math.round(p.position * 100), type: ModuleType.M25, key: p.key })),
            ...doorM30Positions.map((p) => ({ pos: Math.round(p.position * 100), type: ModuleType.M30, key: p.key })),
            ...doorM50Positions.map((p) => ({ pos: Math.round(p.position * 100), type: ModuleType.M50, key: p.key })),
        ].sort((a, b) => a.pos - b.pos);

        for (let i = 0; i < allDoorPositions.length; i++) {
            const { pos, type, key } = allDoorPositions[i];
            for (let j = i + 1; j < allDoorPositions.length; j++) {
                const { pos: pos2, type: type2, key: key2 } = allDoorPositions[j];
                const size1 = modules[type] * 100;
                const size2 = modules[type2] * 100;
                if (Math.abs(pos - pos2) < (size1 + size2) / 2) {
                    return {
                        success: false,
                        error: `Door overlap: ${type} door (key: ${key}) at ${(pos / 100).toFixed(2)}m and ${type2} door (key: ${key2}) at ${(pos2 / 100).toFixed(2)}m are too close. Minimum separation is ${((size1 + size2) / 200).toFixed(2)}m.`,
                    };
                }
            }
        }

        // Calculate module configuration
        const result: ConfigurationResult | null = configureWallModules(
            wallLengthCm,
            windowPositions,
            doorM12Positions,
            doorM25Positions,
            doorM30Positions,
            doorM50Positions,
            isSidewall
        );

        if (!result || result.configuration.length === 0) {
            return { success: false, error: 'Failed to configure wall with given parameters or no modules generated.' };
        }

        const { configuration, windowIndices, doorIndices, allDoors } = result;

        // Build output array
        const output: ModuleOutput[] = [];
        let cumulativeLengthCm = 0;
        let dragModelXPosition: number | null = null;

        for (let i = 0; i < configuration.length; i++) {
            const myModule = configuration[i];
            const moduleSize = modules[myModule];
            const xPosition = cumulativeLengthCm / 100 + moduleSize / 2; // Center of the module
            const contains: string[] = [];
            let isDragModel = false;
            let moduleKey: number | null = null;

            // Handle windows
            if (windowIndices.includes(i)) {
                const windowIndex = windowIndices.indexOf(i);
                const windowKey = windowPositions[windowIndex].key;
                contains.push(`Window ${windowKey}`);
                moduleKey = windowKey;
                if (!onlyupdatemodel && windowKey === dragModelKey && dragModelType === DragModelType.Window) {
                    isDragModel = true;
                    dragModelXPosition = xPosition;
                }
            }

            // Handle doors
            if (doorIndices.includes(i)) {
                const doorIndex = doorIndices.indexOf(i);
                const door = allDoors[doorIndex];
                contains.push(`Door ${door.key} (${door.module})`);
                moduleKey = door.key;
                if (!onlyupdatemodel && door.key === dragModelKey && dragModelType === `door${door.module.toUpperCase()}`) {
                    isDragModel = true;
                    dragModelXPosition = xPosition;
                }
            }

            output.push({
                Position: i + 1,
                Pos: parseFloat(xPosition.toFixed(2)),
                Module: myModule,
                Size: moduleSize,
                Contain: contains.join(', '),
                Label: { isDragModel },
                key: moduleKey,
            });

            cumulativeLengthCm += moduleSize * 100;
        }

        // If onlyupdatemodel is true, return only the configuration data
        if (onlyupdatemodel) {
            return { success: true, data: output, dragModelPosition: 0, dragModelModule: '' };
        }

        // Check if drag model was placed (only if onlyupdatemodel is false)
        if (dragModelXPosition === null) {
            return { success: false, error: 'No module contains the drag model.' };
        }

        return {
            success: true,
            data: output,
            dragModelPosition: parseFloat(dragModelXPosition.toFixed(2)),
            dragModelModule: dragModelType
        };
    }, []);

    return calculateModules;
}

function configureWallModules(
    wallLength: number,
    windowPositions: ModelPosition[],
    doorM12Positions: ModelPosition[],
    doorM25Positions: ModelPosition[],
    doorM30Positions: ModelPosition[],
    doorM50Positions: ModelPosition[],
    isSidewall: boolean
): ConfigurationResult | null {
    // Module sizes in centimeters
    const moduleSizes: Record<ModuleType, number> = {
        [ModuleType.M3]: 30,
        [ModuleType.M6]: 60,
        [ModuleType.M10]: 100,
        [ModuleType.M12]: 120,
        [ModuleType.M25]: 250,
        [ModuleType.M30]: 300,
        [ModuleType.M50]: 500,
        [ModuleType.H4V]: 40,
        [ModuleType.H4H]: 40,
        [ModuleType.H5V]: 50,
        [ModuleType.H5H]: 50,
        [ModuleType.H6V]: 60,
        [ModuleType.H6H]: 60,
        [ModuleType.H7V]: 70,
        [ModuleType.H7H]: 70,
    };

    // Extract positions in centimeters
    const windowPositionsCm: number[] = windowPositions.map((p) => Math.round(p.position * 100));
    const doorM12PositionsCm: number[] = doorM12Positions.map((p) => Math.round(p.position * 100));
    const doorM25PositionsCm: number[] = doorM25Positions.map((p) => Math.round(p.position * 100));
    const doorM30PositionsCm: number[] = doorM30Positions.map((p) => Math.round(p.position * 100));
    const doorM50PositionsCm: number[] = doorM50Positions.map((p) => Math.round(p.position * 100));

    let configuration: ModuleType[] = [];
    let windowIndices: number[] = [];
    let doorIndices: number[] = [];

    // Handle doors
    const numM12Doors: number = doorM12PositionsCm.length;
    const numM25Doors: number = doorM25PositionsCm.length;
    const numM30Doors: number = doorM30PositionsCm.length;
    const numM50Doors: number = doorM50PositionsCm.length;
    const totalDoors: number = numM25Doors + numM30Doors + numM50Doors;
    const totalDoorLength: number = (numM25Doors * moduleSizes[ModuleType.M25]) +
        (numM30Doors * moduleSizes[ModuleType.M30]) +
        (numM50Doors * moduleSizes[ModuleType.M50]);
    let minRemainingLength: number = (numM12Doors + windowPositionsCm.length) > 0 ? 60 : isSidewall ? 80 : 60;

    if (isSidewall) {
        minRemainingLength = (numM12Doors + windowPositionsCm.length) > 0 ? Math.max(80, 60 * (numM12Doors + windowPositionsCm.length)) : 80;
    } else {
        minRemainingLength = (numM12Doors + windowPositionsCm.length) > 0 ? 60 * (numM12Doors + windowPositionsCm.length) : 60;
    }

    const minM12Count = numM12Doors + windowPositionsCm.length;
    const remainingLengthAfterDoors: number = wallLength - totalDoorLength;

    if (wallLength < totalDoorLength + minRemainingLength) {
        return null;
    }

    let maxM12Count: number = Math.max(
        minM12Count,
        Math.floor(remainingLengthAfterDoors / moduleSizes[ModuleType.M12])
    );
    let remainder: number = remainingLengthAfterDoors - maxM12Count * moduleSizes[ModuleType.M12];
    if (remainder < 0) return null;
    let smallModules: ModuleType[] | null = isSidewall
        ? findHModuleCombination(remainder)
        : findSmallModuleCombination(remainder);

    while ((remainder < (isSidewall ? 80 : 60) || !smallModules) && maxM12Count > minM12Count) {
        maxM12Count -= 1;
        remainder = remainingLengthAfterDoors - maxM12Count * moduleSizes[ModuleType.M12];
        smallModules = isSidewall
            ? findHModuleCombination(remainder)
            : findSmallModuleCombination(remainder);
    }

    if (!smallModules && remainder > 0) {
        return null;
    }

    const middleModules: ModuleType[] = Array(maxM12Count).fill(ModuleType.M12);
    const tempConfig: ModuleType[] = smallModules && smallModules.length > 0
        ? isSidewall
            ? [smallModules[0], ...middleModules, smallModules[1]]
            : [smallModules[0], ...middleModules, ...smallModules.slice(1)]
        : [...middleModules];

    if (tempConfig.length === 0 && totalDoors === 0 && numM12Doors === 0 && windowPositionsCm.length === 0) {
        return null;
    }

    configuration = [...tempConfig];
    doorIndices = [];

    // Place non-M12 doors (M25, M30, M50)
    let allDoors: DoorData[] = [
        ...doorM25Positions.map((p, i) => ({ pos: Math.round(p.position * 100), module: ModuleType.M25, index: i, key: p.key })),
        ...doorM30Positions.map((p, i) => ({ pos: Math.round(p.position * 100), module: ModuleType.M30, index: i, key: p.key })),
        ...doorM50Positions.map((p, i) => ({ pos: Math.round(p.position * 100), module: ModuleType.M50, index: i, key: p.key })),
    ].sort((a, b) => a.pos - b.pos);

    if (totalDoors > 0) {
        if (tempConfig.length < totalDoors + (isSidewall ? 2 : 0)) {
            return null;
        }

        for (const door of allDoors) {
            const targetPosCm: number = door.pos;
            const doorModule: ModuleType = door.module;
            let minDiff: number = Infinity;
            let bestIndex: number = -1;
            let cumulativeLengthCm: number = 0;

            for (let j = 1; j < configuration.length - (isSidewall ? 1 : 0); j++) {
                const tempCumulative: number = cumulativeLengthCm;
                const doorMidpointCm: number = tempCumulative + moduleSizes[doorModule] / 2;
                const diff: number = Math.abs(doorMidpointCm - targetPosCm);

                if (diff < minDiff && !doorIndices.includes(j)) {
                    minDiff = diff;
                    bestIndex = j;
                }
                cumulativeLengthCm += modules[configuration[j - 1]] * 100;
            }

            if (bestIndex === -1) {
                return null;
            }

            configuration = [
                ...configuration.slice(0, bestIndex),
                doorModule,
                ...configuration.slice(bestIndex + 1),
            ];
            doorIndices.push(bestIndex);

            for (let k = 0; k < doorIndices.length - 1; k++) {
                if (doorIndices[k] >= bestIndex) {
                    doorIndices[k]++;
                }
            }
        }
    }

    // Place doorM12 and windows on M12 modules
    const numWindows: number = windowPositionsCm.length;
    if (numWindows + numM12Doors > 0 && configuration.filter(m => m === ModuleType.M12).length < numWindows + numM12Doors) {
        return null;
    }

    const m12Elements: { pos: number; type: 'window' | 'doorM12'; key: number; index: number }[] = [
        ...windowPositions.map((p, i) => ({ pos: Math.round(p.position * 100), type: 'window' as const, key: p.key, index: i })),
        ...doorM12Positions.map((p, i) => ({ pos: Math.round(p.position * 100), type: 'doorM12' as const, key: p.key, index: i })),
    ].sort((a, b) => a.pos - b.pos);

    windowIndices = [];
    allDoors = [...allDoors];
    if (m12Elements.length > 0) {
        for (const element of m12Elements) {
            const targetPosCm: number = element.pos;
            const m12Index: number = findClosestModuleIndex(
                configuration,
                targetPosCm,
                ModuleType.M12,
                0,
                configuration.length - 1,
                [...windowIndices, ...doorIndices]
            );

            if (m12Index === -1) {
                return null;
            }

            if (element.type === 'window') {
                windowIndices.push(m12Index);
            } else {
                doorIndices.push(m12Index);
                allDoors.push({
                    pos: element.pos,
                    module: ModuleType.M12,
                    index: element.index,
                    key: element.key,
                });
            }
        }
    }

    return { configuration, windowIndices, doorIndices, allDoors };
}

function findClosestModuleIndex(
    configuration: ModuleType[],
    targetPositionCm: number,
    targetModule: ModuleType,
    minIndex: number,
    maxIndex: number,
    excludeIndices: number[]
): number {
    let minDiff: number = Infinity;
    let closestIndex: number = -1;

    let cumulativeLengthCm: number = 0;
    for (let i = 0; i < configuration.length; i++) {
        if (
            configuration[i] === targetModule &&
            i >= minIndex &&
            i <= maxIndex &&
            !excludeIndices.includes(i)
        ) {
            const moduleStartCm: number = cumulativeLengthCm;
            const moduleEndCm: number = cumulativeLengthCm + modules[configuration[i]] * 100;
            const moduleMidpointCm: number = (moduleStartCm + moduleEndCm) / 2;

            const diff: number = Math.abs(moduleMidpointCm - targetPositionCm);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
            }
        }
        cumulativeLengthCm += modules[configuration[i]] * 100;
    }

    return closestIndex;
}

function findSmallModuleCombination(length: number): ModuleType[] | null {
    const moduleSizes: Partial<Record<ModuleType, number>> = {
        [ModuleType.M3]: 30,
        [ModuleType.M6]: 60,
        [ModuleType.M10]: 100,
        [ModuleType.M12]: 120,
    };

    const dp: (ModuleType[] | null)[] = Array(length + 1).fill(null);
    dp[0] = [];

    for (let i = 1; i <= length; i++) {
        for (const myModule of [ModuleType.M12, ModuleType.M10, ModuleType.M6, ModuleType.M3]) {
            const size: number = moduleSizes[myModule]!;
            if (i >= size && dp[i - size] !== null) {
                if (!dp[i] || dp[i]!.length > dp[i - size]!.length + 1) {
                    dp[i] = [...dp[i - size]!, myModule];
                }
            }
        }
    }

    const combination: ModuleType[] | null = dp[length];
    if (!combination) return null;

    // Replace sequential M6 modules with M12 where possible
    if (combination.length > 1) {
        const result: ModuleType[] = [];
        let i = 0;
        while (i < combination.length - 1) {
            if (
                combination[i] === ModuleType.M6 &&
                combination[i + 1] === ModuleType.M6 &&
                moduleSizes[ModuleType.M12] === moduleSizes[ModuleType.M6]! * 2
            ) {
                result.push(ModuleType.M12);
                i += 2;
            } else {
                result.push(combination[i]);
                i++;
            }
        }
        if (i < combination.length) {
            result.push(combination[i]);
        }
        return result;
    }

    return combination;
}

function findHModuleCombination(length: number): ModuleType[] | null {
    const moduleSizes: Partial<Record<ModuleType, number>> = {
        [ModuleType.H4V]: 40,
        [ModuleType.H4H]: 40,
        [ModuleType.H5V]: 50,
        [ModuleType.H5H]: 50,
        [ModuleType.H6V]: 60,
        [ModuleType.H6H]: 60,
        [ModuleType.H7V]: 70,
        [ModuleType.H7H]: 70,
    };

    const dp: (ModuleType[] | null)[] = Array(length + 1).fill(null);
    dp[0] = [];

    for (let i = 80; i <= length; i++) {
        for (const vModule of [ModuleType.H4V, ModuleType.H5V, ModuleType.H6V, ModuleType.H7V]) {
            for (const hModule of [ModuleType.H4H, ModuleType.H5H, ModuleType.H6H, ModuleType.H7H]) {
                const size: number = moduleSizes[vModule]! + moduleSizes[hModule]!;
                if (i >= size && dp[i - size] !== null) {
                    if (!dp[i] || dp[i]!.length > dp[i - size]!.length + 2) {
                        dp[i] = [vModule, ...dp[i - size]!, hModule];
                    }
                }
            }
        }
    }

    const combination: ModuleType[] | null = dp[length];
    if (!combination) return null;

    return combination;
}