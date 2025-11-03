
import "./App.scss";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Hero/Hero";
import Overview from './Components/Overview/Overview'
import Footer from "./Components/Footer/Footer";
import IcebreakerSection from "./Components/Icebreakers/IcebreakerSection";
import Accordion from "./Components/Accordion/Accordion";
import Fields from "./Components/Fields/Fields";
import Schedule from "./Components/Schedule/Schedule";
// import Bubbles from "./Components/Bubbles/Bubbles"

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Overview/>
      <Schedule />
      <Fields />
      <Accordion />
      <IcebreakerSection />
      <Footer />
    </>
  );
}

export default App;
