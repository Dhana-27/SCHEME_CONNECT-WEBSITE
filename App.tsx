import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, DollarSign, Users, Phone, Mail, FileText, CheckCircle, Star, ArrowRight, Menu, X, Upload, Bot, Sparkles, TrendingUp } from 'lucide-react';
import { Chatbot } from './components/Chatbot';
import { ExcelUploader } from './components/ExcelUploader';
import { DynamicWorkflow } from './components/DynamicWorkflow';
import { useExcelData } from './hooks/useExcelData';
import { Scheme, UserProfile, WorkflowStep } from './types';

// D-Purpose Foundation Theme Colors
const theme = {
  primary: '#0A400C', // Deep Purple
  secondary: '#EC4899', // Pink
  accent: '#10B981', // Emerald
  warning: '#F59E0B', // Amber
  info: '#3B82F6', // Blue
  success: '#059669', // Green
  dark: '#1F2937', // Gray-800
  light: '#F9FAFB' // Gray-50
};

const defaultSchemes: Scheme[] = [
  {
    id: '1',
    title: 'D-Purpose Startup Accelerator Grant',
    category: 'Business',
    amount: '₹25 Lakhs',
    eligibility: ['Age: 18-35 years', 'Innovative startup idea', 'Social impact focus'],
    description: 'Comprehensive funding and mentorship for startups creating positive social impact through technology and innovation.',
    deadline: '2024-12-31',
    status: 'active',
    featured: true,
    applicants: 18420,
    successRate: 85,
    targetAudience: 'Entrepreneurs, Innovators, Social Impact Startups',
    documents: ['Business Plan', 'Pitch Deck', 'Financial Projections', 'Impact Assessment'],
    processingTime: '45 days',
    contactInfo: 'grants@dpurpose.org'
  },
  {
    id: '2',
    title: 'Digital Skills Development Fund',
    category: 'Education',
    amount: '₹75,000',
    eligibility: ['Age: 16-30 years', 'Basic computer literacy', 'Commitment to complete course'],
    description: 'Comprehensive digital skills training program covering AI, blockchain, data science, and emerging technologies.',
    deadline: '2024-11-15',
    status: 'active',
    featured: true,
    applicants: 42450,
    successRate: 92,
    targetAudience: 'Students, Young Professionals, Career Changers',
    documents: ['Educational Certificates', 'ID Proof', 'Income Certificate'],
    processingTime: '15 days',
    contactInfo: 'education@dpurpose.org'
  },
  {
    id: '3',
    title: 'Sustainable Agriculture Innovation Loan',
    category: 'Agriculture',
    amount: '₹5 Lakhs',
    eligibility: ['Farmer with land ownership', 'Sustainable farming practices', 'Technology adoption'],
    description: 'Low-interest loans for farmers adopting sustainable and technology-driven agricultural practices.',
    deadline: '2024-12-15',
    status: 'active',
    featured: true,
    applicants: 28900,
    successRate: 89,
    targetAudience: 'Farmers, Agricultural Entrepreneurs',
    documents: ['Land Records', 'Farming Plan', 'Technology Proposal'],
    processingTime: '30 days',
    contactInfo: 'agriculture@dpurpose.org'
  }
];

