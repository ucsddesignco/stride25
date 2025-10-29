import { useMemo, useState, useRef, useEffect } from 'react'
import './Filter.scss'

interface FilterProps {
  categories?: string[]
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
}

export default function Filter({
  categories = ['Introductions', 'Icebreakers', 'Advice', 'Resume', 'Portfolio'],
  selectedCategory,
  onCategoryChange,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const [chipClipPaths, setChipClipPaths] = useState<Record<number, string>>({})

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
    if (selectedCategory && categories.includes(selectedCategory)) return selectedCategory
    return categories[0]
  }, [selectedCategory, categories])

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
    return categories.indexOf(effectiveSelectedCategory)
  }, [effectiveSelectedCategory, categories])

  // Update indicator position and calculate clip paths for chips
  useEffect(() => {
    const updateIndicatorPosition = () => {
      const selectedChip = chipRefs.current[selectedIndex]
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

  return (
    <>
      {/* Mobile Version */}
      <div className="filter-mobile" ref={filterRef} onKeyDown={handleKeyDown}>
        {(isOpen || isClosing) && (
          <div
            className={`filter-menu ${gridColumnsClass} ${isClosing ? 'closing' : ''}`}
            role="menu"
            aria-label="Filter categories"
          >
            {categories.map((option) => (
              <button
                key={option}
                type="button"
                role="menuitemradio"
                aria-checked={effectiveSelectedCategory === option}
                onClick={() => handleCategoryClick(option)}
                className={`filter-item ${effectiveSelectedCategory === option ? 'active' : ''}`}
              >
                <span className="indicator" aria-hidden="true">
                  {effectiveSelectedCategory === option ? (
                    <img src="/images/svg/Selection-indicator.svg" alt="" />
                  ) : null}
                </span>
                <span className="label">{option}</span>
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
            <p className="filter-button-text">{effectiveSelectedCategory}</p>
            <div className="dropdown-icon">
              <img src="/images/svg/dropdown-icon.svg" alt="dropdown" />
            </div>
          </button>
        </div>
      </div>

      {/* Desktop Version */}
      <div className="filter-desktop">
        <div className="filter-slider" ref={sliderRef} role="group" aria-label="Filter categories">
          <div 
            className="filter-slider-indicator" 
            style={{ 
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`
            }}
          />
          {categories.map((option, index) => (
            <button
              key={option}
              ref={(el) => {
                chipRefs.current[index] = el
              }}
              type="button"
              onClick={() => handleCategorySelect(option)}
              className="filter-chip"
              aria-pressed={effectiveSelectedCategory === option}
              aria-label={option}
              style={{
                '--chip-clip': chipClipPaths[index] || 'inset(0 100% 0 0)'
              } as React.CSSProperties}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

