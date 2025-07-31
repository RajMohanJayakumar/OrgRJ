import { useState } from 'react'
import { useCurrency, CURRENCY_FORMATS } from '../contexts/CurrencyContext'

const CurrencySelector = () => {
  const { currencyFormat, updateCurrencyFormat, currentFormat } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)

  const handleFormatChange = (format) => {
    updateCurrencyFormat(format)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:bg-white/80 transition-all duration-200 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer min-w-0 flex-shrink-0"
      >
        <span className="text-sm sm:text-base flex-shrink-0">🌍</span>
        <span className="hidden sm:inline truncate">{currentFormat.name.split('(')[0].trim()}</span>
        <span className="sm:hidden text-xs truncate max-w-[20px]">{currentFormat.symbol || '$'}</span>
        <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden max-h-80 sm:max-h-96">
            <div className="p-2 sm:p-3 border-b border-gray-100">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Currency Format</h3>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">Choose how numbers are displayed</p>
            </div>

            <div className="py-2 max-h-64 overflow-y-auto">
              {Object.entries(CURRENCY_FORMATS).map(([key, format]) => (
                <button
                  key={key}
                  onClick={() => handleFormatChange(key)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                    currencyFormat === key ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {format.name.split('(')[0].trim()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Example: {format.name.match(/\((.*?)\)/)?.[1] || format.name}
                      </div>
                    </div>
                    {currencyFormat === key && (
                      <div className="text-indigo-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-600">
                💡 Format applies to all calculators and is saved automatically
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CurrencySelector
