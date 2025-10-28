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

  return (
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
  )
}

