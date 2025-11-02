import './Hero.scss'
import Calendar from '../../SVGS/Calendar'
import Map from '../../SVGS/Map'
import PriceTag from '../../SVGS/PriceTag'
import Button from '../Button/Button'
import HeroBoulder from '../HeroBoulder/HeroBoulder'

export default function Hero() {
  return (
    <section id="hero">
        <div className="heroContent">
            <h1>Join Design Co's career fair for UCSD student designers, builders, and problem solvers.</h1>
            <div className='eventsContainer'>
                <Button text='Register now for $6' icon={PriceTag()} className='priceHero'/>
                <span className='outer'>Wed, Oct 2  |  10 AM - 2 PM<span className='inner'> <Calendar/> Add to Calendar</span></span>
                <span className='outer'>The Stage Room | Old Student Center<span className='inner'><Map/>View in Maps</span></span>
            </div>
        </div>
        
   
          <HeroBoulder/>
    

    </section>
  );
}
