import { useState, useMemo, useCallback, memo } from 'react'
import './IcebreakerSection.scss'
import './Icebreaker.scss'
import Button from '../Button/Button'
import PriceTag from '../../SVGS/PriceTag'
import Filter from '../Filter/Filter'
import { ShatterCanvas } from './shatter/ShatterCanvas'
import type { Params } from './shatter/types'

const MemoizedShatterCanvas = memo(ShatterCanvas)

export default function IcebreakerSection() {
  const [selectedCategory, setSelectedCategory] = useState('Introductions')
  const [showText, setShowText] = useState(false)
  const [flashKey, setFlashKey] = useState(0)

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
  }, [])

  const params = useMemo<Params>(() => ({
    gravity: 0.0,
    damping: 0.998,
    impulse: 6.0,
    impulseRadius: 1.2,
    wireframe: false,
    layerCount: 3,
    layerOpacity: 1.0,
    layerSpacing: 0.1,
    enableBlending: true,
    currentActiveLayer: 0,
    acceleration: 0.8,
    accelerationDelay: 0.3,
    iceTopColor: [0.95, 0.98, 1.0],
    iceMiddleColor: [0.7, 0.85, 0.95],
    iceBottomColor: [0.3, 0.6, 0.8],
    iceDeepColor: [0.1, 0.3, 0.5],
    colorTemperature: 0.0,
    metallicAmount: 0.3,
    highlightIntensity: 0.0,
  }), [])

  const handleParamsChange = useCallback(() => {}, [])

  const handleShatter = useCallback(() => {
    // subsequent shatters: hide instantly then fade back in
    setShowText(false)
    // force reflow via key change to restart CSS animation if needed
    setFlashKey((k) => k + 1)
    // fade in shortly after to create appear effect
    setTimeout(() => setShowText(true), 10)
  }, [])

  return (
    <section id="icebreaker">
      <h2>Get prepared for Stride with tips and icebreakers.</h2>
      <div className="canvas-wrapper">
        <div className="filter-overlay">
          <Filter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <MemoizedShatterCanvas params={params} onParamsChange={handleParamsChange} onShatter={handleShatter} />
        <div
          key={flashKey}
          className={`icebreaker-overlay-text ${showText ? 'visible' : ''}`}
          aria-live="polite"
          aria-atomic="true"
        >
          Get prepared for Stride with tips and icebreakers.
        </div>
      </div>

      <h1>Register for Stride!</h1>
      <Button text='Register now for $6' icon={PriceTag()} className='priceHero'/>
    </section>
  )
}

