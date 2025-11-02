import './Navbar.scss'
import { useEffect, useState } from 'react'
import { Pivot as Hamburger } from 'hamburger-react'
import Button from '../Button/Button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

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
    <nav>
      {/* Desktop Nav */}
      <div id="desktop-nav">
        <span className='strideSpan'>Stride</span>
        <ul>
          <li>Overview</li>
          <li>Companies</li>
          <li>Prepare</li>
          <Button text='Register' className='priceNav' />
        </ul>
      </div>

      {/* Mobile Nav */}
      <div id="mobile-nav">
        <span className='strideSpan'>Stride</span>
        <Hamburger toggled={isOpen} toggle={setIsOpen} color="#D3F4FA" />
      </div>

      {/* Mobile Dropdown */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>Overview</li>
          <li>Companies</li>
          <li>Prepare</li>
          <Button text='Register' className='priceNav' />
        </ul>
      </div>
    </nav>
  );
}
