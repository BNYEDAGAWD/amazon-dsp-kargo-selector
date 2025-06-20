export interface AmazonDSPSegment {
  id: string;
  name: string;
  category: 'retail-graph' | 'in-market' | 'lifestyle' | 'demographic' | 'custom' | 'restricted';
  description: string;
  kargoCompatible: boolean;
  matchRateRange: [number, number]; // [min, max] percentage
  estimatedCPM: number;
  technicalLimitations: string[];
  activationPath: 'direct' | 'programmatic' | 'unavailable';
  dataSource: 'amazon-first-party' | 'third-party' | 'hybrid';
  minimumAudienceSize: number;
  geoRestrictions?: string[];
  deviceCompatibility: {
    desktop: boolean;
    mobile: boolean;
    tablet: boolean;
    ctv: boolean;
  };
  setupTime: number; // in weeks
  additionalCosts: number; // percentage premium
  viewabilityRate: number; // percentage
}

export interface KargoActivationDetails {
  canActivate: boolean;
  reason?: string;
  setupTime: number; // weeks
  additionalCosts: number; // percentage
  performanceExpectation: {
    matchRate: number;
    cpmPremium: number;
    viewability: number;
  };
}

export interface SegmentFilters {
  searchTerm: string;
  category: string;
  compatibility: string;
  minMatchRate: number;
  maxCPM: number;
}

export interface PerformanceProjection {
  totalAudience: number;
  averageMatchRate: number;
  averageCPM: number;
  estimatedImpressions: number;
  workingMediaPercentage: number;
  projectedReach: number;
  totalSetupTime: number;
}