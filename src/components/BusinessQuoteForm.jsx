import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Zap, 
  Phone, 
  Mail, 
  User, 
  Calendar,
  PoundSterling,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Users,
  MapPin,
  Briefcase,
  Flame,
  Droplet,
  Search,
  Loader2,
  Shield,
  ChevronDown
} from 'lucide-react';

const BusinessQuoteForm = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState('postcode'); // postcode, utility, address, business, energy, spend, contact, review
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [formData, setFormData] = useState({
    // Initial Step - Postcode & Utility
    postcode: '',
    utilityType: '', // electric, gas, gas-electric, water
    selectedAddress: '',
    
    // Business Details
    businessName: '',
    businessAddress: '',
    businessType: '',
    businessSize: '',
    tradingYears: '',
    
    // Energy Usage
    currentSupplier: '',
    contractEndDate: '',
    annualSpend: '',
    annualUsage: '',
    meterType: '',
    
    // Additional Requirements
    greenEnergy: false,
    multiSite: false,
    numberOfSites: '',
    
    // Contact Details
    contactName: '',
    position: '',
    email: '',
    phone: '',
    preferredContactTime: '',
    
    // Marketing
    howDidYouHear: '',
    additionalNotes: ''
  });

  // Enhanced address lookup with multiple address results
  const fetchAddressesFromPostcode = async (postcode) => {
    setIsLoadingAddress(true);
    try {
      const cleanPostcode = postcode.replace(/\s/g, '').toUpperCase();
      
      // First get the postcode details
      const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${cleanPostcode}`);
      const postcodeData = await postcodeResponse.json();
      
      if (postcodeData.status === 200 && postcodeData.result) {
        // For demonstration, we'll create mock addresses based on the postcode
        // In production, you'd use a proper address API like getAddress.io
        const result = postcodeData.result;
        const baseAddresses = [
          `1 ${result.admin_ward || 'High'} Street`,
          `2 ${result.admin_ward || 'High'} Street`, 
          `3 ${result.admin_ward || 'High'} Street`,
          `Unit 1, Business Park`,
          `Unit 2, Business Park`,
          `Suite A, Office Building`,
          `Suite B, Office Building`,
          `The Old Mill`,
          `Enterprise House`,
          `Innovation Centre`
        ];
        
        const formattedAddresses = baseAddresses.map(addr => 
          `${addr}, ${result.admin_district}, ${result.postcode}`
        );
        
        setAddresses(formattedAddresses);
        setShowAddressDropdown(true);
      } else {
        // If postcode not found, show error
        setAddresses(['Address not found - please enter manually']);
        setShowAddressDropdown(true);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses(['Error loading addresses - please enter manually']);
      setShowAddressDropdown(true);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handlePostcodeSubmit = () => {
    if (formData.postcode.length >= 5) {
      fetchAddressesFromPostcode(formData.postcode);
      setCurrentStep('address');
    }
  };

  const handleAddressSelect = (address) => {
    setFormData(prev => ({
      ...prev,
      selectedAddress: address,
      businessAddress: address
    }));
    setShowAddressDropdown(false);
    setCurrentStep('utility');
  };

  const handleUtilitySelect = (utility) => {
    setFormData(prev => ({ ...prev, utilityType: utility }));
    setTimeout(() => setCurrentStep('business'), 300);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    const stepFlow = {
      'postcode': 'address',
      'address': 'utility',
      'utility': 'business',
      'business': 'energy',
      'energy': 'spend',
      'spend': 'contact',
      'contact': 'review',
      'review': 'success'
    };
    setCurrentStep(stepFlow[currentStep]);
  };

  const handleBack = () => {
    const stepFlowBack = {
      'address': 'postcode',
      'utility': 'address',
      'business': 'utility',
      'energy': 'business',
      'spend': 'energy',
      'contact': 'spend',
      'review': 'contact'
    };
    if (stepFlowBack[currentStep]) {
      setCurrentStep(stepFlowBack[currentStep]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setCurrentStep('success');
  };

  const getStepNumber = () => {
    const stepNumbers = {
      'postcode': 0,
      'address': 0,
      'utility': 0,
      'business': 1,
      'energy': 2,
      'spend': 3,
      'contact': 4,
      'review': 5
    };
    return stepNumbers[currentStep] || 0;
  };

  const renderStep = () => {
    switch(currentStep) {
      case 'postcode':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Get Immediate Pricing</h2>
              <p className="text-gray-400">Compare business electricity deals in seconds</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Save up to 45%</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter your business postcode
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.postcode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value.toUpperCase() }))}
                    onKeyPress={(e) => e.key === 'Enter' && handlePostcodeSubmit()}
                    className="w-full px-4 py-4 pr-12 bg-slate-800 border-2 border-slate-700 rounded-lg text-white text-lg focus:border-emerald-500 focus:outline-none transition-colors uppercase"
                    placeholder="e.g., M2 7LP"
                    autoFocus
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
              </div>

              <motion.button
                onClick={handlePostcodeSubmit}
                disabled={formData.postcode.length < 5}
                whileHover={formData.postcode.length >= 5 ? { scale: 1.02 } : {}}
                whileTap={formData.postcode.length >= 5 ? { scale: 0.98 } : {}}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  formData.postcode.length >= 5
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Find Address <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        );

      case 'address':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Select Your Address</h2>
              <p className="text-gray-400">Choose your business address from the list below</p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/30 rounded-full">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">{formData.postcode}</span>
              </div>
            </div>

            <div className="space-y-3">
              {isLoadingAddress ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="max-h-[300px] overflow-y-auto space-y-2 border border-slate-700 rounded-lg p-2">
                    {addresses.map((address, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        onClick={() => handleAddressSelect(address)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-white group-hover:text-emerald-400 transition-colors">
                            {address}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-500 transform -rotate-90 mt-1" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-slate-900 text-gray-500">Or</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, selectedAddress: 'manual' }));
                      setCurrentStep('utility');
                    }}
                    className="w-full py-3 border border-slate-700 rounded-lg text-gray-400 hover:text-white hover:border-slate-600 transition-all"
                  >
                    Enter address manually
                  </button>
                </>
              )}
            </div>
          </motion.div>
        );

      case 'utility':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Select Your Utility</h2>
              <p className="text-gray-400">What would you like to get prices for?</p>
              {formData.selectedAddress && formData.selectedAddress !== 'manual' && (
                <div className="mt-2 text-sm text-emerald-400">
                  📍 {formData.selectedAddress.split(',')[0]}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUtilitySelect('electric')}
                className="p-6 rounded-lg border-2 border-slate-700 bg-slate-800 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all group"
              >
                <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                <p className="text-white font-semibold text-lg">Electric</p>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUtilitySelect('gas')}
                className="p-6 rounded-lg border-2 border-slate-700 bg-slate-800 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all group"
              >
                <Flame className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <p className="text-white font-semibold text-lg">Gas</p>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUtilitySelect('gas-electric')}
                className="p-6 rounded-lg border-2 border-slate-700 bg-slate-800 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all group"
              >
                <div className="flex justify-center gap-2 mb-3">
                  <Flame className="w-8 h-8 text-orange-400" />
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-white font-semibold text-lg">Gas & Electric</p>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUtilitySelect('water')}
                className="p-6 rounded-lg border-2 border-slate-700 bg-slate-800 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all group"
              >
                <Droplet className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <p className="text-white font-semibold text-lg">Water</p>
              </motion.button>
            </div>
          </motion.div>
        );

      case 'business':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Your Business Details</h2>
              <p className="text-gray-400">Help us understand your business needs</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="Your Company Ltd"
                  autoFocus
                />
              </div>

              {formData.selectedAddress === 'manual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Business Address *
                  </label>
                  <textarea
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Enter your full business address"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                >
                  <option value="">Select your business type</option>
                  <option value="retail">Retail</option>
                  <option value="office">Office</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Employees
                  </label>
                  <select
                    name="businessSize"
                    value={formData.businessSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-250">51-250</option>
                    <option value="251-1000">251-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Years Trading
                  </label>
                  <select
                    name="tradingYears"
                    value={formData.tradingYears}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select years</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );

      case 'energy':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Current Energy Setup</h2>
              <p className="text-gray-400">Tell us about your current {formData.utilityType} arrangement</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Supplier
                </label>
                <select
                  name="currentSupplier"
                  value={formData.currentSupplier}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                >
                  <option value="">Select supplier</option>
                  <option value="british-gas">British Gas</option>
                  <option value="edf">EDF Energy</option>
                  <option value="eon">E.ON</option>
                  <option value="scottish-power">Scottish Power</option>
                  <option value="sse">SSE</option>
                  <option value="opus">Opus Energy</option>
                  <option value="total">Total Energies</option>
                  <option value="other">Other</option>
                  <option value="not-sure">Not Sure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contract End Date
                </label>
                <input
                  type="date"
                  name="contractEndDate"
                  value={formData.contractEndDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank if you're not sure</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="greenEnergy"
                    checked={formData.greenEnergy}
                    onChange={handleInputChange}
                    className="w-5 h-5 bg-slate-800 border-slate-700 rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-gray-300">I'm interested in green energy options</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="multiSite"
                    checked={formData.multiSite}
                    onChange={handleInputChange}
                    className="w-5 h-5 bg-slate-800 border-slate-700 rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-gray-300">We have multiple sites</span>
                </label>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );

      case 'spend':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Energy Usage & Spend</h2>
              <p className="text-gray-400">This helps us find the best tariffs for you</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Annual {formData.utilityType === 'water' ? 'Water' : 'Energy'} Spend
                </label>
                <select
                  name="annualSpend"
                  value={formData.annualSpend}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                >
                  <option value="">Select spend range</option>
                  <option value="0-5000">Under £5,000</option>
                  <option value="5000-10000">£5,000 - £10,000</option>
                  <option value="10000-25000">£10,000 - £25,000</option>
                  <option value="25000-50000">£25,000 - £50,000</option>
                  <option value="50000-100000">£50,000 - £100,000</option>
                  <option value="100000-250000">£100,000 - £250,000</option>
                  <option value="250000+">Over £250,000</option>
                  <option value="not-sure">Not Sure</option>
                </select>
              </div>

              {formData.annualSpend && formData.annualSpend !== 'not-sure' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-emerald-900/20 to-slate-800/50 border border-emerald-500/30 rounded-lg p-4"
                >
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Your Potential Savings
                  </h3>
                  <p className="text-3xl font-bold text-emerald-400 mb-1">
                    Up to £{Math.round(parseInt(formData.annualSpend.split('-')[0]) * 0.45).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    *Based on average savings of 45%
                  </p>
                </motion.div>
              )}

              <button
                onClick={handleNext}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );

      case 'contact':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
              <p className="text-gray-400">How should our energy expert reach you?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="John Smith"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="john@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="07123 456789"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Best Time to Call
                </label>
                <select
                  name="preferredContactTime"
                  value={formData.preferredContactTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                >
                  <option value="">Any time</option>
                  <option value="morning">Morning (9am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 5pm)</option>
                  <option value="evening">Evening (5pm - 7pm)</option>
                </select>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Review Details <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );

      case 'review':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Review & Submit</h2>
              <p className="text-gray-400">Please check your information is correct</p>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Location & Utility
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">{formData.businessAddress}</p>
                  <p className="text-emerald-400">
                    {formData.utilityType === 'gas-electric' ? 'Gas & Electric' : 
                     formData.utilityType.charAt(0).toUpperCase() + formData.utilityType.slice(1)}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Business
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">{formData.businessName || 'Not provided'}</p>
                  <p className="text-gray-400">{formData.businessType || 'Type not specified'}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  Contact
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">{formData.contactName}</p>
                  <p className="text-gray-400">{formData.email}</p>
                  <p className="text-gray-400">{formData.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 bg-slate-800 border-slate-700 rounded text-emerald-500 focus:ring-emerald-500 mt-1"
                />
                <label className="text-sm text-gray-400">
                  I agree to be contacted by Watt Utilities regarding my energy requirements. 
                  We will not share your information with third parties.
                </label>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Get My Quotes <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6 py-8"
          >
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Thank You!</h2>
            <div className="space-y-4">
              <p className="text-xl text-gray-300">
                Your quote request has been received.
              </p>
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-6 max-w-md mx-auto">
                <Clock className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <p className="text-white font-semibold mb-2">What Happens Next?</p>
                <p className="text-gray-300 text-sm mb-4">
                  One of our expert energy consultants will contact you within 2 hours 
                  to provide personalized quotes.
                </p>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Your reference:</p>
                  <p className="text-emerald-400 font-mono">#{Date.now().toString(36).toUpperCase()}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Close
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Don't show progress bar on initial screens
  const showProgress = !['postcode', 'address', 'utility', 'success'].includes(currentStep);
  const stepNumber = getStepNumber();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-slate-800"
      >
        {/* Header */}
        <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!['postcode', 'success'].includes(currentStep) && (
                <button
                  onClick={handleBack}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-lg font-bold text-white">
                {currentStep === 'postcode' ? 'Quick Quote' : 'Get Your Free Quote'}
              </h1>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          {showProgress && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Step {stepNumber} of 5</span>
                <span>{Math.round((stepNumber / 5) * 100)}% Complete</span>
              </div>
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(stepNumber / 5) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessQuoteForm;