
import './Icebreaker.scss'
import Button from '../Button/Button'
import PriceTag from '../../SVGS/PriceTag'

export default function Icebreaker() {
  return (
    <section id="icebreaker">
        <h2>Get prepared for Stride with tips and icebreakers.</h2>
        <div className="sqaure"></div>

        <h1>Register for Stride!</h1>
        <Button text='Register now for $6' icon={PriceTag()} className='priceHero'/>


    </section>
  )
}
