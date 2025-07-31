import React from 'react'
import { motion } from 'framer-motion'

const Breadcrumb = ({ currentCalculator, currentCategory }) => {
  if (!currentCalculator || !currentCategory) return null

  const breadcrumbItems = [
    { name: 'Home', href: '/', current: false },
    { name: 'Calculators', href: '/calculators', current: false },
    { name: currentCategory.title, href: `#${currentCategory.title.toLowerCase()}`, current: false },
    { name: currentCalculator.name, href: `?calculator=${currentCalculator.id}`, current: true }
  ]

  return (
    <motion.nav 
      className="flex mb-4 px-2 sm:px-0"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
        {breadcrumbItems.map((item, index) => (
          <li key={item.name} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            )}
            {item.current ? (
              <span className="text-gray-500 font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <a
                href={item.href}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ol>
    </motion.nav>
  )
}

export default Breadcrumb
