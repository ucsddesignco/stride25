import { useState, useMemo, useCallback, useEffect, memo, useRef, useLayoutEffect } from 'react'
import './IcebreakerSection.scss'
import './Icebreaker.scss'
import Button from '../Button/Button'
import PriceTag from '../../SVGS/PriceTag'
import Hammer from '../../SVGS/Hammer'
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
    prevProps.shatterSignal === nextProps.shatterSignal &&
    prevProps.shatterPoint?.x === nextProps.shatterPoint?.x &&
    prevProps.shatterPoint?.y === nextProps.shatterPoint?.y
  )
})

export default function IcebreakerSection() {
  const [selectedCategory, setSelectedCategory] = useState<IcebreakerCategory>('Introductions')
  const [showText, setShowText] = useState(false)
  const [flashKey, setFlashKey] = useState(0)
  const [currentText, setCurrentText] = useState<string>('')
  const [disableTransition] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [showShatterButton, setShowShatterButton] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [filterReady, setFilterReady] = useState(false)
  const hasShatteredRef = useRef(false)

  const didMountRef = useRef(false)
  const [overlayReady, setOverlayReady] = useState(false)
  const [overlayNoTransition, setOverlayNoTransition] = useState(true)
  const categoryItemsRef = useRef<string[]>([])
  const canvasWrapperRef = useRef<HTMLDivElement>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isCursorVisible, setIsCursorVisible] = useState(false)
  const globalMousePositionRef = useRef({ x: 0, y: 0 })
  const lastCursorPositionRef = useRef({ x: 0, y: 0 })
  const [cursorSwingKey, setCursorSwingKey] = useState(0)
  const [shouldSwing, setShouldSwing] = useState(false)
  const cursorReadyRef = useRef(false)
  const [shatterSignal, setShatterSignal] = useState(0)

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

  const handleParamsChange = useCallback(() => { }, [])

  const handleShatter = useCallback(() => {
    // Hide button and show filter on first shatter
    if (!hasShatteredRef.current) {
      hasShatteredRef.current = true
      setShowShatterButton(false)
      setShowFilter(true)
      // Enable animation after DOM is ready - use double RAF to ensure render
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFilterReady(true)
        })
      })
    }
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

  const handleMouseDown = useCallback((e?: MouseEvent) => {
    setIsMouseDown(true)
    // Trigger swing only when in cursor mode and not on filter elements
    if (!showShatterButton) {
      const wrapper = canvasWrapperRef.current
      const target = (e?.target as HTMLElement) || null

      const isOverFilterElement = (t: HTMLElement | null): boolean => {
        if (!wrapper || !t) return false
        const filterOverlay = wrapper.querySelector('.filter-overlay')
        if (filterOverlay && filterOverlay.contains(t)) return true
        const filterClasses = ['filter-overlay', 'filter-desktop', 'filter-mobile', 'filter-slider', 'filter-chip', 'filter-button', 'filter-menu', 'filter-item']
        if (filterClasses.some(cls => t.classList.contains(cls))) return true
        let current: HTMLElement | null = t
        while (current && current !== wrapper) {
          if (filterClasses.some(cls => current?.classList.contains(cls))) return true
          current = current.parentElement
        }
        return false
      }

      if (isOverFilterElement(target)) return

      setShouldSwing(true)
      setCursorSwingKey((k) => k + 1)
    }
  }, [showShatterButton])

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsMouseDown(false)
  }, [])

  useEffect(() => {
    const wrapper = canvasWrapperRef.current
    if (!wrapper) return

    wrapper.addEventListener('mousedown', handleMouseDown as unknown as EventListener)
    wrapper.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      wrapper.removeEventListener('mousedown', handleMouseDown as unknown as EventListener)
      wrapper.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseDown, handleMouseUp, handleMouseLeave])

  // Track global mouse position
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      globalMousePositionRef.current = { x: e.clientX, y: e.clientY }
    }

    document.addEventListener('mousemove', handleGlobalMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [])

  // Custom cursor that follows mouse when button is hidden (after 0 state)
  useEffect(() => {
    const wrapper = canvasWrapperRef.current
    if (!wrapper) return

    if (!showShatterButton) {
      // Hide default cursor
      wrapper.style.cursor = 'none'
      
      const isOverFilterElement = (target: HTMLElement | null): boolean => {
        if (!target) return false
        
        // Check if target is inside filter-overlay or is a filter component element
        const filterOverlay = wrapper.querySelector('.filter-overlay')
        if (filterOverlay && filterOverlay.contains(target)) {
          return true
        }
        
        // Check if target has filter-related classes
        const filterClasses = ['filter-overlay', 'filter-desktop', 'filter-mobile', 'filter-slider', 'filter-chip', 'filter-button', 'filter-menu', 'filter-item']
        if (filterClasses.some(cls => target.classList.contains(cls))) {
          return true
        }
        
        // Check if target is a child of any filter element
        let current: HTMLElement | null = target
        while (current && current !== wrapper) {
          if (filterClasses.some(cls => current?.classList.contains(cls))) {
            return true
          }
          current = current.parentElement
        }
        
        return false
      }

      const shouldSuppressCursor = () => {
        const hasFinePointer = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
          ? window.matchMedia('(pointer: fine)').matches
          : false
        // If a fine pointer exists (mouse/trackpad), always show the hammer regardless of breakpoint
        if (hasFinePointer) return false
        // Otherwise, suppress on typical touch scenarios and very small viewports
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        return window.innerWidth < 768 || hasTouch
      }

      const handleMouseMove = (e: MouseEvent) => {
        // Don't show cursor when we intentionally suppress (e.g., touch-only)
        if (shouldSuppressCursor()) {
          setIsCursorVisible(false)
          return
        }
        
        // Check if mouse is over filter element
        const target = e.target as HTMLElement
        if (isOverFilterElement(target)) {
          setIsCursorVisible(false)
          return
        }
        
        // Use fixed positioning relative to viewport to avoid warping at edges
        const position = {
          x: e.clientX,
          y: e.clientY
        }
        lastCursorPositionRef.current = position
        setCursorPosition(position)
        setIsCursorVisible(true)
        cursorReadyRef.current = true
      }

      const handleMouseEnter = (e: MouseEvent) => {
        // Don't show cursor when we intentionally suppress (e.g., touch-only)
        if (shouldSuppressCursor()) {
          setIsCursorVisible(false)
          return
        }
        
        // Check if entering over filter element
        const target = e.target as HTMLElement
        if (isOverFilterElement(target)) {
          setIsCursorVisible(false)
          return
        }
        
        // Prevent any accidental swing on hover; only allow on actual mousedown
        setShouldSwing(false)

        // Use last cursor position (unless it's 0,0 which means never moved)
        const position = lastCursorPositionRef.current.x === 0 && lastCursorPositionRef.current.y === 0
          ? { x: globalMousePositionRef.current.x, y: globalMousePositionRef.current.y }
          : lastCursorPositionRef.current
        
        setCursorPosition(position)
        setIsCursorVisible(true)
        // Mark cursor as initialized so future clicks can trigger swing
        cursorReadyRef.current = true
      }

      const handleMouseLeave = () => {
        setIsCursorVisible(false)
      }

      wrapper.addEventListener('mousemove', handleMouseMove)
      wrapper.addEventListener('mouseenter', handleMouseEnter)
      wrapper.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        wrapper.removeEventListener('mousemove', handleMouseMove)
        wrapper.removeEventListener('mouseenter', handleMouseEnter)
        wrapper.removeEventListener('mouseleave', handleMouseLeave)
        wrapper.style.cursor = ''
      }
    } else {
      // Reset to default cursor when button is visible
      wrapper.style.cursor = ''
      setIsCursorVisible(false)
    }
  }, [showShatterButton])

  // Ensure swing never persists when the cursor is hidden or when not actively clicking
  useEffect(() => {
    if (!isCursorVisible) {
      setShouldSwing(false)
    }
  }, [isCursorVisible])

  return (
    <section id="icebreaker">
      <h2>Get prepared for Stride with tips and icebreakers.</h2>

      <div
        ref={canvasWrapperRef}
        className={`canvas-wrapper ${isMouseDown ? 'clicking' : ''} ${showShatterButton ? 'initial-state' : ''}`}
      >
        {showFilter && (
          <div className={`filter-overlay ${filterReady ? 'visible' : ''}`}>
            <Filter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        )}
        <MemoizedShatterCanvas
          params={params}
          onParamsChange={handleParamsChange}
          onShatter={handleShatter}
          shatterSignal={shatterSignal}
          shatterPoint={{ x: 0.5, y: 0.5 }}
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
        {showShatterButton && (
          <div 
            className="shatter-button" 
            onClick={() => {
              // Trigger canvas shatter at center
              setShatterSignal(prev => prev + 1)
              // Call handleShatter after shatter is triggered
              // Use double RAF to ensure shatter effect has started
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  handleShatter()
                })
              })
            }}
          >
            <div className="shatter-button-icon">
              <Hammer />
            </div>
            <span className="shatter-button-text">Break the Ice</span>
          </div>
        )}
        {!showShatterButton && isCursorVisible && (
          <div
            className="custom-cursor"
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
            }}
          >
            <div
              className={`custom-cursor-rotor ${shouldSwing ? 'swinging' : ''}`}
              key={cursorSwingKey}
              onAnimationEnd={() => setShouldSwing(false)}
            >
              <img
                src="/89f4756b7d6c7a88013951a0b09f7a2a86b8a14f.svg"
                alt=""
                draggable={false}
                style={{ display: 'block', width: '40px', height: '40px', pointerEvents: 'none' }}
              />
            </div>
          </div>
        )}
      </div>

      <h1>Register for Stride!</h1>
      <Button text='Register now for $6' icon={<PriceTag/>} className='priceHero' link='https://luma.com/voxmkrg3' />
    </section>
  )
}

