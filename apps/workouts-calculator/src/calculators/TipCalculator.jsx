import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Users, Calculator, Star } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import CommonPDFExport from '../components/CommonPDFExport'
import { NumberInput } from '../components/common/inputs'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'
import {
  Button,
  Card,
  SummaryCard,
  Section,
  Container,
  Grid
} from '../components/common'

const TipCalculator = ({ currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { currentFormat, formatCurrency } = useCurrency()
  const { responsive } = useMobileResponsive()
  
  const [inputs, setInputs] = useState({
    billAmount: '',
    tipPercent: '18',
    numberOfPeople: '1',
    serviceQuality: 'good'
  })

  const [results, setResults] = useState({
    tipAmount: 0,
    totalAmount: 0,
    perPersonBill: 0,
    perPersonTip: 0,
    perPersonTotal: 0
  })

  const serviceQualities = {
    poor: { percent: 10, label: 'Poor Service', color: 'red' },
    average: { percent: 15, label: 'Average Service', color: 'yellow' },
    good: { percent: 18, label: 'Good Service', color: 'green' },
    excellent: { percent: 20, label: 'Excellent Service', color: 'blue' },
    outstanding: { percent: 25, label: 'Outstanding Service', color: 'purple' }
  }

  useEffect(() => {
    calculateTip()
  }, [inputs])

  const calculateTip = () => {
    const billAmount = parseFloat(inputs.billAmount) || 0
    const tipPercent = parseFloat(inputs.tipPercent) || 0
    const numberOfPeople = parseInt(inputs.numberOfPeople) || 1

    const tipAmount = (billAmount * tipPercent) / 100
    const totalAmount = billAmount + tipAmount
    const perPersonBill = billAmount / numberOfPeople
    const perPersonTip = tipAmount / numberOfPeople
    const perPersonTotal = totalAmount / numberOfPeople

    setResults({
      tipAmount,
      totalAmount,
      perPersonBill,
      perPersonTip,
      perPersonTotal
    })
  }

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleServiceQualityChange = (quality) => {
    setInputs(prev => ({
      ...prev,
      serviceQuality: quality,
      tipPercent: serviceQualities[quality].percent.toString()
    }))
  }

  const quickTipButtons = [10, 15, 18, 20, 22, 25]

  const resetCalculator = () => {
    setInputs({
      billAmount: '',
      tipPercent: '18',
      numberOfPeople: '1',
      serviceQuality: 'good'
    })
  }

  return (
    <Container size="lg" spacing="lg">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={(responsive.typography.heading) + ' font-bold text-gray-900 mb-2 flex items-center justify-center gap-3'}>
          <DollarSign className={(responsive.iconSize("lg")) + ' text-green-600'} />
          Tip Calculator
        </h2>
        <p className="text-gray-600">Calculate tips and split bills with tip per person</p>
      </motion.div>

      <Grid columns={2}>
        {/* Input Section */}
        <Section
          title="Bill Details"
          icon={Calculator}
          onReset={resetCalculator}
          color="green"
        >
          {/* Bill Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill Amount
            </label>
            <NumberInput
              value={inputs.billAmount}
              onChange={(value) => handleInputChange('billAmount', value)}
              placeholder="100"
              prefix={currentFormat.symbol}
              step="1"
              allowDecimals={true}
              allowNegative={false}
              className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Service Quality */}
          <div>
            <label className="input-label">Service Quality</label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(serviceQualities).map(([key, quality]) => (
                <Button
                  key={key}
                  variant={inputs.serviceQuality === key ? 'primary' : 'outline'}
                  onClick={() => handleServiceQualityChange(key)}
                  className="flex items-center justify-between p-3"
                  fullWidth
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>{quality.label}</span>
                  </div>
                  <span className="font-bold">{quality.percent}%</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Tip Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tip Percentage
            </label>
            <NumberInput
              value={inputs.tipPercent}
              onChange={(value) => handleInputChange('tipPercent', value)}
              placeholder="18"
              suffix="%"
              step="0.5"
              min="0"
              max="100"
              allowDecimals={true}
              allowNegative={false}
              className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            {/* Quick Tip Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {quickTipButtons.map(percent => (
                <Button
                  key={percent}
                  variant={inputs.tipPercent === percent.toString() ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange('tipPercent', percent.toString())}
                >
                  {percent}%
                </Button>
              ))}
            </div>
          </div>

          {/* Number of People */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of People
            </label>
            <NumberInput
              value={inputs.numberOfPeople}
              onChange={(value) => handleInputChange('numberOfPeople', value)}
              placeholder="1"
              step="1"
              min="1"
              max="100"
              allowDecimals={false}
              allowNegative={false}
              className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </Section>

        {/* Results Section */}
        <Section
          title="Tip Breakdown"
          icon={DollarSign}
          color="blue"
        >
          {/* Bill Summary */}
          <SummaryCard
            title="Bill Summary"
            color="green"
            items={[
              { label: 'Bill Amount', value: inputs.billAmount || 0, type: 'currency' },
              { label: `Tip (${inputs.tipPercent}%)`, value: results.tipAmount, type: 'currency' },
              { label: 'Total Amount', value: results.totalAmount, type: 'currency' }
            ]}
          />

          {/* Per Person Breakdown */}
          {parseInt(inputs.numberOfPeople) > 1 && (
            <SummaryCard
              title={`Per Person (${inputs.numberOfPeople} people)`}
              color="blue"
              items={[
                { label: 'Bill per person', value: results.perPersonBill, type: 'currency' },
                { label: 'Tip per person', value: results.perPersonTip, type: 'currency' },
                { label: 'Total per person', value: results.perPersonTotal, type: 'currency' }
              ]}
            />
          )}

          {/* Tip Guide */}
          <Card variant="warning" size="sm">
            <h3 className="font-semibold text-yellow-800 mb-2">💡 Tipping Guide</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <div><strong>Restaurants:</strong> 15-20% (18% standard)</div>
              <div><strong>Bars:</strong> $1-2 per drink or 15-20%</div>
              <div><strong>Delivery:</strong> 15-20% (minimum $3-5)</div>
              <div><strong>Taxi/Uber:</strong> 15-20%</div>
              <div><strong>Hair Salon:</strong> 15-20%</div>
              <div><strong>Hotel Housekeeping:</strong> $2-5 per night</div>
            </div>
          </Card>

          {/* Service Quality Feedback */}
          {inputs.serviceQuality && (
            <Card variant="default" size="sm" className="bg-purple-50">
              <h3 className="font-semibold text-purple-800 mb-2">
                {serviceQualities[inputs.serviceQuality].label}
              </h3>
              <div className="text-sm text-purple-700">
                {inputs.serviceQuality === 'poor' && 'Consider speaking with management about the service issues.'}
                {inputs.serviceQuality === 'average' && 'Standard service deserves a standard tip.'}
                {inputs.serviceQuality === 'good' && 'Good service is worth recognizing with a fair tip.'}
                {inputs.serviceQuality === 'excellent' && 'Excellent service deserves to be rewarded!'}
                {inputs.serviceQuality === 'outstanding' && 'Outstanding service deserves exceptional recognition!'}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Grid columns={2} gap="sm">
            <Button
              variant="secondary"
              onClick={() => {
                const roundedTotal = Math.ceil(results.totalAmount)
                const newTip = roundedTotal - parseFloat(inputs.billAmount || 0)
                const newTipPercent = inputs.billAmount ? (parseFloat(inputs.billAmount) > 0 ? (newTip / parseFloat(inputs.billAmount) * 100).toFixed(1) : '0.0') : '0.0'
                handleInputChange('tipPercent', newTipPercent.toString())
              }}
            >
              Round Up Total
            </Button>
            <Button
              variant="error"
              onClick={resetCalculator}
            >
              Reset Calculator
            </Button>
          </Grid>
        </Section>
      </Grid>

      

      {/* Universal Related Calculators */}
      <UniversalRelatedCalculators
        currentCalculatorId={currentCalculatorId}
        calculatorData={calculatorData}
        onCalculatorSelect={onCalculatorSelect}
      />
    </Container>

  )
}

export default TipCalculator
