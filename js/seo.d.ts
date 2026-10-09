/**
 * Pure TypeScript SEO, GEO & AEO Telemetry Engine
 * Author: Akhil Shibu Portfolio Architecture
 * Functionality:
 *  - Dynamic JSON-LD Entity Graph Enrichment (Schema.org / Wikidata)
 *  - Geographic Engine Optimization (GEO) Local Presence Telemetry
 *  - Answer Engine Optimization (AEO) Copy Citation & Speakable Text
 *  - Core Web Vitals (CWV) Real User Monitoring & CLS Prevention
 *  - Smart Prefetching for Sub-50ms Navigation
 */
import { CoreWebVitalsMetric } from './types.js';
export declare class SeoEngine {
    private readonly domain;
    private metrics;
    constructor();
    /**
     * Monitor Core Web Vitals to guarantee search engine ranking signals (Good thresholds)
     */
    private initCoreWebVitals;
    private recordMetric;
    /**
     * Answer Engine Optimization (AEO) Copy Citation:
     * When recruiters, researchers, or LLM scrapers copy excerpted text,
     * attach clean semantic attribution to build external domain citation authority.
     */
    private initAeoCitationHandler;
    /**
     * Smart Instant-Prefetch:
     * Pre-warms DNS and caches for hovered links and sections to ensure zero-lag transitions
     */
    private initInstantPrefetch;
    /**
     * Schema.org Entity Graph Runtime Validation & Semantic Enrichment
     */
    private validateAndEnrichSchema;
    /**
     * Heading Hierarchy & Accessibility Auditor
     * Ensures strict semantic hierarchy (single H1, structured H2s/H3s) for search engine crawler grading
     */
    private initHeadingAuditor;
    /**
     * Expose collected Core Web Vitals for debugging or telemetry
     */
    getPerformanceReport(): ReadonlyArray<CoreWebVitalsMetric>;
}
