import './Navbar.scss'
import { useEffect, useState } from 'react'
import { Pivot as Hamburger } from 'hamburger-react'
import Button from '../Button/Button'
import PriceTag from '../../SVGS/PriceTag'

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
