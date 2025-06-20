'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SegmentSelector from '@/components/SegmentSelector';
import PerformanceCalculator from '@/components/PerformanceCalculator';
import { amazonDSPSegments } from '@/data/amazon-dsp-segments';
import { AmazonDSPSegment } from '@/types/amazon-dsp';
import { 
  Target, 
  BarChart3, 
  Shield, 
  Zap, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Users,
  DollarSign,
  TrendingUp
} from 'lucide-react';

export default function AmazonDSPKargoSelector() {
  const [selectedSegments, setSelectedSegments] = useState<AmazonDSPSegment[]>([]);
  const [activeTab, setActiveTab] = useState<'selector' | 'calculator'>('selector');

  const compatibleSegments = amazonDSPSegments.filter(s => s.kargoCompatible);
  const restrictedSegments = amazonDSPSegments.filter(s => !s.kargoCompatible);
  const selectedCompatibleCount = selectedSegments.filter(s => s.kargoCompatible).length;

  const handleSelectionChange = (segments: AmazonDSPSegment[]) => {
    setSelectedSegments(segments);
    if (segments.length > 0 && activeTab === 'selector') {
      // Auto-switch to calculator when segments are selected
      setTimeout(() => setActiveTab('calculator'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <span>Amazon DSP</span>
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                  <span className="text-blue-600">Kargo</span>
                </div>
              </h1>
              <p className="text-gray-600 mt-1">
                Pre-sales vetting tool for Amazon DSP audience segment activation on Kargo&apos;s premium publisher inventory
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                Live Tool
              </Badge>
              <Badge variant="outline" className="text-gray-600">
                v1.0
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Available</span>
              </div>
              <div className="text-2xl font-bold text-green-600 mt-1">{compatibleSegments.length}</div>
              <div className="text-xs text-green-700">Segments on Kargo</div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-800">Restricted</span>
              </div>
              <div className="text-2xl font-bold text-red-600 mt-1">{restrictedSegments.length}</div>
              <div className="text-xs text-red-700">Amazon O&O Only</div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Selected</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{selectedCompatibleCount}</div>
              <div className="text-xs text-blue-700">For Activation</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Avg Match</span>
              </div>
              <div className="text-2xl font-bold text-purple-600 mt-1">
                {compatibleSegments.length > 0 ? 
                  Math.round(compatibleSegments.reduce((sum, s) => 
                    sum + (s.matchRateRange[0] + s.matchRateRange[1])/2, 0) / compatibleSegments.length) : 0}%
              </div>
              <div className="text-xs text-purple-700">Expected Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="flex">
            <button
              onClick={() => setActiveTab('selector')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors border-b-2 ${
                activeTab === 'selector'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Segment Selector</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors border-b-2 ${
                activeTab === 'calculator'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Performance Calculator</span>
                {selectedCompatibleCount > 0 && (
                  <Badge className="bg-blue-600 text-white text-xs">
                    {selectedCompatibleCount}
                  </Badge>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {activeTab === 'selector' && (
          <div className="space-y-6">
            <SegmentSelector 
              segments={amazonDSPSegments} 
              onSelectionChange={handleSelectionChange}
            />
            
            {/* Value Proposition Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-800 flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Pre-Sales Intelligence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 text-sm">
                    Clear documentation of what Amazon DSP segments CAN and CANNOT be activated on Kargo inventory, 
                    eliminating last-minute campaign surprises.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-800 flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Technical Validation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 text-sm">
                    Real-time validation of segment compatibility with Kargo&apos;s ad-tag architecture, 
                    including match rate expectations and technical limitations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-800 flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Performance Estimation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 text-sm">
                    Cost projections and performance estimates for different segment types, 
                    with clear ROI expectations and budget allocation guidance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <PerformanceCalculator selectedSegments={selectedSegments} />
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Amazon DSP → Kargo Segment Vetting Tool</p>
              <p>Built for pre-sales intelligence and campaign optimization</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-300">
                85% Working Media Efficiency
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                Premium Publisher Inventory
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
