/**
 * Interactive 3D Data Visualizer for Akhil Shibu Portfolio
 * Written in TypeScript for High-Performance Light-Mode Three.js Rendering
 */
import { VisualizerMode } from './types.js';
export declare class DataVisualizer3D {
    private container;
    private scene;
    private camera;
    private renderer;
    private animFrameId;
    private currentMode;
    private groupBars;
    private groupTerrain;
    private groupNetwork;
    private gridHelper;
    private raycaster;
    private mouse;
    private isDragging;
    private prevMouseX;
    private prevMouseY;
    private rotSpeedX;
    private rotSpeedY;
    private targetRotationY;
    private targetRotationX;
    private currentRotationY;
    private currentRotationX;
    private barsData;
    private barMeshes;
    private tooltipEl;
    constructor(containerId: string);
    private init;
    private buildBarsMode;
    private buildTerrainMode;
    private buildNetworkMode;
    setMode(mode: VisualizerMode): void;
    private setupEventListeners;
    private onResize;
    private animate;
    private getCurrentGroup;
    private handleBarHover;
    destroy(): void;
}
