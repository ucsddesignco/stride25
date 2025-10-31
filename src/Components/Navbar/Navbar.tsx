import "./Navbar.scss";
import { Pivot as Hamburger } from "hamburger-react";
import Button from "../Button/Button";

export default function Navbar() {
  return (
    <nav>
      <div id="desktop-nav">
        <span className="strideSpan">Stride</span>
        <ul>
          <li>Overview</li>
          <li>Companies</li>
          <li>Prepare</li>
          {/* <li><span className='registerBtn'>Register</span></li> */}
          <Button text="Register" className="priceNav" />
        </ul>
      </div>

      <div id="mobile-nav">
        <span className="strideSpan">Stride</span>
        <Hamburger />
      </div>
    </nav>
  );
}
