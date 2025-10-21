import './App.scss'
import Navbar from './Components/Navbar/Navbar'
import Hero from './Components/Hero/Hero'
import Footer from './Components/Footer/Footer'
import Icebreaker from './Components/Icebreakers/Icebreaker'
import Accordion from './Components/Accordion/Accordion'
import Fields from './Components/Fields/Fields'
import Schedule from './Components/Schedule/Schedule'

function App() {

  return (
    <>
    <Navbar/>
    <Hero/>
    <Fields/>
    <Schedule/>
    <Accordion/>
    <Icebreaker/>
    <Footer/>
    </>
  )
}

export default App
