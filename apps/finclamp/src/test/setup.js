import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url')

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    nav: 'nav',
    div: 'div',
    span: 'span',
    button: 'button',
    section: 'section',
    article: 'article',
    header: 'header',
    footer: 'footer',
    main: 'main',
    aside: 'aside',
    ul: 'ul',
    li: 'li',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'p',
    a: 'a',
    img: 'img',
    form: 'form',
    input: 'input',
    textarea: 'textarea',
    select: 'select',
    option: 'option',
    label: 'label',
    table: 'table',
    thead: 'thead',
    tbody: 'tbody',
    tr: 'tr',
    td: 'td',
    th: 'th'
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useInView: () => false,
  useMotionValue: () => ({ get: vi.fn(), set: vi.fn() }),
  useSpring: () => ({ get: vi.fn(), set: vi.fn() }),
  useTransform: () => ({ get: vi.fn(), set: vi.fn() }),
}))

// Mock PerformanceObserver for SEOPerformanceMonitor tests
global.PerformanceObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => [])
}))

// Mock performance API
global.performance = {
  ...global.performance,
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
  mark: vi.fn(),
  measure: vi.fn(),
  now: vi.fn(() => Date.now())
}

// Mock gtag for analytics
global.gtag = vi.fn()
if (typeof window !== 'undefined') {
  window.gtag = vi.fn()
}

// Store original createElement before mocking
const originalCreateElement = document.createElement.bind(document)

// Enhanced document mock for DOM manipulation
const createMockElement = (tagName = 'div') => {
  // Use the original createElement to create a real DOM element
  const element = originalCreateElement(tagName)

  // Add spy functions to track calls but keep real functionality
  element.setAttribute = vi.fn(element.setAttribute.bind(element))
  element.remove = vi.fn(element.remove ? element.remove.bind(element) : () => {})

  return element
}

// Mock document methods
if (typeof document !== 'undefined') {
  Object.defineProperty(document, 'createElement', {
    value: vi.fn((tagName) => createMockElement(tagName)),
    writable: true
  })

  Object.defineProperty(document, 'querySelector', {
    value: vi.fn(() => null),
    writable: true
  })

  Object.defineProperty(document, 'querySelectorAll', {
    value: vi.fn(() => []),
    writable: true
  })

  // Mock document.head with proper appendChild
  Object.defineProperty(document, 'head', {
    value: {
      appendChild: vi.fn(),
      removeChild: vi.fn(),
      querySelector: vi.fn(() => null),
      querySelectorAll: vi.fn(() => [])
    },
    writable: true
  })

  // Mock document.title
  Object.defineProperty(document, 'title', {
    value: 'Test Page',
    writable: true
  })
}

// Mock window.location
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:3000',
      origin: 'http://localhost:3000',
      pathname: '/',
      search: '',
      hash: '',
      hostname: 'localhost',
      port: '3000',
      protocol: 'http:',
      referrer: ''
    },
    writable: true
  })
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
}
