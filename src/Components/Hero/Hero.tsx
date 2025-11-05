import './Hero.scss'
import Calendar from '../../SVGS/Calendar'
import Map from '../../SVGS/Map'
import PriceTag from '../../SVGS/PriceTag'
import Button from '../Button/Button'
import HeroBoulder from '../HeroBoulder/HeroBoulder'
import Star from '../../SVGS/Star'

export default function Hero() {
  const address = "9360 Eucalyptus Grove Ln, La Jolla, CA 92093";
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  // Calendar event details
  const title = "Design Co Career Fair";
  const location = address;
  const description = "Join Design Co's career fair for UCSD student designers, builders, and problem solvers.";
  const start = "20251112T100000"; // Nov 12, 2025, 10 AM
  const end = "20251112T140000";   // Nov 12, 2025, 2 PM
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

  return (
    <section id="hero">

      <div className="right-stars">
      <Star className='right1'/>
      <Star className='right2'/>
      <Star className='right3'/>
      </div>

      <div className="top-stars">
         <Star className='top1'/>
         <Star className='top2'/>
      </div>

      <div className="left-stars">
        <Star className='left1'/>
        <Star className='left2'/>
        <Star className='left3'/>
      </div>

      <div className="bottom-stars">
        <Star className='bottom1'/>
        <Star className='bottom2'/>
        <Star className='bottom3'/>
        <Star className='bottom4'/> 
        <Star className='bottom5'/> 
        <Star className='bottom6'/> 
      </div>  

      <div className="heroContent">
        <h1>Join Design Co's career fair for UCSD student designers, builders, and problem solvers.</h1>
        <div className='eventsContainer'>
          <Button text='Register now for $6' icon={<PriceTag/>} className='priceHero' link='https://luma.com/voxmkrg3' />

          {/* Add to Calendar */}
          <span className='outer'>
            Wednesday, November 12  |  10 AM - 2 PM
            <a
              className='inner'
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#D3F4FA' }}
            >
              <Calendar style={{ color: '#D3F4FA' }} />
              Add to Calendar
            </a>
          </span>

          {/* Map Link */}
          <span className='outer'>
            The Stage Room | Old Student Center
            <a
              className='inner'
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#D3F4FA' }}
            >
              <Map style={{ color: '#D3F4FA' }} />
              View in Maps
            </a>
          </span>
        </div>
      </div>
      <HeroBoulder />
    </section>
  );
}
