'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AmazonDSPSegment } from '@/types/amazon-dsp';
import { TrendingUp, DollarSign, Clock, Users, Target, Zap } from 'lucide-react';

interface PerformanceCalculatorProps {
  selectedSegments: AmazonDSPSegment[];
}

export default function PerformanceCalculator({ selectedSegments }: PerformanceCalculatorProps) {
  const [totalBudget, setTotalBudget] = useState(100000);

  const calculations = useMemo(() => {
    const compatibleSegments = selectedSegments.filter(s => s.kargoCompatible);
    
    if (compatibleSegments.length === 0) {
      return {
        totalAudience: 0,
        averageMatchRate: 0,
        averageCPM: 0,
        estimatedImpressions: 0,
        workingMediaPercentage: 85,
        projectedReach: 0,
        totalSetupTime: 0,
        averageViewability: 0,
        costPremium: 0
      };
    }
    
    const totalAudience = compatibleSegments.reduce((sum, segment) => sum + segment.minimumAudienceSize, 0);
    const averageMatchRate = compatibleSegments.reduce((sum, segment) => 
      sum + ((segment.matchRateRange[0] + segment.matchRateRange[1]) / 2), 0) / compatibleSegments.length;
    const averageCPM = compatibleSegments.reduce((sum, segment) => sum + segment.estimatedCPM, 0) / compatibleSegments.length;
    const averageViewability = compatibleSegments.reduce((sum, segment) => sum + segment.viewabilityRate, 0) / compatibleSegments.length;
    const costPremium = compatibleSegments.reduce((sum, segment) => sum + segment.additionalCosts, 0) / compatibleSegments.length;
    
    const workingMediaAmount = totalBudget * 0.85; // 85% reaches publishers (upstream advantage)
    const estimatedImpressions = (workingMediaAmount / averageCPM) * 1000;
    const projectedReach = (totalAudience * averageMatchRate) / 100;
    const totalSetupTime = Math.max(...compatibleSegments.map(s => s.setupTime));
    
    return {
      totalAudience,
      averageMatchRate,
      averageCPM,
      estimatedImpressions,
      workingMediaPercentage: 85,
      projectedReach,
      totalSetupTime,
      averageViewability,
      costPremium
    };
  }, [selectedSegments, totalBudget]);

  const comparisonData = [
    {
      platform: 'Kargo + Amazon DSP',
      workingMedia: 85,
      matchRate: calculations.averageMatchRate,
      cpm: calculations.averageCPM,
      viewability: calculations.averageViewability
    },
    {
      platform: 'Standard DSP Path',
      workingMedia: 65,
      matchRate: calculations.averageMatchRate * 0.6, // 40% degradation
      cpm: calculations.averageCPM * 1.2, // 20% premium
      viewability: calculations.averageViewability * 0.8 // 20% lower viewability
    }
  ];

  const segmentBreakdown = selectedSegments
    .filter(s => s.kargoCompatible)
    .map(segment => ({
      name: segment.name,
      audience: segment.minimumAudienceSize,
      matchRate: (segment.matchRateRange[0] + segment.matchRateRange[1]) / 2,
      cpm: segment.estimatedCPM,
      category: segment.category
    }));

  const categoryColors = {
    'retail-graph': '#8B5CF6',
    'in-market': '#F97316',
    'lifestyle': '#06B6D4',
    'demographic': '#6366F1',
    'custom': '#EAB308',
    'restricted': '#EF4444'
  };

  const categoryData = selectedSegments
    .filter(s => s.kargoCompatible)
    .reduce((acc, segment) => {
      const existing = acc.find(item => item.category === segment.category);
      if (existing) {
        existing.count += 1;
        existing.audience += segment.minimumAudienceSize;
      } else {
        acc.push({
          category: segment.category,
          count: 1,
          audience: segment.minimumAudienceSize,
          color: categoryColors[segment.category as keyof typeof categoryColors]
        });
      }
      return acc;
    }, [] as any[]);

  if (selectedSegments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Segments Selected</h3>
          <p className="text-gray-500">Select Amazon DSP segments to see performance projections and cost analysis.</p>
        </CardContent>
      </Card>
    );
  }

  const compatibleCount = selectedSegments.filter(s => s.kargoCompatible).length;
  if (compatibleCount === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">No Compatible Segments</h3>
          <p className="text-gray-500">The selected segments are not available on Kargo inventory. Please select compatible segments for activation.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Budget Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6" />
            <span>Campaign Budget</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Total Budget:</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="pl-10 w-40"
                min="1000"
                step="1000"
              />
            </div>
            <Button size="sm" onClick={() => setTotalBudget(100000)}>Reset</Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-6 w-6" />
            <span>Amazon DSP + Kargo Performance Projection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {(calculations.totalAudience / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">Total Audience</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {calculations.averageMatchRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Avg Match Rate</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <DollarSign className="h-6 w-6 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                ${calculations.averageCPM.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Avg CPM</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Target className="h-6 w-6 mx-auto text-orange-600 mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {(calculations.estimatedImpressions / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">Est. Impressions</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Working Media Efficiency</span>
                <span className="text-sm text-green-600 font-medium">
                  {calculations.workingMediaPercentage}%
                </span>
              </div>
              <Progress value={calculations.workingMediaPercentage} className="h-3" />
              <p className="text-xs text-gray-600">
                ${(totalBudget * 0.85).toLocaleString()} reaches publishers
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Viewability</span>
                <span className="text-sm text-blue-600 font-medium">
                  {calculations.averageViewability.toFixed(1)}%
                </span>
              </div>
              <Progress value={calculations.averageViewability} className="h-3" />
              <p className="text-xs text-gray-600">Premium inventory quality</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Setup Timeline</span>
                <span className="text-sm text-purple-600 font-medium">
                  {calculations.totalSetupTime} week{calculations.totalSetupTime !== 1 ? 's' : ''}
                </span>
              </div>
              <Progress value={(calculations.totalSetupTime / 4) * 100} className="h-3" />
              <p className="text-xs text-gray-600">Time to campaign launch</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kargo vs Standard DSP Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Kargo vs Standard DSP Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${Number(value).toFixed(1)}${name.includes('Rate') || name.includes('Media') || name.includes('viewability') ? '%' : name.includes('cpm') ? '' : ''}`,
                  name === 'workingMedia' ? 'Working Media %' :
                  name === 'matchRate' ? 'Match Rate %' :
                  name === 'cpm' ? 'CPM ($)' :
                  name === 'viewability' ? 'Viewability %' : name
                ]}
              />
              <Bar dataKey="workingMedia" fill="#3B82F6" name="Working Media %" />
              <Bar dataKey="matchRate" fill="#10B981" name="Match Rate %" />
              <Bar dataKey="viewability" fill="#8B5CF6" name="Viewability %" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Kargo Advantage Summary:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 20% higher working media efficiency (85% vs 65%)</li>
              <li>• {((calculations.averageMatchRate - calculations.averageMatchRate * 0.6) / (calculations.averageMatchRate * 0.6) * 100).toFixed(0)}% better match rates on premium inventory</li>
              <li>• {((calculations.averageViewability - calculations.averageViewability * 0.8) / (calculations.averageViewability * 0.8) * 100).toFixed(0)}% higher viewability rates</li>
              <li>• Direct publisher relationships reduce intermediary costs</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Segment Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, count }) => `${category.replace('-', ' ')}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selected Segments Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedSegments.filter(s => s.kargoCompatible).slice(0, 6).map((segment) => (
                  <div key={segment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{segment.name}</div>
                      <div className="text-xs text-gray-600">
                        {((segment.matchRateRange[0] + segment.matchRateRange[1]) / 2).toFixed(0)}% match • 
                        ${segment.estimatedCPM.toFixed(2)} CPM
                      </div>
                    </div>
                    <Badge 
                      className={`text-xs ${
                        segment.category === 'retail-graph' ? 'bg-purple-100 text-purple-800' :
                        segment.category === 'in-market' ? 'bg-orange-100 text-orange-800' :
                        segment.category === 'lifestyle' ? 'bg-cyan-100 text-cyan-800' :
                        segment.category === 'demographic' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {segment.category.replace('-', ' ')}
                    </Badge>
                  </div>
                ))}
                {selectedSegments.filter(s => s.kargoCompatible).length > 6 && (
                  <div className="text-center text-sm text-gray-500">
                    +{selectedSegments.filter(s => s.kargoCompatible).length - 6} more segments
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6" />
            <span>Cost Analysis & Budget Allocation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Media Cost</h4>
              <div className="text-2xl font-bold text-blue-600">
                ${(totalBudget * 0.85).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">85% working media</div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Platform Fees</h4>
              <div className="text-2xl font-bold text-orange-600">
                ${(totalBudget * 0.12).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">12% DSP + tech fees</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Management</h4>
              <div className="text-2xl font-bold text-green-600">
                ${(totalBudget * 0.03).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">3% account management</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Campaign Investment:</span>
              <span className="text-xl font-bold">${totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Expected Impressions:</span>
              <span className="font-medium">{(calculations.estimatedImpressions / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Projected Reach:</span>
              <span className="font-medium">{(calculations.projectedReach / 1000000).toFixed(1)}M unique users</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}