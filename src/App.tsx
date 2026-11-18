import Slider from "./components/slider/slider.tsx";
import "./App.css";

function App() {
  return (
    <>
      <Slider delay={300} speed={1} hit={0.25} crit={0.2} />
      <Slider delay={500} speed={1} hit={0.25} crit={0.2} />
      <Slider delay={800} speed={1} hit={0.25} crit={0.2} />
    </>
  );
}

export default App;
