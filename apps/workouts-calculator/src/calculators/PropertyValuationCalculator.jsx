import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Star, DollarSign, TrendingUp } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import CommonPDFExport from '../components/CommonPDFExport'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import ResetButton from '../components/ResetButton'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'
import {
  SummaryCard,
  Section,
  Container,
  Grid
} from '../components/common'

const PropertyValuationCalculator = ({ currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()
  
  const [inputs, setInputs] = useState({
    builtUpArea: '',
    carpetArea: '',
    pricePerSqFt: '',
    floorNumber: '',
    totalFloors: '',
    propertyAge: '',
    amenitiesScore: '5',
    locationScore: '5',
    marketTrend: '0'
  })

  const [results, setResults] = useState({
    baseValue: 0,
    adjustedValue: 0,
    pricePerSqFt: 0,
    appreciationValue: 0,
    marketValue: 0,
    rentYield: 0
  })

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }

  const calculateResults = () => {
    const builtUpArea = parseFloat(inputs.builtUpArea) || 0
    const carpetArea = parseFloat(inputs.carpetArea) || 0
    const pricePerSqFt = parseFloat(inputs.pricePerSqFt) || 0
    const floorNumber = parseFloat(inputs.floorNumber) || 0
    const totalFloors = parseFloat(inputs.totalFloors) || 0
    const propertyAge = parseFloat(inputs.propertyAge) || 0
    const amenitiesScore = parseFloat(inputs.amenitiesScore) || 5
    const locationScore = parseFloat(inputs.locationScore) || 5
    const marketTrend = parseFloat(inputs.marketTrend) || 0

    if (builtUpArea > 0 && pricePerSqFt > 0) {
      // Base value calculation
      const baseValue = builtUpArea * pricePerSqFt
      
      // Floor adjustment (higher floors generally cost more, but top floor might be less)
      let floorAdjustment = 1
      if (totalFloors > 0) {
        if (floorNumber === 0) floorAdjustment = 0.95 // Ground floor
        else if (floorNumber === totalFloors) floorAdjustment = 0.98 // Top floor
        else if (floorNumber > totalFloors * 0.6) floorAdjustment = 1.05 // Upper floors
        else floorAdjustment = 1.02 // Middle floors
      }
      
      // Age depreciation (2% per year for first 10 years, then 1% per year)
      let ageAdjustment = 1
      if (propertyAge > 0) {
        if (propertyAge <= 10) {
          ageAdjustment = 1 - (propertyAge * 0.02)
        } else {
          ageAdjustment = 1 - (10 * 0.02) - ((propertyAge - 10) * 0.01)
        }
        ageAdjustment = Math.max(ageAdjustment, 0.5) // Minimum 50% value retention
      }
      
      // Amenities adjustment (score out of 10)
      const amenitiesAdjustment = 0.9 + (amenitiesScore / 10) * 0.2
      
      // Location adjustment (score out of 10)
      const locationAdjustment = 0.8 + (locationScore / 10) * 0.4
      
      // Market trend adjustment
      const marketAdjustment = 1 + (marketTrend / 100)
      
      // Calculate adjusted value
      const adjustedValue = baseValue * floorAdjustment * ageAdjustment * 
                           amenitiesAdjustment * locationAdjustment * marketAdjustment
      
      // Calculate appreciation (assuming 5% annual appreciation)
      const appreciationValue = adjustedValue * Math.pow(1.05, 5) - adjustedValue
      
      // Market value (current adjusted value)
      const marketValue = adjustedValue
      
      // Estimated rent yield (assuming 2-4% annual yield)
      const rentYield = (adjustedValue * 0.03) / 12

      setResults({
        baseValue,
        adjustedValue,
        pricePerSqFt: adjustedValue / builtUpArea,
        appreciationValue,
        marketValue,
        rentYield
      })
    }
  }

  useEffect(() => {
    calculateResults()
  }, [inputs])

  const resetCalculator = () => {
    setInputs({
      builtUpArea: '',
      carpetArea: '',
      pricePerSqFt: '',
      floorNumber: '',
      totalFloors: '',
      propertyAge: '',
      amenitiesScore: '5',
      locationScore: '5',
      marketTrend: '0'
    })
    setResults({
      baseValue: 0,
      adjustedValue: 0,
      pricePerSqFt: 0,
      appreciationValue: 0,
      marketValue: 0,
      rentYield: 0
    })
  }

  return (
    <>
      <Container size="lg">
      <Grid columns={{ base: 1, lg: 2 }} gap="lg">
        {/* Property Details */}
        <Section title="Property Details" icon={Building2}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Built-up Area (sq ft)
              </label>
              <NumberInput
                value={inputs.builtUpArea}
                onChange={(value) => handleInputChange('builtUpArea', value)}
                placeholder="1200"
                suffix="sq ft"
                step="1"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carpet Area (sq ft)
              </label>
              <NumberInput
                value={inputs.carpetArea}
                onChange={(value) => handleInputChange('carpetArea', value)}
                placeholder="1000"
                suffix="sq ft"
                step="1"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price per Sq Ft
              </label>
              <NumberInput
                value={inputs.pricePerSqFt}
                onChange={(value) => handleInputChange('pricePerSqFt', value)}
                placeholder="Enter amount"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Floor Number
              </label>
              <NumberInput
                value={inputs.floorNumber}
                onChange={(value) => handleInputChange('floorNumber', value)}
                placeholder="Enter value"
                suffix="floor"
                step="1"
                min="0"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Floors in Building
              </label>
              <NumberInput
                value={inputs.totalFloors}
                onChange={(value) => handleInputChange('totalFloors', value)}
                placeholder="Enter years"
                suffix="floors"
                step="1"
                min="1"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Age (Years)
              </label>
              <NumberInput
                value={inputs.propertyAge}
                onChange={(value) => handleInputChange('propertyAge', value)}
                placeholder="Enter value"
                suffix="years"
                step="1"
                min="0"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </Section>

        {/* Valuation Factors */}
        <Section title="Valuation Factors" icon={Star}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities Score (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={inputs.amenitiesScore}
                onChange={(e) => handleInputChange('amenitiesScore', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Poor (1)</span>
                <span>Current: {inputs.amenitiesScore}</span>
                <span>Excellent (10)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Score (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={inputs.locationScore}
                onChange={(e) => handleInputChange('locationScore', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Remote (1)</span>
                <span>Current: {inputs.locationScore}</span>
                <span>Prime (10)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market Trend (%)
              </label>
              <NumberInput
                value={inputs.marketTrend}
                onChange={(value) => handleInputChange('marketTrend', value)}
                placeholder="Enter value"
                suffix="%"
                step="0.5"
                allowDecimals={true}
                allowNegative={true}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </Section>

        {/* Valuation Results */}
        <SummaryCard
          title="Property Valuation"
          icon={DollarSign}
          items={[
            { label: "Base Value", value: results.baseValue, type: "currency" },
            { label: "Adjusted Market Value", value: results.adjustedValue, type: "currency" },
            { label: "Adjusted Price per Sq Ft", value: results.pricePerSqFt, type: "currency" }
          ]}
          color="green"
        />

        {/* Investment Analysis */}
        <div className="space-y-4">
          <SummaryCard
            title="Investment Analysis"
            icon={TrendingUp}
            items={[
              { label: "5-Year Appreciation", value: results.appreciationValue, type: "currency" },
              { label: "Estimated Monthly Rent", value: results.rentYield, type: "currency" },
              { label: "Annual Rent Yield", value: results.rentYield * 12, type: "currency" }
            ]}
            color="blue"
          />

          {/* Reset Button */}
          <ResetButton onReset={resetCalculator} />
        </div>
      </Grid>

      {/* Valuation Factors Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 p-6 bg-green-50 rounded-xl"
      >
        <h3 className="text-lg font-semibold text-green-800 mb-4">📊 Valuation Factors Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
          <div>
            <h4 className="font-semibold mb-2">Amenities Score:</h4>
            <ul className="space-y-1">
              <li>• 1-3: Basic amenities only</li>
              <li>• 4-6: Standard amenities (gym, parking)</li>
              <li>• 7-8: Premium amenities (pool, club)</li>
              <li>• 9-10: Luxury amenities (concierge, spa)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Location Score:</h4>
            <ul className="space-y-1">
              <li>• 1-3: Remote/developing areas</li>
              <li>• 4-6: Suburban/residential areas</li>
              <li>• 7-8: Well-connected areas</li>
              <li>• 9-10: Prime/commercial areas</li>
            </ul>
          </div>
        </div>
      </motion.div>

    </Container>

    {/* Universal Related Calculators - Full Width */}
    <div className="mt-8 px-4 sm:px-6 lg:px-8">
      {/* PDF Export */}
      {results && (
        <CommonPDFExport
          calculatorName="Property Valuation Calculator"
          inputs={{
            'Built-up Area': (inputs.builtUpArea) + ' sq ft',
            'Price per Sq Ft': formatCurrency(inputs.pricePerSqFt),
            'Floor Number': inputs.floorNumber.toString(),
            'Property Age': (inputs.propertyAge) + ' years'
          }}
          results={{
            'Adjusted Value': formatCurrency(results.adjustedValue || 0),
            'Market Value': formatCurrency(results.marketValue || 0),
            'Price per Sq Ft': formatCurrency(results.pricePerSqFt || 0),
            'Rent Yield': formatCurrency(results.rentYield || 0)
          }}
        />
      )}

      <UniversalRelatedCalculators
        currentCalculatorId={currentCalculatorId}
        calculatorData={calculatorData}
        onCalculatorSelect={onCalculatorSelect}
        className=""
      />
    </div>
    </>

  )
}

export default PropertyValuationCalculator
