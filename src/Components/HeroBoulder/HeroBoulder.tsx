import './HeroBoulder.scss'
import BigBoulder from '../../SVGS/BigBoulder'
import BigBoulderFilterDesktop from '../../SVGS/BigBoulderFilter'
import SmallBoulder from '../../SVGS/SmallBoulder'
import SmallBoulderFilter from '../../SVGS/SmallBoulderFilter'
import WhiteWaves from '../../SVGS/WhiteWaves'

export default function HeroBoulder() {
  return (
    <div id='wave'>
      <BigBoulder/>
      <BigBoulderFilterDesktop/>
      <SmallBoulder/>
       <SmallBoulderFilter/> 
      <WhiteWaves/> 
      </div>
  )
}
