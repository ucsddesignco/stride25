import './HeroBoulder.scss'
import BigBoulder from '../../SVGS/BigBoulder'
import BigBoulderFilterDesktop from '../../SVGS/BigBoulderFilterDesktop'
import SmallBoulder from '../../SVGS/SmallBoulder'
import SmallBoulderFilter from '../../SVGS/SmallBoulderFilter'
import BigBoulderFilterTablet from '../../SVGS/BigBoulderFilterTablet'
import WhiteWaves from '../../SVGS/WhiteWaves'

export default function HeroBoulder() {
  return (
    <div className='wave'>
      {/* <div className="bottom-wave"> */}
      <BigBoulder/>
      {/* <BigBoulderFilterDesktop/>
      <BigBoulderFilterTablet/> */}
      {/* </div> */}

      <SmallBoulder/>
      {/* <SmallBoulderFilter/> 
      <WhiteWaves/> */}
      </div>
  )
}
