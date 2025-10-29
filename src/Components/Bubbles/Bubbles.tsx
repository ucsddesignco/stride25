import "./Bubbles.scss";
import { BubbleCluster } from "./BubbleCluster";

export default function Bubbles() {
  return (
    <section id="bubbles">
      <h2>Connect with a variety of companies & organizations.</h2>
      <div className="bubbles-container">
        <BubbleCluster />
      </div>
    </section>
  );
}
