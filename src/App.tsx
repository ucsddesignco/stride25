
import "./App.scss";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Hero/Hero";
import Overview from './Components/Overview/Overview'
import Footer from "./Components/Footer/Footer";
import Icebreaker from "./Components/Icebreakers/Icebreaker";
import Accordion from "./Components/Accordion/Accordion";
import Fields from "./Components/Fields/Fields";
import Schedule from "./Components/Schedule/Schedule";
import Bubbles from "./Components/Bubbles/Bubbles"

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Overview/>
      <Schedule />
      <Fields />
      <Accordion />
      <Bubbles />
      <Icebreaker />
      <Footer />
    </>
  );
}

export default App;
