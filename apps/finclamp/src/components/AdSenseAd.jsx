import { useEffect, useRef } from 'react'

const AdSenseAd = ({ 
  adSlot, 
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = {},
  className = "adsense-ad"
}) => {
  const adRef = useRef(null)

  useEffect(() => {
    try {
      // Check if adsbygoogle is available
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // Push the ad to AdSense
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-9534639850710383"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  )
}

// Predefined ad components for common placements
export const BannerAd = ({ className = "" }) => (
  <AdSenseAd
    adSlot="1234567890" // Replace with your actual ad slot ID
    adFormat="horizontal"
    className={`banner-ad ${className}`}
    style={{ minHeight: '90px' }}
  />
)

export const SquareAd = ({ className = "" }) => (
  <AdSenseAd
    adSlot="1234567891" // Replace with your actual ad slot ID
    adFormat="rectangle"
    className={`square-ad ${className}`}
    style={{ minHeight: '250px', minWidth: '300px' }}
  />
)

export const ResponsiveAd = ({ className = "" }) => (
  <AdSenseAd
    adSlot="1234567892" // Replace with your actual ad slot ID
    adFormat="auto"
    className={`responsive-ad ${className}`}
    style={{ minHeight: '100px' }}
  />
)

export default AdSenseAd
