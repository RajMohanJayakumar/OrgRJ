import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Car, Bus, Train, Calculator } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { addMobileResponsivenessSEO, addPDFExportSEO, addChartResponsivenessSEO } from '../utils/seo'
import { NumberInput } from '../components/common/inputs'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import CommonPDFExport from '../components/CommonPDFExport'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

const CommuteCostCalculator = ({ categoryColor = 'blue', currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()
  
  const [commuteDetails, setCommuteDetails] = useState({
    distance: '',
    workingDays: '22',
    transportMode: 'car'
  })

  const [transportCosts, setTransportCosts] = useState({
    // Car costs
    fuelPrice: '100',
    mileage: '15',
    parking: '100',
    toll: '50',
    maintenance: '2000',
    
    // Public transport
    busPass: '1500',
    metroPass: '2000',
    autoRickshaw: '25',
    
    // Mixed transport
    mixedDaily: '150'
  })

  const [results, setResults] = useState({
    dailyCost: 0,
    weeklyCost: 0,
    monthlyCost: 0,
    yearlyCost: 0,
    costPerKm: 0,
    comparison: {},
    savings: {}
  })

  const transportModes = {
    car: { label: 'Personal Car', icon: Car, color: 'blue' },
    bike: { label: 'Personal Bike', icon: Car, color: 'green' },
    bus: { label: 'Public Bus', icon: Bus, color: 'yellow' },
    metro: { label: 'Metro/Subway', icon: Train, color: 'purple' },
    auto: { label: 'Auto Rickshaw', icon: Car, color: 'orange' },
    mixed: { label: 'Mixed Transport', icon: MapPin, color: 'gray' }
  }

  useEffect(() => {
    calculateCommuteCost()
  }, [commuteDetails, transportCosts])

  // Enhanced SEO for mobile responsiveness, PDF export, and charts
  useEffect(() => {
    addMobileResponsivenessSEO();
    addPDFExportSEO();
    addChartResponsivenessSEO();
    
    // Update page title and meta description
    document.title = 'Commute Cost Calculator - Travel Expense Calculator | Mobile Friendly';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calculate daily commute costs with mobile-responsive interface. PDF reports for expense tracking and planning.');
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'commute cost calculator, travel expense, fuel cost calculator, mobile responsive, PDF export');
    }
  }, []);

  const calculateCommuteCost = () => {
    const distance = parseFloat(commuteDetails.distance) || 0
    const workingDays = parseInt(commuteDetails.workingDays) || 22
    const roundTripDistance = distance * 2 // Daily round trip

    let dailyCost = 0
    let costPerKm = 0

    switch (commuteDetails.transportMode) {
      case 'car':
        const fuelCostPerKm = parseFloat(transportCosts.fuelPrice) / parseFloat(transportCosts.mileage)
        const fuelCost = roundTripDistance * fuelCostPerKm
        const parking = parseFloat(transportCosts.parking) || 0
        const toll = parseFloat(transportCosts.toll) || 0
        const maintenanceDaily = (parseFloat(transportCosts.maintenance) || 0) / 30
        dailyCost = fuelCost + parking + toll + maintenanceDaily
        costPerKm = dailyCost / roundTripDistance
        break

      case 'bike':
        const bikeFuelCostPerKm = parseFloat(transportCosts.fuelPrice) / 45 // Assuming 45 km/l for bike
        const bikeFuelCost = roundTripDistance * bikeFuelCostPerKm
        const bikeParking = (parseFloat(transportCosts.parking) || 0) * 0.3 // Bike parking is cheaper
        const bikeMaintenance = (parseFloat(transportCosts.maintenance) || 0) * 0.4 / 30 // Bike maintenance is cheaper
        dailyCost = bikeFuelCost + bikeParking + bikeMaintenance
        costPerKm = dailyCost / roundTripDistance
        break

      case 'bus':
        const busPass = parseFloat(transportCosts.busPass) || 0
        dailyCost = busPass / workingDays
        costPerKm = dailyCost / roundTripDistance
        break

      case 'metro':
        const metroPass = parseFloat(transportCosts.metroPass) || 0
        dailyCost = metroPass / workingDays
        costPerKm = dailyCost / roundTripDistance
        break

      case 'auto':
        const autoRate = parseFloat(transportCosts.autoRickshaw) || 0
        dailyCost = roundTripDistance * autoRate
        costPerKm = autoRate
        break

      case 'mixed':
        dailyCost = parseFloat(transportCosts.mixedDaily) || 0
        costPerKm = dailyCost / roundTripDistance
        break

      default:
        dailyCost = 0
        costPerKm = 0
    }

    const weeklyCost = dailyCost * 5 // 5 working days
    const monthlyCost = dailyCost * workingDays
    const yearlyCost = monthlyCost * 12

    // Calculate comparison with other modes
    const comparison = calculateComparison(distance, workingDays)
    
    // Calculate potential savings
    const savings = calculateSavings(dailyCost, comparison)

    setResults({
      dailyCost,
      weeklyCost,
      monthlyCost,
      yearlyCost,
      costPerKm,
      comparison,
      savings
    })
  }

  const calculateComparison = (distance, workingDays) => {
    const roundTripDistance = distance * 2
    const comparison = {}

    // Car calculation
    const carFuelCostPerKm = parseFloat(transportCosts.fuelPrice) / parseFloat(transportCosts.mileage)
    const carDailyCost = (roundTripDistance * carFuelCostPerKm) + 
                        (parseFloat(transportCosts.parking) || 0) + 
                        (parseFloat(transportCosts.toll) || 0) + 
                        ((parseFloat(transportCosts.maintenance) || 0) / 30)
    comparison.car = carDailyCost * workingDays

    // Bike calculation
    const bikeFuelCostPerKm = parseFloat(transportCosts.fuelPrice) / 45
    const bikeDailyCost = (roundTripDistance * bikeFuelCostPerKm) + 
                         ((parseFloat(transportCosts.parking) || 0) * 0.3) + 
                         ((parseFloat(transportCosts.maintenance) || 0) * 0.4 / 30)
    comparison.bike = bikeDailyCost * workingDays

    // Public transport
    comparison.bus = parseFloat(transportCosts.busPass) || 0
    comparison.metro = parseFloat(transportCosts.metroPass) || 0
    comparison.auto = (roundTripDistance * (parseFloat(transportCosts.autoRickshaw) || 0)) * workingDays
    comparison.mixed = (parseFloat(transportCosts.mixedDaily) || 0) * workingDays

    return comparison
  }

  const calculateSavings = (currentDailyCost, comparison) => {
    const currentMonthlyCost = currentDailyCost * parseInt(commuteDetails.workingDays)
    const savings = {}

    Object.entries(comparison).forEach(([mode, cost]) => {
      if (mode !== commuteDetails.transportMode) {
        const monthlySaving = currentMonthlyCost - cost
        const yearlySaving = monthlySaving * 12
        savings[mode] = {
          monthly: monthlySaving,
          yearly: yearlySaving,
          percentage: currentMonthlyCost > 0 ? (monthlySaving / currentMonthlyCost) * 100 : 0
        }
      }
    })

    return savings
  }

  const handleCommuteChange = (field, value) => {
    setCommuteDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCostChange = (field, value) => {
    setTransportCosts(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <MobileLayout className={'' + (isMobile ? 'space-y-4' : 'space-y-8') + ' calculator-main-container'}>
      {/* Header */}
      <motion.div className="text-center" {...fadeInUp}>
        <h2 className={(responsive.typography.heading) + ' font-bold text-gray-900 mb-2 flex items-center justify-center gap-3'}>
          <MapPin className={(responsive.iconSize("lg")) + ' text-blue-600'} />
          Commute Cost Calculator
        </h2>
        <p className="text-gray-600">Calculate daily/weekly fuel or public transport costs for your commute</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Commute Details */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Commute Details</h2>
          
          <div className="space-y-4">
            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                One-way Distance (km)
              </label>
              <NumberInput
                      value={commuteDetails.distance}
                      onChange={(value) => handleCommuteChange('distance', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
            </div>

            {/* Working Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Days per Month
              </label>
              <NumberInput
                      value={commuteDetails.workingDays}
                      onChange={(value) => handleCommuteChange('workingDays', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
            </div>

            {/* Transport Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Transport Mode
              </label>
              <select
                value={commuteDetails.transportMode}
                onChange={(e) => handleCommuteChange('transportMode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(transportModes).map(([key, mode]) => (
                  <option key={key} value={key}>{mode.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Transport Costs */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Parameters</h2>
          
          <div className="space-y-4">
            {/* Car/Bike Costs */}
            {(commuteDetails.transportMode === 'car' || commuteDetails.transportMode === 'bike') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Price per Liter
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {currentFormat.symbol}
                    </span>
                    <NumberInput
                      value={transportCosts.fuelPrice}
                      onChange={(value) => handleCostChange('fuelPrice', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {commuteDetails.transportMode === 'car' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mileage (km/L)
                    </label>
                    <NumberInput
                      value={transportCosts.mileage}
                      onChange={(value) => handleCostChange('mileage', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Parking
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {currentFormat.symbol}
                    </span>
                    <NumberInput
                      value={transportCosts.parking}
                      onChange={(value) => handleCostChange('parking', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Maintenance
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {currentFormat.symbol}
                    </span>
                    <NumberInput
                      value={transportCosts.maintenance}
                      onChange={(value) => handleCostChange('maintenance', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Public Transport Costs */}
            {commuteDetails.transportMode === 'bus' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Bus Pass
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {currentFormat.symbol}
                  </span>
                  <NumberInput
                      value={transportCosts.busPass}
                      onChange={(value) => handleCostChange('busPass', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
              </div>
            )}

            {commuteDetails.transportMode === 'metro' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Metro Pass
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {currentFormat.symbol}
                  </span>
                  <NumberInput
                      value={transportCosts.metroPass}
                      onChange={(value) => handleCostChange('metroPass', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
              </div>
            )}

            {commuteDetails.transportMode === 'auto' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate per KM
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {currentFormat.symbol}
                  </span>
                  <NumberInput
                      value={transportCosts.autoRickshaw}
                      onChange={(value) => handleCostChange('autoRickshaw', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
              </div>
            )}

            {commuteDetails.transportMode === 'mixed' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Mixed Transport Cost
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {currentFormat.symbol}
                  </span>
                  <NumberInput
                      value={transportCosts.mixedDaily}
                      onChange={(value) => handleCostChange('mixedDaily', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calculator className={(responsive.iconSize("md")) + ' text-green-600'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Cost Breakdown</h2>
          </div>

          <div className="space-y-4">
            {/* Cost Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Cost:</span>
                <span className="font-bold"><CompactCurrencyDisplay value={results.dailyCost} /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Cost:</span>
                <span className="font-medium"><CompactCurrencyDisplay value={results.weeklyCost} /></span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Monthly Cost:</span>
                <span className="font-bold text-blue-600"><CompactCurrencyDisplay value={results.monthlyCost} /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Yearly Cost:</span>
                <span className="font-medium"><CompactCurrencyDisplay value={results.yearlyCost} /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost per KM:</span>
                <span className="font-medium"><CompactCurrencyDisplay value={results.costPerKm} /></span>
              </div>
            </div>

            {/* Mode Comparison */}
            {Object.keys(results.comparison).length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-2">Monthly Cost Comparison</h3>
                <div className="space-y-1">
                  {Object.entries(results.comparison).map(([mode, cost]) => {
                    const modeInfo = transportModes[mode]
                    const isCurrent = mode === commuteDetails.transportMode
                    return (
                      <div key={mode} className={'flex justify-between text-sm p-2 rounded ' + (
                        isCurrent ? 'bg-blue-100 font-medium' : 'bg-gray-50'
                      )}>
                        <span>{modeInfo.label} {isCurrent ? '(Current)' : ''}</span>
                        <span>{formatCurrency(cost)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Savings Opportunities */}
            {Object.keys(results.savings).length > 0 && (
              <div className="mt-6 p-3 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">💰 Potential Savings</h3>
                <div className="text-sm text-green-700 space-y-1">
                  {Object.entries(results.savings).map(([mode, saving]) => {
                    if (saving.monthly > 0) {
                      const modeInfo = transportModes[mode]
                      return (
                        <div key={mode}>
                          Switch to {modeInfo.label}: Save {formatCurrency(saving.monthly)}/month
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 Cost Saving Tips</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <div>• Consider carpooling to split costs</div>
                <div>• Use public transport for longer distances</div>
                <div>• Combine trips to reduce frequency</div>
                <div>• Work from home when possible</div>
                <div>• Maintain your vehicle for better mileage</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* PDF Export */}
      {results && (
        <CommonPDFExport
          calculatorName="CommuteCost Calculator"
          inputs={{
            'Distance (One Way)': commuteDetails.distance ? (commuteDetails.distance) + ' km' : "Not set",
            'Working Days per Month': commuteDetails.workingDays?.toString() || "22",
            'Transport Mode': transportModes[commuteDetails.transportMode]?.label || "Car",
            'Fuel Price per Liter': formatCurrency(transportCosts.fuelPrice),
            'Vehicle Mileage': transportCosts.mileage ? (transportCosts.mileage) + ' km/l' : "Not set",
            'Parking Cost per Day': formatCurrency(transportCosts.parking),
            'Toll Charges per Day': formatCurrency(transportCosts.toll),
            'Maintenance Cost per Month': formatCurrency(transportCosts.maintenance),
            'Round Trip Distance': commuteDetails.distance ? (parseFloat(commuteDetails.distance) * 2) + ' km' : "Not calculated",
            'Monthly Working Distance': commuteDetails.distance ? (parseFloat(commuteDetails.distance) * 2 * parseInt(commuteDetails.workingDays)) + ' km' : "Not calculated"
          }}
          results={{
            'Daily Commute Cost': formatCurrency(results.dailyCost || 0),
            'Weekly Commute Cost': formatCurrency(results.weeklyCost || 0),
            'Monthly Commute Cost': formatCurrency(results.monthlyCost || 0),
            'Annual Commute Cost': formatCurrency(results.yearlyCost || 0),
            'Cost per Kilometer': formatCurrency(results.costPerKm || 0),
            'Fuel Cost per Day': formatCurrency((parseFloat(commuteDetails.distance) * 2 * parseFloat(transportCosts.fuelPrice)) / parseFloat(transportCosts.mileage)),
            'Non-Fuel Costs per Day': formatCurrency(parseFloat(transportCosts.parking) + parseFloat(transportCosts.toll)),
            'Monthly Fuel Expense': formatCurrency(((parseFloat(commuteDetails.distance) * 2 * parseFloat(transportCosts.fuelPrice)) / parseFloat(transportCosts.mileage)) * parseInt(commuteDetails.workingDays)),
            'Transport Mode': transportModes[commuteDetails.transportMode]?.label || "Car",
            'Cost Efficiency': ((results.costPerKm * 100).toFixed(2)) + ' paise per km'
          }}
        />
      )}

      {/* Universal Related Calculators */}
      <UniversalRelatedCalculators
        currentCalculatorId={currentCalculatorId}
        calculatorData={calculatorData}
        onCalculatorSelect={onCalculatorSelect}
      />
    </MobileLayout>
  )
}

export default CommuteCostCalculator
