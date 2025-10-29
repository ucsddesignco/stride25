import { useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react'
import './Filter.scss'

type CategoryOption = string | { value: string; label: string; disabled?: boolean }

interface FilterProps {
  categories?: CategoryOption[]
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  className?: string
  ariaLabel?: string
  getLabel?: (option: CategoryOption) => string
  getValue?: (option: CategoryOption) => string
}

export default function Filter({
  categories = [],
  selectedCategory,
  onCategoryChange,
  className,
  ariaLabel,
  getLabel: externalGetLabel,
  getValue: externalGetValue,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const [chipClipPaths, setChipClipPaths] = useState<Record<number, string>>({})
  const isInitialRenderRef = useRef(true)
  const [indicatorReady, setIndicatorReady] = useState(false)
  const [noTransition, setNoTransition] = useState(true)

  const getValue = useMemo(() => externalGetValue || ((opt: CategoryOption) => (typeof opt === 'string' ? opt : opt.value)), [externalGetValue])
  const getLabel = useMemo(() => externalGetLabel || ((opt: CategoryOption) => (typeof opt === 'string' ? opt : opt.label)), [externalGetLabel])
  const isDisabled = (opt: CategoryOption) => (typeof opt === 'string' ? false : !!opt.disabled)

  const normalizedValues = useMemo(() => categories.map((c) => getValue(c)), [categories, getValue])
  const normalizedLabels = useMemo(() => categories.map((c) => getLabel(c)), [categories, getLabel])

  const handleCloseMenu = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 100)
  }

  const handleCategoryClick = (category: string) => {
    onCategoryChange?.(category)
    handleCloseMenu()
  }

  const handleToggleMenu = () => {
    if (isClosing) return
    if (isOpen) {
      handleCloseMenu()
    } else {
      setIsOpen(true)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return
    if (event.key === 'Escape') {
      event.stopPropagation()
      handleCloseMenu()
    }
  }

  const effectiveSelectedCategory = useMemo(() => {
    if (!categories.length) return undefined
    const providedIsValid = selectedCategory && normalizedValues.includes(selectedCategory)
    if (providedIsValid) return selectedCategory
    const firstEnabledIndex = categories.findIndex((c) => !isDisabled(c))
    if (firstEnabledIndex >= 0) return normalizedValues[firstEnabledIndex]
    return normalizedValues[0]
  }, [selectedCategory, categories, normalizedValues])

  const gridColumnsClass = useMemo(() => {
    const count = categories.length
    if (count <= 6) return 'cols-1'
    if (count <= 12) return 'cols-2'
    return 'cols-3'
  }, [categories])

  useEffect(() => {
    const interceptIfOutside = (event: Event) => {
      if (!filterRef.current) return
      const target = event.target as Node
      const isInside = filterRef.current.contains(target)
      if (isInside) return

      // Fully suppress outside interactions
      const e = event as Event & { stopImmediatePropagation?: () => void }
      e.stopImmediatePropagation && e.stopImmediatePropagation()
      event.stopPropagation()
      if (typeof (event as any).preventDefault === 'function') {
        event.preventDefault()
      }
      handleCloseMenu()
    }

    if (isOpen && !isClosing) {
      // Only close/suppress on actionable interactions, not on hover/move
      const types: Array<keyof DocumentEventMap> = [
        'pointerdown', 'mousedown', 'touchstart',
        'click', 'contextmenu'
      ]
      types.forEach((type) => document.addEventListener(type, interceptIfOutside, true))

      return () => {
        types.forEach((type) => document.removeEventListener(type, interceptIfOutside, true))
      }
    }

    return
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isClosing])

  const handleCategorySelect = (category: string) => {
    onCategoryChange?.(category)
  }

  const selectedIndex = useMemo(() => {
    return effectiveSelectedCategory ? normalizedValues.indexOf(effectiveSelectedCategory) : -1
  }, [effectiveSelectedCategory, normalizedValues])

  // Update indicator position and calculate clip paths for chips
  // For the very first render, measure synchronously to avoid visible animation
  useLayoutEffect(() => {
    const selectedChip = selectedIndex >= 0 ? chipRefs.current[selectedIndex] : undefined
    if (selectedChip && sliderRef.current && isInitialRenderRef.current) {
      const slider = sliderRef.current
      const chipRect = selectedChip.getBoundingClientRect()
      const sliderRect = slider.getBoundingClientRect()
      const left = chipRect.left - sliderRect.left
      const width = chipRect.width
      setIndicatorStyle({ left, width })
      isInitialRenderRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // After measuring and fonts are ready, reveal indicator and then enable transitions
  useEffect(() => {
    let mounted = true
    const reveal = () => {
      if (!mounted) return
      setIndicatorReady(true)
      requestAnimationFrame(() => {
        if (!mounted) return
        setNoTransition(false)
      })
    }
    if ((document as any).fonts && (document as any).fonts.ready) {
      ;(document as any).fonts.ready.then(() => reveal())
    } else {
      reveal()
    }
    return () => { mounted = false }
  }, [])

  // Subsequent updates and responsive recalculation
  useEffect(() => {
    const updateIndicatorPosition = () => {
      const selectedChip = selectedIndex >= 0 ? chipRefs.current[selectedIndex] : undefined
      if (selectedChip && sliderRef.current) {
        const slider = sliderRef.current
        const chipRect = selectedChip.getBoundingClientRect()
        const sliderRect = slider.getBoundingClientRect()
        const left = chipRect.left - sliderRect.left
        const width = chipRect.width
        setIndicatorStyle({ left, width })

        // Calculate clip paths for all chips
        const indicatorStart = left
        const indicatorEnd = left + width
        const newClipPaths: Record<number, string> = {}

        chipRefs.current.forEach((chip, index) => {
          if (chip) {
            const chipRect = chip.getBoundingClientRect()
            const chipStart = chipRect.left - sliderRect.left
            const chipEnd = chipStart + chipRect.width
            const chipWidth = chipRect.width

            // Calculate how much the indicator overlaps this chip
            const clipStart = Math.max(0, indicatorStart - chipStart)
            const clipEnd = Math.min(chipWidth, indicatorEnd - chipStart)

            if (clipStart > 0 || clipEnd < chipWidth) {
              // There's an overlap, calculate clip-path
              const clipLeft = (clipStart / chipWidth) * 100
              const clipRight = 100 - (clipEnd / chipWidth) * 100
              newClipPaths[index] = `inset(0 ${clipRight}% 0 ${clipLeft}%)`
            } else {
              // Fully covered or not covered
              if (indicatorStart <= chipStart && indicatorEnd >= chipEnd) {
                newClipPaths[index] = 'inset(0 0% 0 0%)' // Fully revealed
              } else {
                newClipPaths[index] = 'inset(0 100% 0 0)' // Fully hidden
              }
            }
          }
        })

        setChipClipPaths(newClipPaths)
      }
    }

    // Use requestAnimationFrame to ensure DOM has updated
    const timeoutId = setTimeout(() => {
      updateIndicatorPosition()
    }, 0)

    // Recalculate on window resize
    window.addEventListener('resize', updateIndicatorPosition)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updateIndicatorPosition)
    }
  }, [selectedIndex, categories])

  const mobileButtonLabel = useMemo(() => {
    if (!categories.length) return 'Select'
    if (!effectiveSelectedCategory) return 'Select'
    const idx = normalizedValues.indexOf(effectiveSelectedCategory)
    return idx >= 0 ? normalizedLabels[idx] : 'Select'
  }, [categories.length, effectiveSelectedCategory, normalizedLabels, normalizedValues])

  return (
    <>
      {/* Mobile Version */}
      <div className={`filter-mobile${className ? ` ${className}` : ''}`} ref={filterRef} onKeyDown={handleKeyDown}>
        {(isOpen || isClosing) && (
          <div
            className={`filter-menu ${gridColumnsClass} ${isClosing ? 'closing' : ''}`}
            role="menu"
            aria-label={ariaLabel || 'Filter categories'}
          >
            {categories.map((option, i) => (
              <button
                key={normalizedValues[i]}
                type="button"
                role="menuitemradio"
                aria-checked={effectiveSelectedCategory === normalizedValues[i]}
                aria-disabled={isDisabled(option) || undefined}
                disabled={isDisabled(option)}
                onClick={() => !isDisabled(option) && handleCategoryClick(normalizedValues[i])}
                className={`filter-item ${effectiveSelectedCategory === normalizedValues[i] ? 'active' : ''}`}
              >
                <span className="indicator" aria-hidden="true">
                  {effectiveSelectedCategory === normalizedValues[i] ? (
                    <img src="/images/svg/Selection-indicator.svg" alt="" />
                  ) : null}
                </span>
                <span className="label">{normalizedLabels[i]}</span>
              </button>
            ))}
          </div>
        )}
        <div className="filter-padding">
          <button
            type="button"
            className="filter-button"
            onClick={handleToggleMenu}
            aria-haspopup="menu"
            aria-expanded={isOpen}
          >
            <p className="filter-button-text">{mobileButtonLabel}</p>
            <div className="dropdown-icon">
              <img src="/images/svg/dropdown-icon.svg" alt="dropdown" />
            </div>
          </button>
        </div>
      </div>

      {/* Desktop Version */}
      <div className={`filter-desktop${className ? ` ${className}` : ''}`}>
        <div className="filter-slider" ref={sliderRef} role="group" aria-label={ariaLabel || 'Filter categories'} data-initializing={!indicatorReady}>
          <div 
            className="filter-slider-indicator" 
            style={{ 
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              transition: noTransition ? 'none' as any : undefined,
              visibility: indicatorReady ? 'visible' : 'hidden'
            }}
          />
          {categories.map((option, index) => (
            <button
              key={normalizedValues[index]}
              ref={(el) => {
                chipRefs.current[index] = el
              }}
              type="button"
              onClick={() => !isDisabled(option) && handleCategorySelect(normalizedValues[index])}
              className="filter-chip"
              aria-pressed={effectiveSelectedCategory === normalizedValues[index]}
              aria-label={normalizedLabels[index]}
              aria-disabled={isDisabled(option) || undefined}
              disabled={isDisabled(option)}
              style={{
                '--chip-clip': chipClipPaths[index] || 'inset(0 100% 0 0)'
              } as React.CSSProperties}
            >
              {normalizedLabels[index]}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

