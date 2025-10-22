import './Icebreaker.scss'
import Button from '../Button/Button'
import PriceTag from '../../SVGS/PriceTag'
import { useMemo, useRef } from 'react'
import { ShatterCanvas } from './shatter/ShatterCanvas'
import type { Params } from './shatter/types'

export default function Icebreaker() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const params = useMemo<Params>(() => ({
    gravity: 0.0,
    damping: 0.998,
    impulse: 4.0,
    impulseRadius: 0.8,
    wireframe: false,
    loadMyImage: () => inputRef.current?.click(),
    layerCount: 3,
    layerOpacity: 1.0,
    layerSpacing: 0.1,
    enableBlending: true,
    currentActiveLayer: 0,
  }), [])

  return (
    <section id="icebreaker">
        <h2>Get prepared for Stride with tips and icebreakers.</h2>
        <div className="canvas-wrapper">
            <ShatterCanvas params={params} onParamsChange={() => {}} />
            <div className="noise-overlay" />
            <input ref={inputRef} type="file" accept="image/*" className="hidden" />
        </div>

        <h1>Register for Stride!</h1>
        <Button text='Register now for $6' icon={PriceTag()} className='priceHero'/>


    </section>
  );
}
