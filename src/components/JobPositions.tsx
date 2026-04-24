import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  MapPin,
  Briefcase,
  ArrowLeft,
  Building2,
  Clock,
  Calendar,
  X,
  Search,
  Bookmark,
} from "lucide-react";
import { useState } from "react";

interface PositionData {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  category: string;
  deadline: string;
  postedDate: string;
  description: string;
}

interface JobPositionsProps {
  onBack?: () => void;
  onApply?: (position: PositionData) => void;
  onSaveJob?: (job: any) => void;
  savedJobIds?: number[];
}

export function JobPositions({ onBack, onApply, onSaveJob, savedJobIds }: JobPositionsProps) {
  const [selectedPosition, setSelectedPosition] = useState<PositionData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const positions: PositionData[] = [
    {
      id: 1,
      title: "Construction Worker",
      department: "Construction & Development",
      location: "Dubai, UAE",
      type: "Full-time",
      category: "Construction",
      deadline: "May 15, 2026",
      postedDate: "March 1, 2026",
      description: "We are seeking experienced construction workers for our major development projects in Dubai. Candidates will be responsible for various construction tasks including site preparation, material handling, and assisting skilled tradespeople. This is an excellent opportunity to work on prestigious projects with competitive compensation and benefits package.",
    },
    {
      id: 2,
      title: "Registered Nurse",
      department: "Healthcare",
      location: "Riyadh, Saudi Arabia",
      type: "Full-time",
      category: "Healthcare",
      deadline: "April 30, 2026",
      postedDate: "February 15, 2026",
      description: "Join our world-class healthcare facility in Riyadh as a Registered Nurse. You will provide high-quality patient care, work collaboratively with medical teams, and maintain patient records. We offer excellent career development opportunities, competitive salary, and comprehensive benefits including housing allowance and annual flights.",
    },
    {
      id: 3,
      title: "Hotel Staff",
      department: "Hospitality",
      location: "Doha, Qatar",
      type: "Full-time",
      category: "Hospitality",
      deadline: "June 1, 2026",
      postedDate: "March 10, 2026",
      description: "Premium hotel in Doha is looking for dedicated hotel staff members. Responsibilities include guest services, housekeeping coordination, and maintaining hotel standards. We provide comprehensive training, competitive salary, accommodation, and meals. Great opportunity for hospitality professionals looking to advance their careers.",
    },
    {
      id: 4,
      title: "Mechanical Engineer",
      department: "Engineering",
      location: "Abu Dhabi, UAE",
      type: "Full-time",
      category: "Engineering",
      deadline: "April 20, 2026",
      postedDate: "February 1, 2026",
      description: "Leading engineering firm seeks experienced Mechanical Engineers for oil and gas projects in Abu Dhabi. You will be involved in design, analysis, and implementation of mechanical systems. Excellent package including tax-free salary, housing, transportation, and family benefits for qualified candidates.",
    },
    {
      id: 5,
      title: "Executive Chef",
      department: "Culinary",
      location: "Singapore",
      type: "Contract",
      category: "Culinary",
      deadline: "May 30, 2026",
      postedDate: "March 5, 2026",
      description: "Luxury hotel seeking talented Executive Chef to lead our culinary team. You will oversee all kitchen operations, menu development, and maintain highest food quality standards. This contract position offers excellent compensation, creative freedom, and the opportunity to work in Singapore's vibrant culinary scene.",
    },
    {
      id: 6,
      title: "Electrician",
      department: "Maintenance",
      location: "Kuwait City, Kuwait",
      type: "Full-time",
      category: "Maintenance",
      deadline: "May 10, 2026",
      postedDate: "February 28, 2026",
      description: "Industrial facility requires skilled electricians for maintenance and installation work. Candidates will perform electrical repairs, installations, and preventive maintenance. Competitive salary package with overtime opportunities, accommodation, transportation, and comprehensive insurance coverage provided.",
    },
  ];

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(positions.map(p => p.category)))];

  // Filter positions based on search and category
  const filteredPositions = positions.filter(position => {
    const matchesSearch = searchQuery === '' ||
      position.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || position.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#17960b] hover:text-[#148509] font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Available Job Positions
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Browse all open positions and apply directly to opportunities that match your skills.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by job title, department, or location..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Filter by Category:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#17960b] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              {(searchQuery || selectedCategory !== 'all') && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Found <span className="font-semibold text-gray-900">{filteredPositions.length}</span> {filteredPositions.length === 1 ? 'position' : 'positions'}
                    {searchQuery && ` matching "${searchQuery}"`}
                    {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Position Cards Grid */}
        {filteredPositions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPositions.map((position) => (
            <Card
              key={position.id}
              className="border-gray-200 hover:shadow-lg transition-all bg-white"
            >
              <CardContent className="p-6">
                {/* Job Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {position.title}
                </h3>
                <p className="text-gray-600 mb-4 font-medium">
                  {position.department}
                </p>

                {/* Job Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{position.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{position.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">Category: {position.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Deadline: {position.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Posted: {position.postedDate}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="flex-1 bg-[#ffca1a] hover:bg-[#e6b617] text-gray-900 font-semibold"
                    onClick={() => setSelectedPosition(position)}
                  >
                    View Full Details
                  </Button>
                  <Button
                    className="flex-1 bg-[#17960b] hover:bg-[#17960b]/90 text-white font-semibold"
                    onClick={() => onApply?.(position)}
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        ) : (
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Positions Found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? "We couldn't find any positions matching your search criteria. Try adjusting your filters or search terms."
                  : 'There are currently no job positions available. Please check back later.'}
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="bg-[#17960b] hover:bg-[#17960b]/90 text-white"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Full Details Modal */}
      {selectedPosition && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setSelectedPosition(null)}
          ></div>

          {/* Modal Content */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8">
              {/* Close Button */}
              <button
                onClick={() => setSelectedPosition(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {selectedPosition.title}
                </h2>
                <p className="text-lg text-gray-600 font-medium mb-4">
                  {selectedPosition.department}
                </p>

                {/* Position Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-[#17960b]" />
                    <span className="text-sm font-medium">{selectedPosition.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase className="w-5 h-5 text-[#17960b]" />
                    <span className="text-sm font-medium">{selectedPosition.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building2 className="w-5 h-5 text-[#17960b]" />
                    <span className="text-sm font-medium">Category: {selectedPosition.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-[#17960b]" />
                    <span className="text-sm font-medium">Deadline: {selectedPosition.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-[#17960b]" />
                    <span className="text-sm font-medium">Posted: {selectedPosition.postedDate}</span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Job Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedPosition.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300"
                  onClick={() => {
                    if (selectedPosition) {
                      onSaveJob?.({
                        id: selectedPosition.id.toString(),
                        title: selectedPosition.title,
                        company: selectedPosition.department,
                        location: selectedPosition.location,
                        salary: 'Competitive',
                        vacancies: '1',
                        posted: selectedPosition.postedDate,
                        savedDate: new Date(),
                      });
                    }
                  }}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {savedJobIds?.includes(selectedPosition.id) ? "Saved" : "Save Job"}
                </Button>
                <Button
                  className="flex-1 bg-[#17960b] hover:bg-[#17960b]/90 text-white font-semibold"
                  onClick={() => {
                    onApply?.(selectedPosition);
                    setSelectedPosition(null);
                  }}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