const categories = ['All', 'Business', 'Education', 'Agriculture', 'Housing', 'Healthcare', 'Technology', 'Social Impact'];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  
  const { schemes: excelSchemes, loading, error, loadExcelData } = useExcelData();
  const [allSchemes, setAllSchemes] = useState<Scheme[]>(defaultSchemes);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    interests: []
  });

  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Set up your personal and professional information',
      completed: false,
      current: true
    },
    {
      id: 'discover',
      title: 'Discover Schemes',
      description: 'Find schemes that match your profile and goals',
      completed: false,
      current: false
    },
    {
      id: 'eligibility',
      title: 'Check Eligibility',
      description: 'Verify your eligibility for selected schemes',
      completed: false,
      current: false
    },
    {
      id: 'apply',
      title: 'Submit Application',
      description: 'Complete and submit your applications',
      completed: false,
      current: false
    },
    {
      id: 'track',
      title: 'Track Progress',
      description: 'Monitor your application status and updates',
      completed: false,
      current: false
    }
  ]);

  useEffect(() => {
    if (excelSchemes.length > 0) {
      setAllSchemes([...defaultSchemes, ...excelSchemes]);
    }
  }, [excelSchemes]);

  // Dynamic workflow logic
  useEffect(() => {
    const updateWorkflow = () => {
      const hasProfile = userProfile.age && userProfile.category && userProfile.income;
      const hasInterests = userProfile.interests.length > 0;
      
      setWorkflowSteps(prev => prev.map(step => {
        switch (step.id) {
          case 'profile':
            return {
              ...step,
              completed: hasProfile && hasInterests,
              current: !hasProfile || !hasInterests
            };
          case 'discover':
            return {
              ...step,
              completed: false,
              current: hasProfile && hasInterests && !step.completed
            };
          default:
            return step;
        }
      }));
    };

    updateWorkflow();
  }, [userProfile]);

  const filteredSchemes = allSchemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredSchemes = allSchemes.filter(scheme => scheme.featured);

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({
      ...prev,
      ...updates,
      interests: updates.interests ? [...new Set([...prev.interests, ...updates.interests])] : prev.interests
    }));
  };

  const handleWorkflowStep = (stepId: string) => {
    // Dynamic workflow actions
    switch (stepId) {
      case 'profile':
        // Scroll to profile section or open profile modal
        break;
      case 'discover':
        document.getElementById('schemes')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'eligibility':
        // Open eligibility checker
        break;
      case 'apply':
        // Open application form
        break;
      case 'track':
        // Open tracking dashboard
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SchemeConnect</h1>
                <p className="text-xs text-gray-500">D-Purpose Foundation Portal</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-purple-600 transition-colors">Home</a>
              <a href="#schemes" className="text-gray-700 hover:text-purple-600 transition-colors">Schemes</a>
              <button 
                onClick={() => setShowUploader(!showUploader)}
                className="text-gray-700 hover:text-purple-600 transition-colors flex items-center space-x-1"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Data</span>
              </button>
              <a href="#workflow" className="text-gray-700 hover:text-purple-600 transition-colors">Workflow</a>
              <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">Contact</a>
            </nav>

            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-2">
            <nav className="space-y-2">
              <a href="#home" className="block py-2 text-gray-700 hover:text-purple-600">Home</a>
              <a href="#schemes" className="block py-2 text-gray-700 hover:text-purple-600">Schemes</a>
              <button 
                onClick={() => setShowUploader(!showUploader)}
                className="block py-2 text-gray-700 hover:text-purple-600 w-full text-left"
              >
                Upload Data
              </button>
              <a href="#workflow" className="block py-2 text-gray-700 hover:text-purple-600">Workflow</a>
              <a href="#contact" className="block py-2 text-gray-700 hover:text-purple-600">Contact</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Grant or Loan
              </span>
            </h1>
            <p className="text-xl mb-8 text-purple-100 max-w-3xl mx-auto">
              AI-powered platform with dynamic workflows and personalized recommendations. 
              Upload your data and let our intelligent system guide you to success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => document.getElementById('schemes')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Browse Schemes</span>
              </button>
              <button 
                onClick={() => setShowUploader(true)}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Excel Data</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <div className="text-3xl font-bold">{allSchemes.length}+</div>
                <div className="text-purple-200">Active Schemes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <div className="text-3xl font-bold">2M+</div>
                <div className="text-purple-200">Beneficiaries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-3xl font-bold">₹5000Cr+</div>
                <div className="text-purple-200">Disbursed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Bot className="h-8 w-8 mx-auto mb-2 text-pink-400" />
                <div className="text-3xl font-bold">AI</div>
                <div className="text-purple-200">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Excel Uploader Section */}
      {showUploader && (
        <section className="py-12 bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ExcelUploader
              onFileUpload={loadExcelData}
              loading={loading}
              error={error}
              schemasCount={excelSchemes.length}
            />
          </div>
        </section>
      )}

      {/* Dynamic Workflow Section */}
      <section id="workflow" className="py-12 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DynamicWorkflow
                steps={workflowSteps}
                onStepClick={handleWorkflowStep}
              />
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={userProfile.age || ''}
                      onChange={(e) => handleUpdateProfile({ age: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter your age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={userProfile.category || ''}
                      onChange={(e) => handleUpdateProfile({ category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select category</option>
                      <option value="Student">Student</option>
                      <option value="Business">Business Owner</option>
                      <option value="Farmer">Farmer</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
                    <select
                      value={userProfile.income || ''}
                      onChange={(e) => handleUpdateProfile({ income: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select income range</option>
                      <option value="0-3L">₹0 - ₹3 Lakhs</option>
                      <option value="3-8L">₹3 - ₹8 Lakhs</option>
                      <option value="8-15L">₹8 - ₹15 Lakhs</option>
                      <option value="15L+">₹15 Lakhs+</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Sparkles className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">AI Recommendations</h3>
                </div>
                <p className="text-sm text-purple-100 mb-4">
                  Get personalized scheme recommendations based on your profile and goals.
                </p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  Get Recommendations
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section id="schemes" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Scheme</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search through our comprehensive database of schemes, grants, and loans 
              with AI-powered recommendations and dynamic filtering.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search schemes, grants, loans..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Schemes */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Schemes</h2>
              <p className="text-gray-600">AI-curated schemes with highest success rates</p>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    scheme.category === 'Business' ? 'bg-purple-100 text-purple-800' :
                    scheme.category === 'Education' ? 'bg-green-100 text-green-800' :
                    scheme.category === 'Agriculture' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-pink-100 text-pink-800'
                  }`}>
                    {scheme.category}
                  </span>
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{scheme.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{scheme.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>Up to {scheme.amount}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{scheme.applicants.toLocaleString()} applicants</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-500">Success Rate: </span>
                    <span className="font-semibold text-green-600">{scheme.successRate}%</span>
                  </div>
                  <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 font-medium">
                    <span>Apply Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Schemes */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            All Schemes ({filteredSchemes.length})
          </h2>

          <div className="space-y-6">
            {filteredSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{scheme.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        scheme.category === 'Business' ? 'bg-purple-100 text-purple-800' :
                        scheme.category === 'Education' ? 'bg-green-100 text-green-800' :
                        scheme.category === 'Agriculture' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-pink-100 text-pink-800'
                      }`}>
                        {scheme.category}
                      </span>
                      {scheme.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{scheme.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>Up to {scheme.amount}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{scheme.applicants.toLocaleString()} applicants</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        <span>{scheme.successRate}% success rate</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Eligibility: </span>
                      <span className="text-sm text-gray-600">{scheme.eligibility.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                    <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered support team is here to assist you 24/7 with personalized guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-2">1800-D-PURPOSE</p>
              <p className="text-sm text-gray-500">24/7 AI Support</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-2">support@dpurpose.org</p>
              <p className="text-sm text-gray-500">Instant Response</p>
            </div>
            
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Chat</h3>
              <p className="text-gray-600 mb-2">Intelligent Assistant</p>
              <p className="text-sm text-gray-500">Always Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">SchemeConnect</h3>
                  <p className="text-sm text-gray-400">D-Purpose Foundation</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered platform empowering citizens through accessible government schemes and dynamic workflows.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Browse Schemes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Upload Data</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Recommendations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dynamic Workflow</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Business Grants</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Education Funds</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Agricultural Loans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Social Impact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AI Chat Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 SchemeConnect - D-Purpose Foundation. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot
        schemes={allSchemes}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
}

export default App;
