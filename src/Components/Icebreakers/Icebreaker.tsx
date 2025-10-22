import './Icebreaker.scss'
import Button from '../Button/Button'
import PriceTag from '../../SVGS/PriceTag'
import { useMemo } from 'react'
import { ShatterCanvas } from './shatter/ShatterCanvas'
import type { Params } from './shatter/types'

export default function Icebreaker() {
  const params = useMemo<Params>(() => ({
    gravity: 0.0,
    damping: 0.998,
    impulse: 6.0,  // Reduced from 8.0 to allow acceleration to build up
    impulseRadius: 1.2,  // Increased from 0.8 to affect more shards
    wireframe: false,
    layerCount: 3,
    layerOpacity: 1.0,
    layerSpacing: 0.1,
    enableBlending: true,
    currentActiveLayer: 0,
    // Physics enhancement parameters
    acceleration: 0.8,              // Acceleration multiplier: 0 (no acceleration) to 1 (strong acceleration)
    accelerationDelay: 0.3,          // Delay before acceleration starts (seconds)
    // Easy-to-manipulate ice colors
    // RGB values (0-1): [Red, Green, Blue]
    iceTopColor: [0.95, 0.98, 1.0],      // Light blue-white (top of ice)
    iceMiddleColor: [0.7, 0.85, 0.95],   // Medium blue (middle)
    iceBottomColor: [0.3, 0.6, 0.8],     // Darker blue (bottom)
    iceDeepColor: [0.1, 0.3, 0.5],       // Deep blue (deepest)
    colorTemperature: 0.0,                // Color temperature: -1 (cool) to 1 (warm)
    metallicAmount: 0.3,                  // Metallic effect: 0 (matte) to 1 (very metallic)
    highlightIntensity: 0.0,              // Highlight intensity: 0 (no highlights) to 1 (very bright)
  }), [])

  return (
    <section id="icebreaker">
        <h2>Get prepared for Stride with tips and icebreakers.</h2>
        <div className="canvas-wrapper">
            <ShatterCanvas params={params} onParamsChange={() => {}} />
        </div>

        <h1>Register for Stride!</h1>
        <Button text='Register now for $6' icon={PriceTag()} className='priceHero'/>


    </section>
  );
}
