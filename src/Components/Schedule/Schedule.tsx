import "./Schedule.scss";
import Diamond from "../../SVGS/Diamond";
import Calendar from "../../SVGS/Calendar";

const Schedule = () => {
  // Calendar event details (kept consistent with Hero)
  const address = "9360 Eucalyptus Grove Ln, La Jolla, CA 92093";
  const title = "Design Co Career Fair";
  const location = address;
  const description = "Join Design Co's career fair for UCSD student designers, builders, and problem solvers.";
  const start = "20251112T100000"; // Nov 12, 2025, 10 AM
  const end = "20251112T140000"; // Nov 12, 2025, 2 PM
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

  return (
    <>
      <div className="schedule-container">
        <div className="schedule">
          <div className="info">
            <div className="title">
              <h2>
                Learn from Experts.
                <br />
                Network for 4 hours.
              </h2>
              <span className="outer">
                Wednesday, November 12  |  10 AM - 2 PM
                <a
                  className="inner"
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#D3F4FA" }}
                >
                  <Calendar style={{ color: "#D3F4FA" }} />
                  Add to Calendar
                </a>
              </span>
            </div>
            <div className="times">
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Doors Open</p>
                </div>
                <p>10:00 AM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>CheckRx Talk <span className="duration">(15 min)</span></p>
                </div>
                <p>11:00 AM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Illumina Talk <span className="duration">(15 min)</span></p>
                </div>
                <p>12:00 PM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Student Panel <span className="duration">(15 min)</span></p>
                </div>
                <p>1:00 PM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Doors Close</p>
                </div>
                <p>2:00 PM</p>
              </div>
            </div>
          </div>
          <div className="schedule-img">
            <img src="./images/Schedule/ScheduleImg.jpg"></img>
          </div>
        </div>
      </div>

      <div className="schedule-container-mobile">
        <div className="schedule">
          <div className="info">
            <div className="title">
              <h2>
                Learn from Experts.
                <br />
                Network for 4 hours.
              </h2>
              <span className="outer">
                Wednesday, November 12  |  10 AM - 2 PM
                <a
                  className="inner"
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#D3F4FA" }}
                >
                  <Calendar style={{ color: "#D3F4FA" }} />
                  Add to Calendar
                </a>
              </span>
            </div>
            <div className="schedule-img">
              <img src="./images/Schedule/ScheduleImg.jpg"></img>
            </div>

            <div className="times">
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Doors Open</p>
                </div>
                <p>10:00 AM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>CheckRx Talk <span className="duration">(15 min)</span></p>
                </div>
                <p>11:00 AM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Illumina Talk <span className="duration">(15 min)</span></p>
                </div>
                <p>12:00 PM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Student Panel <span className="duration">(15 min)</span></p>
                </div>
                <p>1:00 PM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Doors Close</p>
                </div>
                <p>2:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Schedule;
