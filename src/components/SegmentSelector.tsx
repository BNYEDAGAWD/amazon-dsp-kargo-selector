'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, AlertTriangle, Search, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { AmazonDSPSegment } from '@/types/amazon-dsp';

interface SegmentSelectorProps {
  segments: AmazonDSPSegment[];
  onSelectionChange: (selectedSegments: AmazonDSPSegment[]) => void;
}

export default function SegmentSelector({ segments, onSelectionChange }: SegmentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [compatibilityFilter, setCompatibilityFilter] = useState('all');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const filteredSegments = useMemo(() => {
    return segments.filter(segment => {
      const matchesSearch = segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          segment.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || segment.category === categoryFilter;
      const matchesCompatibility = compatibilityFilter === 'all' || 
                                 (compatibilityFilter === 'compatible' && segment.kargoCompatible) ||
                                 (compatibilityFilter === 'incompatible' && !segment.kargoCompatible);
      
      return matchesSearch && matchesCategory && matchesCompatibility;
    });
  }, [segments, searchTerm, categoryFilter, compatibilityFilter]);

  const handleSegmentToggle = (segmentId: string) => {
    const newSelection = selectedSegments.includes(segmentId)
      ? selectedSegments.filter(id => id !== segmentId)
      : [...selectedSegments, segmentId];
    
    setSelectedSegments(newSelection);
    const selectedSegmentObjects = segments.filter(s => newSelection.includes(s.id));
    onSelectionChange(selectedSegmentObjects);
  };

  const getCompatibilityIcon = (segment: AmazonDSPSegment) => {
    if (segment.kargoCompatible) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getActivationBadge = (path: string) => {
    switch (path) {
      case 'direct':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Direct</Badge>;
      case 'programmatic':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Programmatic</Badge>;
      case 'unavailable':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Unavailable</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'retail-graph': 'bg-purple-100 text-purple-800 border-purple-300',
      'in-market': 'bg-orange-100 text-orange-800 border-orange-300',
      'lifestyle': 'bg-cyan-100 text-cyan-800 border-cyan-300',
      'demographic': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'custom': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'restricted': 'bg-red-100 text-red-800 border-red-300'
    };
    
    return (
      <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300'}>
        {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const compatibleSegments = filteredSegments.filter(s => s.kargoCompatible);
  const restrictedSegments = filteredSegments.filter(s => !s.kargoCompatible);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-6 w-6" />
            <span>Amazon DSP Segment Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search segments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="retail-graph">Retail Graph</SelectItem>
                <SelectItem value="in-market">In-Market</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="demographic">Demographic</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={compatibilityFilter} onValueChange={setCompatibilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Kargo Compatibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="compatible">Kargo Compatible</SelectItem>
                <SelectItem value="incompatible">Not Compatible</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <span className="font-medium">{filteredSegments.length}</span>
              <span className="ml-1">segments found</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{compatibleSegments.length}</div>
              <div className="text-xs text-gray-600">Available on Kargo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{restrictedSegments.length}</div>
              <div className="text-xs text-gray-600">Restricted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedSegments.length}</div>
              <div className="text-xs text-gray-600">Selected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {compatibleSegments.length > 0 ? 
                  Math.round(compatibleSegments.reduce((sum, s) => sum + (s.matchRateRange[0] + s.matchRateRange[1])/2, 0) / compatibleSegments.length) : 0}%
              </div>
              <div className="text-xs text-gray-600">Avg Match Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compatible Segments */}
      {compatibleSegments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Available on Kargo Inventory ({compatibleSegments.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compatibleSegments.map((segment) => (
              <Card 
                key={segment.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
                  selectedSegments.includes(segment.id) 
                    ? 'ring-2 ring-blue-500 border-l-blue-500 bg-blue-50' 
                    : 'border-l-green-500 hover:border-l-green-600'
                }`}
                onClick={() => handleSegmentToggle(segment.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getCompatibilityIcon(segment)}
                        <h3 className="font-semibold text-sm">{segment.name}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{segment.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {getActivationBadge(segment.activationPath)}
                        {getCategoryBadge(segment.category)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Match Rate:
                      </span>
                      <span className="font-medium text-green-600">
                        {segment.matchRateRange[0]}%-{segment.matchRateRange[1]}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Est. CPM:
                      </span>
                      <span className="font-medium">${segment.estimatedCPM.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Setup:
                      </span>
                      <span className="font-medium">
                        {segment.setupTime} week{segment.setupTime !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Min. Audience:</span>
                      <span className="font-medium">
                        {(segment.minimumAudienceSize / 1000).toFixed(0)}K
                      </span>
                    </div>
                    
                    {segment.additionalCosts > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Premium:</span>
                        <span className="font-medium text-orange-600">+{segment.additionalCosts}%</span>
                      </div>
                    )}
                  </div>

                  {/* Device Compatibility */}
                  <div className="mt-3 pt-2 border-t">
                    <div className="text-xs text-gray-600 mb-1">Device Support:</div>
                    <div className="flex space-x-1">
                      {segment.deviceCompatibility.desktop && 
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">Desktop</Badge>}
                      {segment.deviceCompatibility.mobile && 
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">Mobile</Badge>}
                      {segment.deviceCompatibility.tablet && 
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">Tablet</Badge>}
                      {segment.deviceCompatibility.ctv && 
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">CTV</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Restricted Segments */}
      {restrictedSegments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-700 flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            Restricted - Amazon O&O Only ({restrictedSegments.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restrictedSegments.map((segment) => (
              <Card 
                key={segment.id} 
                className="opacity-75 border-l-4 border-l-red-500 bg-red-50"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getCompatibilityIcon(segment)}
                        <h3 className="font-semibold text-sm text-red-800">{segment.name}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{segment.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {getActivationBadge(segment.activationPath)}
                        {getCategoryBadge(segment.category)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 text-red-600 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-xs font-medium">Not available on Kargo inventory</span>
                    </div>
                    {segment.technicalLimitations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Limitations:</p>
                        <ul className="text-xs text-red-700 space-y-1">
                          {segment.technicalLimitations.map((limitation, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-1">•</span>
                              <span>{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {selectedSegments.length > 0 && (
        <Card className="border-2 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">
                  {selectedSegments.length} segments selected for Kargo activation
                </span>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Generate Activation Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}