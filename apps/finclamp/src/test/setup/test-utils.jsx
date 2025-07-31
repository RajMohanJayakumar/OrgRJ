import React from 'react'
import { render } from '@testing-library/react'
import { ViewModeProvider } from '../../contexts/ViewModeContext'
import { CurrencyProvider } from '../../contexts/CurrencyContext'
import { ComparisonProvider } from '../../contexts/ComparisonContext'

import { vi } from 'vitest'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Calculator: () => <div data-testid="calculator-icon" />,
  Target: () => <div data-testid="target-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Percent: () => <div data-testid="percent-icon" />,
  PieChart: () => <div data-testid="pie-chart-icon" />,
  BarChart: () => <div data-testid="bar-chart-icon" />,
  LineChart: () => <div data-testid="line-chart-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  X: () => <div data-testid="x-icon" />,
  Check: () => <div data-testid="check-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  ChevronUp: () => <div data-testid="chevron-up-icon" />,
  Info: () => <div data-testid="info-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Share: () => <div data-testid="share-icon" />,
  Copy: () => <div data-testid="copy-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
  Home: () => <div data-testid="home-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  User: () => <div data-testid="user-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  ThumbsUp: () => <div data-testid="thumbs-up-icon" />,
  ThumbsDown: () => <div data-testid="thumbs-down-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  Unlock: () => <div data-testid="unlock-icon" />,
  Key: () => <div data-testid="key-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Wifi: () => <div data-testid="wifi-icon" />,
  WifiOff: () => <div data-testid="wifi-off-icon" />,
  Battery: () => <div data-testid="battery-icon" />,
  BatteryLow: () => <div data-testid="battery-low-icon" />,
  Volume: () => <div data-testid="volume-icon" />,
  VolumeOff: () => <div data-testid="volume-off-icon" />,
  Play: () => <div data-testid="play-icon" />,
  Pause: () => <div data-testid="pause-icon" />,
  Stop: () => <div data-testid="stop-icon" />,
  SkipForward: () => <div data-testid="skip-forward-icon" />,
  SkipBack: () => <div data-testid="skip-back-icon" />,
  FastForward: () => <div data-testid="fast-forward-icon" />,
  Rewind: () => <div data-testid="rewind-icon" />,
  Repeat: () => <div data-testid="repeat-icon" />,
  Shuffle: () => <div data-testid="shuffle-icon" />,
  Mic: () => <div data-testid="mic-icon" />,
  MicOff: () => <div data-testid="mic-off-icon" />,
  Camera: () => <div data-testid="camera-icon" />,
  CameraOff: () => <div data-testid="camera-off-icon" />,
  Video: () => <div data-testid="video-icon" />,
  VideoOff: () => <div data-testid="video-off-icon" />,
  Image: () => <div data-testid="image-icon" />,
  File: () => <div data-testid="file-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Folder: () => <div data-testid="folder-icon" />,
  FolderOpen: () => <div data-testid="folder-open-icon" />,
  Archive: () => <div data-testid="archive-icon" />,
  Trash: () => <div data-testid="trash-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
  Edit2: () => <div data-testid="edit2-icon" />,
  Edit3: () => <div data-testid="edit3-icon" />,
  Save: () => <div data-testid="save-icon" />,
  Upload: () => <div data-testid="upload-icon" />,
  UploadCloud: () => <div data-testid="upload-cloud-icon" />,
  Cloud: () => <div data-testid="cloud-icon" />,
  CloudOff: () => <div data-testid="cloud-off-icon" />,
  Server: () => <div data-testid="server-icon" />,
  Database: () => <div data-testid="database-icon" />,
  HardDrive: () => <div data-testid="hard-drive-icon" />,
  Cpu: () => <div data-testid="cpu-icon" />,
  Monitor: () => <div data-testid="monitor-icon" />,
  Smartphone: () => <div data-testid="smartphone-icon" />,
  Tablet: () => <div data-testid="tablet-icon" />,
  Laptop: () => <div data-testid="laptop-icon" />,
  Mouse: () => <div data-testid="mouse-icon" />,
  Keyboard: () => <div data-testid="keyboard-icon" />,
  Printer: () => <div data-testid="printer-icon" />,
  Headphones: () => <div data-testid="headphones-icon" />,
  Speaker: () => <div data-testid="speaker-icon" />,
  Gamepad: () => <div data-testid="gamepad-icon" />,
  Gamepad2: () => <div data-testid="gamepad2-icon" />,
  Joystick: () => <div data-testid="joystick-icon" />,
  Tv: () => <div data-testid="tv-icon" />,
  Radio: () => <div data-testid="radio-icon" />,
  Bluetooth: () => <div data-testid="bluetooth-icon" />,
  Usb: () => <div data-testid="usb-icon" />,
  Power: () => <div data-testid="power-icon" />,
  PowerOff: () => <div data-testid="power-off-icon" />,
  RotateCcw: () => <div data-testid="rotate-ccw-icon" />,
  RotateCw: () => <div data-testid="rotate-cw-icon" />,
  RefreshCw: () => <div data-testid="refresh-cw-icon" />,
  RefreshCcw: () => <div data-testid="refresh-ccw-icon" />,
  Maximize: () => <div data-testid="maximize-icon" />,
  Minimize: () => <div data-testid="minimize-icon" />,
  Maximize2: () => <div data-testid="maximize2-icon" />,
  Minimize2: () => <div data-testid="minimize2-icon" />,
  Move: () => <div data-testid="move-icon" />,
  MoreHorizontal: () => <div data-testid="more-horizontal-icon" />,
  MoreVertical: () => <div data-testid="more-vertical-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  Grid: () => <div data-testid="grid-icon" />,
  List: () => <div data-testid="list-icon" />,
  Layers: () => <div data-testid="layers-icon" />,
  Layout: () => <div data-testid="layout-icon" />,
  Sidebar: () => <div data-testid="sidebar-icon" />,
  PanelLeft: () => <div data-testid="panel-left-icon" />,
  PanelRight: () => <div data-testid="panel-right-icon" />,
  PanelTop: () => <div data-testid="panel-top-icon" />,
  PanelBottom: () => <div data-testid="panel-bottom-icon" />,
  Columns: () => <div data-testid="columns-icon" />,
  Rows: () => <div data-testid="rows-icon" />,
  Table: () => <div data-testid="table-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Search: () => <div data-testid="search-icon" />,
  SortAsc: () => <div data-testid="sort-asc-icon" />,
  SortDesc: () => <div data-testid="sort-desc-icon" />,
  ArrowUp: () => <div data-testid="arrow-up-icon" />,
  ArrowDown: () => <div data-testid="arrow-down-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  ArrowUpLeft: () => <div data-testid="arrow-up-left-icon" />,
  ArrowUpRight: () => <div data-testid="arrow-up-right-icon" />,
  ArrowDownLeft: () => <div data-testid="arrow-down-left-icon" />,
  ArrowDownRight: () => <div data-testid="arrow-down-right-icon" />,
  ChevronLeft: () => <div data-testid="chevron-left-icon" />,
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
  ChevronsUp: () => <div data-testid="chevrons-up-icon" />,
  ChevronsDown: () => <div data-testid="chevrons-down-icon" />,
  ChevronsLeft: () => <div data-testid="chevrons-left-icon" />,
  ChevronsRight: () => <div data-testid="chevrons-right-icon" />,
  CornerUpLeft: () => <div data-testid="corner-up-left-icon" />,
  CornerUpRight: () => <div data-testid="corner-up-right-icon" />,
  CornerDownLeft: () => <div data-testid="corner-down-left-icon" />,
  CornerDownRight: () => <div data-testid="corner-down-right-icon" />,
  CornerLeftUp: () => <div data-testid="corner-left-up-icon" />,
  CornerLeftDown: () => <div data-testid="corner-left-down-icon" />,
  CornerRightUp: () => <div data-testid="corner-right-up-icon" />,
  CornerRightDown: () => <div data-testid="corner-right-down-icon" />,
}))

// All Providers Wrapper
const AllTheProviders = ({ children }) => {
  return (
    <ViewModeProvider>
      <CurrencyProvider>
        <ComparisonProvider>
          {children}
        </ComparisonProvider>
      </CurrencyProvider>
    </ViewModeProvider>
  )
}

// Custom render function that includes all providers
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }
