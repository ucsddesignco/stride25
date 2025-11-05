import './Navbar.scss'
import { useEffect, useState, useRef } from 'react'
import { Pivot as Hamburger } from 'hamburger-react'
import Button from '../Button/Button'
import PriceTag from '../../SVGS/PriceTag'

export default function Navbar() {
  
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollDownDistance, setScrollDownDistance] = useState(0)
  const isInitialMount = useRef(true)
  const SCROLL_THRESHOLD = 200 // Pixels to scroll down before hiding navbar

  // Initialize scroll position on mount
  useEffect(() => {
    const initialScrollY = window.scrollY
    setLastScrollY(initialScrollY)
    setIsScrolled(initialScrollY > 0)
    setIsVisible(true) // Always visible on initial load
    setScrollDownDistance(0)
    
    // Mark initial mount as complete after a short delay
    const timer = setTimeout(() => {
      isInitialMount.current = false
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Handle scroll detection for blur and slide in/out
  useEffect(() => {
    const handleScroll = () => {
      // Don't hide navbar on initial mount
      if (isInitialMount.current) {
        return
      }

      const currentScrollY = window.scrollY

      // Check if scrolled from top
      setIsScrolled(currentScrollY > 0)

      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - accumulate scroll distance
        const distance = currentScrollY - lastScrollY
        const newScrollDownDistance = scrollDownDistance + distance
        
        setScrollDownDistance(newScrollDownDistance)
        
        // Only hide navbar after scrolling down threshold amount
        if (newScrollDownDistance >= SCROLL_THRESHOLD) {
          setIsVisible(false)
        }
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar and reset scroll down distance
        setIsVisible(true)
        setScrollDownDistance(0)
      }

      // If at the top, always show navbar and reset distance
      if (currentScrollY === 0) {
        setIsVisible(true)
        setScrollDownDistance(0)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, scrollDownDistance])

  // Close the mobile menu when resizing above the breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 678 && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  return (
    <nav className={`${isScrolled ? 'scrolled' : ''} ${!isVisible ? 'hidden' : ''}`}>
      {/* Desktop Nav */}
      <div id="desktop-nav">
        <a href="/" target="_self" className='strideSpan'>Stride</a>
        <ul>
          <li><a href="#overview">Overview</a></li>
          <li><a href="#bubbles">Companies</a></li>
          <li><a href="#icebreaker">Prepare</a></li>
          <Button text='Register' className='priceNav' link='https://luma.com/voxmkrg3' />
        </ul>
      </div>

      {/* Mobile Nav */}
      <div id="mobile-nav">
        <a href="/" target="_self" className='strideSpan'>Stride</a>
        <Hamburger toggled={isOpen} toggle={setIsOpen} color="#D3F4FA" />
      </div>

      {/* Mobile Dropdown */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <a href="/" target="_self" className='strideSpan'>Stride</a>
          <Hamburger toggled={isOpen} toggle={setIsOpen} color="#D3F4FA" />
        </div>
        <div className="mobile-menu-content">
          <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#bubbles">Companies</a></li>
            <li><a href="#icebreaker">Prepare</a></li>
          </ul>
          <Button text='Register now for $6' icon={<PriceTag/>} className='priceHero' link='https://luma.com/voxmkrg3'/>
          </div>
      </div>
    </nav>
  );
}
