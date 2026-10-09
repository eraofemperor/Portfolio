/**
 * Portfolio Data Models and Type Definitions
 * Supporting Advanced SEO, GEO, AEO, Performance Telemetry, and Interactive 3D Visualizer
 * Production Environment: Pure TypeScript (ES2022)
 */
export interface GeoLocation {
    region: string;
    country: string;
    placename: string;
    latitude: number;
    longitude: number;
    hubs: string[];
}
export interface AccreditedCourse {
    title: string;
    provider: string;
    platform: string;
    credentialUrl?: string;
    skills: string[];
    courseCode?: string;
    description: string;
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
    metrics: Record<string, string>;
}
export interface TechnicalSkillEntity {
    name: string;
    category: string;
    proficiency: 'Expert' | 'Advanced' | 'Proficient';
    wikidataUrl?: string;
    wikipediaUrl?: string;
}
export interface FaqEntry {
    question: string;
    answer: string;
    keywords: string[];
    speakable: boolean;
}
export interface BreadcrumbItem {
    name: string;
    url: string;
    position: number;
}
export interface CoreWebVitalsMetric {
    name: 'CLS' | 'LCP' | 'FID' | 'INP' | 'TTFB';
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
}
export type VisualizerMode = 'bars' | 'terrain' | 'network';
export interface DataBarMeta {
    label: string;
    metric: string;
    value: number;
}
