/**
 * Portfolio Data Models and Type Definitions
 * Supporting SEO, GEO, AEO, and Interactive 3D Telemetry
 */
export interface GeoLocation {
    region: string;
    country: string;
    placename: string;
    latitude: number;
    longitude: number;
}
export interface AccreditedCourse {
    title: string;
    provider: string;
    platform: string;
    credentialUrl?: string;
    skills: string[];
}
export interface PortfolioProject {
    id: string;
    title: string;
    category: string;
    status: string;
    problem: string;
    methodology: string;
    findings: string;
    tools: string[];
    githubUrl: string;
    demoUrl?: string;
}
export type VisualizerMode = 'bars' | 'terrain' | 'network';
export interface DataBarMeta {
    label: string;
    metric: string;
    value: number;
}
