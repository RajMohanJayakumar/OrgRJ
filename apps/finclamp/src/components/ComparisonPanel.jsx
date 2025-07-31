
import React from 'react'
import PDFExport from './PDFExport'

export default function ComparisonPanel({ data, onRemove, onClose }) {
  if (!data || data.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="bg-indigo-500 text-white p-4 sm:p-6 border-b border-indigo-600">
          <div className="flex justify-between items-start sm:items-center">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold flex items-center space-x-2">
                <span className="text-xl sm:text-2xl">📊</span>
                <span className="truncate">finclamp.com - Calculator Comparison</span>
              </h2>
              <p className="text-white/90 mt-1 text-sm sm:text-base hidden sm:block">Compare your financial calculations side by side</p>
              <p className="text-white/90 mt-1 text-xs sm:hidden">Compare calculations</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer ml-2 flex-shrink-0"
            >
              <span className="text-lg sm:text-xl">✕</span>
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)]">
          {data.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">📊</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No calculations to compare yet</h3>
              <p className="text-gray-500 text-sm sm:text-base px-4">Add calculations from any calculator to compare them here.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {data.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors cursor-pointer z-10"
                  >
                    <span className="text-sm sm:text-base">✕</span>
                  </button>

                  <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-gray-800 pr-8">
                    {item.calculator}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="text-xs sm:text-sm text-gray-500">
                      Added: {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>

                    {item.inputs && (
                      <div className="bg-white rounded-lg p-3 sm:p-4">
                        <h4 className="font-semibold mb-2 text-gray-700 text-sm sm:text-base">Inputs:</h4>
                        <div className="space-y-1 text-xs sm:text-sm">
                          {Object.entries(item.inputs).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-start gap-2">
                              <span className="text-gray-600 capitalize flex-shrink-0 min-w-0">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span className="font-medium text-right break-words">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.results && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 sm:p-4">
                        <h4 className="font-semibold mb-2 text-gray-700 text-sm sm:text-base">Results:</h4>
                        <div className="space-y-1 text-xs sm:text-sm">
                          {Object.entries(item.results).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-start gap-2">
                              <span className="text-gray-600 capitalize flex-shrink-0 min-w-0">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span className="font-bold text-purple-700 text-right break-words">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {data.length > 0 && (
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
            <div className="flex justify-center">
              <PDFExport data={data} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
