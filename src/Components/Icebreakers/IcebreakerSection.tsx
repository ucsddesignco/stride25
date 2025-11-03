import { useState, useMemo, useCallback, useEffect, memo, useRef, useLayoutEffect } from 'react'
import './IcebreakerSection.scss'
import './Icebreaker.scss'
import Button from '../Button/Button'
import PriceTag from '../../SVGS/PriceTag'
import Filter from '../Filter/Filter'
import { ShatterCanvas } from './shatter/ShatterCanvas'
import type { Params } from './shatter/types'
import { ICEBREAKER_CONTENT, type IcebreakerCategory } from './data'

const MemoizedShatterCanvas = memo(ShatterCanvas, (prevProps, nextProps) => {
  // Prevent re-renders unless params actually change (shallow comparison)
  return (
    prevProps.params === nextProps.params &&
    prevProps.onParamsChange === nextProps.onParamsChange &&
    prevProps.onShatter === nextProps.onShatter &&
    prevProps.shatterSignal === nextProps.shatterSignal
  )
})

export default function IcebreakerSection() {
  const [selectedCategory, setSelectedCategory] = useState<IcebreakerCategory>('Introductions')
  const [showText, setShowText] = useState(false)
  const [flashKey, setFlashKey] = useState(0)
  const [currentText, setCurrentText] = useState<string>('')
  const [disableTransition] = useState(false)
  
  const didMountRef = useRef(false)
  const [overlayReady, setOverlayReady] = useState(false)
  const [overlayNoTransition, setOverlayNoTransition] = useState(true)
  const categoryItemsRef = useRef<string[]>([])

  const formatWidont = useCallback((text: string) => {
    if (!text) return ''
    // Replace the last regular space with a non-breaking space to avoid a single-word last line
    return text.replace(/\s+([^\s]+)\s*$/, '\u00A0$1')
  }, [])

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category as IcebreakerCategory)
  }, [])

  const categories = useMemo(() => Object.keys(ICEBREAKER_CONTENT) as IcebreakerCategory[], [])

  useEffect(() => {
    categoryItemsRef.current = ICEBREAKER_CONTENT[selectedCategory]
  }, [selectedCategory])

  const getRandomItem = useCallback((items: string[]) => {
    if (!items || items.length === 0) return ''
    const index = Math.floor(Math.random() * items.length)
    return items[index]
  }, [])

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    // Fade out overlay text on category change, then clear after transition
    setShowText(false)
    const clearId = setTimeout(() => {
      setCurrentText('')
    }, 400) // match CSS transition duration in IcebreakerSection.scss
    return () => clearTimeout(clearId)
  }, [selectedCategory])

  const params = useMemo<Params>(() => ({
    gravity: 0.0,
    damping: 0.9995, // Increased from 0.998 - slower velocity decay for smoother motion
    impulse: 4.0, // Reduced from 6.0 - less initial force for slower start
    impulseRadius: 1.2,
    wireframe: false,
    layerCount: 3,
    layerOpacity: 1.0,
    layerSpacing: 0.1,
    enableBlending: true,
    currentActiveLayer: 0,
    acceleration: 0.4, // Reduced from 0.8 - less speed increase over time
    accelerationDelay: 0.6, // Increased from 0.3 - more delay before acceleration starts
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
    setCurrentText((prev) => {
      const items = categoryItemsRef.current
      // try to avoid immediate repeat if possible
      let next = getRandomItem(items)
      if (items.length > 1 && next === prev) {
        next = getRandomItem(items)
      }
      return next
    })
    setTimeout(() => setShowText(true), 10)
  }, [getRandomItem])

  // Ensure overlay text does not animate on initial paint
  useLayoutEffect(() => {
    // Mark ready for first render without transitions
    setOverlayReady(true)
    const id = requestAnimationFrame(() => setOverlayNoTransition(false))
    return () => cancelAnimationFrame(id)
  }, [])

  const displayText = useMemo(() => {
    const baseText = currentText || 'Get prepared for Stride with tips and icebreakers.'
    return formatWidont(baseText)
  }, [currentText, formatWidont])

  return (
    <section id="icebreaker">
      <h2>Get prepared for Stride with tips and icebreakers.</h2>
      <div className="canvas-wrapper">
        <div className="filter-overlay">
          <Filter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <MemoizedShatterCanvas
          params={params}
          onParamsChange={handleParamsChange}
          onShatter={handleShatter}
        />
        <div
          key={flashKey}
          className={`icebreaker-overlay-text ${showText ? 'visible' : ''} ${disableTransition ? 'no-transition' : ''}`}
          aria-live="polite"
          aria-atomic="true"
          style={{ transition: overlayNoTransition ? 'none' as any : undefined, visibility: overlayReady ? 'visible' : 'hidden' }}
        >
          {displayText}
        </div>
      </div>

      <h1>Register for Stride!</h1>
      <Button text='Register now for $6' icon={PriceTag()} className='priceHero'/>
    </section>
  )
}

