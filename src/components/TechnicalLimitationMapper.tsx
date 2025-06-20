'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AmazonDSPSegment } from '@/types/amazon-dsp';
import { 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Shield, 
  Zap,
  Database,
  Settings,
  Globe
} from 'lucide-react';

interface TechnicalLimitationMapperProps {
  segments: AmazonDSPSegment[];
}

export default function TechnicalLimitationMapper({ segments }: TechnicalLimitationMapperProps) {
  const restrictedSegments = segments.filter(s => !s.kargoCompatible);
  const compatibleWithLimitations = segments.filter(s => s.kargoCompatible && s.technicalLimitations.length > 0);

  const limitationCategories = {
    'Data Privacy': {
      icon: Shield,
      color: 'red',
      keywords: ['privacy', 'restriction', 'protected', 'voice', 'device data', 'membership'],
      description: 'Segments restricted due to data privacy regulations and Amazon\'s data protection policies'
    },
    'Platform Restrictions': {
      icon: Settings,
      color: 'orange',
      keywords: ['O&O', 'Amazon', 'platform', 'ecosystem', 'licensing'],
      description: 'Segments available only on Amazon\'s owned and operated inventory'
    },
    'Technical Implementation': {
      icon: Zap,
      color: 'yellow',
      keywords: ['pixel', 'attribution', 'measurement', 'frequency', 'implementation'],
      description: 'Segments requiring specific technical setup or measurement considerations'
    },
    'Business Requirements': {
      icon: Database,
      color: 'blue',
      keywords: ['premium', 'minimum', 'approval', 'verification', 'onboarding'],
      description: 'Segments with specific business or approval requirements for activation'
    }
  };

  const categorizeLimitation = (limitation: string) => {
    for (const [category, config] of Object.entries(limitationCategories)) {
      if (config.keywords.some(keyword => limitation.toLowerCase().includes(keyword))) {
        return { category, ...config };
      }
    }
    return { category: 'Other', icon: AlertTriangle, color: 'gray', description: 'Other technical considerations' };
  };

  const getRestrictionReason = (segment: AmazonDSPSegment) => {
    if (segment.id.includes('prime-membership') || segment.id.includes('prime-video')) {
      return 'Prime Ecosystem Protection';
    }
    if (segment.id.includes('alexa') || segment.id.includes('voice')) {
      return 'Voice Data Privacy';
    }
    if (segment.id.includes('device') || segment.id.includes('usage-patterns')) {
      return 'Device Data Restrictions';
    }
    if (segment.id.includes('business')) {
      return 'B2B Platform Separation';
    }
    return 'Data Licensing Limitations';
  };

  const getSolutionRecommendation = (segment: AmazonDSPSegment) => {
    if (segment.id.includes('prime-video')) {
      return 'Consider CTV advertising on Amazon DSP with Prime Video content targeting';
    }
    if (segment.id.includes('prime-membership')) {
      return 'Use Amazon retail behavioral segments as proxy for Prime users';
    }
    if (segment.id.includes('alexa')) {
      return 'Target smart home enthusiasts or tech early adopters instead';
    }
    if (segment.id.includes('business')) {
      return 'Use professional demographic segments or LinkedIn integration';
    }
    return 'Explore similar third-party segments available on Kargo inventory';
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <span>Technical Limitation Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Completely Restricted</h4>
              <div className="text-2xl font-bold text-red-600">{restrictedSegments.length}</div>
              <p className="text-sm text-red-700">Amazon O&O inventory only</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Available with Limitations</h4>
              <div className="text-2xl font-bold text-yellow-600">{compatibleWithLimitations.length}</div>
              <p className="text-sm text-yellow-700">Require special consideration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restriction Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(limitationCategories).map(([category, config]) => {
          const Icon = config.icon;
          const relevantSegments = [...restrictedSegments, ...compatibleWithLimitations].filter(segment =>
            segment.technicalLimitations.some(limitation =>
              config.keywords.some(keyword => limitation.toLowerCase().includes(keyword))
            )
          );

          if (relevantSegments.length === 0) return null;

          return (
            <Card key={category} className={`border-${config.color}-200`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-${config.color}-800 flex items-center space-x-2`}>
                  <Icon className="h-5 w-5" />
                  <span>{category}</span>
                </CardTitle>
                <p className={`text-sm text-${config.color}-700`}>{config.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relevantSegments.slice(0, 3).map(segment => (
                    <div key={segment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{segment.name}</span>
                        <Badge variant={segment.kargoCompatible ? 'outline' : 'destructive'} className="text-xs">
                          {segment.kargoCompatible ? 'Limited' : 'Blocked'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        {segment.technicalLimitations
                          .filter(limitation => 
                            config.keywords.some(keyword => limitation.toLowerCase().includes(keyword))
                          )
                          .slice(0, 2)
                          .map((limitation, index) => (
                            <div key={index} className="flex items-start">
                              <span className="mr-1">•</span>
                              <span>{limitation}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))}
                  {relevantSegments.length > 3 && (
                    <div className="text-center text-sm text-gray-500">
                      +{relevantSegments.length - 3} more segments
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Restriction Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <XCircle className="h-6 w-6 text-red-600" />
            <span>Restricted Segments - Detailed Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {restrictedSegments.map(segment => (
              <div key={segment.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-red-800">{segment.name}</h4>
                  <Badge className="bg-red-600 text-white">
                    {getRestrictionReason(segment)}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{segment.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-red-800 mb-2 text-sm">Why It&apos;s Restricted:</h5>
                    <ul className="text-sm text-red-700 space-y-1">
                      {segment.technicalLimitations.map((limitation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2 text-sm">Alternative Solution:</h5>
                    <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                      {getSolutionRecommendation(segment)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-blue-600" />
            <span>Kargo Activation Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-3">Recommended Approach:</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Focus on retail graph and in-market segments for highest match rates</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Use programmatic activation path for faster setup</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Combine multiple compatible segments for broader reach</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Plan for 1-3 week setup time for custom segments</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-800 mb-3">Common Pitfalls to Avoid:</h4>
              <ul className="space-y-2 text-sm text-red-700">
                <li className="flex items-start">
                  <span className="mr-2">✗</span>
                  <span>Don&apos;t assume Prime membership segments are available</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✗</span>
                  <span>Avoid relying on device-specific targeting outside Amazon</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✗</span>
                  <span>Don&apos;t expect exact match rates without testing</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✗</span>
                  <span>Avoid last-minute segment changes during trafficking</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}